import type { TargetGroup } from './types'

export function useTargetGroupApi() {
    const { $api } = useApi()

    return {
        getAll: () =>
            $api<TargetGroup[]>('/target-groups'),

        create: (data: { name: string; slug: string }) =>
            $api<TargetGroup>('/target-groups', {
                method: 'POST',
                body: data,
            }),

        update: (id: string, data: { name: string; slug: string }) =>
            $api<TargetGroup>(`/target-groups/${id}`, {
                method: 'PUT',
                body: data,
            }),

        remove: (id: string) =>
            $api<void>(`/target-groups/${id}`, {
                method: 'DELETE',
            }),
    }
}