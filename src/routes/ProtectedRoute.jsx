import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isOwner, loading } = useAuth()
  const location = useLocation()

  // session যাচাই চলার সময় login পেজ বা admin UI কোনোটাই দেখানো হবে না
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    )
  }
  if (!isOwner) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}