import { Header } from '../components/layout/Header'
import { useUser } from '../hooks/useUser'

export default function Profile() {
  const { user, logout } = useUser()
  return (
    <div>
      <Header title="Profile" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <img src="/logo.png" alt="MangAI" style={{ width: 64, height: 64, marginBottom: 8 }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.username}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>{user?.email}</p>
        </div>
        <button onClick={logout} className="btn-secondary">Sign out</button>
      </div>
    </div>
  )
}
