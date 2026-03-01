<script setup lang="ts">
import WorksSidebar from '~/modules/portfolio/components/WorksSidebar.vue'
import WorksGrid from '~/modules/portfolio/components/WorksGrid.vue'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Каталог — ART MONOLIT',
  description: 'Каталог пам\'ятників з граніту та мармуру від виробника',
})

const route = useRoute()

const filters = reactive({
  search: '',
  category: '',
  material: '',
  sort: '',
})

const initialWorkId = computed(() => {
  const workId = route.query.workId
  return typeof workId === 'string' ? workId : ''
})

function resetFilters() {
  filters.search = ''
  filters.category = ''
  filters.material = ''
  filters.sort = ''
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
      <WorksSidebar
          v-model:search="filters.search"
          v-model:category="filters.category"
          v-model:material="filters.material"
          v-model:sort="filters.sort"
          @reset="resetFilters"
      />
      <WorksGrid :filters="filters" :initial-work-id="initialWorkId" />
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