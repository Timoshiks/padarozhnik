import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import MapCanvas from '@/components/map/MapCanvas'
import TopBar from '@/components/map/TopBar'
import MapControls from '@/components/map/MapControls'
import TourismControls from '@/components/map/TourismControls'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import LocationListSheet from '@/components/sheets/LocationListSheet'
import PlaceCardSheet from '@/components/sheets/PlaceCardSheet'
import RouteFinalSheet from '@/components/sheets/RouteFinalSheet'
import FilterSheet from '@/components/sheets/FilterSheet'
import AiWidget from '@/components/ai-widget/AiWidget'
import ProfileModal from '@/components/profile/ProfileModal'

/**
 * App.tsx — корневая оболочка SPA «Падарожнiк»
 *
 * Шаг 8 (plan.md): добавлен <MapCanvas /> — базовый тайловый слой Leaflet.
 * Карта рендерится всегда; оверлей загрузки лежит поверх неё пока данные не пришли.
 *
 * Слои (z-index, DESIGN.md §4.1):
 *   0  — MapCanvas (карта, тайлы, кластеры, маршрут)
 *   20 — TopBar (поиск + тумблер, Шаг 10)
 *   35 — AiWidget (Шаг 18)
 *   40 — BottomNavigation (Шаг 13)
 *   50 — ProfileModal (Шаг 21)
 */
export default function App() {
  const { loadData, isLoading, loadError, sights, stations, sheetState, isAiWidgetOpen } = useAppStore()

  useEffect(() => {
    void loadData()
  }, [loadData])

  const isReady = sights.length > 0 && stations.length > 0

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: '430px',
        height: '100dvh',
        overflow: 'hidden',
        margin: '0 auto',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* z-index 0: базовая интерактивная карта с тайлами */}
      <MapCanvas />

      {/* z-index 20: поиск + фільтр */}
      <TopBar />

      {/* z-index 20: асобны кружочак для турызму і іконка квэстаў */}
      <TourismControls />

      {/* z-index 20: кнопки +/−/геолокация */}
      <MapControls />

      {/* z-index 35: ИИ-виджет (показывается при isTourismMode) */}
      <AiWidget />

      {/* z-index 40: нижнее меню навигации */}
      <BottomNavigation />

      {/* Шторка фильтрации АЗС */}
      <FilterSheet />

      {/* z-index 30: шторка списка мест (sheetState === 'list' && !isAiWidgetOpen) */}
      {sheetState === 'list' && !isAiWidgetOpen && <LocationListSheet />}

      {/* z-index 30: детальная карточка места (sheetState === 'card') */}
      {sheetState === 'card' && <PlaceCardSheet />}

      {/* z-index 30: финальная шторка маршрута (sheetState === 'route-final') */}
      {sheetState === 'route-final' && <RouteFinalSheet />}

      {/* Оверлей загрузки поверх карты — исчезает когда данные готовы */}
      {!isReady && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          {loadError ? (
            <span
              className="body-md"
              style={{ color: 'var(--color-danger)', textAlign: 'center', padding: '0 32px' }}
            >
              {loadError}
            </span>
          ) : isLoading ? (
            <span className="body-md" style={{ color: 'var(--text-secondary)' }}>
              Карта загружается…
            </span>
          ) : null}
        </div>
      )}

      {/* z-index 50: профіль з ачыўкамі */}
      <ProfileModal />
    </div>
  )
}
