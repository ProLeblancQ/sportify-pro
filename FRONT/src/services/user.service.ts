const API = import.meta.env.VITE_API_URL

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const getMe = async (token: string) => {
  const res = await fetch(`${API}/users/me`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}

export const updateMe = async (token: string, data: Record<string, string>) => {
  const res = await fetch(`${API}/users/me`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}

export const uploadAvatar = async (token: string, file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)
  const res = await fetch(`${API}/users/me/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}
