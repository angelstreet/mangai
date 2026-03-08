import { useState, useEffect } from 'react'
import { API } from '../../api'

type VersionMeta = { id: string; idea_id: string; version: number; created_at: string }
type VersionSnapshot = {
  version: number; hook: string; sell_pitch: string; theme: string;
  twist: string | null; storyline: string; created_at: string
}

const FIELDS = ['hook', 'sell_pitch', 'theme', 'twist', 'storyline'] as const
const FIELD_LABELS: Record<string, string> = {
  hook: 'Hook', sell_pitch: 'Pitch', theme: 'Theme', twist: 'Twist', storyline: 'Storyline'
}

function DiffView({ older, newer }: { older: VersionSnapshot; newer: VersionSnapshot }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {FIELDS.map(f => {
        const a = (older as any)[f] ?? ''
        const b = (newer as any)[f] ?? ''
        if (a === b) return null
        return (
          <div key={f} className="card" style={{ padding: 12 }}>
            <p className="section-label" style={{ marginBottom: 6 }}>{FIELD_LABELS[f]}</p>
            <p style={{ fontSize: 13, color: '#e63946', textDecoration: 'line-through', opacity: 0.7, marginBottom: 4, whiteSpace: 'pre-wrap' }}>{a || '—'}</p>
            <p style={{ fontSize: 13, color: '#4caf50', whiteSpace: 'pre-wrap' }}>{b || '—'}</p>
          </div>
        )
      })}
    </div>
  )
}

export function VersionHistory({ ideaId, currentVersion }: { ideaId: string; currentVersion: number }) {
  const [versions, setVersions] = useState<VersionMeta[]>([])
  const [expanded, setExpanded] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [snapshot, setSnapshot] = useState<VersionSnapshot | null>(null)
  const [prevSnapshot, setPrevSnapshot] = useState<VersionSnapshot | null>(null)
  const [mode, setMode] = useState<'diff' | 'full'>('diff')

  useEffect(() => {
    if (!expanded) return
    fetch(`${API}/ideas/${ideaId}/versions`)
      .then(r => r.json())
      .then(setVersions)
  }, [expanded, ideaId])

  async function selectVersion(v: number) {
    setSelectedVersion(v)
    const [snap, prev] = await Promise.all([
      fetch(`${API}/ideas/${ideaId}/versions/${v}`).then(r => r.json()),
      v > 1 ? fetch(`${API}/ideas/${ideaId}/versions/${v - 1}`).then(r => r.json()) : Promise.resolve(null)
    ])
    setSnapshot(snap)
    setPrevSnapshot(prev)
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <button onClick={() => setExpanded(e => !e)} style={{
        width: '100%', padding: '10px 14px',
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', color: 'var(--text)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 14, fontWeight: 600, cursor: 'pointer',
      }}>
        <span>📜 Version History · v{currentVersion}</span>
        <span style={{ color: 'var(--muted)' }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Version list */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {versions.map(v => (
              <button key={v.id} onClick={() => selectVersion(v.version)} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                border: `1px solid ${selectedVersion === v.version ? 'var(--accent)' : 'var(--border)'}`,
                background: selectedVersion === v.version ? 'rgba(230,57,70,0.12)' : 'var(--surface2)',
                color: selectedVersion === v.version ? 'var(--accent)' : 'var(--muted)',
                fontWeight: selectedVersion === v.version ? 700 : 400,
              }}>
                v{v.version} · {new Date(v.created_at).toLocaleDateString()}
              </button>
            ))}
          </div>

          {/* Diff/Full toggle */}
          {snapshot && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button onClick={() => setMode('diff')} style={{
                  flex: 1, padding: '7px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                  border: '1px solid var(--border)',
                  background: mode === 'diff' ? 'var(--accent)' : 'var(--surface2)',
                  color: mode === 'diff' ? '#fff' : 'var(--muted)',
                }}>View Diff</button>
                <button onClick={() => setMode('full')} style={{
                  flex: 1, padding: '7px', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                  border: '1px solid var(--border)',
                  background: mode === 'full' ? 'var(--accent)' : 'var(--surface2)',
                  color: mode === 'full' ? '#fff' : 'var(--muted)',
                }}>Read Full</button>
              </div>

              {mode === 'diff' && prevSnapshot && <DiffView older={prevSnapshot} newer={snapshot} />}
              {mode === 'diff' && !prevSnapshot && <p style={{ color: 'var(--muted)', fontSize: 13 }}>This is the first version — no diff available.</p>}
              {mode === 'full' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {FIELDS.map(f => (
                    <div key={f} className="card" style={{ padding: 12 }}>
                      <p className="section-label" style={{ marginBottom: 4 }}>{FIELD_LABELS[f]}</p>
                      <p style={{ fontSize: 13, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{(snapshot as any)[f] || '—'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
