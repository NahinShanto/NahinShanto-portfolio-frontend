import { useFeaturedProjects } from '../../hooks/useProjects'
import EmptyState from '../ui/EmptyState'
import QueryState from '../ui/QueryState'
import SectionHeading from '../ui/SectionHeading'
import { CardSkeleton } from '../ui/Skeleton'
import ProjectCard from './ProjectCard'

export default function FeaturedProjects() {
  const query = useFeaturedProjects(3)

  return (
    <section className="section border-t border-border">
      <div className="container-page">
        <SectionHeading title="Featured projects" to="/projects" linkLabel="See all projects" />
        <QueryState
          query={query}
          skeleton={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          }
          isEmpty={(d) => d.length === 0}
          empty={<EmptyState title="No projects yet" />}
        >
          {(projects) => (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </QueryState>
      </div>
    </section>
  )
}