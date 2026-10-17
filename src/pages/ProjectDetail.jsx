import { Calendar, ExternalLink, Pencil } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import { useAuth } from '../context/AuthContext'
import usePageTitle from '../hooks/usePageTitle'
import { useProject } from '../hooks/useProjects'
import { PROJECT_CATEGORIES } from '../utils/constants'
import { getErrorMessage } from '../utils/errors'
import { formatDate } from '../utils/formatDate'

export default function ProjectDetail() {
  const { slug } = useParams()
  const query = useProject(slug)
  const { isOwner } = useAuth()
  const project = query.data

  usePageTitle(project ? project.title : 'Project')

  if (query.isLoading) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-3xl space-y-6" role="status" aria-label="Loading">
          <Skeleton className="aspect-video" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-48" />
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
            <EmptyState title="Project not found" action={<Button to="/projects">Back to projects</Button>} />
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
        <div className="aspect-video overflow-hidden rounded-lg border border-border bg-surface-2">
          <img src={project.cover_image} alt={`Screenshot of ${project.title}`} className="size-full object-cover" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Badge variant="accent">{PROJECT_CATEGORIES[project.category] ?? project.category}</Badge>
          {project.completed_date && (
            <span className="inline-flex items-center gap-1 text-sm text-muted">
              <Calendar className="size-4" aria-hidden="true" />
              {formatDate(project.completed_date)}
            </span>
          )}
          {isOwner && (
            <Link to={`/dashboard/projects/${project.slug}/edit`} className="inline-flex items-center gap-1 text-sm">
              <Pencil className="size-4" aria-hidden="true" />
              Edit
            </Link>
          )}
        </div>

        <h1 className="mt-4 text-2xl md:text-3xl">{project.title}</h1>
        <p className="mt-4 text-lg text-muted">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-4">
          {project.live_url && (
            <Button href={project.live_url} target="_blank" rel="noreferrer">
              <ExternalLink className="size-5" aria-hidden="true" />
              Live demo
            </Button>
          )}
          {project.github_url && (
            <Button variant="secondary" href={project.github_url} target="_blank" rel="noreferrer">
              <FaGithub className="size-5" aria-hidden="true" />
              Source code
            </Button>
          )}
        </div>

        {project.tech_stack.length > 0 && (
          <section className="mt-12" aria-labelledby="tech-heading">
            <h2 id="tech-heading" className="text-lg">Tech stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tech_stack.map((t) => (
                <li key={t.id}><Badge>{t.name}</Badge></li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12" aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-lg">About this project</h2>
          <div className="mt-4 max-w-[72ch]">
            <div className="prose max-w-none">
              <ReactMarkdown
                components={{ a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}
              >
                {project.description}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        <Button to="/projects" variant="ghost" className="-ml-4 mt-12">Back to all projects</Button>
      </article>
    </PageContainer>
  )
}