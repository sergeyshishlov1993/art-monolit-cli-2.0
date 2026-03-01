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
    }
}