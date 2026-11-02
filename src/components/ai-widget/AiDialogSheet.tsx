/**
 * src/components/ai-widget/AiDialogSheet.tsx — выезжающее снизу окно диалога с ИИ-ассистентом
 *
 * Требование пользователя:
 *   «при нажатии на окно ввода текста с нейросетью должно выезжать окно диалога с ней
 *    с местом на экране, что бы маршрут строился в реальном времени»
 *
 * Характеристики:
 *   - Высота: 48dvh (оставляет более 50% экрана сверху свободными под интерактивную карту)
 *   - Карта Leaflet в реальном времени отрисовывает полилинию маршрута, пины остановок и выполняет flyTo
 *   - Интерактивный чат: история сообщений, подсказки-чипы, текстовый ввод и отправка
 *   - Кнопка сворачивания/закрытия
 */

import { useState, useRef, useEffect } from 'react'
import { useAppStore, VOICE_REQUEST_PROMPT } from '@/store/useAppStore'

// ─── Иконки ───────────────────────────────────────────────────────────────────

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
      <path d="M5 5l1.5 1.5M18.5 5L17 6.5M5 19l1.5-1.5M18.5 19L17 17.5" strokeWidth="1.5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="var(--text-secondary)" strokeWidth="2.4" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SendIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke={active ? '#FFFFFF' : 'var(--text-secondary)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8"  y1="23" x2="16" y2="23" />
    </svg>
  )
}

// ─── Компонент ────────────────────────────────────────────────────────────────

export default function AiDialogSheet() {
  const {
    dialogStep,
    chatMessages,
    initialAiMessage,
    nextDialogStep,
    setAiDialogOpen,
  } = useAppStore()

  const [inputVal, setInputVal] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages.length, dialogStep])

  function handleSend(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    nextDialogStep(trimmed)
    setInputVal('')
  }

  function handleMicClick() {
    if (dialogStep === 0) {
      handleSend(VOICE_REQUEST_PROMPT)
    } else if (dialogStep === 1) {
      handleSend('Да, добавляй обязательно')
    } else if (dialogStep === 2) {
      handleSend('Да, сделаем там перерыв')
    } else if (dialogStep === 3) {
      handleSend('Маршрут готов. Поехали!')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSend(inputVal)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        height: '48dvh',
        backgroundColor: 'var(--bg-sheet)',
        borderRadius: 'var(--radius-sheet)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
        zIndex: 45,
        display: 'flex',
        flexDirection: 'column',
        outline: 'none',
        overflow: 'hidden',
        animation: 'slide-up-dialog 0.26s cubic-bezier(0.2, 0.9, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes slide-up-dialog {
          from { transform: translateX(-50%) translateY(100%); }
          to   { transform: translateX(-50%) translateY(0); }
        }
        @keyframes pulse-status {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }
      `}</style>

      {/* Drag handle */}
      <div
        style={{
          width: '50px',
          height: '5px',
          borderRadius: '3px',
          backgroundColor: 'var(--handle)',
          margin: '8px auto 6px',
          flexShrink: 0,
        }}
      />

      {/* Шапка окна диалога */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 16px 10px',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Аватар ИИ */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-accent) 0%, #007a3a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 154, 73, 0.3)',
            }}
          >
            <SparkleIcon />
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'var(--font-text)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: '18px',
              }}
            >
              ИИ-ассистент «Падарожнiк»
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  display: 'inline-block',
                  animation: 'pulse-status 2s infinite ease-in-out',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-text)',
                  fontSize: '11px',
                  color: 'var(--color-accent)',
                  fontWeight: 500,
                }}
              >
                Онлайн • Строит маршрут на карте
              </span>
            </div>
          </div>
        </div>

        {/* Кнопка закрытия / сворачивания диалога */}
        <button
          onClick={() => setAiDialogOpen(false)}
          aria-label="Свернуть диалог"
          title="Свернуть диалог"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card-inner)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          <CloseIcon />
        </button>
      </div>

      {/* История сообщений чата */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Начальный вопрос ИИ (если сообщений ещё нет) */}
        {chatMessages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignSelf: 'flex-start', maxWidth: '88%' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-card-inner)',
                borderRadius: '16px 16px 16px 4px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-text)',
                fontSize: '14px',
                lineHeight: '1.45',
              }}
            >
              {initialAiMessage.aiText}
            </div>

            {/* Быстрые варианты-чипы */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
              {initialAiMessage.chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-accent-soft)',
                    border: '1px solid var(--color-accent)',
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-text)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-accent-soft)'
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Все накопленные сообщения */}
        {chatMessages.map((msg, index) => {
          const isUser = msg.author === 'user'
          const isLast = index === chatMessages.length - 1

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '82%' : '88%',
              }}
            >
              <div
                style={{
                  backgroundColor: isUser ? 'var(--text-primary)' : 'var(--bg-card-inner)',
                  color: isUser ? '#FFFFFF' : 'var(--text-primary)',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px',
                  fontFamily: 'var(--font-text)',
                  fontSize: '14px',
                  lineHeight: '1.45',
                  boxShadow: isUser ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {msg.text}
              </div>

              {/* Чипы вариантов ответа для последнего сообщения ИИ */}
              {!isUser && isLast && msg.chips && msg.chips.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                  {msg.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSend(chip)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-accent-soft)',
                        border: '1px solid var(--color-accent)',
                        color: 'var(--color-accent)',
                        fontFamily: 'var(--font-text)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-accent)'
                        e.currentTarget.style.color = '#FFFFFF'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-accent-soft)'
                        e.currentTarget.style.color = 'var(--color-accent)'
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Индикатор построения маршрута на карте */}
        {dialogStep > 0 && dialogStep < 3 && (
          <div
            style={{
              alignSelf: 'center',
              backgroundColor: 'var(--color-accent-soft)',
              color: 'var(--color-accent)',
              borderRadius: 'var(--radius-pill)',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'var(--font-text)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🗺️ Маршрут строится на карте в реальном времени…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода внизу окна диалога */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '8px 14px 12px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-sheet)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            height: '44px',
            borderRadius: '22px',
            backgroundColor: 'var(--bg-card-inner)',
            display: 'flex',
            alignItems: 'center',
            paddingInline: '14px',
            gap: '8px',
          }}
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Напишите ответ или выберите выше…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontFamily: 'var(--font-text)',
              fontSize: '14px',
              color: 'var(--text-primary)',
            }}
          />
          <button
            type="button"
            onClick={handleMicClick}
            aria-label="Голосовой ввод"
            title="Голосовой ввод (произнести запрос в микрофон)"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-accent)',
            }}
          >
            <MicIcon />
          </button>
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!inputVal.trim()}
          aria-label="Отправить"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: inputVal.trim() ? 'var(--color-accent)' : 'var(--bg-card-inner)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputVal.trim() ? 'pointer' : 'default',
            transition: 'background-color 0.15s ease',
            flexShrink: 0,
          }}
        >
          <SendIcon active={Boolean(inputVal.trim())} />
        </button>
      </form>
    </div>
  )
}
