import type { ReactNode } from 'react'

export interface Session {
  id: number
  title: string
  scheduled_at: string
  duration_min: number
  max_spots: number
  available_spots: number
  status: string
}

interface Props {
  session: Session
  children?: ReactNode
}

export default function SessionCard({ session, children }: Props) {
  const isFull = session.available_spots === 0

  return (
    <div className="session-card">
      <h3 className="session-card__title">{session.title}</h3>
      <div className="session-card__meta">
        <span>📅 {new Date(session.scheduled_at).toLocaleString('fr-FR')}</span>
        <span>⏱ {session.duration_min} min</span>
        <span className={`session-card__spots${isFull ? ' session-card__spots--full' : ''}`}>
          👥 {session.available_spots} / {session.max_spots} places
        </span>
        <span className="session-card__status">{session.status}</span>
      </div>
      {children && <div className="session-card__actions">{children}</div>}
    </div>
  )
}
