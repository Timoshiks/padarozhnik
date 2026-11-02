/**
 * src/data/achievementsData.ts — начальные ачивки пользователя «Падарожнiк»
 *
 * Шаг 16 (plan.md): только данные, без UI и логики стора.
 * Используется в:
 *   - Шаг 17: store achievements[]
 *   - Шаг 21: ProfileModal — карточки ачивок
 */

import type { Achievement } from '@/types'

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'Первый шаг',
    description: 'Отметьтесь в первом месте',
    tier: 'bronze',
    unlocked: false,
    icon: 'MapPin',
  },
  {
    id: 'explorer',
    title: 'Путешественник',
    description: 'Отметьтесь в 5 местах',
    tier: 'silver',
    unlocked: false,
    icon: 'Compass',
  },
  {
    id: 'collector',
    title: 'Коллекционер',
    description: 'Отметьтесь в 10 местах',
    tier: 'gold',
    unlocked: false,
    icon: 'Star',
  },
  {
    id: 'route-master',
    title: 'Знаток Беларуси',
    description: 'Завершите маршрут Речица → Минск',
    tier: 'gold',
    unlocked: false,
    icon: 'Trophy',
  },
]
