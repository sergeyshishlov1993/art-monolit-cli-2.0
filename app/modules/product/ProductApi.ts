import type { Product, ProductFilters, ProductSpec, FilterCounts, ProductListResponse } from './types'

export function useProductApi() {
    const { $api } = useApi()

    return {
        getAll: (filters: ProductFilters = {}) => {
            const query: Record<string, string> = {}
            if (filters.categoryId) query.categoryId = filters.categoryId
            if (filters.targetGroup) query.targetGroup = filters.targetGroup
            if (filters.material) query.material = filters.material
            if (filters.badge) query.badge = filters.badge
            if (filters.size) query.size = filters.size
            if (filters.search) query.search = filters.search
            if (filters.all) query.all = 'true'
            if (filters.page) query.page = String(filters.page)
            if (filters.limit) query.limit = String(filters.limit)
            return $api<ProductListResponse>('/products', { query })
        },

        getCounts: (filters: { categoryId?: string; targetGroup?: string; material?: string; badge?: string } = {}) => {
            const query: Record<string, string> = {}
            if (filters.categoryId) query.categoryId = filters.categoryId
            if (filters.targetGroup) query.targetGroup = filters.targetGroup
            if (filters.material) query.material = filters.material
            if (filters.badge) query.badge = filters.badge
            return $api<FilterCounts>('/products/counts', { query })
        },

        getBySlug: (slug: string) =>
            $api<Product>(`/products/${slug}`),

        getById: (id: string) =>
            $api<Product>(`/products/by-id/${id}`),

        create: (data: Partial<Product>) =>
            $api<Product>('/products', { method: 'POST', body: data }),

        update: (id: string, data: Partial<Product>) =>
            $api<Product>(`/products/${id}`, { method: 'PUT', body: data }),

        remove: (id: string) =>
            $api<void>(`/products/${id}`, { method: 'DELETE' }),

        setMainImage: (productId: string, imageId: string) =>
            $api<Product>(`/products/${productId}/main-image/${imageId}`, { method: 'PUT' }),

        uploadImage: (productId: string, file: File, isMain = false, alt = '') => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('isMain', String(isMain))
            formData.append('alt', alt)
            return $api<unknown>(`/upload/products/${productId}`, {
                method: 'POST',
                body: formData,
            })
        },

        deleteImage: (imageId: string) =>
            $api<void>(`/upload/products/images/${imageId}`, { method: 'DELETE' }),

        addVariant: (productId: string, data: { title: string; material: string; size: string; sortOrder?: number }) =>
            $api<unknown>(`/products/${productId}/variants`, { method: 'POST', body: data }),

        addSpec: (productId: string, data: { key: string; value: string; sortOrder?: number }) =>
            $api<ProductSpec>(`/products/${productId}/specs`, { method: 'POST', body: data }),

        updateSpec: (specId: string, data: Partial<{ key: string; value: string; sortOrder: number }>) =>
            $api<ProductSpec>(`/products/specs/${specId}`, { method: 'PUT', body: data }),

        removeSpec: (specId: string) =>
            $api<void>(`/products/specs/${specId}`, { method: 'DELETE' }),
    }
}