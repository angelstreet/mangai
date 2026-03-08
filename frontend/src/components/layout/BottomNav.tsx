import { Home, Plus, Star, BookOpen, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', icon: Home, label: 'Feed' },
  { to: '/submit', icon: Plus, label: 'Submit' },
  { to: '/starred', icon: Star, label: 'Starred' },
  { to: '/my-ideas', icon: BookOpen, label: 'Me' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      height: 'var(--bottom-nav-height)',
      display: 'flex', alignItems: 'center', zIndex: 100
    }}>
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 2, padding: '8px 0',
          color: isActive ? 'var(--accent)' : 'var(--muted)',
          fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase'
        })}>
          <Icon size={22} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
