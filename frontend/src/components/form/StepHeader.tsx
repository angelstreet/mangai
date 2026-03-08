interface StepHeaderProps {
  step: number
  total: number
  title: string
}

export function StepHeader({ step, total, title }: StepHeaderProps) {
  const pct = (step / total) * 100

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Step {step} of {total}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{title}</span>
      </div>
      <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: 'var(--accent)',
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}
