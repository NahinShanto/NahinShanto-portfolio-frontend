import { useExperiences } from '../../hooks/useExperiences'
import { EMPLOYMENT_TYPES } from '../../utils/constants'
import { formatMonthYear } from '../../utils/formatDate'
import Badge from '../ui/Badge'
import EmptyState from '../ui/EmptyState'
import QueryState from '../ui/QueryState'
import SectionHeading from '../ui/SectionHeading'
import Skeleton from '../ui/Skeleton'

const bullets = (text = '') =>
  text
    .split('\n')
    .map((l) => l.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 3)

export default function ExperienceTimeline({ limit }) {
  const query = useExperiences()

  return (
    <section className="section border-t border-border">
      <div className="container-page max-w-3xl">
        <SectionHeading title="Experience" />
        <QueryState
          query={query}
          skeleton={
            <div className="space-y-6" role="status" aria-label="Loading">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          }
          isEmpty={(d) => d.length === 0}
          empty={<EmptyState title="No experience added yet" />}
        >
          {(items) => (
            <ol className="ml-2 border-l border-border">
              {(limit ? items.slice(0, limit) : items).map((exp) => (
                <li key={exp.id} className="relative pb-12 pl-8 last:pb-0">
                  <span aria-hidden="true" className="absolute left-0 top-2 size-4 -translate-x-1/2 rounded-full border-2 border-accent bg-bg" />
                  <p className="text-sm text-muted">
                    {formatMonthYear(exp.start_date)} – {exp.is_current ? 'Present' : formatMonthYear(exp.end_date)}
                  </p>
                  <h3 className="mt-1 text-lg">{exp.role}</h3>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-muted">
                    {exp.company_url ? (
                      <a href={exp.company_url} target="_blank" rel="noreferrer">
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                    <Badge>{EMPLOYMENT_TYPES[exp.employment_type]}</Badge>
                    {exp.location && <span className="text-sm">{exp.location}</span>}
                  </p>
                  {bullets(exp.description).length > 0 && (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-muted">
                      {bullets(exp.description).map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          )}
        </QueryState>
      </div>
    </section>
  )
}