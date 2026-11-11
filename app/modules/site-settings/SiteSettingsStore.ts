import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSiteSettingsApi } from '~/modules/site-settings/SiteSettingsApi'
import type { SiteSettings } from '~/modules/site-settings/types'

export const useSiteSettingsStore = defineStore('site-settings', () => {
    const api = useSiteSettingsApi()
    const settings = ref<SiteSettings | null>(null)

    async function fetch(): Promise<void> {
        try {
            settings.value = await api.get()
        } catch {
            // API недоступний — сайт працює з контактами за замовчуванням (constants/contacts.ts)
            settings.value = null
        }
    }

    async function save(data: SiteSettings): Promise<void> {
        settings.value = await api.update(data)
    }

    return { settings, fetch, save }
})
