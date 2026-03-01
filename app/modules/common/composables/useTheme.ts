type Theme = 'dark' | 'light'

const theme = ref<Theme>('dark')

export function useTheme() {
  function setTheme(value: Theme) {
    theme.value = value
    if (import.meta.client) {
      document.documentElement.className = `theme-${value}`
      localStorage.setItem('theme', value)
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme() {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme') as Theme | null
      setTheme(saved ?? 'dark')
    }
  }

  return { theme: readonly(theme), setTheme, toggleTheme, initTheme }
}
