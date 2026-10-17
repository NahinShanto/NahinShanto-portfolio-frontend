import AboutPreview from '../components/home/AboutPreview'
import ContactCta from '../components/home/ContactCta'
import ExperienceTimeline from '../components/home/ExperienceTimeline'
import FeaturedProjects from '../components/home/FeaturedProjects'
import Hero from '../components/home/Hero'
import LatestPosts from '../components/home/LatestPosts'
import SkillGrid from '../components/home/SkillGrid'
import { useProfile } from '../hooks/useProfile'
import usePageTitle from '../hooks/usePageTitle'

export default function Home() {
  const { data: profile } = useProfile()
  usePageTitle(profile ? `${profile.full_name} | ${profile.headline}` : 'Portfolio')

  return (
    <>
      <Hero />
      <AboutPreview />
      <SkillGrid />
      <ExperienceTimeline limit={4} />
      <FeaturedProjects />
      <LatestPosts />
      <ContactCta />
    </>
  )
}