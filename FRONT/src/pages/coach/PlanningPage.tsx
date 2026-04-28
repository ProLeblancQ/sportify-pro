import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getCoachSessions } from '../../services/session.service'
import SessionCard from '../../components/SessionCard'
import type { Session } from '../../components/SessionCard'

export default function PlanningPage() {
  const { token } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    getCoachSessions(token)
      .then(setSessions)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Mon planning</h1>
        <p className="page__subtitle">Vos sessions programmées</p>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && sessions.length === 0 && (
        <div className="empty-state">Aucune session programmée.</div>
      )}

      <div className="grid grid--3">
        {sessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </main>
  )
}
