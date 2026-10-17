import { Clock, Eye, Pencil } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import CommentForm from '../components/blog/CommentForm'
import CommentList from '../components/blog/CommentList'
import LikeButton from '../components/blog/LikeButton'
import PostCard from '../components/blog/PostCard'
import ShareBar from '../components/blog/ShareBar'
import PageContainer from '../components/layout/PageContainer'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'
import { usePost } from '../hooks/usePosts'
import { useProfile } from '../hooks/useProfile'
import { formatDate } from '../utils/formatDate'
import { getErrorMessage } from '../utils/errors'

export default function BlogDetail() {
  const { slug } = useParams()
  const query = usePost(slug)
  const { data: profile } = useProfile()
  const { isOwner } = useAuth()
  const post = query.data

  usePageTitle(post ? `${post.title}${profile ? ` | ${profile.full_name}` : ''}` : 'Blog')

  if (query.isLoading) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-3xl space-y-6" role="status" aria-label="Loading">
          <Skeleton className="aspect-video" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64" />
        </div>
      </PageContainer>
    )
  }

  if (query.isError) {
    const notFound = query.error?.response?.status === 404
    return (
      <PageContainer>
        <div className="mx-auto max-w-3xl">
          {notFound ? (
            <EmptyState
              title="Post not found"
              description="This post does not exist or is no longer available."
              action={<Button to="/blog">Back to the blog</Button>}
            />
          ) : (
            <ErrorState message={getErrorMessage(query.error)} onRetry={query.refetch} />
          )}
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <article className="mx-auto max-w-3xl">
        {post.cover_image && (
          <div className="aspect-video overflow-hidden rounded-lg border border-border bg-surface-2">
            <img src={post.cover_image} alt={post.title} className="size-full object-cover" />
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {post.category && (
            <Link to={`/blog?category=${post.category.slug}`} className="no-underline">
              <Badge variant="accent">{post.category.name}</Badge>
            </Link>
          )}
          {isOwner && post.status === 'DRAFT' && <Badge variant="warning">Draft</Badge>}
        </div>

        <h1 className="mt-4 text-2xl md:text-3xl">{post.title}</h1>

        <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <li>{formatDate(post.published_at ?? post.created_at)}</li>
          <li className="inline-flex items-center gap-1">
            <Clock className="size-4" aria-hidden="true" />
            {post.reading_time} min read
          </li>
          <li className="inline-flex items-center gap-1">
            <Eye className="size-4" aria-hidden="true" />
            {post.views_count} views
          </li>
          {isOwner && (
            <li>
              <Link to={`/dashboard/posts/${post.slug}/edit`} className="inline-flex items-center gap-1 text-sm">
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Link>
            </li>
          )}
        </ul>

        {/* এক লাইনে সর্বোচ্চ ~72 অক্ষর। react-markdown HTML চালায় না, তাই নিরাপদ (S-6) */}
        <div className="mt-8 max-w-[72ch]">
          <div className="prose max-w-none">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                img: ({ node, ...props }) => <img {...props} loading="lazy" alt={props.alt ?? ''} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {post.tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t.id}>
                <Link to={`/blog?tag=${t.slug}`} className="no-underline">
                  <Badge>#{t.name}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border py-6">
          <LikeButton slug={post.slug} liked={post.is_liked} count={post.likes_count} />
          <ShareBar title={post.title} />
        </div>

        <section className="mt-12" aria-labelledby="comments-heading">
          <h2 id="comments-heading" className="text-xl">
            Comments ({post.comments_count})
          </h2>
          <div className="mt-6 rounded-lg border border-border bg-surface p-6">
            <h3 className="mb-4 text-lg">Leave a comment</h3>
            <CommentForm slug={post.slug} />
          </div>
          <div className="mt-8">
            <CommentList slug={post.slug} />
          </div>
        </section>
      </article>

      {post.related_posts.length > 0 && (
        <section className="mt-16 border-t border-border pt-12" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-8 text-xl">
            Related posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {post.related_posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  )
}