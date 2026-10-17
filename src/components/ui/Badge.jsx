const variants = {
  neutral: 'bg-surface-2 text-muted',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
}

export default function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-sm px-2 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}