import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TargetGroup } from './types'
import { useTargetGroupApi } from './TargetGroupApi'

export const useTargetGroupStore = defineStore('targetGroup', () => {
    const api = useTargetGroupApi()
    const targetGroups = ref<TargetGroup[]>([])

    async function fetchAll() {
        targetGroups.value = await api.getAll()
    }

    async function create(name: string, slug: string) {
        const created = await api.create({ name, slug })
        targetGroups.value.push(created)
        return created
    }

    return { targetGroups, fetchAll, create }
})