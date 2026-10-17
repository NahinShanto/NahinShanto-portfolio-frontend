export default function Chip({ active = false, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex h-12 items-center rounded-md border px-4 text-sm font-medium transition-colors duration-200 ${
        active
          ? 'border-accent bg-accent text-on-accent'
          : 'border-border bg-surface text-text hover:bg-surface-2'
      } ${className}`}
      {...props}
    />
  )
}