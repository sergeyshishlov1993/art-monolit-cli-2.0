import type { Category } from './types'

export function useCategoryApi() {
    const { $api } = useApi()

    return {
        getAll: (all = false) =>
            $api<Category[]>('/categories', { query: all ? { all: 'true' } : {} }),

        getBySlug: (slug: string) =>
            $api<Category>(`/categories/${slug}`),

        create: (data: Partial<Category>) =>
            $api<Category>('/categories', { method: 'POST', body: data }),

        update: (id: string, data: Partial<Category>) =>
            $api<Category>(`/categories/${id}`, { method: 'PUT', body: data }),

        remove: (id: string) =>
            $api<Category>(`/categories/${id}`, { method: 'DELETE' }),

        uploadImage: (id: string, file: File) => {
            const formData = new FormData()
            formData.append('file', file)
            return $api<Category>(`/upload/categories/${id}`, {
                method: 'POST',
                body: formData,
            })
        },
    }
}