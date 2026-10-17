import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MailOpen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { contactApi } from '../../api/contact'
import ConfirmModal from '../../components/dashboard/ConfirmModal'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Chip from '../../components/ui/Chip'
import EmptyState from '../../components/ui/EmptyState'
import IconButton from '../../components/ui/IconButton'
import Pagination from '../../components/ui/Pagination'
import QueryState from '../../components/ui/QueryState'
import Skeleton from '../../components/ui/Skeleton'
import usePageTitle from '../../hooks/usePageTitle'
import { getErrorMessage } from '../../utils/errors'
import { formatDate } from '../../utils/formatDate'

export default function DashboardMessages() {
  usePageTitle('Messages | Dashboard')
  const qc = useQueryClient()
  const [tab, setTab] = useState('') // '' = সব, 'false' = unread
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const query = useQuery({
    queryKey: ['admin-messages', tab, page],
    queryFn: () => contactApi.list({ page, ...(tab && { is_read: tab }) }),
    placeholderData: keepPreviousData,
  })

  const mark = useMutation({
    mutationFn: ({ id, is_read }) => contactApi.update(id, { is_read }),
    onSuccess: () => qc.invalidateQueries(),
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const remove = useMutation({
    mutationFn: (m) => contactApi.remove(m.id),
    onSuccess: () => {
      toast.success('Message deleted')
      setDeleting(null)
      qc.invalidateQueries()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
      setDeleting(null)
    },
  })

  const toggleOpen = (m) => {
    setOpenId(openId === m.id ? null : m.id)
    // "সব" ট্যাবে খুললে নিজে থেকে read হয়। Unread ট্যাবে হলে তালিকা থেকে সরে যেত, তাই সেখানে নয়
    if (!m.is_read && tab === '') mark.mutate({ id: m.id, is_read: true })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl">Messages</h1>
      <div role="group" aria-label="Filter messages" className="flex flex-wrap gap-2">
        <Chip active={tab === ''} onClick={() => { setTab(''); setPage(1) }}>All</Chip>
        <Chip active={tab === 'false'} onClick={() => { setTab('false'); setPage(1) }}>Unread</Chip>
      </div>

      <QueryState
        query={query}
        skeleton={<Skeleton className="h-48" />}
        isEmpty={(d) => d.results.length === 0}
        empty={<EmptyState title={tab === 'false' ? 'No unread messages' : 'No messages yet'} />}
      >
        {(data) => (
          <>
            <ul className="space-y-4">
              {data.results.map((m) => (
                <li key={m.id}>
                  <Card>
                    <button
                      type="button"
                      onClick={() => toggleOpen(m)}
                      aria-expanded={openId === m.id}
                      className="flex min-h-12 w-full items-center gap-4 p-4 text-left"
                    >
                      <span
                        aria-label={m.is_read ? 'Read' : 'Unread'}
                        className={`size-2 shrink-0 rounded-full ${m.is_read ? 'bg-transparent' : 'bg-accent'}`}
                      />
                      <span className={`min-w-0 flex-1 truncate ${m.is_read ? '' : 'font-semibold'}`}>{m.subject}</span>
                      <span className="hidden text-sm text-muted sm:inline">{m.name}</span>
                      <span className="text-sm text-muted">{formatDate(m.created_at)}</span>
                    </button>
                    {openId === m.id && (
                      <div className="border-t border-border p-4">
                        <p className="text-sm text-muted">
                          From {m.name} · <a href={`mailto:${m.email}`}>{m.email}</a>
                        </p>
                        <p className="mt-4 whitespace-pre-wrap">{m.message}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => mark.mutate({ id: m.id, is_read: !m.is_read })}
                            disabled={mark.isPending}
                          >
                            <MailOpen className="size-4" aria-hidden="true" />
                            Mark as {m.is_read ? 'unread' : 'read'}
                          </Button>
                          <IconButton label="Delete message" onClick={() => setDeleting(m)}>
                            <Trash2 className="size-5 text-danger" aria-hidden="true" />
                          </IconButton>
                        </div>
                      </div>
                    )}
                  </Card>
                </li>
              ))}
            </ul>
            <Pagination page={page} count={data.count} pageSize={10} onChange={setPage} />
          </>
        )}
      </QueryState>

      <ConfirmModal
        open={Boolean(deleting)}
        message="Delete this message? This cannot be undone."
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}