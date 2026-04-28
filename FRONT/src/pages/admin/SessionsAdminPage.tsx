import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllSessions, deleteSession } from '../../services/session.service'
import type { Session } from '../../components/SessionCard'
import { formatDateTime, formatDuration } from '../../utils/date'

export default function SessionsAdminPage() {
  const { token } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSessions = async () => {
    if (!token) return
    try {
      const data = await getAllSessions(token)
      setSessions(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!token || !confirm('Supprimer cette session ?')) return
    try {
      await deleteSession(token, id)
      fetchSessions()
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => { fetchSessions() }, [])

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Gestion des sessions</h1>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th>Durée</th>
            <th>Places</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>{formatDateTime(s.scheduled_at)}</td>
              <td>{formatDuration(s.duration_min)}</td>
              <td>{s.available_spots} / {s.max_spots}</td>
              <td><span className={`badge badge--${s.status}`}>{s.status}</span></td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
