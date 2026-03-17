import type {
    CreateLeadPayload,
    UpdateLeadPayload,
    LeadResponse,
    LeadFilters,
    LeadsListResponse,
} from './types'

export function useLeadApi() {
    const { $api } = useApi()

    return {
        create: (payload: CreateLeadPayload): Promise<LeadResponse> =>
            $api<LeadResponse>('/leads', {
                method: 'POST',
                body: payload,
            }),

        findAll: (filters: LeadFilters = {}): Promise<LeadsListResponse> => {
            const query: Record<string, string> = {}

            if (filters.status) {
                query.status = filters.status
            }

            if (filters.source) {
                query.source = filters.source
            }

            if (typeof filters.page === 'number') {
                query.page = String(filters.page)
            }

            if (typeof filters.limit === 'number') {
                query.limit = String(filters.limit)
            }

            return $api<LeadsListResponse>('/leads', { query })
        },

        findById: (id: string): Promise<LeadResponse> =>
            $api<LeadResponse>(`/leads/${id}`),

        update: (id: string, payload: UpdateLeadPayload): Promise<LeadResponse> =>
            $api<LeadResponse>(`/leads/${id}`, {
                method: 'PUT',
                body: payload,
            }),

        remove: (id: string): Promise<LeadResponse> =>
            $api<LeadResponse>(`/leads/${id}`, {
                method: 'DELETE',
            }),
    }
}