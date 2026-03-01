import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {CreateLeadPayload, UpdateLeadPayload, LeadResponse, LeadFilters} from './types'
import {useLeadApi} from '~/modules/lead/LeadApi'

export const useLeadStore = defineStore('lead', () => {
    const api = useLeadApi()

    const isSubmitting = ref(false)
    const isSuccess = ref(false)

    const leads = ref<LeadResponse[]>([])
    const selectedLead = ref<LeadResponse | null>(null)
    const isLoading = ref(false)

    async function submit(payload: CreateLeadPayload) {
        isSubmitting.value = true
        try {
            await api.create(payload)
            isSuccess.value = true
        } finally {
            isSubmitting.value = false
        }
    }

    function reset() {
        isSuccess.value = false
    }

    async function fetchAll(filters: LeadFilters = {}) {
        isLoading.value = true
        try {
            leads.value = await api.findAll(filters)
        } finally {
            isLoading.value = false
        }
    }

    async function fetchById(id: string) {
        isLoading.value = true
        try {
            selectedLead.value = await api.findById(id)
        } finally {
            isLoading.value = false
        }
    }

    async function update(id: string, payload: UpdateLeadPayload) {
        const updated = await api.update(id, payload)
        selectedLead.value = updated
        const index = leads.value.findIndex(lead => lead.id === id)
        if (index !== -1) {
            leads.value[index] = updated
        }
        return updated
    }

    async function remove(id: string) {
        await api.remove(id)
        leads.value = leads.value.filter(lead => lead.id !== id)
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
        submit,
        reset,
        fetchAll,
        fetchById,
        update,
        remove,
    }
})