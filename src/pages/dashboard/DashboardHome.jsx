import { Link } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import QueryState from '../../components/ui/QueryState'
import Skeleton from '../../components/ui/Skeleton'
import StatCard from '../../components/dashboard/StatCard'
import { useAuth } from '../../context/AuthContext'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import usePageTitle from '../../hooks/usePageTitle'
import { formatDate } from '../../utils/formatDate'
import { shorten } from '../../utils/text'

export default function DashboardHome() {
  usePageTitle('Dashboard')
  const query = useDashboardStats()
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl">Overview</h1>
          <p className="text-muted">Signed in as {user?.username}</p>
        </div>
        <Button to="/dashboard/posts/new">New post</Button>
      </div>

      <QueryState
        query={query}
        skeleton={
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
          </div>
        }
      >
        {(s) => {
          const max = Math.max(1, ...s.posts_per_month.map((m) => m.count))
          return (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Posts" value={s.total_posts} hint={`${s.published_posts} published · ${s.draft_posts} drafts`} />
                <StatCard label="Views" value={s.total_views} hint={`${s.total_likes} likes`} />
                <StatCard label="Pending comments" value={s.pending_comments} hint={`${s.total_comments} in total`} />
                <StatCard label="Unread messages" value={s.unread_messages} hint={`${s.total_projects} projects · ${s.total_skills} skills`} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                  <h2 className="text-lg">Top posts by views</h2>
                  {s.top_posts.length === 0 ? (
                    <p className="mt-4 text-muted">No published posts yet.</p>
                  ) : (
                    <ol className="mt-4 space-y-4">
                      {s.top_posts.map((p) => (
                        <li key={p.slug} className="flex items-center justify-between gap-4">
                          <Link to={`/dashboard/posts/${p.slug}/edit`} className="min-w-0 truncate text-text no-underline hover:text-accent">
                            {p.title}
                          </Link>
                          <span className="shrink-0 text-sm text-muted">{p.views} views · {p.likes} likes</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg">Posts per month</h2>
                  <div className="mt-6 flex h-32 items-end gap-2" role="img" aria-label="Posts created per month, last 6 months">
                    {s.posts_per_month.map((m) => (
                      <div key={m.month} className="flex flex-1 flex-col items-center justify-end gap-2" style={{ height: '100%' }}>
                        <span className="text-xs text-muted">{m.count}</span>
                        <div className="w-full rounded-sm bg-accent" style={{ height: `${Math.max((m.count / max) * 80, m.count ? 8 : 2)}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    {s.posts_per_month.map((m) => (
                      <span key={m.month} className="flex-1 text-center text-xs text-muted">{m.label.split(' ')[0]}</span>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg">Recent comments</h2>
                  <Link to="/dashboard/comments" className="text-sm">Moderate</Link>
                </div>
                {s.recent_comments.length === 0 ? (
                  <p className="mt-4 text-muted">No comments yet.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-border">
                    {s.recent_comments.map((c) => (
                      <li key={c.id} className="py-4">
                        <p className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-medium">{c.name}</span>
                          <span className="text-muted">on {c.post_title} · {formatDate(c.created_at)}</span>
                          {!c.is_approved && <Badge variant="warning">Pending</Badge>}
                        </p>
                        <p className="mt-2 text-muted">{shorten(c.content, 140)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </>
          )
        }}
      </QueryState>
    </div>
  )
}