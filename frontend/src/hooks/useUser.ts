import { useState, useEffect } from 'react'

export type User = {
  userId: string
  username: string
  email: string
}

const DEV_USER: User = {
  userId: 'user_dev',
  username: 'TestUser',
  email: 'test@example.com',
}

const DEV_CREDENTIALS = [
  { email: 'test@example.com', password: 'password', userId: 'user_dev', username: 'TestUser' },
  { email: 'user', password: 'user', userId: 'user_dev', username: 'TestUser' },
]

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('mangai_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { setUser(DEV_USER) }
    }
    setLoading(false)
  }, [])

  function login(email: string, password: string): boolean {
    const match = DEV_CREDENTIALS.find(
      c => c.email === email.trim() && c.password === password
    )
    if (!match) return false
    const u: User = { userId: match.userId, username: match.username, email: match.email }
    localStorage.setItem('mangai_user', JSON.stringify(u))
    setUser(u)
    return true
  }

  function logout() {
    localStorage.removeItem('mangai_user')
    setUser(null)
  }

  return {
    user,
    userId: user?.userId ?? '',
    username: user?.username ?? '',
    loading,
    login,
    logout,
  }
}
