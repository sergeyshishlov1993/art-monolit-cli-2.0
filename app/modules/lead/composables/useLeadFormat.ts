export function useLeadFormat() {
    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    function formatNumber(num: number | undefined): string {
        if (!num) return '—'
        return '#' + String(num).padStart(6, '0')
    }

    function buildProductUrl(categorySlug: string | undefined, productSlug: string): string | null {
        if (!categorySlug) return null
        const config = useRuntimeConfig()
        const baseUrl = config.public.siteUrl || ''
        return `${baseUrl}/catalog/${categorySlug}/${productSlug}`
    }

    return {
        formatDate,
        formatNumber,
        buildProductUrl,
    }
}