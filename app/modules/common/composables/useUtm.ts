export interface UtmParams {
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
}

const STORAGE_KEY = 'utm'
const QUERY_KEYS: Record<keyof UtmParams, string> = {
    utmSource: 'utm_source',
    utmMedium: 'utm_medium',
    utmCampaign: 'utm_campaign',
}

// Запам'ятовує UTM з посилання (на сесію), щоб заявка на будь-якій сторінці знала, з якої реклами прийшов клієнт
export function captureUtm(query: Record<string, unknown>): void {
    const found: UtmParams = {}

    for (const [field, key] of Object.entries(QUERY_KEYS) as [keyof UtmParams, string][]) {
        const value = query[key]
        if (typeof value === 'string' && value) found[field] = value.slice(0, 100)
    }

    if (!Object.keys(found).length) return

    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    } catch {
        // sessionStorage недоступний — UTM просто не збережеться
    }
}

export function getUtm(): UtmParams {
    if (!import.meta.client) return {}

    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') as UtmParams
    } catch {
        return {}
    }
}
