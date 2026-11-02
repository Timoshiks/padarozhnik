/**
 * src/components/sheets/RouteFinalSheet.tsx — финальная шторка маршрута (82dvh)
 *
 * DESIGN.md §5.4 (паттерн бенто) + plan.md Шаг 20:
 *   - Градиентная шапка «Рэчыца → Мінск»
 *   - Вертикальный список остановок из activeRoute
 *   - Бенто-блок: «У навігатар» (акцент) / «Падзяліцца» / «Захаваць»
 *   - «У навігатар» → тост «Маршрут перанесены ✓»
 *   - Открывается когда sheetState === 'route-final'
 *
 * Граница: логика диалога в сторе не меняется.
 */

import { useState } from 'react'
import { Drawer } from 'vaul'
import { useAppStore } from '@/store/useAppStore'

// ─── Иконки ───────────────────────────────────────────────────────────────────

function NavIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  )
}

function ShareIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function SaveIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

// Иконки вида остановки
function StopKindIcon({ kind }: { kind: string }) {
  if (kind === 'station') {
    return <span style={{ fontSize: '14px' }}>⛽</span>
  }
  if (kind === 'finish') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-accent)"
        stroke="none"><circle cx="12" cy="12" r="10" /></svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
    </svg>
  )
}

// ─── Плитка бенто ─────────────────────────────────────────────────────────────

function BentoTile({
  icon, label, accent = false, onClick,
}: {
  icon: React.ReactNode; label: string; accent?: boolean; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, height: '124px',
        backgroundColor: 'var(--bg-card-inner)',
        borderRadius: 'var(--radius-tile)',
        border: 'none',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '10px', cursor: 'pointer', padding: '12px 8px',
        transition: 'opacity 0.15s',
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: 'var(--radius-pill)',
        backgroundColor: accent ? 'var(--color-accent)' : 'var(--bg-sheet)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <span className="caption" style={{ color: 'var(--text-primary)', textAlign: 'center', lineHeight: '16px' }}>
        {label}
      </span>
    </button>
  )
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export default function RouteFinalSheet() {
  const { sheetState, setSheetState, activeRoute } = useAppStore()
  const [toastVisible, setToastVisible] = useState(false)

  const isOpen = sheetState === 'route-final'

  function handleNavigator() {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2800)
  }

  return (
    <>
      <Drawer.Root
        open={isOpen}
        onOpenChange={(open) => { if (!open) setSheetState('closed') }}
        snapPoints={[0.48, 0.82]}
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
              position: 'fixed', bottom: 0,
              left: '50%', transform: 'translateX(-50%)',
              width: '100%', maxWidth: '430px', maxHeight: '82dvh',
              backgroundColor: 'var(--bg-sheet)',
              borderRadius: 'var(--radius-sheet)',
              boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
              zIndex: 30,
              display: 'flex', flexDirection: 'column',
              outline: 'none', paddingBottom: '72px',
              overflowY: 'auto', overscrollBehavior: 'contain',
            }}
          >
            {/* Градиентная шапка */}
            <div style={{
              flexShrink: 0,
              background: 'linear-gradient(135deg, var(--color-accent) 0%, #007a3a 100%)',
              borderRadius: 'var(--radius-sheet)',
              padding: '20px 16px 24px',
              position: 'relative',
            }}>
              {/* Drag Handle 1:1 по .handle */}
              <Drawer.Handle style={{
                position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
                width: '80px', height: '6px', borderRadius: '3px',
                backgroundColor: 'rgba(255,255,255,0.75)',
              }} />

              <p className="caption" style={{ color: 'rgba(255,255,255,0.75)', marginTop: '8px' }}>
                Ваш маршрут сформирован
              </p>
              <h2 className="title-lg" style={{ color: '#FFFFFF', marginTop: '4px' }}>
                Гомель → Минск (трасса М-5)
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                <span className="caption numeric" style={{
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}>
                  312 км • 3 остановки
                </span>
                <span className="caption numeric" style={{
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}>
                  ~3.5 часа
                </span>
                <span className="caption numeric" style={{
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                }}>
                  ☕ Кофе за 1 коп. на АЗК №20
                </span>
              </div>
            </div>

            {/* Бенто-блок действий */}
            <div style={{
              margin: '16px 16px 0',
              backgroundColor: 'var(--bg-container)',
              borderRadius: 'var(--radius-container)',
              padding: '16px',
              flexShrink: 0,
            }}>
              <p style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-text)', color: 'var(--text-primary)', marginBottom: '12px' }}>
                Действия
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <BentoTile accent onClick={handleNavigator}
                  label="В навигатор"
                  icon={<NavIcon color="var(--text-on-accent)" />}
                />
                <BentoTile label="Поделиться" icon={<ShareIcon color="var(--text-primary)" />} />
                <BentoTile label="Сохранить"   icon={<SaveIcon  color="var(--text-primary)" />} />
              </div>
            </div>

            {/* Вертикальный список остановок */}
            <div style={{ padding: '16px 16px 0' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-text)', color: 'var(--text-primary)', marginBottom: '12px' }}>
                Остановки маршрута
              </p>

              {activeRoute.map((stop, idx) => (
                <div key={stop.index} style={{ display: 'flex', gap: '12px', marginBottom: idx < activeRoute.length - 1 ? '0' : '0' }}>
                  {/* Линия-таймлайн */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '9999px',
                      backgroundColor: stop.kind === 'station' ? '#262B28' : 'var(--color-accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <StopKindIcon kind={stop.kind} />
                    </div>
                    {idx < activeRoute.length - 1 && (
                      <div style={{ width: '2px', flex: 1, minHeight: '28px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />
                    )}
                  </div>

                  {/* Назва і апісанне */}
                  <div style={{ flex: 1, paddingBottom: idx < activeRoute.length - 1 ? '16px' : '0', paddingTop: '4px' }}>
                    <p className="list-title" style={{ color: 'var(--text-primary)' }}>{stop.name}</p>
                    {stop.description && (
                      <p className="caption" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {stop.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Тост «Маршрут перанесены ✓» */}
      {toastVisible && (
        <div style={{
          position: 'fixed', bottom: '90px',
          left: '50%', transform: 'translateX(-50%)',
          maxWidth: '360px', width: 'calc(100% - 48px)',
          zIndex: 60,
          backgroundColor: 'var(--text-primary)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-pill)',
          padding: '14px 20px',
          fontFamily: 'var(--font-text)',
          fontSize: '15px', fontWeight: 500,
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
          animation: 'toast-in 0.25s ease',
        }}>
          Маршрут перенесён ✓
        </div>
      )}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  )
}
