<script setup lang="ts">
import ProductSidebar from '~/modules/product/components/ProductSidebar.vue'
import ProductGrid from '~/modules/product/components/ProductGrid.vue'
import type { ProductFilters } from '~/modules/product/types'
import { useCategoryStore } from '~/modules/category/CategoryStore'
import { ROUTES } from '~/modules/common/constants/routes'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()

const search = ref('')
const materialSlug = ref('')
const badge = ref('')
const targetGroupSlug = ref('')
const isApplyingQuery = ref(false)

const areCategoriesReady = ref(categoryStore.categories.length > 0)

if (!categoryStore.categories.length) {
  await useAsyncData('categories-load', async () => {
    await categoryStore.fetchAll()
    areCategoriesReady.value = true
  })
} else {
  areCategoriesReady.value = true
}

const routeCategorySlug = computed(() => String(route.params.category || ''))

const currentCategory = computed(() => {
  if (!areCategoriesReady.value || !routeCategorySlug.value) return undefined
  return categoryStore.categories.find((cat) => cat.slug === routeCategorySlug.value)
})

const pageTitle = computed(() => currentCategory.value?.name || 'Каталог')

const gridFilters = computed<ProductFilters>(() => ({
  categoryId: currentCategory.value?.id,
  material: materialSlug.value || undefined,
  badge: badge.value || undefined,
  targetGroup: targetGroupSlug.value || undefined,
  search: search.value || undefined,
}))

const breadcrumbs = computed(() => {
  const items: Array<{ label: string; to?: string }> = [{ label: 'Каталог', to: ROUTES.CATALOG }]
  if (currentCategory.value) {
    items.push({ label: currentCategory.value.name })
  }
  return items
})

async function applyQueryParams(): Promise<void> {
  isApplyingQuery.value = true

  badge.value = ''
  search.value = ''
  materialSlug.value = ''
  targetGroupSlug.value = ''

  if (route.query.sale !== undefined) badge.value = 'SALE'
  if (route.query.new !== undefined) badge.value = 'NEW'
  if (route.query.hit !== undefined) badge.value = 'HIT'
  if (route.query.search) search.value = String(route.query.search)
  if (route.query.material) materialSlug.value = String(route.query.material)

  await nextTick()
  isApplyingQuery.value = false
}

watch(
    () => route.query,
    async () => {
      await applyQueryParams()
    },
    { deep: true, immediate: true },
)

watch(
    [search, materialSlug, badge, targetGroupSlug],
    async () => {
      if (isApplyingQuery.value) return

      const query: Record<string, string> = {}

      if (search.value) query.search = search.value
      if (materialSlug.value) query.material = materialSlug.value
      if (badge.value === 'SALE') query.sale = ''
      if (badge.value === 'NEW') query.new = ''
      if (badge.value === 'HIT') query.hit = ''

      await router.replace({ query })
    },
    { deep: true },
)

watch(routeCategorySlug, () => {
  search.value = ''
  materialSlug.value = ''
  badge.value = ''
  targetGroupSlug.value = ''
})

useSeoMeta({
  title: () => currentCategory.value
      ? `${currentCategory.value.name} — ART MONOLIT`
      : 'Каталог — ART MONOLIT',
  description: () => currentCategory.value
      ? `${currentCategory.value.name} з граніту та мармуру від виробника`
      : 'Каталог пам\'ятників з граніту та мармуру від виробника',
})

function resetFilters() {
  search.value = ''
  materialSlug.value = ''
  badge.value = ''
  targetGroupSlug.value = ''
}
</script>

<template>
  <div class="catalog-page">
    <BBreadcrumbs :items="breadcrumbs" />

    <div class="catalog-page__header">
      <h1 class="catalog-page__title">
        <span class="catalog-page__accent">{{ pageTitle[0] }}</span>{{ pageTitle.slice(1) }}
      </h1>
      <p class="catalog-page__sub">{{ pageTitle }} з граніту та мармуру від виробника</p>
    </div>

    <div class="catalog-page__body">
      <ProductSidebar
          v-model:search="search"
          v-model:material-slug="materialSlug"
          v-model:badge="badge"
          v-model:target-group-slug="targetGroupSlug"
          :category-slug="routeCategorySlug"
          @reset="resetFilters"
      />

      <div class="catalog-page__grid">
        <ProductGrid :filters="gridFilters" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.catalog-page__header {
  margin-bottom: 32px;
}

.catalog-page__title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.catalog-page__accent {
  color: var(--gold);
  font-size: 40px;
}

.catalog-page__sub {
  margin: 8px 0 0;
  font-size: 15px;
  color: var(--text-muted);
}

.catalog-page__body {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 32px;
  align-items: start;
}

.catalog-page__grid {
  min-width: 0;
  min-height: 540px;
}

@media (max-width: 768px) {
  .catalog-page {
    padding: 40px 10px;
  }

  .catalog-page__body {
    grid-template-columns: 1fr;
  }

  .catalog-page__title {
    font-size: 24px;
  }

  .catalog-page__accent {
    font-size: 30px;
  }
}

@media (max-width: 600px) {
  .catalog-page {
    padding: 40px 10px 80px;
  }
}
</style>