const API = import.meta.env.VITE_API_URL

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const createBooking = async (token: string, session_id: number) => {
  const res = await fetch(`${API}/bookings`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ session_id }),
  })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}

export const cancelBooking = async (token: string, id: number) => {
  const res = await fetch(`${API}/bookings/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error((await res.json()).message)
}
