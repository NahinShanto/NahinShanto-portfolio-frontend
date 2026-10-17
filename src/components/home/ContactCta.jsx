import Button from '../ui/Button'

export default function ContactCta() {
  return (
    <section className="section border-t border-border bg-surface">
      <div className="container-page text-center">
        <h2 className="text-xl md:text-2xl">Have a project in mind?</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          I am always open to new opportunities and interesting conversations.
        </p>
        <Button to="/contact" className="mt-8">
          Get in touch
        </Button>
      </div>
    </section>
  )
}