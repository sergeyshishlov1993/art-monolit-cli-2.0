import type { SiteSettings } from './types'

export function useSiteSettingsApi() {
    const { $api } = useApi()

    return {
        get: () => $api<SiteSettings>('/site-settings'),

        update: (data: SiteSettings) =>
            $api<SiteSettings>('/site-settings', { method: 'PUT', body: data }),
    }
}
