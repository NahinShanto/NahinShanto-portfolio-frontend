import { usePosts } from '../../hooks/usePosts'
import PostCard from '../blog/PostCard'
import EmptyState from '../ui/EmptyState'
import QueryState from '../ui/QueryState'
import SectionHeading from '../ui/SectionHeading'
import { CardSkeleton } from '../ui/Skeleton'

export default function LatestPosts() {
  const query = usePosts({ ordering: '-published_at' })

  return (
    <section className="section border-t border-border">
      <div className="container-page">
        <SectionHeading title="Latest from the blog" to="/blog" linkLabel="Read the blog" />
        <QueryState
          query={query}
          skeleton={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          }
          isEmpty={(d) => d.results.length === 0}
          empty={<EmptyState title="No posts published yet" />}
        >
          {(data) => (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.results.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </QueryState>
      </div>
    </section>
  )
}