import type { TargetGroup } from './types'

export function useTargetGroupApi() {
    const { $api } = useApi()

    return {
        getAll: () => $api<TargetGroup[]>('/target-groups'),
        create: (data: { name: string; slug: string }) =>
            $api<TargetGroup>('/target-groups', { method: 'POST', body: data }),
    }
}