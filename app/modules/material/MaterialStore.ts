import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Material } from './types'
import { useMaterialApi } from './MaterialApi'

export const useMaterialStore = defineStore('material', () => {
    const api = useMaterialApi()
    const materials = ref<Material[]>([])

    async function fetchAll() {
        materials.value = await api.getAll()
    }

    async function create(name: string, slug: string) {
        const created = await api.create({ name, slug })
        materials.value.push(created)
        return created
    }

    async function update(id: string, name: string, slug: string) {
        const updated = await api.update(id, { name, slug })
        const index = materials.value.findIndex(m => m.id === id)
        if (index !== -1) {
            materials.value[index] = updated
        }
        return updated
    }

    async function remove(id: string) {
        await api.remove(id)
        materials.value = materials.value.filter(m => m.id !== id)
    }

    return { materials, fetchAll, create, update, remove }
})