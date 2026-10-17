import { Download } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { getErrorMessage } from '../../utils/errors'
import { initials, shorten } from '../../utils/text'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ErrorState from '../ui/ErrorState'
import Skeleton from '../ui/Skeleton'
import SocialLinks from '../ui/SocialLinks'

export default function Hero() {
  const { data: profile, isLoading, isError, error, refetch } = useProfile()

  return (
    <section className="section">
      <div className="container-page">
        {isLoading && (
          <div className="grid items-center gap-12 lg:grid-cols-2" role="status" aria-label="Loading">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="mx-auto aspect-[4/5] w-full max-w-sm" />
          </div>
        )}
        {isError && <ErrorState message={getErrorMessage(error)} onRetry={refetch} />}
        {profile && (
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              {profile.is_available_for_hire && <Badge variant="success">Available for hire</Badge>}
              <p className="mt-6 text-sm font-medium uppercase tracking-widest text-muted">{profile.headline}</p>
              <h1 className="mt-2 text-2xl md:text-3xl">{profile.full_name}</h1>
              <p className="mt-6 max-w-xl text-lg text-muted">{shorten(profile.bio, 180)}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button to="/projects">View Projects</Button>
                {profile.resume && (
                  <Button variant="secondary" href={profile.resume} target="_blank" rel="noreferrer">
                    <Download className="size-5" aria-hidden="true" />
                    Download Resume
                  </Button>
                )}
              </div>
              <SocialLinks profile={profile} className="mt-8" />
            </div>
            <div className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-border bg-surface-2">
              {profile.avatar ? (
                <img src={profile.avatar} alt={`Portrait of ${profile.full_name}`} className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center font-heading text-3xl text-muted" aria-hidden="true">
                  {initials(profile.full_name)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}