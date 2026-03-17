import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
    CreateLeadPayload,
    UpdateLeadPayload,
    LeadResponse,
    LeadFilters,
    LeadsListResponse,
} from './types'
import { useLeadApi } from '~/modules/lead/LeadApi'

type FetchAllOptions = {
    append?: boolean
}

export const useLeadStore = defineStore('lead', () => {
    const api = useLeadApi()

    const isSubmitting = ref(false)
    const isSuccess = ref(false)

    const leads = ref<LeadResponse[]>([])
    const selectedLead = ref<LeadResponse | null>(null)

    const isLoading = ref(false)
    const isLoadingMore = ref(false)

    const total = ref(0)
    const page = ref(1)
    const limit = ref(20)
    const totalPages = ref(0)

    const currentFilters = ref<LeadFilters>({})

    const hasMore = computed<boolean>(() => {
        if (totalPages.value === 0) {
            return false
        }

        return page.value < totalPages.value
    })

    async function submit(payload: CreateLeadPayload): Promise<void> {
        isSubmitting.value = true

        try {
            await api.create(payload)
            isSuccess.value = true
        } finally {
            isSubmitting.value = false
        }
    }

    function reset(): void {
        isSuccess.value = false
    }

    async function fetchAll(
        filters: LeadFilters = {},
        options: FetchAllOptions = {},
    ): Promise<LeadsListResponse> {
        const nextPage: number = filters.page ?? 1
        const nextLimit: number = filters.limit ?? limit.value
        const append: boolean = options.append === true && nextPage > 1

        currentFilters.value = {
            status: filters.status,
            source: filters.source,
            page: nextPage,
            limit: nextLimit,
        }

        if (append) {
            isLoadingMore.value = true
        } else {
            isLoading.value = true
        }

        try {
            const response = await api.findAll({
                ...filters,
                page: nextPage,
                limit: nextLimit,
            })

            leads.value = append
                ? [...leads.value, ...response.items]
                : response.items

            total.value = response.total
            page.value = response.page
            limit.value = response.limit
            totalPages.value = response.totalPages

            return response
        } finally {
            if (append) {
                isLoadingMore.value = false
            } else {
                isLoading.value = false
            }
        }
    }

    async function fetchNextPage(): Promise<void> {
        if (isLoading.value || isLoadingMore.value || !hasMore.value) {
            return
        }

        await fetchAll(
            {
                ...currentFilters.value,
                page: page.value + 1,
                limit: limit.value,
            },
            { append: true },
        )
    }

    function resetList(): void {
        leads.value = []
        total.value = 0
        page.value = 1
        totalPages.value = 0
    }

    async function fetchById(id: string): Promise<void> {
        isLoading.value = true

        try {
            selectedLead.value = await api.findById(id)
        } finally {
            isLoading.value = false
        }
    }

    async function update(id: string, payload: UpdateLeadPayload): Promise<LeadResponse> {
        const updated = await api.update(id, payload)

        selectedLead.value = updated

        const index: number = leads.value.findIndex((lead: LeadResponse) => lead.id === id)

        if (index !== -1) {
            leads.value[index] = updated
        }

        return updated
    }

    async function remove(id: string): Promise<void> {
        await api.remove(id)

        leads.value = leads.value.filter((lead: LeadResponse) => lead.id !== id)
        total.value = Math.max(0, total.value - 1)

        if (selectedLead.value?.id === id) {
            selectedLead.value = null
        }
    }

    return {
        isSubmitting,
        isSuccess,
        leads,
        selectedLead,
        isLoading,
        isLoadingMore,
        total,
        page,
        limit,
        totalPages,
        hasMore,
        submit,
        reset,
        fetchAll,
        fetchNextPage,
        resetList,
        fetchById,
        update,
        remove,
    }
})