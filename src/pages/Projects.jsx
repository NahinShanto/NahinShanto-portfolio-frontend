import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProjectCard from '../components/home/ProjectCard'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import { Select } from '../components/ui/Input'
import Pagination from '../components/ui/Pagination'
import QueryState from '../components/ui/QueryState'
import { CardSkeleton } from '../components/ui/Skeleton'
import useDebounce from '../hooks/useDebounce'
import usePageTitle from '../hooks/usePageTitle'
import { useProjects } from '../hooks/useProjects'
import { useSkills } from '../hooks/useSkills'
import { PROJECT_CATEGORIES } from '../utils/constants'

const PAGE_SIZE = 9
const DEFAULT_ORDERING = '-completed_date'
const SORTS = [
  { value: '-completed_date', label: 'Newest' },
  { value: 'completed_date', label: 'Oldest' },
  { value: 'display_order', label: 'My order' },
]

export default function Projects() {
  usePageTitle('Projects')
  const [params, setParams] = useSearchParams()

  const search = params.get('search') ?? ''
  const category = params.get('category') ?? ''
  const tech = params.get('tech') ?? ''
  const ordering = params.get('ordering') ?? DEFAULT_ORDERING
  const page = Number(params.get('page')) || 1

  const [input, setInput] = useState(search)
  const debounced = useDebounce(input, 400)

  const update = (changes, replace = false) => {
    const next = new URLSearchParams(params)
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
    if (!('page' in changes)) next.delete('page')
    setParams(next, { replace })
  }

  useEffect(() => {
    if (debounced.trim() !== search) update({ search: debounced.trim() }, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const query = useProjects({
    page,
    ordering,
    ...(search && { search }),
    ...(category && { category }),
    ...(tech && { tech }),
  })
  const skills = useSkills()

  const hasFilters = Boolean(search || category || tech)
  const clearFilters = () => {
    setInput('')
    setParams({})
  }

  return (
    <PageContainer>
      <header className="max-w-2xl">
        <h1 className="text-2xl md:text-3xl">Projects</h1>
        <p className="mt-4 text-lg text-muted">Things I have built, from small tools to full-stack apps.</p>
      </header>

      <div className="mt-8 space-y-6 md:mt-12">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="h-12 w-full rounded-md border border-border bg-surface pl-12 pr-4 text-text placeholder:text-muted"
            />
          </div>
          <Select aria-label="Filter by technology" value={tech} onChange={(e) => update({ tech: e.target.value })} className="md:w-48">
            <option value="">All technologies</option>
            {(skills.data ?? []).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
          <Select
            aria-label="Sort projects"
            value={ordering}
            onChange={(e) => update({ ordering: e.target.value === DEFAULT_ORDERING ? '' : e.target.value })}
            className="md:w-48"
          >
            {SORTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>

        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          <Chip active={!category} onClick={() => update({ category: '' })}>All</Chip>
          {Object.entries(PROJECT_CATEGORIES).map(([key, label]) => (
            <Chip key={key} active={category === key} onClick={() => update({ category: key })}>
              {label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-8 md:mt-12">
        <QueryState
          query={query}
          skeleton={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
            </div>
          }
          isEmpty={(d) => d.results.length === 0}
          empty={
            <EmptyState
              title={search ? `No projects found for '${search}'` : 'No projects found'}
              description={hasFilters ? 'Try a different search or clear the filters.' : 'Check back soon.'}
              action={hasFilters && <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
            />
          }
        >
          {(data) => (
            <div className={query.isPlaceholderData ? 'opacity-60 transition-opacity' : ''}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.results.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
              <Pagination
                page={page}
                count={data.count}
                pageSize={PAGE_SIZE}
                onChange={(p) => {
                  update({ page: p > 1 ? String(p) : '' })
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </div>
          )}
        </QueryState>
      </div>
    </PageContainer>
  )
}