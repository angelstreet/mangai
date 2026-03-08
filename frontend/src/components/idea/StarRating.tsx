import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange: (v: number) => void
  readonly?: boolean
}

export function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value >= star
        const partial = !filled && value > star - 1 && readonly
        return (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange(star)}
            style={{
              padding: 2,
              color: filled || partial ? 'var(--accent)' : 'var(--muted)',
              opacity: partial ? 0.5 : 1,
              cursor: readonly ? 'default' : 'pointer',
            }}
            disabled={readonly}
          >
            <Star
              size={24}
              fill={filled ? 'var(--accent)' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        )
      })}
    </div>
  )
}
