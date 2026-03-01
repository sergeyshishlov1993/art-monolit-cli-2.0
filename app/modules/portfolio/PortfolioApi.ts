import type { PortfolioWork, PortfolioImage, PortfolioListResponse, FilterCounts } from './types'

export interface PortfolioGetAllParams {
    all?: boolean
    search?: string
    categoryId?: string
    material?: string
    targetGroup?: string
    page?: number
    limit?: number
}

export function usePortfolioApi() {
    const { $api } = useApi()

    return {
        getAll: (params: PortfolioGetAllParams = {}) => {
            const query: Record<string, string> = {}
            if (params.all) query.all = 'true'
            if (params.search) query.search = params.search
            if (params.categoryId) query.categoryId = params.categoryId
            if (params.material) query.material = params.material
            if (params.targetGroup) query.targetGroup = params.targetGroup
            if (params.page) query.page = String(params.page)
            if (params.limit) query.limit = String(params.limit)
            return $api<PortfolioListResponse>('/portfolio', { query })
        },

        getCounts: (params: { categoryId?: string } = {}) => {
            const query: Record<string, string> = {}
            if (params.categoryId) query.categoryId = params.categoryId
            return $api<FilterCounts>('/portfolio/counts', { query })
        },

        getById: (id: string) =>
            $api<PortfolioWork>(`/portfolio/${id}`),

        create: (data: Partial<PortfolioWork>) =>
            $api<PortfolioWork>('/portfolio', {
                method: 'POST',
                body: data,
            }),

        update: (id: string, data: Partial<PortfolioWork>) =>
            $api<PortfolioWork>(`/portfolio/${id}`, {
                method: 'PUT',
                body: data,
            }),

        remove: (id: string) =>
            $api<void>(`/portfolio/${id}`, {
                method: 'DELETE',
            }),

        uploadImage: (portfolioWorkId: string, file: File, alt = '') => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('alt', alt)
            return $api<PortfolioImage>(`/upload/portfolio/${portfolioWorkId}`, {
                method: 'POST',
                body: formData,
            })
        },

        deleteImage: (imageId: string) =>
            $api<void>(`/upload/portfolio/images/${imageId}`, {
                method: 'DELETE',
            }),
    }
}