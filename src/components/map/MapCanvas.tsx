/**
 * src/components/map/MapCanvas.tsx — Leaflet-карта (базовый слой)
 *
 * Шаг 8 (plan.md): инициализация Leaflet + CartoDB Positron тайлы.
 * Шаг 9 (plan.md): MarkerClusterGroup для 732 АЗС (графитовые кластеры 48/56px).
 *
 * mapRef экспортируется для использования в:
 *   - MapControls (Шаг 12): zoomIn/zoomOut/flyTo
 *   - MapCanvas же (Шаги 11, 19): кластеры POI, маршрут
 */

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import '@/styles/map.css'
import { useAppStore } from '@/store/useAppStore'

// ─── Константы карты ──────────────────────────────────────────────────────────

/** Центр Беларуси */
const BELARUS_CENTER: L.LatLngTuple = [53.685937, 27.93035]
const INITIAL_ZOOM = 7

/**
 * OpenStreetMap тайлы со стилизацией под Positron (без API-ключей)
 */
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

// ─── Экспортируемый ref на экземпляр карты ────────────────────────────────────
// Используется компонентами MapControls (Шаг 12) и расширениями MapCanvas

export const mapRef: { current: L.Map | null } = { current: null }

// ─── Иконка одиночного маркера АЗС (при зуме ≥ 14) ──────────────────────────

const stationIcon = L.divIcon({
  html: '<div class="single-station-pin"></div>',
  className: '',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
})

// ─── Иконка одиночного маркера достопримечательности (при зуме ≥ 14) ─────────

const sightIcon = L.divIcon({
  html: '<div class="single-sight-pin"></div>',
  className: '',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
})

// ─── Фабрика иконок кластера АЗС ──────────────────────────────────────────────

function createStationClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const count = cluster.getChildCount()
  const isLarge = count >= 50
  const size = isLarge ? 56 : 48

  // Форматируем метку по порогам DESIGN.md §5.1: 10+/20+/50+/100+
  const label =
    count >= 100 ? '100+' :
    count >= 50  ? '50+'  :
    count >= 20  ? '20+'  :
    count >= 10  ? '10+'  :
    String(count)

  return L.divIcon({
    html: `<div class="station-cluster-badge${isLarge ? ' station-cluster-badge--lg' : ''}">${label}</div>`,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// ─── Фабрика иконок кластера достопримечательностей ───────────────────────────

function createSightClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const count = cluster.getChildCount()
  const isLarge = count >= 50
  const size = isLarge ? 56 : 48

  const label =
    count >= 100 ? '100+' :
    count >= 50  ? '50+'  :
    count >= 20  ? '20+'  :
    count >= 10  ? '10+'  :
    String(count)

  return L.divIcon({
    html: `<div class="sight-cluster-badge${isLarge ? ' sight-cluster-badge--lg' : ''}">${label}</div>`,
    className: '',
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// ─── Компонент ────────────────────────────────────────────────────────────────

export default function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stations           = useAppStore((s) => s.stations)
  const sights             = useAppStore((s) => s.sights)
  const isTourismMode      = useAppStore((s) => s.isTourismMode)
  const routePolylinePoints = useAppStore((s) => s.routePolylinePoints)
  const activeRoute        = useAppStore((s) => s.activeRoute)
  const mapTarget          = useAppStore((s) => s.mapTarget)
  const selectedFuel       = useAppStore((s) => s.selectedFuel)
  // ref на sight-кластер для добавления/удаления при переключении режима
  const sightClusterRef = useRef<L.MarkerClusterGroup | null>(null)
  // ref на слой маршрута
  const routeLayerRef = useRef<L.LayerGroup | null>(null)

  // ─── Шаг 8: инициализация карты ─────────────────────────────────────────────

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: BELARUS_CENTER,
      zoom: INITIAL_ZOOM,
      // Кастомные контролы зума подключаются в Шаге 12
      zoomControl: false,
      // Attribution скрыт (офлайн-демо без внешних требований)
      attributionControl: false,
    })

    L.tileLayer(TILE_URL, {
      maxZoom: 19,
      className: 'map-tiles-light',
    }).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // ─── Шаг 9: кластеры АЗС ────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapRef.current || stations.length === 0) return

    const map = mapRef.current

    const stationCluster = L.markerClusterGroup({
      // Радиус объединения в кластер (px)
      maxClusterRadius: 60,
      // Индивидуальные маркеры при зуме ≥ 14
      disableClusteringAtZoom: 14,
      // Без паутины при клике на плотный кластер
      spiderfyOnMaxZoom: false,
      // Без подсветки полигона кластера при наведении
      showCoverageOnHover: false,
      // Кастомная иконка — зелёный бейдж Белоруснефть
      iconCreateFunction: createStationClusterIcon,
    })

    const filtered = selectedFuel
      ? stations.filter((s) => s.fuels && s.fuels.toLowerCase().includes(selectedFuel.toLowerCase()))
      : stations

    filtered.forEach((station) => {
      L.marker([station.lat, station.lng], { icon: stationIcon }).addTo(stationCluster)
    })

    map.addLayer(stationCluster)

    return () => {
      map.removeLayer(stationCluster)
    }
  }, [stations, selectedFuel])

  // ─── Шаг 11: sight-кластеры — строим один раз, показываем/скрываем по режиму

  useEffect(() => {
    if (!mapRef.current || sights.length === 0) return

    const map = mapRef.current

    // Строим кластер только один раз (sights не меняется после загрузки)
    if (!sightClusterRef.current) {
      const sightCluster = L.markerClusterGroup({
        maxClusterRadius: 65,
        disableClusteringAtZoom: 17,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: createSightClusterIcon,
      })

      sights.forEach((sight) => {
        L.marker([sight.lat, sight.lng], { icon: sightIcon }).addTo(sightCluster)
      })

      sightClusterRef.current = sightCluster
    }

    if (isTourismMode) {
      map.addLayer(sightClusterRef.current)
    } else {
      map.removeLayer(sightClusterRef.current)
    }

    return () => {
      if (sightClusterRef.current) {
        map.removeLayer(sightClusterRef.current)
      }
    }
  }, [sights, isTourismMode])

  // ─── Шаг 19: маршрутный слой — полилиния + маркеры остановок ────────────────

  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current

    // Инициализируем слой один раз
    if (!routeLayerRef.current) {
      routeLayerRef.current = L.layerGroup().addTo(map)
    }
    const layer = routeLayerRef.current
    layer.clearLayers()

    if (routePolylinePoints.length < 2) return

    // Полилиния маршрута — акцентный цвет, weight 6
    const poly = L.polyline(routePolylinePoints, {
      color: '#009A49',
      weight: 6,
      lineCap: 'round',
      lineJoin: 'round',
      opacity: 0.92,
    }).addTo(layer)

    // CSS-анимация stroke-dashoffset через прямой доступ к SVG path
    requestAnimationFrame(() => {
      const pathEl = (poly as unknown as { _path?: SVGPathElement })._path
      if (pathEl) pathEl.classList.add('route-line-animated')
    })

    // Маркеры остановок
    activeRoute.forEach((stop) => {
      const isStation = stop.kind === 'station'
      const html = isStation
        ? `<div class="pit-stop-pin">⛽</div>`
        : `<div class="route-stop-pin">${stop.index}</div>`

      const size: [number, number] = isStation ? [24, 24] : [28, 28]

      const icon = L.divIcon({
        html,
        className: '',
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1] / 2],
      })

      L.marker([stop.lat, stop.lng], { icon }).addTo(layer)
    })
  }, [routePolylinePoints, activeRoute])

  // ─── Шаг 19: flyTo при изменении mapTarget ────────────────────────────────────

  useEffect(() => {
    if (!mapRef.current || !mapTarget) return
    mapRef.current.flyTo(mapTarget, 9, { duration: 1.4 })
  }, [mapTarget])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        // z-index 0: карта — самый нижний слой (DESIGN.md §4.1)
        zIndex: 0,
        backgroundColor: 'var(--bg-canvas)',
      }}
    />
  )
}
