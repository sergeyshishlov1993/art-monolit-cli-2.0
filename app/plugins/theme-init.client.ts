export default defineNuxtPlugin((nuxtApp) => {
    const applyThemeClass = (): void => {
        const documentElement = document.documentElement
        const storageKey = 'theme'

        let theme: 'light' | 'dark' = 'dark'

        try {
            const stored = localStorage.getItem(storageKey)
            if (stored === 'light' || stored === 'dark') {
                theme = stored
            } else {
                const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? true
                theme = prefersDark ? 'dark' : 'light'
            }
        } catch {
            theme = 'dark'
        }

        documentElement.classList.remove('theme-light', 'theme-dark')
        documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light')
    }

    nuxtApp.hook('app:created', () => {
        applyThemeClass()
    })
})