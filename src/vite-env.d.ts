/// <reference types="vite/client" />

// Объявление типов для CSS-модулей и статичных CSS-импортов
declare module '*.css' {
  const content: Record<string, string>
  export default content
}
