import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { projectsApi } from '../../api/projects'
import ConfirmModal from '../../components/dashboard/ConfirmModal'
import DataTable from '../../components/dashboard/DataTable'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import IconButton from '../../components/ui/IconButton'
import Pagination from '../../components/ui/Pagination'
import QueryState from '../../components/ui/QueryState'
import Skeleton from '../../components/ui/Skeleton'
import useDebounce from '../../hooks/useDebounce'
import usePageTitle from '../../hooks/usePageTitle'
import { useProjects } from '../../hooks/useProjects'
import { PROJECT_CATEGORIES } from '../../utils/constants'
import { getErrorMessage } from '../../utils/errors'
import { formatDate } from '../../utils/formatDate'

export default function DashboardProjects() {
  usePageTitle('Projects | Dashboard')
  const qc = useQueryClient()
  const [input, setInput] = useState('')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState(null)
  const search = useDebounce(input, 400)
  const query = useProjects({ page, ...(search && { search }) })

  const remove = useMutation({
    mutationFn: (p) => projectsApi.remove(p.slug),
    onSuccess: () => {
      toast.success('Project deleted')
      setDeleting(null)
      qc.invalidateQueries()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
      setDeleting(null)
    },
  })

  const columns = [
    {
      header: 'Title',
      render: (p) => (
        <Link to={`/dashboard/projects/${p.slug}/edit`} className="font-medium text-text no-underline hover:text-accent">
          {p.title}
        </Link>
      ),
    },
    { header: 'Category', render: (p) => PROJECT_CATEGORIES[p.category] ?? p.category },
    { header: 'Featured', render: (p) => (p.is_featured ? <Badge variant="accent">Featured</Badge> : '—') },
    { header: 'Completed', render: (p) => formatDate(p.completed_date) || '—' },
    {
      header: 'Actions',
      render: (p) => (
        <div className="flex items-center">
          <Link
            to={`/dashboard/projects/${p.slug}/edit`}
            aria-label="Edit project"
            title="Edit project"
            className="inline-flex size-12 items-center justify-center rounded-md text-text hover:bg-surface-2"
          >
            <Pencil className="size-5" aria-hidden="true" />
          </Link>
          <IconButton label="Delete project" onClick={() => setDeleting(p)}>
            <Trash2 className="size-5 text-danger" aria-hidden="true" />
          </IconButton>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl">Projects</h1>
        <Button to="/dashboard/projects/new" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          New project
        </Button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={input}
          onChange={(e) => { setInput(e.target.value); setPage(1) }}
          placeholder="Search projects"
          aria-label="Search projects"
          className="h-12 w-full rounded-md border border-border bg-surface pl-12 pr-4 text-text placeholder:text-muted"
        />
      </div>

      <QueryState
        query={query}
        skeleton={<Skeleton className="h-64" />}
        isEmpty={(d) => d.results.length === 0}
        empty={<EmptyState title="No projects found" action={<Button to="/dashboard/projects/new" size="sm">New project</Button>} />}
      >
        {(data) => (
          <>
            <DataTable columns={columns} rows={data.results} />
            <Pagination page={page} count={data.count} pageSize={9} onChange={setPage} />
          </>
        )}
      </QueryState>

      <ConfirmModal
        open={Boolean(deleting)}
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}