import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps { title: string; showBack?: boolean }

export function Header({ title, showBack }: HeaderProps) {
  const navigate = useNavigate()
  return (
    <header style={{
      padding: '16px', display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--bg)', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50
    }}>
      {showBack && (
        <button onClick={() => navigate(-1)} style={{ color: 'var(--text)', padding: 4 }}>
          <ArrowLeft size={22} />
        </button>
      )}
      <h1 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h1>
    </header>
  )
}
