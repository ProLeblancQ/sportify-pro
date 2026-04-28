const API = import.meta.env.VITE_API_URL

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const getAllSessions = async (token: string) => {
  const res = await fetch(`${API}/sessions`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}

export const getCoachSessions = async (token: string) => {
  const res = await fetch(`${API}/sessions/coach/me`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}

export const createSession = async (token: string, data: {
  title: string
  scheduled_at: string
  duration_min: number
  max_spots: number
}) => {
  const res = await fetch(`${API}/sessions`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}

export const getSessionById = async (token: string, id: number) => {
  const res = await fetch(`${API}/sessions/${id}`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}

export const deleteSession = async (token: string, id: number) => {
  const res = await fetch(`${API}/sessions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error((await res.json()).message)
}
