import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import SessionsPage from '../pages/client/SessionsPage'
import BookingsPage from '../pages/client/BookingsPage'
import PlanningPage from '../pages/coach/PlanningPage'
import CreateSessionPage from '../pages/coach/CreateSessionPage'
import UsersPage from '../pages/admin/UsersPage'
import SessionsAdminPage from '../pages/admin/SessionsAdminPage'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AppRouter() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />

        <Route element={<ProtectedRoute allowedRoles={['client', 'coach', 'admin']} />}>
          <Route path="/sessions" element={<SessionsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['client']} />}>
          <Route path="/bookings" element={<BookingsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['coach']} />}>
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/sessions/create" element={<CreateSessionPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/sessions" element={<SessionsAdminPage />} />
        </Route>

        <Route path="/" element={
          !user ? <Navigate to="/login" /> :
          user.role === 'admin' ? <Navigate to="/admin/users" /> :
          user.role === 'coach' ? <Navigate to="/planning" /> :
          <Navigate to="/sessions" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
