<script setup lang="ts">
import { ROUTES } from '~/modules/common/constants/routes'
import { useCategoryStore } from '~/modules/category/CategoryStore'
import { useMaterialStore } from '~/modules/material/MaterialStore'
import { useProductStore } from '~/modules/product/ProductStore'

const props = defineProps<{
  search: string
  categorySlug: string
  materialSlug: string
  badge: string
  targetGroupSlug: string
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:categorySlug': [value: string]
  'update:materialSlug': [value: string]
  'update:badge': [value: string]
  'update:targetGroupSlug': [value: string]
  'reset': []
}>()

const categoryStore = useCategoryStore()
const materialStore = useMaterialStore()
const productStore = useProductStore()

const badges = [
  { value: 'HIT', label: 'Хіт' },
  { value: 'NEW', label: 'Новинка' },
  { value: 'SALE', label: 'Акція' },
]

const isMobileOpen = ref(false)

await useAsyncData('catalog-filters', async () => {
  await Promise.all([
    categoryStore.categories.length ? null : categoryStore.fetchAll(),
    materialStore.materials.length ? null : materialStore.fetchAll(),
  ])
  return true
})

onMounted(() => {
  productStore.fetchCounts()
})

function getCategoryCount(slug: string): number {
  return productStore.counts?.categories.find(c => c.slug === slug)?.count ?? 0
}

function getMaterialCount(slug: string): number {
  return productStore.counts?.materials.find(m => m.slug === slug)?.count ?? 0
}

function getBadgeCount(badge: string): number {
  return productStore.counts?.badges.find(b => b.badge === badge)?.count ?? 0
}

const visibleCategories = computed(() =>
    categoryStore.categories.filter(cat => getCategoryCount(cat.slug) > 0)
)

const visibleMaterials = computed(() =>
    materialStore.materials.filter(mat => getMaterialCount(mat.slug) > 0)
)

const visibleBadges = computed(() =>
    badges.filter(item => getBadgeCount(item.value) > 0)
)

const activeFiltersCount = computed(() => {
  let count = 0
  if (props.categorySlug) count++
  if (props.materialSlug) count++
  if (props.badge) count++
  if (props.search) count++
  return count
})

function selectCategory(slug: string) {
  if (slug) {
    navigateTo(ROUTES.CATALOG_CATEGORY(slug))
  } else {
    navigateTo(ROUTES.CATALOG)
  }
}

function resetFilters() {
  navigateTo(ROUTES.CATALOG)
  emit('reset')
}

function applyFilters() {
  isMobileOpen.value = false
}
</script>

<template>
  <aside class="sidebar">
    <button class="sidebar__mobile-toggle" @click="isMobileOpen = !isMobileOpen">
      <BIcon name="adjustments-horizontal" size="sm" />
      Фільтри
      <span v-if="activeFiltersCount > 0" class="sidebar__badge">{{ activeFiltersCount }}</span>
      <BIcon :name="isMobileOpen ? 'chevron-up' : 'chevron-down'" size="sm" />
    </button>

    <div v-if="visibleCategories.length" class="sidebar__tabs">
      <button
          class="sidebar__tab"
          :class="{ 'sidebar__tab--active': !categorySlug }"
          @click="selectCategory('')"
      >
        Усі
      </button>
      <button
          v-for="cat in visibleCategories"
          :key="cat.id"
          class="sidebar__tab"
          :class="{ 'sidebar__tab--active': categorySlug === cat.slug }"
          @click="selectCategory(cat.slug)"
      >
        {{ cat.name }}
      </button>
    </div>

    <div class="sidebar__body" :class="{ 'sidebar__body--open': isMobileOpen }">
      <div class="sidebar__section">
        <span class="sidebar__label">Пошук</span>
        <BInput
            :model-value="search"
            placeholder="Назва виробу..."
            @update:model-value="emit('update:search', $event)"
        />
      </div>

      <div v-if="visibleCategories.length" class="sidebar__section">
        <span class="sidebar__label">Категорія</span>
        <div class="sidebar__options">
          <button
              class="sidebar__option"
              :class="{ 'sidebar__option--active': !categorySlug }"
              @click="selectCategory('')"
          >
            Всі категорії
            <span class="sidebar__count">{{ productStore.counts?.total ?? 0 }}</span>
          </button>
          <button
              v-for="cat in visibleCategories"
              :key="cat.id"
              class="sidebar__option"
              :class="{ 'sidebar__option--active': categorySlug === cat.slug }"
              @click="selectCategory(cat.slug)"
          >
            {{ cat.name }}
            <span class="sidebar__count">{{ getCategoryCount(cat.slug) }}</span>
          </button>
        </div>
      </div>

      <div v-if="visibleMaterials.length" class="sidebar__section">
        <span class="sidebar__label">Матеріал</span>
        <div class="sidebar__options">
          <button
              class="sidebar__option"
              :class="{ 'sidebar__option--active': !materialSlug }"
              @click="emit('update:materialSlug', '')"
          >
            Всі матеріали
          </button>
          <button
              v-for="mat in visibleMaterials"
              :key="mat.id"
              class="sidebar__option"
              :class="{ 'sidebar__option--active': materialSlug === mat.slug }"
              @click="emit('update:materialSlug', mat.slug)"
          >
            {{ mat.name }}
            <span class="sidebar__count">{{ getMaterialCount(mat.slug) }}</span>
          </button>
        </div>
      </div>

      <div v-if="visibleBadges.length" class="sidebar__section">
        <span class="sidebar__label">Мітка</span>
        <div class="sidebar__options">
          <button
              class="sidebar__option"
              :class="{ 'sidebar__option--active': badge === '' }"
              @click="emit('update:badge', '')"
          >
            Всі
          </button>
          <button
              v-for="item in visibleBadges"
              :key="item.value"
              class="sidebar__option"
              :class="{ 'sidebar__option--active': badge === item.value }"
              @click="emit('update:badge', item.value)"
          >
            {{ item.label }}
            <span class="sidebar__count">{{ getBadgeCount(item.value) }}</span>
          </button>
        </div>
      </div>

      <button class="sidebar__reset" @click="resetFilters">
        <BIcon name="x-mark" size="sm" />
        Скинути фільтри
      </button>

      <button class="sidebar__apply" @click="applyFilters">
        Застосувати
        <span v-if="activeFiltersCount > 0">({{ activeFiltersCount }})</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 80px;
}

.sidebar__mobile-toggle {
  display: none;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.sidebar__badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--gold);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--bg-primary);
}

.sidebar__tabs {
  display: none;
  gap: 8px;
  padding: 12px 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.sidebar__tabs::-webkit-scrollbar {
  display: none;
}

.sidebar__tab {
  flex-shrink: 0;
  padding: 8px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;
}

.sidebar__tab:hover {
  border-color: var(--gold);
  color: var(--text-primary);
}

.sidebar__tab--active {
  background: var(--gold);
  border-color: var(--gold);
  color: white !important;
  font-weight: 500;
}

.sidebar__body {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
}

.sidebar__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.sidebar__options {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.sidebar__option:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.sidebar__option--active {
  background: var(--bg-secondary);
  color: var(--gold);
  font-weight: 500;
}

.sidebar__count {
  font-size: 11px;
  color: var(--text-muted);
  min-width: 20px;
  text-align: right;
}

.sidebar__option--active .sidebar__count {
  color: var(--gold);
}

.sidebar__reset {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar__reset:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.sidebar__apply {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: var(--gold);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--bg-primary);
  cursor: pointer;
  transition: opacity 0.2s;
}

.sidebar__apply:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .sidebar {
    position: sticky;
    top: 60px;
    z-index: 20;
    margin: 0 -24px;
    padding: 0 24px;
    background: var(--bg-primary);
    overflow: hidden;
  }

  .sidebar__mobile-toggle {
    display: flex;
    border: none;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
    background: var(--bg-primary);
    padding: 14px 0;
  }

  .sidebar__tabs {
    display: flex;
    margin: 0 -24px;
    padding: 12px 24px;
    border-bottom: 1px solid var(--border);
    max-width: 100vw;
  }

  .sidebar__body {
    display: none;
    margin-top: 0;
    border-top: none;
    border-radius: 0 0 4px 4px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .sidebar__body--open {
    display: flex;
  }

  .sidebar__apply {
    display: flex;
  }
}
</style>