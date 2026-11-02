/**
 * src/components/ai-widget/AiWidget.tsx — капсула ввода + кнопка ИИ
 * При клике на капсулу ввода или кнопку ИИ выезжает AiDialogSheet (48dvh).
 */

import { useAppStore, VOICE_REQUEST_PROMPT } from '@/store/useAppStore'
import AiDialogSheet from '@/components/ai-widget/AiDialogSheet'

// ─── Иконки ───────────────────────────────────────────────────────────────────

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8"  y1="23" x2="16" y2="23" />
    </svg>
  )
}

function SparkleIcon({ active }: { active: boolean }) {
  const color = active ? '#FFFFFF' : 'var(--text-primary)'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
      <path d="M5 5l1.5 1.5M18.5 5L17 6.5M5 19l1.5-1.5M18.5 19L17 17.5" strokeWidth="1.5" />
    </svg>
  )
}

// ─── Компонент ────────────────────────────────────────────────────────────────

export default function AiWidget() {
  const {
    isTourismMode,
    isAiDialogOpen,
    setAiDialogOpen,
    dialogStep,
    sheetState,
    nextDialogStep,
  } = useAppStore()

  function handleVoiceClick(e: React.MouseEvent) {
    e.stopPropagation()
    setAiDialogOpen(true)
    if (dialogStep === 0) {
      nextDialogStep(VOICE_REQUEST_PROMPT)
    }
  }

  // Виджет показывается только в режиме Туризм и не перекрывает шторки карточки или финала
  if (
    !isTourismMode ||
    sheetState === 'card' ||
    sheetState === 'route-final'
  ) {
    return null
  }

  // Если окно диалога открыто — рендерим выезжающий диалог на 48dvh
  if (isAiDialogOpen) {
    return <AiDialogSheet />
  }

  const isActive = dialogStep > 0

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '76px', // 64px меню + 12px отступ
        left: '16px',
        right: '16px',
        zIndex: 35,
      }}
    >
      {/* Нижний ряд: капсула ввода + кнопка ИИ */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

        {/* Капсула ввода — клик открывает выезжающее окно диалога */}
        <div
          onClick={() => setAiDialogOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="Открыть диалог с нейросетью"
          style={{
            flex: 1,
            height: '48px',
            borderRadius: '24px',
            backgroundColor: 'var(--card)',
            border: 'none',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            paddingInline: '16px',
            gap: '10px',
            cursor: 'pointer',
            transition: 'transform 0.12s ease, box-shadow 0.12s ease',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.99)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <SparkleIcon active={false} />
          <span
            style={{
              flex: 1,
              fontFamily: 'var(--font-text)',
              fontSize: '14px',
              color: 'var(--muted)',
              userSelect: 'none',
            }}
          >
            Напишите или проговорите…
          </span>
          <button
            type="button"
            onClick={handleVoiceClick}
            aria-label="Сказать в микрофон"
            title="Голосовой запрос: «Падарожнiк, хотим на выходные...»"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <MicIcon />
          </button>
        </div>

        {/* Кнопка ИИ — круглая 50×50px со стилем FAB */}
        <button
          onClick={() => setAiDialogOpen(true)}
          aria-label="ИИ-ассистент"
          title="Открыть диалог с ИИ"
          style={{
            flexShrink: 0,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isActive ? 'var(--color-accent)' : 'var(--card)',
            boxShadow: isActive
              ? '0 0 0 3px var(--color-accent-soft), var(--shadow)'
              : 'var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <SparkleIcon active={isActive} />
        </button>
      </div>
    </div>
  )
}
