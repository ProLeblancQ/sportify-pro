
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { formatDateTime, formatDuration } from '../utils/date'

const API = import.meta.env.VITE_API_URL as string
const MAX_VISIBLE = 5

interface Participant {
  user: {
    id: number
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

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
  bookings?: Participant[]
}

interface Props {
  session: Session
  children?: ReactNode
}

function ParticipantAvatar({ participant }: { participant: Participant }) {
  const { first_name, last_name, avatar_url } = participant.user
  const title = `${first_name} ${last_name}`

  return (
    <div className="avatar-stack__item" title={title}>
      {avatar_url ? (
        <img
          src={`${API}${avatar_url}`}
          alt={title}
          className="avatar-stack__img"
        />
      ) : (
        <span className="avatar-stack__initials">
          {first_name[0]}{last_name[0]}
        </span>
      )}
    </div>
  )
}

export default function SessionCard({ session, children }: Props) {
  const booked = session.bookings
    ? session.bookings.length
    : session.max_spots - session.available_spots
  const isFull = session.available_spots === 0
  const visible = session.bookings?.slice(0, MAX_VISIBLE) ?? []
  const overflow = session.bookings ? Math.max(0, session.bookings.length - MAX_VISIBLE) : 0

  const participants = (
    <div className="session-card__participants">
      {session.bookings !== undefined ? (
        visible.length > 0 ? (
          <>
            <div className="avatar-stack">
              {visible.map(p => (
                <ParticipantAvatar key={p.user.id} participant={p} />
              ))}
              {overflow > 0 && (
                <div className="avatar-stack__item avatar-stack__overflow">
                  +{overflow}
                </div>
              )}
            </div>
            <span className={`session-card__spots-count${isFull ? ' session-card__spots-count--full' : ''}`}>
              {booked} / {session.max_spots}
              {isFull && ' · complet'}
            </span>
          </>
        ) : (
          <span className="session-card__spots-empty">Aucun inscrit</span>
        )
      ) : (
        <span className={`session-card__spots-count${isFull ? ' session-card__spots-count--full' : ''}`}>
          👥 {booked} / {session.max_spots} inscrits
        </span>
      )}
    </div>
  )

  return (
    <div className="session-card">
      <div className="session-card__header">
        <h3 className="session-card__title">{session.title}</h3>
        {participants}
      </div>
      <div className="session-card__meta">
        <span>📅 {formatDateTime(session.scheduled_at)}</span>
        <span>⏱ {formatDuration(session.duration_min)}</span>
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
