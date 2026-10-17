import { Inbox } from 'lucide-react'

export default function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      <Inbox className="mx-auto size-8 text-muted" aria-hidden="true" />
      <p className="mt-4 font-medium">{title}</p>
      {description && <p className="mt-2 text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}