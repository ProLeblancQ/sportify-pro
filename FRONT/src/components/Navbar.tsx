import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ConfirmDialog from './ConfirmDialog'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          message="Êtes-vous sûr de vouloir vous déconnecter ?"
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <nav className="navbar">
        <Link to="/" className="navbar__brand">Sportify Pro</Link>
        <ul className="navbar__links">
          {(user?.role === 'client' || user?.role === 'admin') && (
            <li><Link to="/sessions" className="navbar__link">Sessions</Link></li>
          )}
          {user?.role === 'client' && (
            <li><Link to="/bookings" className="navbar__link">Mes réservations</Link></li>
          )}
          {user?.role === 'coach' && (
            <li><Link to="/planning" className="navbar__link">Planning</Link></li>
          )}
          {user?.role === 'coach' && (
            <li><Link to="/sessions/create" className="navbar__link">Créer session</Link></li>
          )}
          {user?.role === 'admin' && (
            <>
              <li><Link to="/admin/users" className="navbar__link">Utilisateurs</Link></li>
              <li><Link to="/admin/sessions" className="navbar__link">Sessions admin</Link></li>
            </>
          )}
        </ul>
        <div className="navbar__right">
          <span className="navbar__email">{user?.email}</span>
          <button className="btn btn-secondary" onClick={() => setShowConfirm(true)}>Déconnexion</button>
        </div>
      </nav>
    </>
  )
}
