/**
 * src/components/map/TopBar.tsx — верхний оверлей: поиск + кнопка фильтрации АЗС
 * Стиль 1:1 по референсу АЗС на карте (HTML)
 */

import { useAppStore } from '@/store/useAppStore'

// SVG-иконка поиска из оригинального приложения Белоруснефть
function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 105 105" style={{ flex: 'none' }}>
      <path
        fill="var(--icon)"
        fillRule="evenodd"
        d="M22.0 20.2L17.0 25.8L13.0 32.5L10.2 40.2L9.2 48.2L9.8 56.5L11.2 63.0L14.0 69.2L20.0 77.5L24.8 82.0L31.2 86.2L37.2 88.8L44.5 90.2L55.2 90.2L59.8 89.5L67.5 86.8L74.8 82.0L75.5 82.0L91.0 97.5L94.2 98.5L97.0 97.2L98.0 96.0L98.5 94.0L97.8 91.2L82.0 75.5L82.5 73.8L85.8 69.2L88.5 63.0L90.2 55.0L90.5 47.5L89.8 41.2L87.2 33.5L84.5 28.2L79.8 22.2L74.0 17.0L67.5 13.0L60.0 10.2L53.5 9.2L44.5 9.5L36.5 11.2L29.5 14.5ZM44.0 18.8L55.5 18.8L62.2 20.8L67.2 23.5L73.2 28.8L77.0 33.8L79.0 37.5L81.0 44.8L81.2 51.2L80.8 56.2L79.0 62.0L76.0 67.5L73.2 70.8L67.5 76.0L59.2 80.0L54.8 81.0L49.5 81.2L43.8 80.8L37.2 78.8L32.0 75.8L25.8 70.0L22.8 66.0L19.8 59.5L18.8 55.5L18.8 44.0L20.8 37.8L23.8 32.2L27.8 27.5L32.5 23.5L37.5 20.8Z"
      />
    </svg>
  )
}

// Шеврон раскрытия выпадающего списка поиска
function ChevronIcon() {
  return (
    <svg width="12" height="8" viewBox="0 0 45 30" style={{ flex: 'none' }}>
      <path
        fill="var(--icon)"
        fillRule="evenodd"
        d="M7.2 9.0L7.2 9.8L23.5 25.8L24.2 25.8L40.5 9.8L40.5 9.0Z"
      />
    </svg>
  )
}

// Иконка фильтра из оригинального приложения
function FilterSvg({ active }: { active: boolean }) {
  return (
    <svg width="22" height="23" viewBox="0 0 85 90">
      <path
        fill={active ? '#FFFFFF' : 'var(--icon)'}
        fillRule="evenodd"
        d="M73.0 10.0L70.5 9.2L66.0 9.0L19.8 9.0L15.2 9.2L12.8 10.0L10.8 11.2L9.0 13.5L8.0 17.0L8.0 19.8L9.0 26.2L10.5 29.2L21.0 40.8L30.0 48.5L32.2 72.8L33.5 76.2L35.0 77.5L37.8 78.8L40.5 78.5L47.0 74.5L51.8 70.2L53.0 68.0L54.0 64.0L55.8 48.5L67.5 38.0L73.8 31.2L76.5 27.0L77.8 19.8L77.5 16.0L76.8 13.5L75.8 12.0ZM70.2 16.2L71.0 17.2L71.0 21.2L69.8 25.8L58.0 38.0L52.5 42.2L50.2 44.8L49.0 48.5L48.2 58.2L47.0 65.2L46.0 66.8L40.2 71.0L39.2 71.0L38.5 70.0L38.5 67.0L37.5 60.8L37.5 56.5L36.8 52.2L36.8 48.5L35.8 45.2L33.2 42.2L28.0 38.2L16.0 25.8L14.8 21.2L15.0 16.8L16.8 15.8L69.0 15.8Z"
      />
    </svg>
  )
}

export default function TopBar() {
  const { isTourismMode, isFilterOpen, setFilterOpen, selectedFuel } = useAppStore()

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      {/* Поисковая плашка (style 1:1 с АЗС на карте.html) */}
      <div
        style={{
          flex: 1,
          height: '48px',
          borderRadius: '24px',
          backgroundColor: 'var(--card)',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '14px',
          cursor: 'pointer',
        }}
        onClick={() => setFilterOpen(true)}
      >
        <SearchIcon />
        <span
          style={{
            flex: 1,
            color: 'var(--muted)',
            fontSize: '14px',
            letterSpacing: '.8px',
            opacity: 0.85,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {selectedFuel ? `Топливо: ${selectedFuel}` : isTourismMode ? 'Поиск мест и АЗС…' : 'по номеру АЗС'}
        </span>
        <ChevronIcon />
      </div>

      {/* Кнопка фильтрации в правом верхнем углу (1:1 с АЗС на карте.html) */}
      <button
        onClick={() => setFilterOpen(!isFilterOpen)}
        aria-label="Фильтр"
        style={{
          position: 'relative',
          flexShrink: 0,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: selectedFuel ? 'var(--color-accent)' : 'var(--card)',
          boxShadow: selectedFuel
            ? '0 0 0 3px var(--color-accent-soft), var(--shadow)'
            : 'var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease, transform 0.12s ease',
        }}
      >
        <FilterSvg active={!!selectedFuel} />
        {selectedFuel && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--color-accent)',
            }}
          />
        )}
      </button>
    </div>
  )
}
