import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as coachService from '../../services/coach.service'
import SessionCard from '../../components/SessionCard'

interface CoachSession {
  id: number
  title: string
  scheduled_at: string
  duration_min: number
  max_spots: number
  available_spots: number
  status: string
}

interface Coach {
  id: number
  specialty: string | null
  bio: string | null
  user: { first_name: string; last_name: string; email: string }
  sessions: CoachSession[]
}

export default function CoachProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const [coach, setCoach] = useState<Coach | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    coachService.getCoachById(token!, Number(id))
      .then(setCoach)
      .catch((e: Error) => setError(e.message))
  }, [token, id])

  if (error) return <p className="empty-state error-message">{error}</p>
  if (!coach) return <p className="empty-state">Chargement...</p>

  return (
    <div className="page">
      <div className="coach-profile__header">
        <h1 className="page__title">{coach.user.first_name} {coach.user.last_name}</h1>
        {coach.specialty && (
          <p className="coach-profile__specialty">{coach.specialty}</p>
        )}
        {coach.bio && (
          <p className="coach-profile__bio">{coach.bio}</p>
        )}
      </div>

      <div className="page__header" style={{ marginTop: 'var(--space-xl)' }}>
        <h2 className="page__title">Sessions à venir</h2>
      </div>

      {coach.sessions.length === 0 ? (
        <p className="empty-state">Aucune session à venir.</p>
      ) : (
        <div className="grid grid--3">
          {coach.sessions.map(s => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  )
}
