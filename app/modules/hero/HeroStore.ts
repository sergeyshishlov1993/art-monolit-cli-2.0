import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useHeroApi } from '~/modules/hero/HeroApi'
import type { HeroSlide } from '~/modules/hero/types'

export const useHeroStore = defineStore('hero', () => {
    const slides = ref<HeroSlide[]>([])
    const loading = ref<boolean>(false)
    const loaded = ref<boolean>(false)
    const heroApi = useHeroApi()

    async function fetchAll(all = false): Promise<void> {
        if (loaded.value && !all) return
        loading.value = true
        try {
            slides.value = await heroApi.getAll({ all })
            if (!all) loaded.value = true
        } finally {
            loading.value = false
        }
    }

    function reset(): void {
        slides.value = []
        loaded.value = false
    }

    return {
        slides,
        loading,
        loaded,
        fetchAll,
        reset,
    }
})