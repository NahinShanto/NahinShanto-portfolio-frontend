import { ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

const linkCls = 'inline-flex min-h-12 items-center gap-2 text-sm font-medium'

export default function ProjectCard({ project }) {
  const href = `/projects/${project.slug}`
  return (
    <Card hover className="flex h-full flex-col overflow-hidden">
      <Link to={href} tabIndex={-1} aria-hidden="true" className="block">
        <div className="aspect-video bg-surface-2">
          <img src={project.cover_image} alt="" loading="lazy" className="size-full object-cover" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg">
          <Link to={href} className="text-text no-underline hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech_stack.slice(0, 4).map((t) => (
            <li key={t.id}>
              <Badge>{t.name}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-x-6 pt-4">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className={linkCls}>
              <FaGithub className="size-4" aria-hidden="true" />
              Code
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className={linkCls}>
              <ExternalLink className="size-4" aria-hidden="true" />
              Live demo
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}