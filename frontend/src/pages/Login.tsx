import { useState } from 'react'
import { useUser } from '../hooks/useUser'

interface Props {
  onLogin: () => void
}

export default function Login({ onLogin }: Props) {
  const { login } = useUser()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(email, password)
    if (ok) onLogin()
    else setError('Invalid credentials')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'var(--bg)',
    }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <img src="/mangai/logo.png" alt="MangAI" style={{ width: 320, height: 320 }} />
        <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>MangAI</h1>
        <p style={{ color: 'var(--muted)', marginTop: 4 }}>Structure your manga idea</p>
      </div>

      <form onSubmit={handleSubmit} style={{
        width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12
      }}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <p style={{ color: 'var(--accent)', fontSize: 14 }}>{error}</p>}
        <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
          Sign in
        </button>
        <p style={{ color: 'var(--muted)', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
          Dev: test@example.com / password
        </p>
      </form>
    </div>
  )
}
