import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from '@/lib/auth-client'
import { Spinner } from '@/components/ui/spinner'

export default function ProtectedRoute({ children }) {
  const { data: session, isPending } = useSession()
  const location = useLocation()

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    )
  }

  return children
}
