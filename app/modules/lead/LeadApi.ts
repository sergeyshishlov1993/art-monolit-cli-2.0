import type { CreateLeadPayload, UpdateLeadPayload, LeadResponse, LeadFilters } from './types'

export function useLeadApi() {
    const { $api } = useApi()

    return {
        create: (payload: CreateLeadPayload) =>
            $api<LeadResponse>('/leads', {
                method: 'POST',
                body: payload,
            }),

        findAll: (filters: LeadFilters = {}) => {
            const query: Record<string, string> = {}
            if (filters.status) query.status = filters.status
            if (filters.source) query.source = filters.source
            return $api<LeadResponse[]>('/leads', { query })
        },

        findById: (id: string) =>
            $api<LeadResponse>(`/leads/${id}`),

        update: (id: string, payload: UpdateLeadPayload) =>
            $api<LeadResponse>(`/leads/${id}`, {
                method: 'PUT',
                body: payload,
            }),

        remove: (id: string) =>
            $api<LeadResponse>(`/leads/${id}`, {
                method: 'DELETE',
            }),
    }
}