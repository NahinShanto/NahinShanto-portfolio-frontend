import { ArrowRight } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import Button from '../ui/Button'
import Skeleton from '../ui/Skeleton'

export default function AboutPreview() {
  const { data: profile, isLoading } = useProfile()
  if (!isLoading && !profile) return null

  return (
    <section className="section border-t border-border">
      <div className="container-page max-w-3xl">
        <h2 className="text-xl md:text-2xl">About me</h2>
        {isLoading ? (
          <div className="mt-4 space-y-2" role="status" aria-label="Loading">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ) : (
          <p className="mt-4 line-clamp-5 text-lg text-muted">{profile.bio}</p>
        )}
        <Button to="/about" variant="ghost" className="-ml-4 mt-6">
          More about me
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}