import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium no-underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-hover',
  secondary: 'border border-border bg-surface text-text hover:bg-surface-2 active:bg-surface-2',
  ghost: 'text-text hover:bg-surface-2 active:bg-surface-2',
  danger: 'bg-danger text-bg hover:opacity-90 active:opacity-80',
}

const sizes = { md: 'h-12 px-6 text-base', sm: 'h-12 px-4 text-sm' }

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  ...props
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" {...props} className={cls} disabled={loading || props.disabled}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}