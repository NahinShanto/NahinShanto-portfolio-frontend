import { ChevronLeft, ChevronRight } from 'lucide-react'

function pageList(page, pages) {
  const keep = [...new Set([1, page - 1, page, page + 1, pages])]
    .filter((p) => p >= 1 && p <= pages)
    .sort((a, b) => a - b)
  const out = []
  keep.forEach((p, i) => {
    if (i > 0 && p - keep[i - 1] > 1) out.push(`gap-${p}`)
    out.push(p)
  })
  return out
}

const btn =
  'inline-flex size-12 items-center justify-center rounded-md border border-border text-sm font-medium transition-colors duration-200 hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-50'

export default function Pagination({ page, count, pageSize, onChange }) {
  const pages = Math.ceil(count / pageSize)
  if (pages <= 1) return null
  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      <button type="button" className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      {pageList(page, pages).map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="px-2 text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btn} ${p === page ? 'border-accent bg-accent text-on-accent hover:bg-accent-hover' : ''}`}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className={btn} disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>
    </nav>
  )
}