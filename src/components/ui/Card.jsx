export default function Card({ as: Tag = 'div', hover = false, className = '', ...props }) {
  return (
    <Tag
      className={`rounded-lg border border-border bg-surface ${
        hover ? 'transition-shadow duration-200 hover:shadow-md' : ''
      } ${className}`}
      {...props}
    />
  )
}