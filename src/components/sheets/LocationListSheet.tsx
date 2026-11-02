/**
 * src/components/sheets/LocationListSheet.tsx — шторка vaul со списком мест
 *
 * DESIGN.md §4.3 + §5.3:
 *   - Snap-points: collapsed 220px (≈0.26vh), half-expanded 58dvh (0.58)
 *   - Drag Handle: 44×5px, --radius-pill, --border-subtle
 *   - modal={false} — карта остаётся интерактивной под шторкой
 *   - Режим Туризм ON → достопримечательности; OFF → АЗС
 *   - Клик по строке → setSelectedObject() + setSheetState('card')
 *
 * Границы (plan.md Шаг 14): PlaceCardSheet и RouteFinalSheet ещё не существуют.
 */

import { useState } from 'react'
import { Drawer } from 'vaul'
import { useAppStore } from '@/store/useAppStore'
import type { SightPoint, StationPoint } from '@/types'
import LocationRow from '@/components/sheets/LocationRow'

// Snap points: 0.26 ≈ 220px на стандартном мобильном (844px), 0.58 = 58dvh
const SNAP_POINTS: (string | number)[] = [0.26, 0.58]

// Бонус за АЗС фиксирован (данные не содержат поля bonus)
const STATION_BONUS = 30

export default function LocationListSheet() {
  const { isTourismMode, sights, stations, sheetState, setSheetState, setSelectedObject, isAiDialogOpen, setAiDialogOpen } =
    useAppStore()
  const [snap, setSnap] = useState<string | number | null>(SNAP_POINTS[0])

  const isOpen = sheetState === 'list' && !isAiDialogOpen

  // Список для отображения: первые 200 для производительности
  const items: (SightPoint | StationPoint)[] = isTourismMode
    ? sights.slice(0, 200)
    : stations.slice(0, 200)

  function handleRowClick(item: SightPoint | StationPoint) {
    setSelectedObject(item)
    setSheetState('card')
  }

  function getSubtitle(item: SightPoint | StationPoint): string {
    if ('region' in item) {
      // SightPoint
      return item.category || item.region
    }
    // StationPoint
    return item.address || item.city
  }

  function getBonus(item: SightPoint | StationPoint): number {
    if ('bonus' in item) return item.bonus
    return STATION_BONUS
  }

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => { if (!open) setSheetState('closed') }}
      snapPoints={SNAP_POINTS}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
      // Без overlay — карта остаётся кликабельной
    >
      <Drawer.Portal>
        <Drawer.Content
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '430px',
            // 82dvh max — выше нижнего меню
            maxHeight: '82dvh',
            backgroundColor: 'var(--bg-sheet)',
            borderRadius: 'var(--radius-sheet)',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
            // z-index между картой (0) и меню (40)
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            // Отступ снизу для нижнего меню
            paddingBottom: '68px',
          }}
        >
          {/* Drag Handle 1:1 по .handle из АЗС на карте.html */}
          <Drawer.Handle
            style={{
              width: '80px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: 'var(--handle)',
              margin: '8px auto 14px',
              flexShrink: 0,
            }}
          />

          {/* Заголовок секции */}
          <div
            style={{
              padding: '16px 16px 8px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span className="title-md" style={{ color: 'var(--text-primary)' }}>
              {isTourismMode ? 'Достопримечательности' : 'АЗС «Белоруснефть»'}
            </span>
            {isTourismMode && (
              <button
                onClick={() => setAiDialogOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-accent-soft)',
                  border: '1px solid var(--color-accent)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '4px 12px',
                  color: 'var(--color-accent)',
                  fontFamily: 'var(--font-text)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span>ИИ-маршрут</span>
                <span>✨</span>
              </button>
            )}
          </div>

          {/* Скроллируемый список */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
            }}
          >
            {items.map((item, idx) => (
              <LocationRow
                key={item.id}
                name={item.name}
                subtitle={getSubtitle(item)}
                bonus={getBonus(item)}
                isLast={idx === items.length - 1}
                onClick={() => handleRowClick(item)}
              />
            ))}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
