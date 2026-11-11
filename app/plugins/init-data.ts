import { useCategoryStore } from '~/modules/category/CategoryStore'
import { useSiteSettingsStore } from '~/modules/site-settings/SiteSettingsStore'

export default defineNuxtPlugin(async () => {
    const categoryStore = useCategoryStore()

    if (categoryStore.categories.length === 0) {
        await categoryStore.fetchAll()
    }

    const siteSettingsStore = useSiteSettingsStore()

    if (!siteSettingsStore.settings) {
        await siteSettingsStore.fetch()
    }
})