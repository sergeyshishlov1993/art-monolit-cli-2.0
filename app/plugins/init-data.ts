import { useCategoryStore } from '~/modules/category/CategoryStore'

export default defineNuxtPlugin(async () => {
    const categoryStore = useCategoryStore()

    if (categoryStore.categories.length === 0) {
        await categoryStore.fetchAll()
    }
})