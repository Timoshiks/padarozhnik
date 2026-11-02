/**
 * src/types/index.ts — Все интерфейсы данных «Падарожнiк»
 *
 * Структура полей 1:1 с public/sights_parsed.json и public/stations_parsed.json.
 * Только типы — без логики и компонентов (Шаг 5, plan.md).
 */

// ─── Данные из public/sights_parsed.json (6993 точки) ─────────────────────────

/** Туристическая достопримечательность */
export interface SightPoint {
  /** Уникальный идентификатор (Wikidata QID, напр. "Q99494963") */
  id: string
  /** Название объекта */
  name: string
  /** Категория объекта (напр. "Памятники истории и культуры") */
  category: string
  /** Широта */
  lat: number
  /** Долгота */
  lng: number
  /** Регион Беларуси */
  region: string
  /** Описание объекта (может быть пустой строкой "") */
  desc: string
  /** URL изображения из Wikimedia Commons (может быть пустой строкой "") */
  image_url: string
  /** URL статьи Wikipedia (может быть пустой строкой "") */
  wikipedia_url: string
  /** Бонусные баллы за чекин */
  bonus: number
}

// ─── Данные из public/stations_parsed.json (732 точки) ────────────────────────

/** АЗС Белоруснефть */
export interface StationPoint {
  /** Уникальный идентификатор (напр. "station_25387724") */
  id: string
  /** Название АЗС */
  name: string
  /** Номер АЗС */
  station_number: string
  /** Категория (напр. "АЗС / АЗС на базе ТЦ") */
  category: string
  /** Широта */
  lat: number
  /** Долгота */
  lng: number
  /** Город */
  city: string
  /** Полный адрес */
  address: string
  /** Виды топлива через запятую (напр. "octane_92, octane_95, diesel"), может быть "" */
  fuels: string
  /** Оператор / юридическое лицо */
  operator: string
  /** Наличие электрозарядки */
  is_electric: boolean
}

// ─── Маршрут ──────────────────────────────────────────────────────────────────

/** Тип остановки на маршруте */
export type RouteStopKind = 'sight' | 'station' | 'start' | 'finish'

/** Остановка на маршруте (пит-стоп или достопримечательность) */
export interface RouteStop {
  /** Порядковый номер остановки (1-based) */
  index: number
  /** Вид остановки */
  kind: RouteStopKind
  /** Название */
  name: string
  /** Широта */
  lat: number
  /** Долгота */
  lng: number
  /** Описание для карточки пит-стопа */
  description?: string
  /** Связанный объект достопримечательности (если kind === 'sight') */
  sightId?: string
  /** Связанная АЗС (если kind === 'station') */
  stationId?: string
}

// ─── ИИ-диалог ────────────────────────────────────────────────────────────────

/** Автор сообщения в чате */
export type ChatAuthor = 'ai' | 'user'

/** Сообщение в диалоге с ИИ-ассистентом */
export interface ChatMessage {
  /** Уникальный идентификатор сообщения */
  id: string
  /** Автор */
  author: ChatAuthor
  /** Текст сообщения */
  text: string
  /** Быстрые ответы-чипы (только у ai-сообщений) */
  chips?: string[]
  /** Временна́я метка */
  timestamp: number
}

// ─── Ачивки (профиль) ─────────────────────────────────────────────────────────

/** Уровень прогресса ачивки */
export type AchievementTier = 'bronze' | 'silver' | 'gold'

/** Ачивка пользователя */
export interface Achievement {
  /** Уникальный идентификатор */
  id: string
  /** Название ачивки */
  title: string
  /** Краткое описание условия получения */
  description: string
  /** Уровень */
  tier: AchievementTier
  /** Получена ли ачивка */
  unlocked: boolean
  /** Иконка (название из lucide-react) */
  icon: string
}

// ─── Состояния шторок ─────────────────────────────────────────────────────────

/**
 * Состояние активной нижней шторки (Bottom Sheet):
 * - 'closed'       — все шторки скрыты
 * - 'list'         — список локаций (collapsed 220px ↔ half-expanded 58dvh)
 * - 'card'         — детальная карточка места (82dvh)
 * - 'route-final'  — финальная шторка маршрута (82dvh)
 */
export type SheetState = 'closed' | 'list' | 'card' | 'route-final'
