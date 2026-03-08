interface NavButtonsProps {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  disabled?: boolean
}

export function NavButtons({ onBack, onNext, nextLabel = 'Next', disabled = false }: NavButtonsProps) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
      {onBack && (
        <button
          className="btn-secondary"
          onClick={onBack}
          style={{ flex: 1 }}
        >
          Back
        </button>
      )}
      <button
        className="btn-primary"
        onClick={onNext}
        disabled={disabled}
        style={{
          flex: onBack ? 2 : 1,
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {nextLabel}
      </button>
    </div>
  )
}
