/**
 * src/components/sheets/PlaceCardSheet.tsx — детальная карточка места (82dvh)
 *
 * DESIGN.md §5.4:
 *   - Фото 220px (image_url или градиентный плейсхолдер)
 *   - Заголовок Title-Lg + адрес Caption
 *   - Бенто-контейнер: 3 плитки 124px
 *     1. «Адзначыцца» (--color-accent) → после чекина «Адзначана ✓»
 *     2. «У маршрут» (монохром)
 *     3. «Пра месца» (монохром)
 *   - Описание до 3 строк
 *   - АЗС: чипы топлива (без буллитов-разделителей — DESIGN.md §1)
 *
 * Границы (plan.md Шаг 15): только checkIn() — без AI и маршрутной логики.
 */

import { Drawer } from 'vaul'
import { useAppStore } from '@/store/useAppStore'
import type { SightPoint, StationPoint } from '@/types'

// ─── Типовые гарды ────────────────────────────────────────────────────────────

function isSight(obj: SightPoint | StationPoint): obj is SightPoint {
  return 'region' in obj
}

// ─── Вспомогательные компоненты ───────────────────────────────────────────────

function CheckmarkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="var(--text-on-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function MapPinIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function RouteIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  )
}

function InfoIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

// ─── Плитка бенто-блока ───────────────────────────────────────────────────────

function BentoTile({
  icon,
  label,
  accent = false,
  disabled = false,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  accent?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        height: '124px',
        backgroundColor: 'var(--bg-card-inner)',
        borderRadius: 'var(--radius-tile)',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        cursor: disabled ? 'default' : 'pointer',
        padding: '12px 8px',
        transition: 'opacity 0.15s ease',
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {/* Иконка-круг */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: accent ? 'var(--color-accent)' : 'var(--bg-sheet)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      {/* Подпись */}
      <span
        className="caption numeric"
        style={{
          color: 'var(--text-primary)',
          textAlign: 'center',
          lineHeight: '16px',
          whiteSpace: 'pre-line',
        }}
      >
        {label}
      </span>
    </button>
  )
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export default function PlaceCardSheet() {
  const { sheetState, setSheetState, selectedObject, checkedInIds, checkIn } = useAppStore()

  const isOpen = sheetState === 'card'

  if (!selectedObject) return null

  const isCheckedIn = checkedInIds.includes(selectedObject.id)
  const sight = isSight(selectedObject) ? selectedObject : null
  const station = !sight ? (selectedObject as StationPoint) : null

  const title   = selectedObject.name
  const bonus   = sight ? sight.bonus : 30
  const address = sight
    ? sight.region
    : `${station!.city}, ${station!.address}`
  const imageUrl = sight?.image_url || ''
  const desc     = sight?.desc || ''

  // Чипы топлива для АЗС (без буллитов — DESIGN.md §1)
  const fuelChips = station?.fuels
    ? station.fuels.split(',').map((f) => f.trim()).filter(Boolean)
    : []

  function handleCheckIn() {
    if (!isCheckedIn) checkIn(selectedObject!.id, bonus)
  }

  function handleClose() {
    setSheetState('list')
  }

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => { if (!open) handleClose() }}
      snapPoints={[0.82]}
      modal={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 23, 21, 0.40)',
            zIndex: 25,
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
            maxHeight: '82dvh',
            backgroundColor: 'var(--bg-sheet)',
            borderRadius: 'var(--radius-sheet)',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            paddingBottom: '72px',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
          }}
        >
          {/* Фото-шапка 220px */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '220px',
              flexShrink: 0,
              borderRadius: 'var(--radius-sheet)',
              overflow: 'hidden',
              background: imageUrl
                ? undefined
                : 'linear-gradient(135deg, var(--color-accent-soft) 0%, var(--bg-container) 100%)',
            }}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback при ошибке загрузки — скрыть img, показать градиент
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}

            {/* Drag Handle поверх фото 1:1 со стилем ручки */}
            <Drawer.Handle
              style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: 'rgba(255,255,255,0.75)',
              }}
            />
          </div>

          {/* Заголовочный блок */}
          <div style={{ padding: '16px 16px 0' }}>
            <h2 className="title-lg" style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
              {title}
            </h2>
            <p className="caption" style={{ color: 'var(--text-secondary)' }}>
              {address}
            </p>
          </div>

          {/* Бенто-контейнер действий — DESIGN.md §5.4 */}
          <div
            style={{
              margin: '16px 16px 0',
              backgroundColor: 'var(--bg-container)',
              borderRadius: 'var(--radius-container)',
              padding: '16px',
            }}
          >
            <p
              style={{
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'var(--font-text)',
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              {sight ? 'Действия' : 'Возможности'}
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Плитка 1: Главная CTA — акцент */}
              <BentoTile
                accent
                disabled={isCheckedIn}
                onClick={handleCheckIn}
                label={isCheckedIn ? 'Отмечено ✓' : `Отметиться\n+${bonus} Б`}
                icon={
                  isCheckedIn
                    ? <CheckmarkIcon />
                    : <MapPinIcon color="var(--text-on-accent)" />
                }
              />

              {/* Плитка 2: В маршрут */}
              <BentoTile
                label="В маршрут"
                icon={<RouteIcon color="var(--text-primary)" />}
              />

              {/* Плитка 3: О месте / Об АЗС */}
              <BentoTile
                label={sight ? 'О месте' : 'Об АЗС'}
                icon={<InfoIcon color="var(--text-primary)" />}
              />
            </div>
          </div>

          {/* Описание — до 3 строк */}
          {desc && (
            <div style={{ padding: '16px 16px 0' }}>
              <p
                className="body-md"
                style={{
                  color: 'var(--text-secondary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {desc}
              </p>
            </div>
          )}

          {/* Чипы топлива для АЗС — без буллитов (DESIGN.md §1) */}
          {fuelChips.length > 0 && (
            <div
              style={{
                padding: '12px 16px 0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {fuelChips.map((fuel) => (
                <span
                  key={fuel}
                  className="caption"
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--bg-container)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {fuel}
                </span>
              ))}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
