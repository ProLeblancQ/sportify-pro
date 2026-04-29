import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as userService from '../../services/user.service'

interface UserProfile {
  id: number
  first_name: string
  last_name: string
  email: string
  role: { label: string }
  coach: { specialty: string | null; bio: string | null } | null
}

export default function ProfilePage() {
  const { token } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    specialty: '',
    bio: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    userService.getMe(token!)
      .then(data => {
        setProfile(data)
        setForm({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: '',
          specialty: data.coach?.specialty ?? '',
          bio: data.coach?.bio ?? '',
        })
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      const payload: Record<string, string> = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
      }
      if (form.password) payload.password = form.password
      if (profile?.coach) {
        payload.specialty = form.specialty
        payload.bio = form.bio
      }
      await userService.updateMe(token!, payload)
      setSuccess('Profil mis à jour.')
      setForm(f => ({ ...f, password: '' }))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="empty-state">Chargement...</p>

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Mon profil</h1>
        <p className="page__subtitle">
          Rôle&nbsp;: <span className={`badge badge--${profile?.role.label}`}>{profile?.role.label}</span>
        </p>
      </div>

      <div className="profile-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="first_name">Prénom</label>
              <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required />
            </div>
            <div className="auth-form__field">
              <label htmlFor="last_name">Nom</label>
              <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required />
            </div>
          </div>

          <div className="auth-form__field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">
              Nouveau mot de passe{' '}
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>(laisser vide pour ne pas changer)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {profile?.coach && (
            <>
              <div className="auth-form__field">
                <label htmlFor="specialty">Spécialité</label>
                <input
                  id="specialty"
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  placeholder="Ex : Yoga, CrossFit..."
                />
              </div>
              <div className="auth-form__field">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Quelques mots sur vous..."
                />
              </div>
            </>
          )}

          {error && <p className="auth-form__error">{error}</p>}
          {success && <p className="profile__success">{success}</p>}

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  )
}
