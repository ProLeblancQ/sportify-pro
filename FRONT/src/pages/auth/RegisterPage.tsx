import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { register as registerService } from '../../services/auth.service'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await registerService(form.first_name, form.last_name, form.email, form.password)
      const { login: loginService } = await import('../../services/auth.service')
      const data = await loginService(form.email, form.password)
      login(data.token, data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Inscription</h1>
        <p className="auth-card__subtitle">Créez votre compte Sportify Pro</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="first_name">Prénom</label>
              <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Jean" required />
            </div>
            <div className="auth-form__field">
              <label htmlFor="last_name">Nom</label>
              <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Dupont" required />
            </div>
          </div>
          <div className="auth-form__field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" required />
          </div>
          <div className="auth-form__field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          {error && <p className="auth-form__error">{error}</p>}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
        <p className="auth-card__footer">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
