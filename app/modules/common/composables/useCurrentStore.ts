import { STORES } from '~/modules/common/constants/contacts'
import type { Store } from '~/modules/common/constants/contacts'
import { useSiteSettingsStore } from '~/modules/site-settings/SiteSettingsStore'

// Карта за адресою (без API-ключа), якщо власне embed-посилання не задано
export function buildMapUrl(address: string): string {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=uk&output=embed`
}

// Магазини, вибір міста і перемикачі беруться з налаштувань сайту (адмінка); без API — з constants/contacts.ts
export function useCurrentStore() {
    const settingsStore = useSiteSettingsStore()
    const storeId = useCookie<string | null>('store-id', {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        default: () => null,
    })
    const chooserOpen = useState('store-chooser-open', () => false)

    const stores = computed<Store[]>(() => {
        const list = settingsStore.settings?.stores
        if (!list?.length) return STORES

        return list.map((store) => ({
            id: store.id,
            city: store.city,
            logo: store.logo ?? '',
            address: store.address,
            mapEmbedUrl: store.mapEmbedUrl || buildMapUrl(store.address),
        }))
    })

    // З одним магазином вибирати нічого
    const hasChoice = computed(() => stores.value.length > 1)
    const enabled = computed(() => hasChoice.value && (settingsStore.settings?.citySwitcherHeader ?? true))
    const modalEnabled = computed(() => hasChoice.value && (settingsStore.settings?.citySelectorModal ?? true))
    const current = computed(() => stores.value.find((store) => store.id === storeId.value) ?? stores.value[0]!)
    const needsChoice = computed(() => modalEnabled.value && !storeId.value)

    function select(id: string): void {
        storeId.value = id
        chooserOpen.value = false
    }

    return { stores, current, enabled, modalEnabled, needsChoice, chooserOpen, select }
}
