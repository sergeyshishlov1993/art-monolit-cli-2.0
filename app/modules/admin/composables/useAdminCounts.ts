import { useCategoryStore } from '~/modules/category/CategoryStore'
import { useProductStore } from '~/modules/product/ProductStore'
import { usePortfolioStore } from '~/modules/portfolio/PortfolioStore'
import { useLeadStore } from '~/modules/lead/LeadStore'
import { useHeroStore } from '~/modules/hero/HeroStore'

type AdminCounts = {
    categories: ComputedRef<number>
    products: ComputedRef<number>
    portfolios: ComputedRef<number>
    leads: ComputedRef<number>
    heroSlides: ComputedRef<number>
    isLoaded: Ref<boolean>
    fetchCounts: () => Promise<void>
}

export function useAdminCounts(): AdminCounts {
    const categoryStore = useCategoryStore()
    const productStore = useProductStore()
    const portfolioStore = usePortfolioStore()
    const leadStore = useLeadStore()
    const heroStore = useHeroStore()

    const isLoaded = ref(false)

    const categories = computed(() => categoryStore.categories.length)
    const products = computed(() => productStore.totalCount)
    const portfolios = computed(() => portfolioStore.totalCount)
    const leads = computed(() => leadStore.total)
    const heroSlides = computed(() => heroStore.slides.length)

    async function fetchCounts(): Promise<void> {
        if (isLoaded.value) return

        await Promise.all([
            categoryStore.categories.length ? Promise.resolve() : categoryStore.fetchAll(true),
            productStore.totalCount ? Promise.resolve() : productStore.fetchAll({ limit: 1 }),
            portfolioStore.totalCount ? Promise.resolve() : portfolioStore.fetchAll({ limit: 1 }),
            leadStore.total ? Promise.resolve() : leadStore.fetchAll({ limit: 1 }),
            heroStore.slides.length ? Promise.resolve() : heroStore.fetchAll(true),
        ])

        isLoaded.value = true
    }

    return {
        categories,
        products,
        portfolios,
        leads,
        heroSlides,
        isLoaded,
        fetchCounts,
    }
}