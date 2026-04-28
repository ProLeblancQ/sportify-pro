import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createBooking } from '../services/booking.service'

interface Props {
  sessionId: number
  availableSpots: number
  onBooked: () => void
}

export default function BookingButton({ sessionId, availableSpots, onBooked }: Props) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBook = async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      await createBooking(token, sessionId)
      onBooked()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={handleBook}
        disabled={loading || availableSpots === 0}
      >
        {availableSpots === 0 ? 'Complet' : loading ? 'Réservation...' : 'Réserver'}
      </button>
      {error && <p className="auth-form__error">{error}</p>}
    </div>
  )
}
