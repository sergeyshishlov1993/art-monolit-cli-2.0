<script setup lang="ts">
import ProductSidebar from '~/modules/product/components/ProductSidebar.vue'
import ProductGrid from '~/modules/product/components/ProductGrid.vue'
import type { ProductFilters } from '~/modules/product/types'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Каталог — ART MONOLIT',
  description: 'Каталог пам\'ятників з граніту та мармуру від виробника',
})

const route = useRoute()

const search = ref('')
const materialSlug = ref('')
const badge = ref('')
const targetGroupSlug = ref('')

const gridFilters = computed<ProductFilters>(() => ({
  material: materialSlug.value || undefined,
  badge: badge.value || undefined,
  targetGroup: targetGroupSlug.value || undefined,
  search: search.value || undefined,
}))

function applyQueryParams() {
  if (route.query.sale !== undefined) {
    badge.value = 'SALE'
  }
  if (route.query.new !== undefined) {
    badge.value = 'NEW'
  }
  if (route.query.hit !== undefined) {
    badge.value = 'HIT'
  }
  if (route.query.search) {
    search.value = String(route.query.search)
  }
  if (route.query.material) {
    materialSlug.value = String(route.query.material)
  }
}

applyQueryParams()

watch(() => route.query, () => {
  applyQueryParams()
}, { deep: true })

function resetFilters() {
  search.value = ''
  materialSlug.value = ''
  badge.value = ''
  targetGroupSlug.value = ''
  navigateTo({ path: '/catalog', query: {} })
}
</script>

<template>
  <div class="catalog-page">
    <BBreadcrumbs :items="[{ label: 'Каталог' }]" />

    <div class="catalog-page__header">
      <h1 class="catalog-page__title">
        <span class="catalog-page__accent">К</span>аталог
      </h1>
      <p class="catalog-page__sub">Пам'ятники з граніту та мармуру від виробника</p>
    </div>

    <div class="catalog-page__body">
      <ProductSidebar
          v-model:search="search"
          v-model:material-slug="materialSlug"
          v-model:badge="badge"
          v-model:target-group-slug="targetGroupSlug"
          category-slug=""
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