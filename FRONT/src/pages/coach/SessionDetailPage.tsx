import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getSessionById } from '../../services/session.service'
import { formatDateTime, formatDuration } from '../../utils/date'
import { getErrorMessage } from '../../utils/error'

interface Participant {
  id: number
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  status: string
  booked_at: string
}

interface SessionDetail {
  id: number
  title: string
  scheduled_at: string
  duration_min: number
  max_spots: number
  available_spots: number
  status: string
  bookings: Participant[]
}

export default function SessionDetailPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [session, setSession] = useState<SessionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || !id) return
    getSessionById(token, Number(id))
      .then(setSession)
      .catch((err: unknown) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [token, id])

  if (loading) return <main className="page"><p>Chargement...</p></main>
  if (error)   return <main className="page"><p className="error-message">{error}</p></main>
  if (!session) return null

  const confirmed = session.bookings.filter(b => b.status === 'confirmed')

  return (
    <main className="page">
      <div className="page__header">
        <button className="btn btn-secondary" onClick={() => navigate('/planning')} style={{ marginBottom: '1rem' }}>
          ← Retour au planning
        </button>
        <h1 className="page__title">{session.title}</h1>
        <p className="page__subtitle">{formatDateTime(session.scheduled_at)} · {formatDuration(session.duration_min)}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <span className={`badge badge--${session.status}`}>{session.status}</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          👥 {confirmed.length} / {session.max_spots} inscrits
        </span>
      </div>

      <h2 style={{ marginBottom: '1rem', color: 'var(--color-secondary)' }}>Participants</h2>

      {confirmed.length === 0 ? (
        <div className="empty-state">Aucun participant inscrit pour le moment.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Statut</th>
              <th>Réservé le</th>
            </tr>
          </thead>
          <tbody>
            {session.bookings.map(b => (
              <tr key={b.id}>
                <td>{b.user.first_name} {b.user.last_name}</td>
                <td>{b.user.email}</td>
                <td><span className={`badge badge--${b.status}`}>{b.status}</span></td>
                <td>{formatDateTime(b.booked_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
