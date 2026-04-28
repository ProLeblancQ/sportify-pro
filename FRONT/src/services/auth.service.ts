const API = import.meta.env.VITE_API_URL

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}

export const register = async (first_name: string, last_name: string, email: string, password: string) => {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ first_name, last_name, email, password }),
  })
  if (!res.ok) throw new Error((await res.json()).message)
  return res.json()
}
