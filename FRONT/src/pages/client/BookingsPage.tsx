import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { cancelBooking } from '../../services/booking.service'
import { formatDateTime, formatDuration } from '../../utils/date'

interface Booking {
  id: number
  status: string
  booked_at: string
  session: {
    id: number
    title: string
    scheduled_at: string
    duration_min: number
  }
}

export default function BookingsPage() {
  const { token } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBookings = async () => {
    if (!token) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error((await res.json()).message)
      setBookings(await res.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: number) => {
    if (!token) return
    try {
      await cancelBooking(token, id)
      fetchBookings()
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Mes réservations</h1>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && bookings.length === 0 && (
        <div className="empty-state">Vous n'avez aucune réservation.</div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Session</th>
            <th>Date</th>
            <th>Durée</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.session.title}</td>
              <td>{formatDateTime(b.session.scheduled_at)}</td>
              <td>{formatDuration(b.session.duration_min)}</td>
              <td>{b.status}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleCancel(b.id)}>
                  Annuler
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
