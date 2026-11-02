/**
 * src/components/profile/ProfileModal.tsx — полноэкранный профиль с ачивками
 *
 * DESIGN.md + plan.md Шаг 21:
 *   - z-index: 50, slide-up анимация
 *   - Аватар 80px, имя «Падарожнiк», баллы (--color-accent, tabular-nums)
 *   - 4 карточки ачивок
 *   - Кнопка закрытия X
 *   - Открывается по клику Menu в BottomNavigation
 */

import { useAppStore } from '@/store/useAppStore'
import type { Achievement } from '@/types'

// ─── Иконки ───────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  )
}

// Иконки ачивок по имени (из lucide-react — inline SVG)
function AchievementIcon({ name, color }: { name: string; color: string }) {
  const props = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  if (name === 'MapPin') return (
    <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  )
  if (name === 'Compass') return (
    <svg {...props}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
  )
  if (name === 'Star') return (
    <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  )
  // Trophy
  return (
    <svg {...props}><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M7 4H4a2 2 0 0 0-2 2v3a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a2 2 0 0 0-2-2h-3"/><rect x="7" y="2" width="10" height="9" rx="1"/></svg>
  )
}

// Названия уровней ачивок
const TIER_LABEL: Record<string, string> = {
  bronze: 'Бронза',
  silver: 'Серебро',
  gold:   'Золото',
}

// ─── Карточка ачивки ──────────────────────────────────────────────────────────

function AchievementCard({ a }: { a: Achievement }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 16px',
      backgroundColor: a.unlocked ? 'var(--card)' : 'transparent',
      borderRadius: 'var(--radius-tile)',
      border: a.unlocked ? 'none' : '1px solid var(--border-subtle)',
      boxShadow: a.unlocked ? 'var(--shadow)' : 'none',
      opacity: a.unlocked ? 1 : 0.45,
      transition: 'opacity 0.2s',
    }}>
      {/* Иконка-круг */}
      <div style={{
        width: '48px', height: '48px', flexShrink: 0,
        borderRadius: 'var(--radius-pill)',
        backgroundColor: a.unlocked ? 'var(--bg-card-inner)' : 'var(--bg-container)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AchievementIcon name={a.icon} color={a.unlocked ? 'var(--text-primary)' : 'var(--text-secondary)'} />
      </div>

      {/* Текст */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="list-title" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
        <p className="caption" style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{a.description}</p>
      </div>

      {/* Бейдж уровня */}
      {a.unlocked && (
        <span className="caption" style={{
          flexShrink: 0, padding: '3px 10px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: 'var(--bg-card-inner)',
          color: 'var(--text-secondary)', fontWeight: 600,
        }}>
          {TIER_LABEL[a.tier] || a.tier}
        </span>
      )}
    </div>
  )
}

// ─── Основной компонент ───────────────────────────────────────────────────────

export default function ProfileModal() {
  const { isProfileOpen, setProfileOpen, userPoints, checkedInIds, achievements } = useAppStore()

  if (!isProfileOpen) return null

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-sheet)',
        display: 'flex', flexDirection: 'column',
        animation: 'slide-up-modal 0.28s ease-out',
        overflowY: 'auto', overscrollBehavior: 'contain',
      }}
    >
      <style>{`
        @keyframes slide-up-modal {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Шапка с кнопкой закрытия */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 16px 0', flexShrink: 0,
      }}>
        <span className="title-md" style={{ color: 'var(--text-primary)' }}>Профиль и Квесты</span>
        <button
          onClick={() => setProfileOpen(false)}
          aria-label="Закрыть профиль"
          style={{
            width: '40px', height: '40px', borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--bg-container)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Аватар + имя + баллы */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '28px 16px 24px', gap: '12px', flexShrink: 0,
      }}>
        {/* Аватар 80px */}
        <div style={{
          width: '80px', height: '80px', borderRadius: 'var(--radius-pill)',
          background: 'linear-gradient(135deg, var(--color-accent) 0%, #007a3a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,154,73,0.25)',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '28px',
            fontWeight: 700, color: '#FFFFFF',
          }}>П</span>
        </div>

        {/* Имя */}
        <h2 className="title-lg" style={{ color: 'var(--text-primary)' }}>Падарожнiк</h2>

        {/* Баллы */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '10px 20px',
          backgroundColor: 'var(--color-accent-soft)',
          borderRadius: 'var(--radius-pill)',
        }}>
          <span
            className="numeric"
            style={{
              fontFamily: 'var(--font-display)', fontSize: '24px',
              fontWeight: 700, color: 'var(--color-accent)',
            }}
          >
            {userPoints}
          </span>
          <span className="body-md" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            баллов
          </span>
        </div>

        {/* Статистика чекинов */}
        <p className="caption" style={{ color: 'var(--text-secondary)' }}>
          <span className="numeric">{checkedInIds.length}</span> {
            checkedInIds.length % 10 === 1 && checkedInIds.length % 100 !== 11
              ? 'отметка'
              : checkedInIds.length % 10 >= 2 && checkedInIds.length % 10 <= 4 && (checkedInIds.length % 100 < 10 || checkedInIds.length % 100 >= 20)
              ? 'отметки'
              : 'отметок'
          }
        </p>
      </div>

      {/* Разделитель */}
      <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', marginInline: '16px', flexShrink: 0 }} />

      {/* Ачивки */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{
          fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-text)',
          color: 'var(--text-primary)', marginBottom: '4px',
        }}>
          Квесты и достижения
        </p>
        {achievements.map((a) => <AchievementCard key={a.id} a={a} />)}
      </div>
    </div>
  )
}
