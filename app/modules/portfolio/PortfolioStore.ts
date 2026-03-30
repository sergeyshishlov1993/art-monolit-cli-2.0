import { defineStore } from 'pinia'
import { usePortfolioApi } from './PortfolioApi'
import type { PortfolioWork, FilterCounts } from './types'
import type { PortfolioGetAllParams } from './PortfolioApi'

export const usePortfolioStore = defineStore('portfolio', () => {
    const api = usePortfolioApi()
    const works = ref<PortfolioWork[]>([])
    const current = ref<PortfolioWork | null>(null)
    const counts = ref<FilterCounts | null>(null)
    const isLoading = ref(false)
    const hasMore = ref(true)
    const currentPage = ref(1)
    const totalCount = ref(0)

    async function fetchAll(params: PortfolioGetAllParams = {}) {
        isLoading.value = true
        try {
            const response = await api.getAll(params)
            works.value = response.items
            hasMore.value = response.hasMore
            currentPage.value = response.page
            totalCount.value = response.total
        } finally {
            isLoading.value = false
        }
    }

    async function fetchMore(params: PortfolioGetAllParams = {}) {
        if (isLoading.value || !hasMore.value) return
        isLoading.value = true
        try {
            const response = await api.getAll({ ...params, page: currentPage.value + 1 })
            works.value = [...works.value, ...response.items]
            hasMore.value = response.hasMore
            currentPage.value = response.page
            totalCount.value = response.total
        } finally {
            isLoading.value = false
        }
    }

    async function fetchCounts(params: { categoryId?: string } = {}) {
        try {
            counts.value = await api.getCounts(params)
        } catch {
            counts.value = null
        }
    }

    async function fetchById(id: string) {
        current.value = await api.getById(id)
    }

    function filteredBySearch(query: string): PortfolioWork[] {
        if (!query) return works.value
        const lower = query.toLowerCase()
        return works.value.filter(work =>
            work.title.toLowerCase().includes(lower)
        )
    }

    async function create(data: Partial<PortfolioWork>) {
        return api.create(data)
    }

    async function update(id: string, data: Partial<PortfolioWork>) {
        return api.update(id, data)
    }

    async function remove(id: string) {
        return api.remove(id)
    }

    async function uploadImage(workId: string, file: File) {
        return api.uploadImage(workId, file)
    }

    async function deleteImage(imageId: string) {
        return api.deleteImage(imageId)
    }

    return {
        works,
        current,
        counts,
        isLoading,
        hasMore,
        currentPage,
        totalCount,
        fetchAll,
        fetchMore,
        fetchCounts,
        fetchById,
        filteredBySearch,
        create,
        update,
        remove,
        uploadImage,
        deleteImage,
    }
})