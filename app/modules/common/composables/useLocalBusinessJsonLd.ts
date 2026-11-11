import { useCurrentStore } from '~/modules/common/composables/useCurrentStore'
import { useContacts } from '~/modules/common/composables/useContacts'
import { useSiteSettingsStore } from '~/modules/site-settings/SiteSettingsStore'
import type { DayHours } from '~/modules/site-settings/types'

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hoursSpec(dayOfWeek: string | string[], hours: DayHours) {
    return hours ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek, opens: hours.from, closes: hours.to }] : []
}

// Структуровані дані для Google: адреса, телефони, графік (беруться з налаштувань сайту)
export function useLocalBusinessJsonLd(): void {
    const siteUrl = useRuntimeConfig().public.siteUrl
    const siteContacts = useContacts()
    const settingsStore = useSiteSettingsStore()
    const { stores } = useCurrentStore()

    const json = computed(() => {
        const contacts = siteContacts.value
        const schedule = settingsStore.settings?.schedule

        const businesses = stores.value.map((store) => ({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: `ART MONOLIT — ${store.city}`,
            url: siteUrl,
            image: `${siteUrl}/og-image.jpg`,
            telephone: [contacts.PHONE_1_HREF, contacts.PHONE_2_HREF].filter(Boolean).map(href => href.replace('tel:', '')),
            ...(contacts.EMAIL ? { email: contacts.EMAIL } : {}),
            address: {
                '@type': 'PostalAddress',
                // «м. Запоріжжя, вул. Космічна, 63/1» → «вул. Космічна, 63/1»
                streetAddress: store.address.replace(new RegExp(`^м\\.?\\s*${escapeRegExp(store.city)}\\s*,\\s*`, 'i'), ''),
                addressLocality: store.city,
                addressCountry: 'UA',
            },
            openingHoursSpecification: schedule
                ? [...hoursSpec(WEEKDAYS, schedule.weekdays), ...hoursSpec('Saturday', schedule.saturday), ...hoursSpec('Sunday', schedule.sunday)]
                : [
                    ...hoursSpec(WEEKDAYS, { from: '09:00', to: '18:00' }),
                    ...hoursSpec('Saturday', { from: '10:00', to: '15:00' }),
                ],
        }))

        return JSON.stringify(businesses.length === 1 ? businesses[0] : businesses)
    })

    useHead({
        script: [{ key: 'ld-local-business', type: 'application/ld+json', innerHTML: json }],
    })
}
