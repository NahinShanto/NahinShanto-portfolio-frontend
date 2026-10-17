import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import usePageTitle from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <PageContainer className="text-center">
      <p className="font-heading text-3xl text-accent">404</p>
      <h1 className="mt-4 text-2xl md:text-3xl">Page not found</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button to="/" className="mt-8">Back to home</Button>
    </PageContainer>
  )
}