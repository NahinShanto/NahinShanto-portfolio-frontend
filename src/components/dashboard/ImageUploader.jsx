import { useState } from 'react'
import Button from '../ui/Button'

export default function ImageUploader({ label, value, onChange, existingUrl, error, hint, maxMb = 2 }) {
  const [preview, setPreview] = useState(null)
  const [localError, setLocalError] = useState('')

  const pick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!/\.(jpe?g|png|webp)$/i.test(file.name)) {
      setLocalError('Only .jpg, .jpeg, .png and .webp images are allowed.')
      return
    }
    if (file.size > maxMb * 1024 * 1024) {
      setLocalError(`Image must be ${maxMb} MB or smaller.`)
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setLocalError('')
    setPreview(URL.createObjectURL(file))
    onChange(file)
  }

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    onChange(null)
  }

  const shown = preview || existingUrl
  const message = localError || error

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-start gap-4">
        <div className="aspect-video w-48 overflow-hidden rounded-md border border-border bg-surface-2">
          {shown ? (
            <img src={shown} alt="Preview" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted">No image</div>
          )}
        </div>
        <div className="space-y-2">
          <label className="inline-flex h-12 cursor-pointer items-center rounded-md border border-border bg-surface px-4 text-sm font-medium transition-colors duration-200 hover:bg-surface-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
            Choose image
            <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={pick} className="sr-only" />
          </label>
          {value && (
            <div>
              <Button variant="ghost" size="sm" onClick={clear}>Remove selected</Button>
            </div>
          )}
          {hint && !message && <p className="text-sm text-muted">{hint}</p>}
        </div>
      </div>
      {message && <p role="alert" className="mt-2 text-sm text-danger">{message}</p>}
    </div>
  )
}