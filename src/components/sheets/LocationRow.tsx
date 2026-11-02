/**
 * src/components/sheets/LocationRow.tsx — строка локации в списке шторки
 *
 * DESIGN.md §5.3:
 *   - height: 72px, padding: 12px 16px
 *   - flex: space-between, align-items: flex-start
 *   - Слева: название (List-Title, --text-primary) + адрес/категория (Caption, --text-secondary)
 *   - Справа: бонус +50 Б (tabular-nums, --text-primary, font-weight 600)
 *   - Разделитель снизу: 1px --border-subtle (кроме последней строки)
 */

interface LocationRowProps {
  name: string
  subtitle: string
  bonus: number
  isLast?: boolean
  onClick: () => void
}

export default function LocationRow({ name, subtitle, bonus, isLast = false, onClick }: LocationRowProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: '76px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.12s ease',
      }}
      onMouseDown={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)' }}
      onMouseUp={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
    >
      {/* Левый блок 1:1 по .item h3 и p */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '.6px',
            color: 'var(--text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-text)',
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--muted)',
            marginTop: '6px',
            letterSpacing: '.4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-text)',
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Правый блок 1:1 по .item .d */}
      <div
        className="numeric"
        style={{
          fontSize: '18px',
          fontWeight: 400,
          letterSpacing: '.8px',
          whiteSpace: 'nowrap',
          paddingLeft: '12px',
          color: 'var(--text)',
          fontFamily: 'var(--font-text)',
        }}
      >
        +{bonus} Б
      </div>
    </button>
  )
}
