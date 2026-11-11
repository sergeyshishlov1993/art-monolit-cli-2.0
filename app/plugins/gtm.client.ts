const GTM_ID = 'GTM-5NLD2FPG'

export default defineNuxtPlugin(() => {
    const { consent } = useCookieConsent()
    let loaded = false

    function loadGtm(): void {
        if (loaded) return
        loaded = true

        const win = window as unknown as { dataLayer?: unknown[] }
        win.dataLayer = win.dataLayer || []
        win.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

        const script = document.createElement('script')
        script.async = true
        script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
        document.head.appendChild(script)
    }

    watch(consent, (value) => {
        if (value === 'granted') loadGtm()
    }, { immediate: true })
})
