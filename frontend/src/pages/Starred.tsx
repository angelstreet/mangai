import { Header } from '../components/layout/Header'
import { useUser } from '../hooks/useUser'

export default function Starred() {
  const { username } = useUser()
  return (
    <div>
      <Header title="Starred" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>{username || '…'}</p>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Ideas you starred appear here.</p>
        </div>
      </div>
    </div>
  )
}
