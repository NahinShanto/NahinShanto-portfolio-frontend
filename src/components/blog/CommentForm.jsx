import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2 } from 'lucide-react'
import { postsApi } from '../../api/posts'
import { getErrorMessage, getFieldErrors } from '../../utils/errors'
import Button from '../ui/Button'
import { Input, Textarea } from '../ui/Input'

const FIELDS = ['name', 'email', 'website', 'content']

export default function CommentForm({ slug, parentId = null }) {
  const [success, setSuccess] = useState('')
  const [serverError, setServerError] = useState('')
  const {
    register, handleSubmit, reset, setError, formState: { errors },
  } = useForm({ defaultValues: { name: '', email: '', website: '', content: '' } })

  const mutation = useMutation({
    mutationFn: (values) =>
      postsApi.addComment(slug, {
        ...values,
        content: values.content.trim(),
        ...(parentId ? { parent: parentId } : {}),
      }),
    onSuccess: (data) => {
      setServerError('')
      setSuccess(data.message) // "Your comment is awaiting approval." (প্রকাশিত দেখানো হয় না)
      reset()
    },
    onError: (error) => {
      const fieldErrors = getFieldErrors(error)
      let handled = false
      Object.entries(fieldErrors).forEach(([field, message]) => {
        const target = field === 'parent' ? 'content' : field
        if (FIELDS.includes(target)) {
          setError(target, { message })
          handled = true
        }
      })
      setServerError(handled ? '' : getErrorMessage(error)) // যেমন 429: Too many attempts
    },
  })

  if (success) {
    return (
      <div role="status" className="rounded-lg border border-border bg-surface p-6">
        <p className="flex items-center gap-2 font-medium text-success">
          <CheckCircle2 className="size-5" aria-hidden="true" />
          {success}
        </p>
        <Button variant="ghost" size="sm" className="-ml-4 mt-4" onClick={() => setSuccess('')}>
          Write another comment
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Name *"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required.', minLength: { value: 2, message: 'Name must be at least 2 characters.' } })}
        />
        <Input
          label="Email * (never shown publicly)"
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
        label="Website (optional)"
        type="url"
        placeholder="https://"
        error={errors.website?.message}
        {...register('website', { pattern: { value: /^https?:\/\/\S+$/i, message: 'Enter a valid URL starting with http(s)://' } })}
      />
      <Textarea
        label="Comment *"
        error={errors.content?.message}
        hint="5 to 1000 characters."
        {...register('content', {
          required: 'Comment is required.',
          minLength: { value: 5, message: 'Comment must be at least 5 characters.' },
          maxLength: { value: 1000, message: 'Comment must be at most 1000 characters.' },
        })}
      />
      {serverError && <p role="alert" className="text-sm text-danger">{serverError}</p>}
      <Button type="submit" loading={mutation.isPending}>
        {parentId ? 'Post reply' : 'Post comment'}
      </Button>
    </form>
  )
}