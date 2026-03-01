import { defineStore } from 'pinia'
import type { Category } from './types'
import { useCategoryApi } from './CategoryApi'

export const useCategoryStore = defineStore('category', () => {
    const api = useCategoryApi()
    const categories = ref<Category[]>([])
    const current = ref<Category | null>(null)
    const loading = ref(false)

    async function fetchAll(all = false) {
        if (loading.value) return
        loading.value = true
        try {
            categories.value = await api.getAll(all)
        } finally {
            loading.value = false
        }
    }

    async function fetchBySlug(slug: string) {
        current.value = await api.getBySlug(slug)
    }

    async function create(data: Partial<Category>) {
        return api.create(data)
    }

    async function update(id: string, data: Partial<Category>) {
        return api.update(id, data)
    }

    async function remove(id: string) {
        return api.remove(id)
    }

    async function uploadImage(id: string, file: File) {
        return api.uploadImage(id, file)
    }

    return {
        categories,
        current,
        loading,
        fetchAll,
        fetchBySlug,
        create,
        update,
        remove,
        uploadImage,
    }
})