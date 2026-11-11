type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] }

// Події йдуть у dataLayer лише після того, як GTM завантажено (тобто після згоди на cookie)
export function trackEvent(event: string, params: Record<string, unknown> = {}): void {
    if (!import.meta.client) return

    const dataLayer = (window as DataLayerWindow).dataLayer
    if (!dataLayer) return

    dataLayer.push({ event, ...params })
}
