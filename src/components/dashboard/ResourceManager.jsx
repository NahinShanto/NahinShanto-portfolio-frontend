import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { buildPayload } from '../../utils/payload'
import { toFormValues } from '../../utils/formConfigs'
import { getErrorMessage } from '../../utils/errors'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import IconButton from '../ui/IconButton'
import Modal from '../ui/Modal'
import QueryState from '../ui/QueryState'
import Skeleton from '../ui/Skeleton'
import ConfirmModal from './ConfirmModal'
import DataTable from './DataTable'
import ResourceForm from './ResourceForm'

export default function ResourceManager({ title, noun, api, queryKey, fields, defaults, columns }) {
  const qc = useQueryClient()
  const query = useQuery({ queryKey: [queryKey], queryFn: () => api.list() })
  const [editing, setEditing] = useState(null) // null | 'new' | item
  const [deleting, setDeleting] = useState(null)

  const remove = useMutation({
    mutationFn: (item) => api.remove(item.id),
    onSuccess: () => {
      toast.success(`${noun} deleted`)
      setDeleting(null)
      qc.invalidateQueries()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error)) // যেমন: category ব্যবহৃত হলে backend-এর বার্তা
      setDeleting(null)
    },
  })

  const save = async (values) => {
    const payload = buildPayload(values, fields)
    if (editing === 'new') await api.create(payload)
    else await api.update(editing.id, payload)
    toast.success(`${noun} saved`)
    setEditing(null)
    await qc.invalidateQueries()
  }

  const allColumns = [
    ...columns,
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center">
          <IconButton label={`Edit ${noun.toLowerCase()}`} onClick={() => setEditing(row)}>
            <Pencil className="size-5" aria-hidden="true" />
          </IconButton>
          <IconButton label={`Delete ${noun.toLowerCase()}`} onClick={() => setDeleting(row)}>
            <Trash2 className="size-5 text-danger" aria-hidden="true" />
          </IconButton>
        </div>
      ),
    },
  ]

  const addButton = (
    <Button size="sm" onClick={() => setEditing('new')}>
      <Plus className="size-4" aria-hidden="true" />
      Add {noun.toLowerCase()}
    </Button>
  )

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl">{title}</h2>
        {addButton}
      </div>

      <QueryState
        query={query}
        skeleton={<Skeleton className="h-48" />}
        isEmpty={(d) => d.length === 0}
        empty={<EmptyState title={`No ${title.toLowerCase()} yet`} action={addButton} />}
      >
        {(rows) => <DataTable columns={allColumns} rows={rows} />}
      </QueryState>

      <Modal open={Boolean(editing)} wide onClose={() => setEditing(null)} title={editing === 'new' ? `Add ${noun.toLowerCase()}` : `Edit ${noun.toLowerCase()}`}>
        {editing && (
          <ResourceForm
            key={editing === 'new' ? 'new' : editing.id}
            fields={fields}
            defaultValues={editing === 'new' ? defaults : toFormValues(editing, fields, defaults)}
            existing={editing === 'new' ? null : editing}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        message={`Delete this ${noun.toLowerCase()}? This cannot be undone.`}
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </section>
  )
}