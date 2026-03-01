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

    return { materials, fetchAll, create }
})