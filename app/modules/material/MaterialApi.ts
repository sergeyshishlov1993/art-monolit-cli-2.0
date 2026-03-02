import type { Material } from './types'

export function useMaterialApi() {
    const { $api } = useApi()

    return {
        getAll: () =>
            $api<Material[]>('/materials'),

        create: (data: { name: string; slug: string }) =>
            $api<Material>('/materials', {
                method: 'POST',
                body: data,
            }),

        update: (id: string, data: { name: string; slug: string }) =>
            $api<Material>(`/materials/${id}`, {
                method: 'PUT',
                body: data,
            }),

        remove: (id: string) =>
            $api<void>(`/materials/${id}`, {
                method: 'DELETE',
            }),
    }
}