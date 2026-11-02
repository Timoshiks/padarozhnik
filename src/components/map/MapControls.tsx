/**
 * src/components/map/MapControls.tsx — кнопки зума и геолокации
 * В точном соответствии со стилем и SVG из АЗС на карте.html
 */

import { mapRef } from '@/components/map/MapCanvas'

const MINSK: [number, number] = [53.9045, 27.5615]

const fabStyle: React.CSSProperties = {
  position: 'absolute',
  right: '16px',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: 'var(--card)',
  boxShadow: 'var(--shadow)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 0,
  cursor: 'pointer',
  zIndex: 20,
  transition: 'transform 0.12s ease',
}

export default function MapControls() {
  const handleZoomIn  = () => mapRef.current?.zoomIn()
  const handleZoomOut = () => mapRef.current?.zoomOut()
  const handleLocate  = () => mapRef.current?.flyTo(MINSK, 12, { duration: 1.2 })

  return (
    <>
      {/* Кнопка «Приблизить» top: 151px */}
      <button
        style={{ ...fabStyle, top: '151px' }}
        onClick={handleZoomIn}
        aria-label="Приблизить"
      >
        <svg width="22" height="22" viewBox="0 0 65 65">
          <path
            fill="var(--icon)"
            fillRule="evenodd"
            d="M30.0 6.8L29.5 7.5L29.5 27.0L28.5 27.8L9.0 27.8L8.5 28.5L8.5 33.2L9.5 34.2L29.0 34.2L29.8 35.5L29.5 54.2L30.5 55.2L35.2 55.2L36.0 54.8L36.2 34.8L37.5 34.0L56.2 34.2L57.0 33.8L57.0 28.0L36.8 27.5L36.0 26.5L36.0 7.0Z"
          />
        </svg>
      </button>

      {/* Кнопка «Отдалить» top: 221px */}
      <button
        style={{ ...fabStyle, top: '221px' }}
        onClick={handleZoomOut}
        aria-label="Отдалить"
      >
        <svg width="18" height="7" viewBox="0 0 55 20">
          <path
            fill="var(--icon)"
            fillRule="evenodd"
            d="M3.5 8.5L3.5 13.2L4.5 14.2L51.2 14.2L52.0 13.8L51.8 7.8L4.0 7.8Z"
          />
        </svg>
      </button>

      {/* Кнопка «Моё местоположение» top: 311px */}
      <button
        style={{ ...fabStyle, top: '311px' }}
        onClick={handleLocate}
        aria-label="Моё местоположение"
      >
        <svg width="28" height="28" viewBox="0 0 85 85">
          <path
            fill="var(--icon)"
            fillRule="evenodd"
            d="M42.5 27.0L37.8 28.0L35.0 29.5L32.5 31.8L30.0 35.8L29.2 38.2L29.0 41.5L30.0 46.0L31.2 48.5L33.8 51.2L37.8 53.8L43.2 54.8L48.0 53.8L50.5 52.5L53.2 50.0L55.8 46.0L56.8 40.5L55.8 35.8L54.8 33.8L52.2 30.8L48.0 28.0ZM40.2 2.5L39.5 3.5L39.8 8.5L38.8 10.0L33.2 11.0L28.0 13.2L23.5 16.2L18.2 21.5L14.2 28.0L13.0 31.2L11.8 37.0L10.5 37.8L5.0 37.8L4.5 38.2L4.5 43.5L5.5 44.2L10.5 44.0L12.0 45.0L13.0 50.5L15.2 55.8L17.2 59.0L22.0 64.2L24.8 66.5L30.0 69.5L33.2 70.8L39.0 72.0L39.8 73.2L39.8 78.8L40.2 79.2L45.5 79.2L46.0 78.8L46.0 73.2L46.8 72.0L52.5 70.8L57.8 68.5L61.0 66.5L66.0 62.0L68.5 59.0L71.5 53.8L73.2 48.5L73.8 45.0L75.5 44.0L80.2 44.2L81.2 43.5L81.2 38.2L80.8 37.8L75.0 37.8L73.8 36.8L72.8 31.2L70.8 26.5L67.5 21.5L62.2 16.2L55.8 12.2L54.2 12.0L52.5 11.0L47.0 10.0L46.0 8.8L46.0 3.0L45.5 2.5ZM42.0 16.2L48.5 16.8L49.8 17.5L51.8 17.8L57.2 20.8L63.0 26.5L66.0 32.0L66.2 34.0L67.0 35.5L67.5 40.0L67.0 46.2L66.2 47.8L66.0 49.8L63.0 55.2L57.2 61.0L51.8 64.0L48.5 65.0L43.8 65.5L37.2 65.0L34.0 64.0L30.0 62.0L27.0 59.8L22.8 55.2L19.8 49.8L18.8 46.5L18.2 42.0L18.8 35.2L19.8 32.0L21.8 28.0L24.2 24.8L28.5 20.8L34.0 17.8L36.0 17.5L37.5 16.8Z"
          />
        </svg>
      </button>
    </>
  )
}
