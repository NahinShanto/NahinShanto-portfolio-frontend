import { Download, MapPin } from 'lucide-react'
import ContactCta from '../components/home/ContactCta'
import EducationList from '../components/home/EducationList'
import ExperienceTimeline from '../components/home/ExperienceTimeline'
import SkillGrid from '../components/home/SkillGrid'
import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import SocialLinks from '../components/ui/SocialLinks'
import usePageTitle from '../hooks/usePageTitle'
import { useProfile } from '../hooks/useProfile'
import { getErrorMessage } from '../utils/errors'
import { initials } from '../utils/text'

export default function About() {
  const { data: profile, isLoading, isError, error, refetch } = useProfile()
  usePageTitle(profile ? `About | ${profile.full_name}` : 'About')

  return (
    <>
      <section className="section">
        <div className="container-page">
          {isLoading && (
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr]" role="status" aria-label="Loading">
              <Skeleton className="aspect-[4/5] w-full max-w-sm" />
              <Skeleton className="h-64" />
            </div>
          )}
          {isError && <ErrorState message={getErrorMessage(error)} onRetry={refetch} />}
          {profile && (
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_2fr]">
              <div className="aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-border bg-surface-2">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={`Portrait of ${profile.full_name}`} className="size-full object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center font-heading text-3xl text-muted" aria-hidden="true">
                    {initials(profile.full_name)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl">{profile.full_name}</h1>
                <p className="mt-2 text-lg text-muted">{profile.headline}</p>
                {profile.location && (
                  <p className="mt-4 inline-flex items-center gap-2 text-muted">
                    <MapPin className="size-4" aria-hidden="true" />
                    {profile.location}
                  </p>
                )}
                <p className="mt-6 max-w-[72ch] whitespace-pre-line text-lg">{profile.bio}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  {profile.resume && (
                    <Button href={profile.resume} target="_blank" rel="noreferrer">
                      <Download className="size-5" aria-hidden="true" />
                      Download Resume
                    </Button>
                  )}
                  <Button to="/contact" variant="secondary">Get in touch</Button>
                </div>
                <SocialLinks profile={profile} className="mt-8" />
              </div>
            </div>
          )}
        </div>
      </section>
      <SkillGrid />
      <ExperienceTimeline />
      <EducationList />
      <ContactCta />
    </>
  )
}