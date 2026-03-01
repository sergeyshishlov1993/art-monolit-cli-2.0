export function usePixel(): string | undefined {
    const route = useRoute()
    const pixelFromUrl = route.query.pixel as string | undefined

    if (pixelFromUrl) {
        if (import.meta.client) {
            sessionStorage.setItem('pixel', pixelFromUrl)
        }
        return pixelFromUrl
    }

    if (import.meta.client) {
        return sessionStorage.getItem('pixel') || undefined
    }

    return undefined
}