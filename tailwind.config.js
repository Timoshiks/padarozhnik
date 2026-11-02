/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    // Полная перезапись темы — без дефолтных slate/zinc токенов shadcn
    extend: {
      // Цветовые токены из DESIGN.md §3.3 — только через CSS-переменные
      colors: {
        canvas:        'var(--bg-canvas)',
        sheet:         'var(--bg-sheet)',
        container:     'var(--bg-container)',
        'card-inner':  'var(--bg-card-inner)',
        glass:         'var(--bg-glass)',
        primary:       'var(--text-primary)',
        secondary:     'var(--text-secondary)',
        'on-accent':   'var(--text-on-accent)',
        accent:        'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        danger:        'var(--color-danger)',
        'border-subtle': 'var(--border-subtle)',
      },
      // Шрифты из DESIGN.md §2.2 — только Unbounded и Onest, без Inter/Roboto/Arial
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        text:    ['Onest', 'sans-serif'],
      },
      // Кастомные радиусы из DESIGN.md §4.2
      borderRadius: {
        'sheet':     '28px 28px 0 0',
        'container': '24px',
        'tile':      '18px',
        'pill':      '9999px',
      },
      // Высоты snap-points шторок из DESIGN.md §4.3
      height: {
        'sheet-collapsed':     '220px',
        'sheet-half':          '58dvh',
        'sheet-card':          '82dvh',
        'screen-dvh':          '100dvh',
        'topbar':              '52px',
        'map-control-btn':     '48px',
        'nav-bar':             '64px',
        'location-row':        '72px',
        'card-photo':          '220px',
        'bento-tile':          '124px',
        'ai-capsule':          '54px',
        'ai-btn':              '54px',
      },
      width: {
        'map-control-btn':     '48px',
        'topbar-btn':          '52px',
        'ai-btn':              '54px',
        'bento-icon-circle':   '52px',
      },
      // z-index слои
      zIndex: {
        'map':    '0',
        'topbar': '20',
        'ai':     '35',
        'nav':    '40',
        'modal':  '50',
      },
      // Тени
      boxShadow: {
        'cluster':  '0 4px 12px rgba(0,0,0,0.15)',
        'glass':    '0 8px 24px rgba(0,0,0,0.08)',
        'sheet':    '0 -4px 24px rgba(0,0,0,0.08)',
      },
      // Максимальная ширина контейнера — мобильный вьюпорт
      maxWidth: {
        'mobile': '430px',
      },
    },
  },
  plugins: [],
}
