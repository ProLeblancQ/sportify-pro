import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatDateTime, formatDuration } from '../utils/date'

export interface Session {
  id: number
  title: string
  scheduled_at: string
  duration_min: number
  max_spots: number
  available_spots: number
  status: string
  coach?: {
    id: number
    user: { first_name: string; last_name: string }
  }
}

interface Props {
  session: Session
  children?: ReactNode
}

export default function SessionCard({ session, children }: Props) {
  const booked = session.max_spots - session.available_spots
  const isFull = session.available_spots === 0

  return (
    <div className="session-card">
      <h3 className="session-card__title">{session.title}</h3>
      <div className="session-card__meta">
        <span>📅 {formatDateTime(session.scheduled_at)}</span>
        <span>⏱ {formatDuration(session.duration_min)}</span>
        <span className={`session-card__spots${isFull ? ' session-card__spots--full' : ''}`}>
          👥 {booked} / {session.max_spots} inscrits
        </span>
        <span className={`badge badge--${session.status}`}>{session.status}</span>
        {session.coach && (
          <Link to={`/coaches/${session.coach.id}`} className="session-card__coach">
            🏋️ {session.coach.user.first_name} {session.coach.user.last_name}
          </Link>
        )}
      </div>
      {children && <div className="session-card__actions">{children}</div>}
    </div>
  )
}
