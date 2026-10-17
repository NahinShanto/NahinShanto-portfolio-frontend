import { forwardRef, useId } from 'react'

const field =
  'w-full rounded-md border bg-surface px-4 text-text placeholder:text-muted transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50'

function Field({ id, label, error, hint, className, children }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-2 text-sm text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

const borderOf = (error) => (error ? 'border-danger' : 'border-border')

export const Input = forwardRef(function Input({ label, error, hint, className = '', ...props }, ref) {
  const id = useId()
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${field} h-12 ${borderOf(error)}`}
        {...props}
      />
    </Field>
  )
})

export const Textarea = forwardRef(function Textarea({ label, error, hint, className = '', ...props }, ref) {
  const id = useId()
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <textarea
        ref={ref}
        id={id}
        rows={5}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${field} py-4 ${borderOf(error)}`}
        {...props}
      />
    </Field>
  )
})

export const Select = forwardRef(function Select({ label, error, hint, className = '', children, ...props }, ref) {
  const id = useId()
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <select
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${field} h-12 ${borderOf(error)}`}
        {...props}
      >
        {children}
      </select>
    </Field>
  )
})