const API = import.meta.env.VITE_API_URL

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const getCoachById = async (token: string, id: number) => {
  const res = await fetch(`${API}/coaches/${id}`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}
