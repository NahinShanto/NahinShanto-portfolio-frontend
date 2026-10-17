import { GraduationCap } from 'lucide-react'
import { useEducation } from '../../hooks/useExperiences'
import EmptyState from '../ui/EmptyState'
import QueryState from '../ui/QueryState'
import SectionHeading from '../ui/SectionHeading'
import Skeleton from '../ui/Skeleton'

export default function EducationList() {
  const query = useEducation()

  return (
    <section className="section border-t border-border">
      <div className="container-page max-w-3xl">
        <SectionHeading title="Education" />
        <QueryState
          query={query}
          skeleton={<Skeleton className="h-32" />}
          isEmpty={(d) => d.length === 0}
          empty={<EmptyState title="No education added yet" />}
        >
          {(items) => (
            <ul className="space-y-8">
              {items.map((e) => (
                <li key={e.id} className="flex gap-4">
                  <GraduationCap className="mt-1 size-6 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-muted">{e.start_year} – {e.end_year ?? 'Present'}</p>
                    <h3 className="text-lg">{e.degree}, {e.field_of_study}</h3>
                    <p className="text-muted">{e.institution}{e.grade ? ` · ${e.grade}` : ''}</p>
                    {e.description && <p className="mt-2 text-muted">{e.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </QueryState>
      </div>
    </section>
  )
}