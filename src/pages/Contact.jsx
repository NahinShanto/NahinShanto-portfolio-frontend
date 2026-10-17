import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { contactApi } from '../api/contact'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'
import SocialLinks from '../components/ui/SocialLinks'
import usePageTitle from '../hooks/usePageTitle'
import { useProfile } from '../hooks/useProfile'
import { getErrorMessage, getFieldErrors } from '../utils/errors'

const FIELDS = ['name', 'email', 'subject', 'message']

export default function Contact() {
  usePageTitle('Contact')
  const { data: profile } = useProfile()
  const [success, setSuccess] = useState('')
  const [serverError, setServerError] = useState('')
  const {
    register, handleSubmit, reset, setError, formState: { errors },
  } = useForm({ defaultValues: { name: '', email: '', subject: '', message: '' } })

  const mutation = useMutation({
    mutationFn: contactApi.send,
    onSuccess: (data) => {
      setServerError('')
      setSuccess(data.message)
      reset()
    },
    onError: (error) => {
      let handled = false
      Object.entries(getFieldErrors(error)).forEach(([field, message]) => {
        if (FIELDS.includes(field)) {
          setError(field, { message })
          handled = true
        }
      })
      // 429 হলে: "Too many attempts, please try later."
      setServerError(handled ? '' : getErrorMessage(error))
    },
  })

  const onSubmit = (v) => mutation.mutate({ ...v, message: v.message.trim() })

  return (
    <PageContainer>
      <header className="max-w-2xl">
        <h1 className="text-2xl md:text-3xl">Contact</h1>
        <p className="mt-4 text-lg text-muted">Have a question or an opportunity? Send me a message.</p>
      </header>

      <div className="mt-8 grid gap-12 md:mt-12 lg:grid-cols-[2fr_1fr]">
        {success ? (
          <div role="status" className="rounded-lg border border-border bg-surface p-8">
            <p className="flex items-center gap-2 text-lg font-medium text-success">
              <CheckCircle2 className="size-6" aria-hidden="true" />
              {success}
            </p>
            <p className="mt-2 text-muted">I will get back to you as soon as I can.</p>
            <Button variant="secondary" className="mt-6" onClick={() => setSuccess('')}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Name *"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name', { required: 'Name is required.', minLength: { value: 2, message: 'Name must be at least 2 characters.' } })}
              />
              <Input
                label="Email *"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
                })}
              />
            </div>
            <Input
              label="Subject *"
              error={errors.subject?.message}
              {...register('subject', { required: 'Subject is required.', maxLength: { value: 200, message: 'Subject must be at most 200 characters.' } })}
            />
            <Textarea
              label="Message *"
              rows={7}
              hint="10 to 2000 characters."
              error={errors.message?.message}
              {...register('message', {
                required: 'Message is required.',
                minLength: { value: 10, message: 'Message must be at least 10 characters.' },
                maxLength: { value: 2000, message: 'Message must be at most 2000 characters.' },
              })}
            />
            {serverError && <p role="alert" className="text-sm text-danger">{serverError}</p>}
            <Button type="submit" loading={mutation.isPending}>
              {mutation.isPending ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        )}

        {profile && (
          <aside aria-label="Contact details" className="space-y-4">
            {profile.email && (
              <p className="flex items-center gap-4">
                <Mail className="size-5 text-accent" aria-hidden="true" />
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </p>
            )}
            {profile.phone && (
              <p className="flex items-center gap-4">
                <Phone className="size-5 text-accent" aria-hidden="true" />
                <a href={`tel:${profile.phone}`}>{profile.phone}</a>
              </p>
            )}
            {profile.location && (
              <p className="flex items-center gap-4">
                <MapPin className="size-5 text-accent" aria-hidden="true" />
                {profile.location}
              </p>
            )}
            <SocialLinks profile={profile} className="pt-4" />
          </aside>
        )}
      </div>
    </PageContainer>
  )
}