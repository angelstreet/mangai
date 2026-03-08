import type { Protagonist } from '../../types'

interface ProtagonistListProps {
  protagonists: Protagonist[]
}

export function ProtagonistList({ protagonists }: ProtagonistListProps) {
  if (!protagonists || protagonists.length === 0) {
    return <p style={{ color: 'var(--muted)' }}>No protagonists listed.</p>
  }
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {protagonists.map((p, i) => (
        <li key={i} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>
            {i + 1}. {p.name}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 2 }}>{p.pitch}</div>
        </li>
      ))}
    </ol>
  )
}
