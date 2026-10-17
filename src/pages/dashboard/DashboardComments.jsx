import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Trash2, Undo2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { commentsApi } from '../../api/posts'
import ConfirmModal from '../../components/dashboard/ConfirmModal'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Chip from '../../components/ui/Chip'
import EmptyState from '../../components/ui/EmptyState'
import IconButton from '../../components/ui/IconButton'
import Pagination from '../../components/ui/Pagination'
import QueryState from '../../components/ui/QueryState'
import Skeleton from '../../components/ui/Skeleton'
import Card from '../../components/ui/Card'
import usePageTitle from '../../hooks/usePageTitle'
import { getErrorMessage } from '../../utils/errors'
import { formatDate } from '../../utils/formatDate'

const TABS = [
  { label: 'Pending', value: 'false' },
  { label: 'Approved', value: 'true' },
  { label: 'All', value: '' },
]

export default function DashboardComments() {
  usePageTitle('Comments | Dashboard')
  const qc = useQueryClient()
  const [tab, setTab] = useState('false')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState(null)

  const query = useQuery({
    queryKey: ['admin-comments', tab, page],
    queryFn: () => commentsApi.list({ page, ...(tab && { is_approved: tab }) }),
    placeholderData: keepPreviousData,
  })

  const toggle = useMutation({
    mutationFn: (c) => commentsApi.update(c.id, { is_approved: !c.is_approved }),
    onSuccess: (c) => {
      toast.success(c.is_approved ? 'Comment approved. It is now public.' : 'Comment unapproved')
      qc.invalidateQueries()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const remove = useMutation({
    mutationFn: (c) => commentsApi.remove(c.id),
    onSuccess: () => {
      toast.success('Comment deleted')
      setDeleting(null)
      qc.invalidateQueries()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
      setDeleting(null)
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl">Comments</h1>
      <div role="group" aria-label="Filter comments" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Chip key={t.label} active={tab === t.value} onClick={() => { setTab(t.value); setPage(1) }}>
            {t.label}
          </Chip>
        ))}
      </div>

      <QueryState
        query={query}
        skeleton={<Skeleton className="h-48" />}
        isEmpty={(d) => d.results.length === 0}
        empty={<EmptyState title={tab === 'false' ? 'No comments waiting for approval' : 'No comments found'} />}
      >
        {(data) => (
          <>
            <ul className="space-y-4">
              {data.results.map((c) => (
                <li key={c.id}>
                  <Card className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{c.name}</span>
                          <a href={`mailto:${c.email}`} className="text-sm">{c.email}</a>
                          <Badge variant={c.is_approved ? 'success' : 'warning'}>{c.is_approved ? 'Approved' : 'Pending'}</Badge>
                          {c.parent && <Badge>Reply</Badge>}
                        </p>
                        <p className="mt-2 text-sm text-muted">
                          on <Link to={`/blog/${c.post_slug}`}>{c.post_title}</Link> · {formatDate(c.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={c.is_approved ? 'secondary' : 'primary'}
                          onClick={() => toggle.mutate(c)}
                          disabled={toggle.isPending}
                        >
                          {c.is_approved ? <Undo2 className="size-4" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
                          {c.is_approved ? 'Unapprove' : 'Approve'}
                        </Button>
                        <IconButton label="Delete comment" onClick={() => setDeleting(c)}>
                          <Trash2 className="size-5 text-danger" aria-hidden="true" />
                        </IconButton>
                      </div>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap">{c.content}</p>
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
        message="Delete this comment? This cannot be undone."
        loading={remove.isPending}
        onConfirm={() => remove.mutate(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}