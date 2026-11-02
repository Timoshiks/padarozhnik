/**
 * src/components/navigation/BottomNavigation.tsx — нижний бар
 * 1:1 по стилю и векторным SVG из АЗС на карте.html
 */

import { useAppStore } from '@/store/useAppStore'

// SVG иконки из оригинального приложения Белоруснефть
function HomeSvg({ active }: { active: boolean }) {
  return (
    <svg width="26" height="25" viewBox="0 0 95 90" style={{ position: 'relative', flex: 'none' }}>
      <path
        fill={active ? 'var(--text)' : 'var(--icon)'}
        fillRule="evenodd"
        d="M42.5 8.0L37.0 11.5L15.5 30.2L12.8 33.2L11.2 35.8L10.8 38.5L10.8 69.2L11.0 71.8L12.0 74.2L14.0 76.8L18.5 79.5L31.5 79.8L33.5 79.5L35.8 78.5L39.5 75.2L41.0 72.2L41.5 70.2L41.5 60.0L42.0 58.5L43.5 56.8L46.8 56.0L48.2 56.5L50.2 58.8L51.0 72.0L52.0 74.2L53.8 76.5L56.8 78.8L58.5 79.5L71.5 79.8L74.2 79.2L77.2 77.5L79.5 75.2L81.2 71.0L81.8 67.2L81.8 40.5L80.8 35.5L79.2 33.0L75.8 29.5L53.8 10.5L49.5 8.0L47.0 7.5ZM18.2 37.8L42.5 16.2L44.8 14.8L47.5 14.8L51.2 17.5L71.8 35.5L74.2 38.5L74.5 69.2L74.0 70.5L72.2 72.2L69.8 73.0L62.2 73.0L59.5 72.0L57.8 69.8L57.8 60.0L56.8 55.5L55.5 53.5L53.2 51.2L49.2 49.2L43.5 49.0L40.0 50.5L38.0 52.0L35.2 56.0L34.5 59.5L34.2 69.8L32.5 72.0L29.8 73.0L22.2 73.0L19.5 72.0L18.0 70.2L17.5 68.2L17.5 39.8Z"
      />
    </svg>
  )
}

function FuelSvg({ active }: { active: boolean }) {
  return (
    <svg width="28" height="24" viewBox="0 0 105 90" style={{ position: 'relative', flex: 'none' }}>
      <path
        fill={active ? 'var(--text)' : 'var(--icon)'}
        fillRule="evenodd"
        d="M19.8 27.5L16.8 28.8L12.0 33.8L9.2 37.8L8.0 41.0L8.0 47.8L10.2 52.5L13.8 55.8L17.5 57.5L22.0 57.8L26.0 56.5L30.2 53.0L32.8 48.2L33.2 43.0L31.8 38.0L28.8 33.5L23.5 28.2ZM20.5 35.5L23.8 38.8L26.0 42.5L26.0 46.2L23.2 49.8L21.5 50.5L18.0 50.0L15.8 47.8L14.8 45.5L14.8 42.8L15.8 40.8L18.0 37.8ZM17.2 15.2L17.2 18.0L18.8 19.8L19.5 20.0L45.2 20.5L48.2 21.8L53.2 26.2L53.2 27.0L52.5 27.8L50.8 28.2L47.0 31.0L44.2 34.5L43.2 36.5L42.5 40.2L43.0 46.2L44.2 49.2L46.5 52.2L60.8 66.5L63.8 68.8L69.2 70.5L72.8 70.5L76.8 69.5L78.8 68.5L82.8 65.0L86.0 59.5L86.5 59.5L92.5 65.5L95.5 65.8L97.5 64.2L97.8 61.0L96.8 59.5L57.5 20.2L51.0 15.0L45.5 13.2L42.2 13.0L20.0 13.0L18.5 13.8ZM52.8 35.5L56.5 33.8L58.8 33.8L61.5 34.8L77.2 50.2L79.0 53.5L79.0 57.2L78.0 59.5L75.5 62.0L73.8 63.0L72.2 63.2L68.5 63.0L66.5 62.0L51.0 46.5L49.8 44.2L49.8 39.5L50.8 37.5Z"
      />
    </svg>
  )
}

function CardsSvg({ active }: { active: boolean }) {
  return (
    <svg width="26" height="25" viewBox="0 0 95 90" style={{ position: 'relative', flex: 'none' }}>
      <path
        fill={active ? 'var(--text)' : 'var(--icon)'}
        fillRule="evenodd"
        d="M22.0 31.0L22.0 33.8L24.0 35.8L58.2 35.8L60.5 33.2L60.5 31.5L58.2 29.0L24.0 29.0ZM8.0 17.2L7.0 19.0L6.0 22.5L6.0 61.5L7.0 65.2L8.0 67.0L11.8 70.8L13.5 71.8L17.5 72.8L74.2 72.8L77.8 71.8L79.5 70.8L83.8 66.2L84.8 64.0L85.2 60.8L85.2 23.8L84.8 20.2L82.8 16.5L78.8 13.0L76.2 12.0L14.8 12.0L10.8 14.2ZM13.8 21.5L15.2 19.8L17.0 18.8L74.8 19.0L76.8 20.5L78.0 22.5L77.8 62.2L75.2 65.0L73.8 65.5L17.5 65.5L16.0 65.0L13.8 62.8L13.2 61.2L13.2 23.0Z"
      />
    </svg>
  )
}

function MapPinSvg({ active }: { active: boolean }) {
  return (
    <svg width="22" height="28" viewBox="0 0 73 100" style={{ position: 'relative', flex: 'none' }}>
      <path
        fill={active ? 'var(--text)' : 'var(--icon)'}
        fillRule="evenodd"
        d="M31.5 10.0L23.2 12.0L18.5 14.5L14.5 17.5L9.0 23.5L6.0 28.8L4.0 35.5L4.0 46.5L6.2 55.5L9.2 62.0L17.0 73.2L22.5 79.2L29.8 85.8L32.5 87.5L36.8 87.8L38.0 87.5L42.0 84.8L49.8 77.5L56.2 69.8L60.5 63.2L64.2 55.5L65.8 50.0L66.8 44.0L66.5 35.2L64.8 29.5L62.8 25.5L59.2 20.8L54.2 16.0L47.2 12.0L41.2 10.2ZM35.0 28.8L39.8 29.8L42.8 31.8L45.2 34.8L46.8 38.8L46.5 43.0L46.0 44.8L44.5 47.0L41.5 50.0L36.8 51.8L33.8 51.8L31.0 51.0L28.8 49.8L25.0 45.5L23.8 42.0L24.0 38.0L26.0 33.8L30.2 30.0Z"
      />
    </svg>
  )
}

function MenuSvg({ active }: { active: boolean }) {
  return (
    <svg width="24" height="20" viewBox="0 0 85 70" style={{ position: 'relative', flex: 'none' }}>
      <path
        fill={active ? 'var(--text)' : 'var(--icon)'}
        fillRule="evenodd"
        d="M10.2 51.8L10.2 54.2L11.5 55.8L13.5 56.5L70.0 56.5L71.8 55.8L73.0 54.0L73.0 51.8L72.5 50.8L70.8 49.5L12.8 49.5L11.5 50.0ZM10.2 31.5L10.2 34.2L11.2 35.5L13.5 36.5L70.0 36.5L72.0 35.5L73.0 34.0L72.8 31.0L71.5 29.8L70.2 29.2L13.0 29.2L11.5 30.0ZM10.2 11.2L10.5 14.5L11.8 15.8L13.0 16.2L70.2 16.2L72.0 15.5L73.0 13.8L73.0 11.8L72.5 10.8L70.2 9.2L12.8 9.2Z"
      />
    </svg>
  )
}

// Активная вкладка — АЗС / Карта (индекс 3)
const ACTIVE_INDEX = 3

interface NavItem {
  label: string
  icon: (active: boolean) => React.ReactNode
  onClick?: () => void
}

export default function BottomNavigation() {
  const setProfileOpen = useAppStore((s) => s.setProfileOpen)

  const NAV_ITEMS: NavItem[] = [
    { label: 'Главная', icon: (a) => <HomeSvg active={a} /> },
    { label: 'Топливо', icon: (a) => <FuelSvg active={a} /> },
    { label: 'Карты',   icon: (a) => <CardsSvg active={a} /> },
    { label: 'АЗС',     icon: (a) => <MapPinSvg active={a} /> },
    {
      label: 'Меню',
      icon: (a) => <MenuSvg active={a} />,
      onClick: () => setProfileOpen(true),
    },
  ]

  return (
    <nav
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        height: '68px',
        backgroundColor: 'var(--nav)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        boxShadow: 'var(--shadow-nav)',
      }}
    >
      {NAV_ITEMS.map((item, idx) => {
        const isActive = idx === ACTIVE_INDEX
        return (
          <button
            key={item.label}
            onClick={item.onClick}
            aria-label={item.label}
            style={{
              position: 'relative',
              width: '60px',
              height: '48px',
              borderRadius: '14px',
              border: 0,
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Подложка активной вкладки 1:1 (.tab.on::before) */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  left: '11px',
                  right: '11px',
                  top: '7px',
                  bottom: '7px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--active)',
                }}
              />
            )}
            {item.icon(isActive)}
          </button>
        )
      })}
    </nav>
  )
}
