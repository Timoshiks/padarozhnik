/**
 * src/store/useAppStore.ts — Zustand-стор «Падарожнiк»
 *
 * Шаг 6:  режим Туризм, данные, шторка.
 * Шаг 15: checkedInIds, userPoints, checkIn().
 * Шаг 17: диалог ИИ, маршрут, профиль, ачивки.
 */

import { create } from 'zustand'
import type { SightPoint, StationPoint, SheetState, ChatMessage, RouteStop, Achievement } from '@/types'
import { DEMO_ROUTE_STOPS, ROUTE_POLYLINE_POINTS } from '@/data/routeData'
import { INITIAL_ACHIEVEMENTS } from '@/data/achievementsData'

// ─── Вспомогательные типы ─────────────────────────────────────────────────────

export type SelectedObject = SightPoint | StationPoint | null

// ─── Сценарий диалога ИИ (Гомель → Минск по М-5) ─────────────────────────────

export const VOICE_REQUEST_PROMPT =
  'Падарожнiк, хотим на выходные выбраться семьей из Гомеля в сторону Минска по М-5. Подбери интересный маршрут с историей часа на три-четыре в дороге.'

interface DialogScript {
  aiText: string
  chips: string[]
}

const DIALOG_SCRIPT: DialogScript[] = [
  // 0: До отправки запроса
  {
    aiText: 'Добрый день! Готов подобрать идеальный маршрут. Скажите в микрофон или выберите сценарий поездки:',
    chips: [
      VOICE_REQUEST_PROMPT,
      'Гомель → Минск по М-5',
    ],
  },
  // 1: Шаг 2 ТЗ (Ответ ассистента и первая отрисовка нитки)
  {
    aiText:
      'Отличный выбор для поездки. Построил базовый трек по трассе М-5 через Бобруйск.\n\nРядом со Светлогорском находится знаковый мемориал операции "Багратион". Заедем на 20 минут почтить историю? Это добавит всего 8 километров к пути.',
    chips: ['Да, добавляй обязательно', 'Поехать прямо по М-5'],
  },
  // 2: Шаг 4 ТЗ (Умная подсказка АЗС)
  {
    aiText:
      'Мемориал в маршруте. Впереди отрезок трассы в 130 километров без остановок.\n\nНа 142-м километре расположена АЗК №20 "Белоруснефть" с кафе Drive&Point. Добавить ее для кофе-паузы и отдыха?',
    chips: ['Да, сделаем там перерыв', 'Проехать без остановок'],
  },
  // 3: Шаг 5 ТЗ (Согласие и геймификация)
  {
    aiText:
      'АЗК №20 добавлена. Напоминаю: если отметитесь на "Багратионе" и в Бобруйской крепости, на этой станции вас ждет кофе за 1 копейку по программе лояльности.',
    chips: ['Маршрут готов. Поехали!', 'Посмотреть детали'],
  },
  // 4: Шаг 6 ТЗ (Финал и экспорт)
  {
    aiText:
      'Маршрут сформирован: 312 км, 3 остановки, 2 потенциальных бонуса. Переношу трек в навигатор?',
    chips: ['В навигатор! ➔', 'Поделиться'],
  },
]

function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

// ─── Форма стора ──────────────────────────────────────────────────────────────

interface AppState {
  // — Режим Туризм —
  isTourismMode: boolean
  toggleTourismMode: () => void

  // — Данные —
  sights: SightPoint[]
  stations: StationPoint[]
  isLoading: boolean
  loadError: string | null
  loadData: () => Promise<void>

  // — Шторки и выбор объекта —
  sheetState: SheetState
  selectedObject: SelectedObject
  setSheetState: (state: SheetState) => void
  setSelectedObject: (obj: SelectedObject) => void

  // — Чекины и баллы —
  checkedInIds: string[]
  userPoints: number
  checkIn: (id: string, bonus: number) => void

  // — ИИ-диалог —
  /** Текущий шаг диалога (0 = начальный вопрос не задан, 1-4 = активные шаги) */
  dialogStep: number
  /** Накопленные сообщения чата */
  chatMessages: ChatMessage[]
  /** Виджет ИИ открыт */
  isAiWidgetOpen: boolean
  /** Развернуто ли окно диалога с ИИ (на 48dvh с видимой картой) */
  isAiDialogOpen: boolean
  /** Начальный вопрос ИИ (из DIALOG_SCRIPT[0]) */
  initialAiMessage: DialogScript
  /** Перейти к следующему шагу диалога (chip text = ответ пользователя) */
  nextDialogStep: (userText: string) => void
  /** Открыть/закрыть виджет */
  setAiWidgetOpen: (open: boolean) => void
  /** Открыть/закрыть выезжающее окно диалога */
  setAiDialogOpen: (open: boolean) => void

  // — Маршрут —
  /** Активные остановки маршрута */
  activeRoute: RouteStop[]
  /** Точки полилинии, добавляемые пошагово */
  routePolylinePoints: [number, number][]
  /** Индекс текущей отрисованной части маршрута (0 = нет маршрута) */
  routeProgressIndex: number
  /** Целевые координаты для flyTo карты */
  mapTarget: [number, number] | null

  // — Профиль —
  isProfileOpen: boolean
  setProfileOpen: (open: boolean) => void
  achievements: Achievement[]

  // — Фільтр АЗС —
  isFilterOpen: boolean
  setFilterOpen: (open: boolean) => void
  selectedFuel: string | null
  setSelectedFuel: (fuel: string | null) => void
}

// ─── Реализация ───────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  // — Режим Туризм —
  isTourismMode: false,
  toggleTourismMode: () =>
    set((state) => ({
      isTourismMode: !state.isTourismMode,
      sheetState: !state.isTourismMode ? 'list' : 'closed',
      selectedObject: null,
      isAiWidgetOpen: !state.isTourismMode,
      isAiDialogOpen: false,
    })),

  // — Данные —
  sights: [],
  stations: [],
  isLoading: false,
  loadError: null,

  loadData: async () => {
    if (get().sights.length > 0 && get().stations.length > 0) return
    set({ isLoading: true, loadError: null })
    try {
      const [sightsRes, stationsRes] = await Promise.all([
        fetch('/sights_parsed.json'),
        fetch('/stations_parsed.json'),
      ])
      if (!sightsRes.ok) throw new Error(`sights fetch: ${sightsRes.status}`)
      if (!stationsRes.ok) throw new Error(`stations fetch: ${stationsRes.status}`)
      const [sights, stations] = await Promise.all([
        sightsRes.json() as Promise<SightPoint[]>,
        stationsRes.json() as Promise<StationPoint[]>,
      ])
      set({ sights, stations, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка загрузки данных'
      set({ isLoading: false, loadError: message })
    }
  },

  // — Шторки и выбор объекта —
  sheetState: 'closed',
  selectedObject: null,
  setSheetState: (state) => set({ sheetState: state }),
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  // — Чекины и баллы —
  checkedInIds: [],
  userPoints: 0,
  checkIn: (id, bonus) =>
    set((state) => {
      if (state.checkedInIds.includes(id)) return {}
      const newIds = [...state.checkedInIds, id]
      const newPoints = state.userPoints + bonus
      // Обновляем ачивки по количеству чекинов
      const achievements = state.achievements.map((a) => {
        if (a.unlocked) return a
        if (a.id === 'first-step' && newIds.length >= 1) return { ...a, unlocked: true }
        if (a.id === 'explorer'   && newIds.length >= 5) return { ...a, unlocked: true }
        if (a.id === 'collector'  && newIds.length >= 10) return { ...a, unlocked: true }
        return a
      })
      return { checkedInIds: newIds, userPoints: newPoints, achievements }
    }),

  // — ИИ-диалог —
  dialogStep: 0,
  chatMessages: [],
  isAiWidgetOpen: false,
  isAiDialogOpen: false,
  initialAiMessage: DIALOG_SCRIPT[0],

  setAiWidgetOpen: (open) => set({ isAiWidgetOpen: open }),
  setAiDialogOpen: (open) => set({ isAiDialogOpen: open }),

  nextDialogStep: (userText) => {
    const state = get()
    const step = state.dialogStep

    // Добавляем сообщение пользователя
    const userMsg: ChatMessage = {
      id: makeId(),
      author: 'user',
      text: userText,
      timestamp: Date.now(),
    }

    const newMessages = [...state.chatMessages, userMsg]

    if (step >= 4) return // диалог уже завершён

    const nextStep = step + 1
    const script = DIALOG_SCRIPT[nextStep]

    // AI-ответ следующего шага
    const aiMsg: ChatMessage = {
      id: makeId(),
      author: 'ai',
      text: script.aiText,
      chips: script.chips,
      timestamp: Date.now() + 1,
    }

    const allMessages = [...newMessages, aiMsg]

    // На шаге 4 (финал) — полный маршрут и открываем финальную шторку
    if (nextStep === 4) {
      set({
        dialogStep: nextStep,
        chatMessages: allMessages,
        activeRoute: DEMO_ROUTE_STOPS,
        routePolylinePoints: ROUTE_POLYLINE_POINTS,
        routeProgressIndex: ROUTE_POLYLINE_POINTS.length,
        mapTarget: [53.9045, 27.5615], // flyTo Минск
        sheetState: 'route-final',
        isAiDialogOpen: false,
        // Разблокируем ачивку маршрута
        achievements: get().achievements.map((a) =>
          a.id === 'route-master' ? { ...a, unlocked: true } : a
        ),
      })
      return
    }

    // Пошаговая отрисовка трека и фокусировка камеры по шагам сценария:
    // Шаг 1: старт из Гомеля (points 0..6), камера на Гомель
    // Шаг 2: петля мемориала «Багратион» (points 0..9) + АЗК №20
    // Шаг 3: заезд в Бобруйскую крепость (points 0..12)
    const progressIndex = nextStep === 1 ? 6 : nextStep === 2 ? 9 : nextStep === 3 ? 12 : 0
    const routeTarget =
      nextStep === 1
        ? ([52.4345, 30.9754] as [number, number]) // Гомель
        : nextStep === 2
          ? ([52.7483, 29.8450] as [number, number]) // Мемориал «Багратион»
          : nextStep === 3
            ? ([53.1386, 29.2417] as [number, number]) // Бобруйская крепость
            : null

    const activeStops =
      nextStep === 1
        ? DEMO_ROUTE_STOPS.slice(0, 2) // Гомель + Мемориал
        : nextStep === 2
          ? DEMO_ROUTE_STOPS.slice(0, 3) // + АЗК №20
          : nextStep === 3
            ? DEMO_ROUTE_STOPS.slice(0, 4) // + Бобруйская крепость
            : []

    set({
      dialogStep: nextStep,
      chatMessages: allMessages,
      routeProgressIndex: progressIndex,
      mapTarget: routeTarget,
      activeRoute: activeStops,
      routePolylinePoints: ROUTE_POLYLINE_POINTS.slice(0, progressIndex),
    })
  },

  // — Маршрут —
  activeRoute: [],
  routePolylinePoints: [],
  routeProgressIndex: 0,
  mapTarget: null,

  // — Профиль —
  isProfileOpen: false,
  setProfileOpen: (open) => set({ isProfileOpen: open }),
  achievements: INITIAL_ACHIEVEMENTS,

  // — Фільтр АЗС —
  isFilterOpen: false,
  setFilterOpen: (open) => set({ isFilterOpen: open }),
  selectedFuel: null,
  setSelectedFuel: (fuel) => set({ selectedFuel: fuel }),
}))
