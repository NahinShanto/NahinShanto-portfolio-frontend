import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { postsApi } from '../../api/posts'
import ConfirmModal from '../../components/dashboard/ConfirmModal'
import DataTable from '../../components/dashboard/DataTable'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import IconButton from '../../components/ui/IconButton'
import { Select } from '../../components/ui/Input'
import Pagination from '../../components/ui/Pagination'
import QueryState from '../../components/ui/QueryState'
import Skeleton from '../../components/ui/Skeleton'
import useDebounce from '../../hooks/useDebounce'
import usePageTitle from '../../hooks/usePageTitle'
import { usePosts } from '../../hooks/usePosts'
import { getErrorMessage, getErrorSummary } from '../../utils/errors'

export default function DashboardPosts() {
  usePageTitle('Posts | Dashboard')
  const qc = useQueryClient()
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState(null)
  const search = useDebounce(input, 400)
  const query = usePosts({ page, status, ...(search && { search }) })

  const toggle = useMutation({
    mutationFn: (post) => postsApi.update(post.slug, { status: post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }),
    onSuccess: (post) => {
      toast.success(post.status === 'PUBLISHED' ? 'Post published' : 'Post moved to drafts')
      qc.invalidateQueries()
    },
    onError: (error) => toast.error(getErrorSummary(error)), // যেমন: content ১০০ অক্ষরের কম বা category নেই
  })

  const remove = useMutation({
    mutationFn: (post) => postsApi.remove(post.slug),
    onSuccess: () => {
      toast.success('Post deleted')
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
        <Link to={`/dashboard/posts/${p.slug}/edit`} className="font-medium text-text no-underline hover:text-accent">
          {p.title}
        </Link>
      ),
    },
    {
      header: 'Status',
      render: (p) => (
        <Badge variant={p.status === 'PUBLISHED' ? 'success' : 'warning'}>
          {p.status === 'PUBLISHED' ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    { header: 'Category', render: (p) => p.category?.name ?? '—' },
    { header: 'Views', render: (p) => p.views_count },
    { header: 'Likes', render: (p) => p.likes_count },
    { header: 'Comments', render: (p) => p.comments_count },
    {
      header: 'Actions',
      render: (p) => (
        <div className="flex items-center">
          <IconButton
            label={p.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
            onClick={() => toggle.mutate(p)}
            disabled={toggle.isPending}
          >
            {p.status === 'PUBLISHED' ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </IconButton>
          <Link
            to={`/dashboard/posts/${p.slug}/edit`}
            aria-label="Edit post"
            title="Edit post"
            className="inline-flex size-12 items-center justify-center rounded-md text-text hover:bg-surface-2"
          >
            <Pencil className="size-5" aria-hidden="true" />
          </Link>
          <IconButton label="Delete post" onClick={() => setDeleting(p)}>
            <Trash2 className="size-5 text-danger" aria-hidden="true" />
          </IconButton>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl">Posts</h1>
        <Button to="/dashboard/posts/new" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          New post
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={input}
            onChange={(e) => { setInput(e.target.value); setPage(1) }}
            placeholder="Search posts"
            aria-label="Search posts"
            className="h-12 w-full rounded-md border border-border bg-surface pl-12 pr-4 text-text placeholder:text-muted"
          />
        </div>
        <Select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="md:w-48">
          <option value="all">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Drafts</option>
        </Select>
      </div>

      <QueryState
        query={query}
        skeleton={<Skeleton className="h-64" />}
        isEmpty={(d) => d.results.length === 0}
        empty={<EmptyState title={search ? `No posts found for '${search}'` : 'No posts found'} action={<Button to="/dashboard/posts/new" size="sm">New post</Button>} />}
      >
        {(data) => (
          <>
            <DataTable columns={columns} rows={data.results} />
            <Pagination page={page} count={data.count} pageSize={6} onChange={setPage} />
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