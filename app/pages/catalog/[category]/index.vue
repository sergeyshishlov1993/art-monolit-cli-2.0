<script setup lang="ts">
import ProductSidebar from '~/modules/product/components/ProductSidebar.vue'
import ProductGrid from '~/modules/product/components/ProductGrid.vue'
import type { ProductFilters } from '~/modules/product/types'
import { useCategoryStore } from '~/modules/category/CategoryStore'
import { ROUTES } from '~/modules/common/constants/routes'

definePageMeta({ layout: 'default' })

const route = useRoute()
const categoryStore = useCategoryStore()

const categorySlug = computed(() => String(route.params.category || ''))

await useAsyncData(`category-${categorySlug.value}`, async () => {
  if (!categoryStore.categories.length) await categoryStore.fetchAll()
  return true
})

const currentCategory = computed(() =>
    categoryStore.categories.find(cat => cat.slug === categorySlug.value)
)

const categoryLabel = computed(() => currentCategory.value?.name || 'Каталог')

useSeoMeta({
  title: () => `${categoryLabel.value} — ART MONOLIT`,
  description: () => `${categoryLabel.value} з граніту та мармуру від виробника`,
})

const search = ref('')
const materialSlug = ref('')
const badge = ref('')
const targetGroupSlug = ref('')

const gridFilters = computed<ProductFilters>(() => ({
  categoryId: currentCategory.value?.id,
  material: materialSlug.value || undefined,
  badge: badge.value || undefined,
  targetGroup: targetGroupSlug.value || undefined,
  search: search.value || undefined,
}))

function resetFilters() {
  search.value = ''
  materialSlug.value = ''
  badge.value = ''
  targetGroupSlug.value = ''
}
</script>

<template>
  <div class="catalog-page">
    <BBreadcrumbs :items="[
      { label: 'Каталог', to: ROUTES.CATALOG },
      { label: categoryLabel },
    ]" />

    <div class="catalog-page__header">
      <h1 class="catalog-page__title">
        <span class="catalog-page__accent">{{ categoryLabel[0] }}</span>{{ categoryLabel.slice(1) }}
      </h1>
      <p class="catalog-page__sub">{{ categoryLabel }} з граніту та мармуру від виробника</p>
    </div>

    <div class="catalog-page__body">
      <ProductSidebar
          v-model:search="search"
          v-model:material-slug="materialSlug"
          v-model:badge="badge"
          v-model:target-group-slug="targetGroupSlug"
          :category-slug="categorySlug"
          @reset="resetFilters"
      />
      <ProductGrid :filters="gridFilters" />
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

@media (max-width: 768px) {
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
</style>