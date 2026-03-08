import { useRef, useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { useUser } from '../hooks/useUser'

const AVATAR_KEY = 'mangai_avatar'
const PSEUDO_KEY = 'mangai_pseudo'

export default function Profile() {
  const { user, logout } = useUser()
  const [avatar, setAvatar] = useState<string>('/mangai/logo.png')
  const [pseudo, setPseudo] = useState('')
  const [editingPseudo, setEditingPseudo] = useState(false)
  const [pseudoInput, setPseudoInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(AVATAR_KEY)
    if (saved) setAvatar(saved)
    const savedPseudo = localStorage.getItem(PSEUDO_KEY)
    if (savedPseudo) setPseudo(savedPseudo)
    else setPseudo(user?.username ?? '')
  }, [user])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      localStorage.setItem(AVATAR_KEY, dataUrl)
      setAvatar(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  function savePseudo() {
    const trimmed = pseudoInput.trim()
    if (!trimmed) return
    localStorage.setItem(PSEUDO_KEY, trimmed)
    setPseudo(trimmed)
    setEditingPseudo(false)
  }

  function startEditPseudo() {
    setPseudoInput(pseudo)
    setEditingPseudo(true)
  }

  return (
    <div>
      <Header title="Profile" />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>

          {/* Avatar */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
            <img
              src={avatar}
              alt="Avatar"
              style={{ width: 320, height: 320, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border)' }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', bottom: 8, right: 8,
                background: 'var(--accent)', border: 'none', borderRadius: '50%',
                width: 36, height: 36, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}
              title="Change avatar"
            >✏️</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          {/* Pseudo */}
          {editingPseudo ? (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 4 }}>
              <input
                value={pseudoInput}
                onChange={e => setPseudoInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && savePseudo()}
                style={{ fontSize: 18, fontWeight: 700, textAlign: 'center', width: 180 }}
                autoFocus
              />
              <button onClick={savePseudo} className="btn-primary" style={{ padding: '4px 12px', fontSize: 13 }}>Save</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{pseudo}</h2>
              <button
                onClick={startEditPseudo}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 14 }}
                title="Edit name"
              >✏️</button>
            </div>
          )}

          <p style={{ color: 'var(--muted)', fontSize: 13 }}>{user?.email}</p>
        </div>
        <button onClick={logout} className="btn-secondary">Sign out</button>
      </div>
    </div>
  )
}
