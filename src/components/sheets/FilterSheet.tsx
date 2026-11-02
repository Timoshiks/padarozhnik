/**
 * src/components/sheets/FilterSheet.tsx — шторка фильтрации АЗС
 */

import { Drawer } from 'vaul'
import { useAppStore } from '@/store/useAppStore'

const FUELS = [
  { id: null, label: 'Все виды' },
  { id: '95', label: 'АИ-95' },
  { id: '92', label: 'АИ-92' },
  { id: 'ДТ', label: 'Дизель (ДТ)' },
  { id: 'Газ', label: 'Газ (LPG)' },
]

export default function FilterSheet() {
  const { isFilterOpen, setFilterOpen, selectedFuel, setSelectedFuel } = useAppStore()

  function handleSelect(fuelId: string | null) {
    setSelectedFuel(fuelId)
    setFilterOpen(false)
  }

  return (
    <Drawer.Root
      open={isFilterOpen}
      onOpenChange={(open) => setFilterOpen(open)}
      modal={true}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 23, 21, 0.40)',
            zIndex: 45,
          }}
        />
        <Drawer.Content
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '430px',
            backgroundColor: 'var(--sheet)',
            borderRadius: '28px 28px 0 0',
            boxShadow: 'var(--shadow)',
            zIndex: 46,
            padding: '12px 16px 32px',
            outline: 'none',
          }}
        >
          {/* Ручка шторки */}
          <div
            style={{
              width: '80px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: 'var(--handle)',
              margin: '0 auto 16px',
            }}
          />

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              fontFamily: 'var(--font-text)',
              color: 'var(--text)',
              marginBottom: '16px',
            }}
          >
            Фильтр АЗС «Белоруснефть»
          </h3>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--muted)',
              fontFamily: 'var(--font-text)',
              marginBottom: '10px',
            }}
          >
            Вид топлива
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {FUELS.map((f) => {
              const isSelected = selectedFuel === f.id
              return (
                <button
                  key={f.label}
                  onClick={() => handleSelect(f.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: isSelected ? 'var(--color-accent)' : 'var(--card)',
                    color: isSelected ? '#FFFFFF' : 'var(--text)',
                    border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow)',
                    fontFamily: 'var(--font-text)',
                    fontSize: '14px',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {f.label}
                </button>
              )
            })}
          </div>

          {selectedFuel && (
            <button
              onClick={() => setSelectedFuel(null)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--muted)',
                fontFamily: 'var(--font-text)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Сбросить фильтр
            </button>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
