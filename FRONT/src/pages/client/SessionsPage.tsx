import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllSessions } from '../../services/session.service'
import { getErrorMessage } from '../../utils/error'
import SessionCard from '../../components/SessionCard'
import BookingButton from '../../components/BookingButton'
import type { Session } from '../../components/SessionCard'

export default function SessionsPage() {
  const { token, user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSessions = () => {
    if (!token) return
    getAllSessions(token)
      .then(data => setSessions(data))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!token) return
    getAllSessions(token)
      .then(data => setSessions(data))
      .catch(err => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Sessions disponibles</h1>
        <p className="page__subtitle">Réservez une session sportive</p>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && sessions.length === 0 && (
        <div className="empty-state">Aucune session disponible.</div>
      )}

      <div className="grid grid--3">
        {sessions.map(session => (
          <SessionCard key={session.id} session={session}>
            {user?.role !== 'admin' && (
              <BookingButton
                sessionId={session.id}
                availableSpots={session.available_spots}
                onBooked={fetchSessions}
              />
            )}
          </SessionCard>
        ))}
      </div>
    </main>
  )
}
