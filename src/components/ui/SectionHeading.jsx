import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SectionHeading({ title, to, linkLabel }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12">
      <h2 className="text-xl md:text-2xl">{title}</h2>
      {to && (
        <Link to={to} className="inline-flex min-h-12 items-center gap-2 text-sm font-medium">
          {linkLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}