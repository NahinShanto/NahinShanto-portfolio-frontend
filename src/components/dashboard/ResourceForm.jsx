import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getErrorMessage, getFieldErrors } from '../../utils/errors'
import Button from '../ui/Button'
import { Input, Select, Textarea } from '../ui/Input'
import FileInput from './FileInput'
import ImageUploader from './ImageUploader'

function rulesFor(f) {
  const l = f.label
  return {
    ...(f.required && { required: `${l} is required.` }),
    ...(f.minLength && { minLength: { value: f.minLength, message: `${l} must be at least ${f.minLength} characters.` } }),
    ...(f.maxLength && { maxLength: { value: f.maxLength, message: `${l} must be at most ${f.maxLength} characters.` } }),
    ...(f.min !== undefined && { min: { value: f.min, message: `${l} must be at least ${f.min}.` } }),
    ...(f.max !== undefined && { max: { value: f.max, message: `${l} must be at most ${f.max}.` } }),
  }
}

export default function ResourceForm({
  fields, defaultValues, existing = null, optionSets = {}, onSubmit, onCancel, submitLabel = 'Save',
}) {
  const { register, control, handleSubmit, setError, watch, formState: { errors, isSubmitting } } =
    useForm({ defaultValues })
  const [formError, setFormError] = useState('')
  const watched = watch()

  const submit = handleSubmit(async (data) => {
    setFormError('')
    const clean = { ...data }
    // লুকানো ফিল্ডের পুরনো মান (যেমন "current" থাকলে end_date) পাঠানো হয় না
    fields.forEach((f) => {
      if (f.showIf && !f.showIf(data)) clean[f.name] = ''
    })
    try {
      await onSubmit(clean)
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      const names = fields.map((f) => f.name)
      let handled = false
      Object.entries(fieldErrors).forEach(([key, message]) => {
        if (names.includes(key)) {
          setError(key, { type: 'server', message })
          handled = true
        }
      })
      const general = fieldErrors.non_field_errors || fieldErrors.detail || (handled ? '' : getErrorMessage(error))
      setFormError(general)
      toast.error(handled ? 'Please fix the highlighted fields.' : general)
    }
  })

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {fields
          .filter((f) => !f.showIf || f.showIf(watched))
          .map((f) => {
            const error = errors[f.name]?.message
            const span = f.full ? 'md:col-span-2' : ''
            const label = `${f.label}${f.required ? ' *' : ''}`
            const options = f.options ?? optionSets[f.optionsFrom] ?? []

            if (f.type === 'textarea' || f.type === 'markdown') {
              return (
                <Textarea
                  key={f.name} label={label} rows={f.rows ?? 5} error={error} className={span}
                  hint={f.hint ?? (f.type === 'markdown' ? 'Markdown is supported.' : undefined)}
                  {...register(f.name, rulesFor(f))}
                />
              )
            }
            if (f.type === 'select') {
              return (
                <Select key={f.name} label={label} error={error} hint={f.hint} className={span} {...register(f.name, rulesFor(f))}>
                  {!f.noBlank && <option value="">{f.required ? 'Select…' : 'None'}</option>}
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              )
            }
            if (f.type === 'checkbox') {
              return (
                <label key={f.name} className={`flex min-h-12 cursor-pointer items-center gap-4 ${span}`}>
                  <input type="checkbox" className="size-5 accent-accent" {...register(f.name)} />
                  <span>{f.label}</span>
                </label>
              )
            }
            if (f.type === 'multi') {
              return (
                <Controller
                  key={f.name} name={f.name} control={control}
                  render={({ field }) => (
                    <fieldset className={span}>
                      <legend className="mb-2 text-sm font-medium">{f.label}</legend>
                      <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-md border border-border p-4">
                        {options.length === 0 && <p className="text-sm text-muted">Nothing to choose from yet.</p>}
                        {options.map((o) => {
                          const current = (field.value ?? []).map(Number)
                          const on = current.includes(Number(o.value))
                          return (
                            <label
                              key={o.value}
                              className={`inline-flex min-h-12 cursor-pointer items-center rounded-md border px-4 text-sm transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                                on ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:bg-surface-2'
                              }`}
                            >
                              <input
                                type="checkbox" className="sr-only" checked={on}
                                onChange={() =>
                                  field.onChange(on ? current.filter((id) => id !== Number(o.value)) : [...current, Number(o.value)])
                                }
                              />
                              {o.label}
                            </label>
                          )
                        })}
                      </div>
                    </fieldset>
                  )}
                />
              )
            }
            if (f.type === 'image' || f.type === 'file') {
              const Uploader = f.type === 'image' ? ImageUploader : FileInput
              return (
                <Controller
                  key={f.name} name={f.name} control={control}
                  rules={{ validate: (v) => !f.required || Boolean(v) || Boolean(existing?.[f.name]) || `${f.label} is required.` }}
                  render={({ field }) => (
                    <div className={span}>
                      <Uploader
                        label={label} value={field.value} onChange={field.onChange}
                        existingUrl={existing?.[f.name]} error={error} hint={f.hint}
                      />
                    </div>
                  )}
                />
              )
            }
            return (
              <Input
                key={f.name} label={label} type={f.type} error={error} hint={f.hint} className={span}
                autoComplete={f.type === 'password' ? 'off' : undefined}
                {...register(f.name, rulesFor(f))}
              />
            )
          })}
      </div>

      {formError && <p role="alert" className="text-sm text-danger">{formError}</p>}

      <div className="flex flex-wrap gap-4">
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        )}
      </div>
    </form>
  )
}