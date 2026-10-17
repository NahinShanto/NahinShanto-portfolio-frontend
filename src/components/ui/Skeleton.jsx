export default function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-surface-2 ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface" role="status" aria-label="Loading">
      <Skeleton className="aspect-video rounded-none" />
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}