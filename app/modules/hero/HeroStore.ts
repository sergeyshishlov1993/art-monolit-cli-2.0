import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useHeroApi } from '~/modules/hero/HeroApi'
import type { HeroSlide } from '~/modules/hero/types'

export const useHeroStore = defineStore('hero', () => {
    const slides = ref<HeroSlide[]>([])
    const loading = ref(false)
    const heroApi = useHeroApi()

    async function fetchAll(all = false) {
        loading.value = true
        try {
            slides.value = await heroApi.getAll({ all })
        } finally {
            loading.value = false
        }
    }

    function reset() {
        slides.value = []
    }

    return {
        slides,
        loading,
        fetchAll,
        reset,
    }
})