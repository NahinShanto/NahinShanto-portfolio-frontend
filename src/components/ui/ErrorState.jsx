import { AlertCircle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div role="alert" className="rounded-lg border border-border bg-surface p-8 text-center">
      <AlertCircle className="mx-auto size-8 text-danger" aria-hidden="true" />
      <p className="mt-4 text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-6" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}