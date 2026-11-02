/**
 * src/components/map/TourismControls.tsx — отдельный кружочек для режима «Туризм»
 * и появляющаяся при его включении иконка профиля/квестов.
 */

import { useAppStore } from '@/store/useAppStore'

// Иконка компаса для туристического режима
function CompassIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#FFFFFF' : 'var(--color-accent)'}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

// Иконка кубка / квестов для профиля
function TrophyIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
      <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
    </svg>
  )
}

export default function TourismControls() {
  const { isTourismMode, toggleTourismMode, userPoints, setProfileOpen } = useAppStore()

  return (
    <div
      style={{
        position: 'absolute',
        top: '74px',
        left: '16px',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* Отдельный кружочек для туристического режима */}
      <button
        onClick={toggleTourismMode}
        aria-label={isTourismMode ? 'Выключить режим Туризм' : 'Включить режим Туризм'}
        title="Режим «Туризм»"
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isTourismMode ? 'var(--color-accent)' : 'var(--card)',
          boxShadow: isTourismMode
            ? '0 0 0 3px var(--color-accent-soft), var(--shadow)'
            : 'var(--shadow)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <CompassIcon active={isTourismMode} />
      </button>

      {/* При нажатии на экране появляется иконка профиля с квестами */}
      {isTourismMode && (
        <button
          onClick={() => setProfileOpen(true)}
          aria-label="Профиль и Квесты"
          title="Квесты и достижения"
          style={{
            height: '46px',
            paddingInline: '14px',
            borderRadius: '23px',
            border: 'none',
            backgroundColor: 'var(--card)',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            animation: 'pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <TrophyIcon />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text)',
                fontFamily: 'var(--font-text)',
                lineHeight: '15px',
              }}
            >
              Квесты
            </span>
            <span
              className="numeric"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-text)',
                lineHeight: '13px',
              }}
            >
              {userPoints} баллов
            </span>
          </div>
        </button>
      )}

      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
