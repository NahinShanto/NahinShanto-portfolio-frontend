import { Clock, Eye, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/formatDate'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

export default function PostCard({ post }) {
  const { isOwner } = useAuth()
  const href = `/blog/${post.slug}`

  return (
    <Card hover className="flex h-full flex-col overflow-hidden">
      <Link to={href} tabIndex={-1} aria-hidden="true" className="block">
        <div className="aspect-video bg-surface-2">
          {post.cover_image && (
            <img src={post.cover_image} alt="" loading="lazy" className="size-full object-cover" />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && <Badge variant="accent">{post.category.name}</Badge>}
          {isOwner && post.status === 'DRAFT' && <Badge variant="warning">Draft</Badge>}
        </div>
        <h3 className="mt-4 line-clamp-2 text-lg">
          <Link to={href} className="text-text no-underline hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        <ul className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-xs text-muted">
          <li>{formatDate(post.published_at ?? post.created_at)}</li>
          <li className="inline-flex items-center gap-1">
            <Clock className="size-4" aria-hidden="true" />
            {post.reading_time} min
          </li>
          <li className="inline-flex items-center gap-1">
            <Eye className="size-4" aria-hidden="true" />
            {post.views_count}
          </li>
          <li className="inline-flex items-center gap-1">
            <Heart className="size-4" aria-hidden="true" />
            {post.likes_count}
          </li>
        </ul>
      </div>
    </Card>
  )
}