import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getErrorMessage } from '../../utils/error'
import ConfirmDialog from '../../components/ConfirmDialog'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: { label: string }
}

export default function UsersPage() {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const fetchUsers = async () => {
    if (!token) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error((await res.json()).message)
      setUsers(await res.json())
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!token || confirmId === null) return
    setConfirmId(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${confirmId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error((await res.json()).message)
      fetchUsers()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  useEffect(() => { fetchUsers() }, [])

  return (
    <main className="page">
      {confirmId !== null && (
        <ConfirmDialog
          message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div className="page__header">
        <h1 className="page__title">Gestion des utilisateurs</h1>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="error-message">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td><span className={`badge badge--${u.role.label}`}>{u.role.label}</span></td>
              <td>
                <button className="btn btn-danger" onClick={() => setConfirmId(u.id)}>
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
