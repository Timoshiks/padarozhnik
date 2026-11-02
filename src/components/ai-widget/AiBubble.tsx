/**
 * src/components/ai-widget/AiBubble.tsx — всплывающий вопрос ИИ-ассистента
 *
 * DESIGN.md §5.5:
 *   - margin-bottom: 10px над капсулой ввода
 *   - --radius-container (24px), --bg-glass, backdrop-filter: blur(16px) [поверх карты — разрешено]
 *   - padding: 16px
 *   - Текст вопроса ИИ (body-md) + 2–3 чипа ответа в одну строку
 *
 * Граница: blur разрешён — элемент физически плавает над движущейся картой (DESIGN.md §1).
 */

import { useAppStore } from '@/store/useAppStore'

export default function AiBubble() {
  const { dialogStep, chatMessages, initialAiMessage, nextDialogStep } = useAppStore()

  // Определяем текущее AI-сообщение
  let currentText: string
  let currentChips: string[]

  if (dialogStep === 0) {
    // Начальный вопрос — ещё нет chatMessages
    currentText  = initialAiMessage.aiText
    currentChips = initialAiMessage.chips
  } else {
    // Последнее AI-сообщение из chatMessages
    const lastAi = [...chatMessages].reverse().find((m) => m.author === 'ai')
    currentText  = lastAi?.text  ?? ''
    currentChips = lastAi?.chips ?? []
  }

  if (!currentText) return null

  return (
    <div
      style={{
        marginBottom: '10px',
        borderRadius: 'var(--radius-container)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        padding: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      }}
    >
      {/* Текст ИИ */}
      <p className="body-md" style={{ color: 'var(--text-primary)', marginBottom: currentChips.length ? '12px' : '0' }}>
        {currentText}
      </p>

      {/* Чипы ответов */}
      {currentChips.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {currentChips.map((chip) => (
            <button
              key={chip}
              onClick={() => nextDialogStep(chip)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-sheet)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-text)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-soft)'
                e.currentTarget.style.borderColor = 'var(--color-accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-sheet)'
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
