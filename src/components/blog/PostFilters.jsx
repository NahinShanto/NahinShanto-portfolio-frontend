import { Search } from 'lucide-react'
import { Select } from '../ui/Input'

export const SORT_OPTIONS = [
  { value: '-published_at', label: 'Newest' },
  { value: '-views_count', label: 'Most viewed' },
  { value: '-likes_count', label: 'Most liked' },
  { value: 'title', label: 'A-Z' },
]

const chip = (active) =>
  `inline-flex h-12 items-center rounded-md border px-4 text-sm font-medium transition-colors duration-200 ${
    active
      ? 'border-accent bg-accent text-on-accent'
      : 'border-border bg-surface text-text hover:bg-surface-2'
  }`

export default function PostFilters({
  input, onInput, categories = [], category, onCategory,
  tags = [], tag, onTag, ordering, onOrdering,
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={input}
            onChange={(e) => onInput(e.target.value)}
            placeholder="Search posts"
            aria-label="Search posts"
            className="h-12 w-full rounded-md border border-border bg-surface pl-12 pr-4 text-text placeholder:text-muted transition-colors duration-200"
          />
        </div>
        <Select aria-label="Filter by tag" value={tag} onChange={(e) => onTag(e.target.value)} className="md:w-48">
          <option value="">All tags</option>
          {tags.filter((t) => t.posts_count > 0).map((t) => (
            <option key={t.id} value={t.slug}>{t.name} ({t.posts_count})</option>
          ))}
        </Select>
        <Select aria-label="Sort posts" value={ordering} onChange={(e) => onOrdering(e.target.value)} className="md:w-48">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        <button type="button" className={chip(!category)} aria-pressed={!category} onClick={() => onCategory('')}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={chip(category === c.slug)}
            aria-pressed={category === c.slug}
            onClick={() => onCategory(c.slug)}
          >
            {c.name} ({c.posts_count})
          </button>
        ))}
      </div>
    </div>
  )
}