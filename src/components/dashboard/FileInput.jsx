import { useState } from 'react'

export default function FileInput({ label, value, onChange, existingUrl, error, accept = '.pdf', maxMb = 5 }) {
  const [localError, setLocalError] = useState('')

  const pick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setLocalError('Only PDF files are allowed.')
      return
    }
    if (file.size > maxMb * 1024 * 1024) {
      setLocalError(`File must be ${maxMb} MB or smaller.`)
      return
    }
    setLocalError('')
    onChange(file)
  }

  const message = localError || error
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex h-12 cursor-pointer items-center rounded-md border border-border bg-surface px-4 text-sm font-medium transition-colors duration-200 hover:bg-surface-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
          Choose file
          <input type="file" accept={accept} onChange={pick} className="sr-only" />
        </label>
        {value ? (
          <span className="text-sm">{value.name}</span>
        ) : (
          existingUrl && <a href={existingUrl} target="_blank" rel="noreferrer" className="text-sm">Current file</a>
        )}
      </div>
      {message && <p role="alert" className="mt-2 text-sm text-danger">{message}</p>}
    </div>
  )
}