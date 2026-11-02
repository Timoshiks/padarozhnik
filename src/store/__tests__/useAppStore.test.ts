/**
 * src/store/__tests__/useAppStore.test.ts — Unit-тесты Zustand-стора
 *
 * Тестируют:
 *   - toggleTourismMode   (план.md §22)
 *   - checkIn             (идемпотентность, начисление баллов, ачивки)
 *   - nextDialogStep      (4 шага, построение маршрута, sheetState-переходы)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../useAppStore'
import { INITIAL_ACHIEVEMENTS } from '@/data/achievementsData'

// Сбрасываем стор перед каждым тестом
function resetStore() {
  // Глубокое копирование ачивок, чтобы каждый тест получал чистое состояние
  const freshAchievements = INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }))
  useAppStore.setState({
    isTourismMode: false,
    sheetState: 'closed',
    selectedObject: null,
    isAiWidgetOpen: false,
    sights: [],
    stations: [],
    isLoading: false,
    loadError: null,
    checkedInIds: [],
    userPoints: 0,
    dialogStep: 0,
    chatMessages: [],
    activeRoute: [],
    routePolylinePoints: [],
    routeProgressIndex: 0,
    mapTarget: null,
    isProfileOpen: false,
    achievements: freshAchievements,
  })
}

// ─── toggleTourismMode ────────────────────────────────────────────────────────

describe('toggleTourismMode', () => {
  beforeEach(resetStore)

  it('включает режим туризма из OFF', () => {
    const { toggleTourismMode } = useAppStore.getState()
    toggleTourismMode()
    const state = useAppStore.getState()
    expect(state.isTourismMode).toBe(true)
    expect(state.sheetState).toBe('list')
    expect(state.isAiWidgetOpen).toBe(true)
  })

  it('выключает режим туризма из ON', () => {
    useAppStore.setState({ isTourismMode: true, sheetState: 'list', isAiWidgetOpen: true })
    const { toggleTourismMode } = useAppStore.getState()
    toggleTourismMode()
    const state = useAppStore.getState()
    expect(state.isTourismMode).toBe(false)
    expect(state.sheetState).toBe('closed')
    expect(state.isAiWidgetOpen).toBe(false)
  })

  it('дважды переключает — возвращается в исходное состояние', () => {
    const { toggleTourismMode } = useAppStore.getState()
    toggleTourismMode()
    toggleTourismMode()
    expect(useAppStore.getState().isTourismMode).toBe(false)
  })
})

// ─── checkIn ─────────────────────────────────────────────────────────────────

describe('checkIn', () => {
  beforeEach(resetStore)

  it('начисляет баллы при первом чекине', () => {
    const { checkIn } = useAppStore.getState()
    checkIn('place-1', 50)
    const state = useAppStore.getState()
    expect(state.userPoints).toBe(50)
    expect(state.checkedInIds).toContain('place-1')
  })

  it('идемпотентен — повторный чекин не добавляет баллы', () => {
    const { checkIn } = useAppStore.getState()
    checkIn('place-1', 50)
    checkIn('place-1', 50)
    expect(useAppStore.getState().userPoints).toBe(50)
    expect(useAppStore.getState().checkedInIds.filter(id => id === 'place-1').length).toBe(1)
  })

  it('суммирует баллы от разных мест', () => {
    const { checkIn } = useAppStore.getState()
    checkIn('place-1', 50)
    checkIn('place-2', 30)
    checkIn('place-3', 100)
    expect(useAppStore.getState().userPoints).toBe(180)
  })

  it('разблокирует ачивку «first-step» после 1-го чекина', () => {
    const { checkIn } = useAppStore.getState()
    checkIn('place-1', 50)
    const firstStep = useAppStore.getState().achievements.find(a => a.id === 'first-step')
    expect(firstStep?.unlocked).toBe(true)
  })

  it('разблокирует ачивку «explorer» после 5 чекинов', () => {
    const { checkIn } = useAppStore.getState()
    for (let i = 1; i <= 5; i++) {
      checkIn(`place-${i}`, 10)
    }
    const explorer = useAppStore.getState().achievements.find(a => a.id === 'explorer')
    expect(explorer?.unlocked).toBe(true)
  })

  it('НЕ разблокирует «explorer» при 4 чекинах', () => {
    const { checkIn } = useAppStore.getState()
    for (let i = 1; i <= 4; i++) {
      checkIn(`place-${i}`, 10)
    }
    const explorer = useAppStore.getState().achievements.find(a => a.id === 'explorer')
    expect(explorer?.unlocked).toBe(false)
  })
})

// ─── nextDialogStep ───────────────────────────────────────────────────────────

describe('nextDialogStep', () => {
  beforeEach(resetStore)

  it('шаг 1: добавляет сообщения пользователя и ИИ', () => {
    const { nextDialogStep } = useAppStore.getState()
    nextDialogStep('Гомель → Минск по М-5')
    const state = useAppStore.getState()
    expect(state.dialogStep).toBe(1)
    expect(state.chatMessages.length).toBe(2) // user + ai
    expect(state.chatMessages[0].author).toBe('user')
    expect(state.chatMessages[1].author).toBe('ai')
  })

  it('шаг 1: начинает рисовать маршрут (progressIndex=6) и flyTo Гомель', () => {
    const { nextDialogStep } = useAppStore.getState()
    nextDialogStep('Гомель → Минск по М-5')
    const state = useAppStore.getState()
    expect(state.routeProgressIndex).toBe(6)
    expect(state.mapTarget).toEqual([52.4345, 30.9754])
  })

  it('шаг 2: progressIndex=9, flyTo Мемориал Багратион', () => {
    const { nextDialogStep } = useAppStore.getState()
    nextDialogStep('Гомель → Минск по М-5')
    nextDialogStep('Да, добавляй обязательно')
    const state = useAppStore.getState()
    expect(state.dialogStep).toBe(2)
    expect(state.routeProgressIndex).toBe(9)
    expect(state.mapTarget).toEqual([52.7483, 29.8450])
  })

  it('шаг 3: progressIndex=12, flyTo Бобруйская крепость', () => {
    const { nextDialogStep } = useAppStore.getState()
    nextDialogStep('Гомель → Минск по М-5')
    nextDialogStep('Да, добавляй обязательно')
    nextDialogStep('Да, сделаем там перерыв')
    const state = useAppStore.getState()
    expect(state.dialogStep).toBe(3)
    expect(state.routeProgressIndex).toBe(12)
    expect(state.mapTarget).toEqual([53.1386, 29.2417])
  })

  it('шаг 4 (финал): полный маршрут 312 км + sheetState=route-final + flyTo Минск', () => {
    const { nextDialogStep } = useAppStore.getState()
    nextDialogStep('Гомель → Минск по М-5')
    nextDialogStep('Да, добавляй обязательно')
    nextDialogStep('Да, сделаем там перерыв')
    nextDialogStep('Маршрут готов. Поехали!')
    const state = useAppStore.getState()
    expect(state.dialogStep).toBe(4)
    expect(state.sheetState).toBe('route-final')
    expect(state.mapTarget).toEqual([53.9045, 27.5615])
    expect(state.activeRoute.length).toBe(5)
    expect(state.routePolylinePoints.length).toBe(17)
  })

  it('шаг 4: разблокирует ачивку «route-master»', () => {
    const { nextDialogStep } = useAppStore.getState()
    nextDialogStep('Гомель → Минск по М-5')
    nextDialogStep('Да, добавляй обязательно')
    nextDialogStep('Да, сделаем там перерыв')
    nextDialogStep('Маршрут готов. Поехали!')
    const routeMaster = useAppStore.getState().achievements.find(a => a.id === 'route-master')
    expect(routeMaster?.unlocked).toBe(true)
  })

  it('диалог не продвигается за шаг 4', () => {
    const { nextDialogStep } = useAppStore.getState()
    nextDialogStep('Гомель → Минск по М-5')
    nextDialogStep('Да, добавляй обязательно')
    nextDialogStep('Да, сделаем там перерыв')
    nextDialogStep('Маршрут готов. Поехали!')
    const before = useAppStore.getState().dialogStep
    nextDialogStep('extra')
    expect(useAppStore.getState().dialogStep).toBe(before)
  })
})
