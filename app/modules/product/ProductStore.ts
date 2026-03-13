import { defineStore } from 'pinia'
import type { Product, ProductFilters, FilterCounts } from './types'
import { useProductApi } from './ProductApi'

export const useProductStore = defineStore('product', () => {
    const api = useProductApi()
    const products = ref<Product[]>([])
    const current = ref<Product | null>(null)
    const counts = ref<FilterCounts | null>(null)
    const isLoading = ref(false)
    const hasMore = ref(true)
    const currentPage = ref(1)
    const totalCount = ref(0)

    async function fetchAll(filters: ProductFilters = {}) {
        isLoading.value = true
        try {
            const response = await api.getAll(filters)
            products.value = response.items
            hasMore.value = response.hasMore
            currentPage.value = response.page
            totalCount.value = response.total
        } finally {
            isLoading.value = false
        }
    }

    async function fetchMore(filters: ProductFilters = {}) {
        if (!hasMore.value || isLoading.value) return
        isLoading.value = true
        try {
            const response = await api.getAll({
                ...filters,
                page: currentPage.value + 1,
            })
            products.value = [...products.value, ...response.items]
            hasMore.value = response.hasMore
            currentPage.value = response.page
            totalCount.value = response.total
        } finally {
            isLoading.value = false
        }
    }

    async function fetchCounts(filters: { categoryId?: string; targetGroup?: string; material?: string; badge?: string } = {}) {
        counts.value = await api.getCounts(filters)
    }

    async function fetchById(id: string) {
        current.value = await api.getById(id)
    }

    async function fetchBySlug(slug: string) {
        current.value = await api.getBySlug(slug)
    }

    function filteredBySearch(query: string): Product[] {
        if (!query) return products.value
        const lower = query.toLowerCase()
        return products.value.filter(product =>
            product.title.toLowerCase().includes(lower)
        )
    }

    async function create(data: Partial<Product>) {
        return api.create(data)
    }

    async function update(id: string, data: Partial<Product>) {
        return api.update(id, data)
    }

    async function remove(id: string) {
        return api.remove(id)
    }

    async function setMainImage(productId: string, imageId: string) {
        return api.setMainImage(productId, imageId)
    }

    async function uploadImage(productId: string, file: File, isMain = false, alt = '') {
        return api.uploadImage(productId, file, isMain, alt)
    }

    async function deleteImage(imageId: string) {
        return api.deleteImage(imageId)
    }

    return {
        products,
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
        fetchBySlug,
        filteredBySearch,
        create,
        update,
        remove,
        setMainImage,
        uploadImage,
        deleteImage,
    }
})