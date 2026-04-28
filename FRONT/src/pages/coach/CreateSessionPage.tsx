import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createSession } from '../../services/session.service'

export default function CreateSessionPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    scheduled_at: '',
    duration_min: 60,
    max_spots: 10,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: name === 'duration_min' || name === 'max_spots' ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    setError('')
    try {
      await createSession(token, form)
      navigate('/planning')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">Créer une session</h1>
      </div>
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="title">Titre</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Cardio Intensif" required />
          </div>
          <div className="auth-form__field">
            <label htmlFor="scheduled_at">Date et heure</label>
            <input id="scheduled_at" name="scheduled_at" type="datetime-local" value={form.scheduled_at} onChange={handleChange} required />
          </div>
          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="duration_min">Durée (min)</label>
              <input id="duration_min" name="duration_min" type="number" min={15} value={form.duration_min} onChange={handleChange} required />
            </div>
            <div className="auth-form__field">
              <label htmlFor="max_spots">Places max</label>
              <input id="max_spots" name="max_spots" type="number" min={1} value={form.max_spots} onChange={handleChange} required />
            </div>
          </div>
          {error && <p className="auth-form__error">{error}</p>}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer la session'}
          </button>
        </form>
      </div>
    </main>
  )
}
