export default function PageContainer({ children, className = '' }) {
  return <div className={`container-page section ${className}`}>{children}</div>
}