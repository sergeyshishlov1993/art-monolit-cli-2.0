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

    async function update(id: string, name: string, slug: string) {
        const updated = await api.update(id, { name, slug })
        const index = targetGroups.value.findIndex(g => g.id === id)
        if (index !== -1) {
            targetGroups.value[index] = updated
        }
        return updated
    }

    async function remove(id: string) {
        await api.remove(id)
        targetGroups.value = targetGroups.value.filter(g => g.id !== id)
    }

    return { targetGroups, fetchAll, create, update, remove }
})