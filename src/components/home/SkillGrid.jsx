import { useSkills } from '../../hooks/useSkills'
import { SKILL_CATEGORIES } from '../../utils/constants'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'
import QueryState from '../ui/QueryState'
import SectionHeading from '../ui/SectionHeading'
import Skeleton from '../ui/Skeleton'

function SkillsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  )
}

export default function SkillGrid() {
  const query = useSkills()

  return (
    <section className="section border-t border-border">
      <div className="container-page">
        <SectionHeading title="Skills" />
        <QueryState
          query={query}
          skeleton={<SkillsSkeleton />}
          isEmpty={(d) => d.length === 0}
          empty={<EmptyState title="No skills added yet" />}
        >
          {(skills) => (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(SKILL_CATEGORIES)
                .map(([key, label]) => ({ key, label, items: skills.filter((s) => s.category === key) }))
                .filter((g) => g.items.length > 0)
                .map((group) => (
                  <Card key={group.key} className="p-6">
                    <h3 className="text-lg">{group.label}</h3>
                    <ul className="mt-6 space-y-4">
                      {group.items.map((s) => (
                        <li key={s.id}>
                          <div className="flex justify-between text-sm">
                            <span>{s.name}</span>
                            <span className="text-muted">{s.proficiency}%</span>
                          </div>
                          <div
                            className="mt-2 h-2 rounded-sm bg-surface-2"
                            role="progressbar"
                            aria-label={`${s.name} proficiency`}
                            aria-valuenow={s.proficiency}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div className="h-full rounded-sm bg-accent" style={{ width: `${s.proficiency}%` }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
            </div>
          )}
        </QueryState>
      </div>
    </section>
  )
}