# Падарожнiк — Прототип сервиса автотуризма «Белоруснефть»

Интерактивный веб-прототип сервиса автотуризма. Карта достопримечательностей + конструктор маршрутов с ИИ-ассистентом + система бонусов за чекины.

## Быстрый старт

### 1. Требования
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`

### 2. Клонировать и установить
```bash
git clone https://github.com/Timoshiks/padarozhnik.git
cd padarozhnik
pnpm install
```

### 3. Добавить данные (JSON-файлы)
Получи у Тимоши файлы и положи их в папку `public/`:
- `public/sights_parsed.json`
- `public/stations_parsed.json`

### 4. Запустить
```bash
pnpm dev
```

Открой в браузере: **http://localhost:5173**

---

## Стек
- **React 19** + **TypeScript** (strict)
- **Vite** — сборщик
- **Leaflet** — интерактивная карта
- **Zustand** — управление состоянием
- **Tailwind CSS** + кастомные CSS-токены
- **vaul** — нижние шторки (Bottom Sheets)

## Команды
```bash
pnpm dev      # Запуск dev-сервера
pnpm build    # Production-сборка
pnpm test     # Unit-тесты (vitest)
pnpm lint     # Линтер
```
