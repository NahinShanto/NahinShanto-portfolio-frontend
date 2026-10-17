import { useState } from 'react'
import { useComments } from '../../hooks/usePosts'
import { formatDate } from '../../utils/formatDate'
import { initials } from '../../utils/text'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import Pagination from '../ui/Pagination'
import QueryState from '../ui/QueryState'
import Skeleton from '../ui/Skeleton'
import CommentForm from './CommentForm'

function Author({ comment }) {
  return (
    <div className="flex items-center gap-4">
      <span aria-hidden="true" className="inline-flex size-10 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-muted">
        {initials(comment.name)}
      </span>
      <div>
        <p className="font-medium leading-tight">
          {comment.website ? (
            <a href={comment.website} target="_blank" rel="noopener noreferrer nofollow">{comment.name}</a>
          ) : (
            comment.name
          )}
        </p>
        <p className="text-xs text-muted">{formatDate(comment.created_at)}</p>
      </div>
    </div>
  )
}

export default function CommentList({ slug }) {
  const [page, setPage] = useState(1)
  const [replyTo, setReplyTo] = useState(null)
  const query = useComments(slug, page)

  return (
    <QueryState
      query={query}
      skeleton={
        <div className="space-y-6" role="status" aria-label="Loading comments">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      }
      isEmpty={(d) => d.results.length === 0}
      empty={<EmptyState title="No comments yet" description="Be the first to share your thoughts." />}
    >
      {(data) => (
        <>
          <ul className="space-y-8">
            {data.results.map((comment) => (
              <li key={comment.id}>
                <Author comment={comment} />
                {/* সাধারণ text হিসেবে দেখানো হয়, HTML হিসেবে নয় */}
                <p className="mt-4 whitespace-pre-wrap">{comment.content}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-4 mt-2"
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                >
                  {replyTo === comment.id ? 'Cancel reply' : 'Reply'}
                </Button>

                {replyTo === comment.id && (
                  <div className="mt-4 rounded-lg border border-border bg-surface p-6">
                    <CommentForm slug={slug} parentId={comment.id} />
                  </div>
                )}

                {comment.replies.length > 0 && (
                  <ul className="mt-6 space-y-6 border-l border-border pl-6 md:ml-8">
                    {comment.replies.map((reply) => (
                      <li key={reply.id}>
                        <Author comment={reply} />
                        <p className="mt-4 whitespace-pre-wrap">{reply.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Pagination page={page} count={data.count} pageSize={10} onChange={setPage} />
        </>
      )}
    </QueryState>
  )
}