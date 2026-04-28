import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'

interface Props {
  allowedRoles: string[]
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
