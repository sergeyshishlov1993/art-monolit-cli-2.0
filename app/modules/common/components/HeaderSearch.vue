<script setup lang="ts">
import { onClickOutside, refDebounced } from '@vueuse/core'
import { useProductApi } from '~/modules/product/ProductApi'
import { ROUTES } from '~/modules/common/constants/routes'
import type { Product } from '~/modules/product/types'

const productApi = useProductApi()
const route = useRoute()

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const query = ref('')
const debouncedQuery = refDebounced(query, 300)
const suggestions = ref<Product[]>([])
const total = ref(0)
const isLoading = ref(false)

async function loadSuggestions(value: string): Promise<void> {
  const text = value.trim()
  if (text.length < 2) {
    suggestions.value = []
    total.value = 0
    return
  }
  isLoading.value = true
  try {
    const response = await productApi.getAll({ search: text, limit: 5 })
    if (text === query.value.trim()) {
      suggestions.value = response.items
      total.value = response.total
    }
  } finally {
    isLoading.value = false
  }
}

// Підказки вантажимо лише коли панель відкрита
watch(debouncedQuery, (value) => {
  if (isOpen.value) void loadSuggestions(value)
})

async function open(): Promise<void> {
  isOpen.value = true
  void loadSuggestions(query.value)
  await nextTick()
  inputRef.value?.focus()
}

function reset(): void {
  query.value = ''
  suggestions.value = []
  total.value = 0
}

function clear(): void {
  reset()
  inputRef.value?.focus()
}

function close(): void {
  isOpen.value = false
}

function submit(): void {
  const text = query.value.trim()
  if (!text) return
  close()
  navigateTo({ path: ROUTES.CATALOG, query: { search: text } })
}

function mainImage(product: Product): string {
  return product.images.find((image) => image.isMain)?.url || product.images[0]?.url || ''
}

onClickOutside(rootRef, close)
// При переході на іншу сторінку поле пошуку очищається
watch(() => route.fullPath, () => {
  close()
  reset()
})
</script>

<template>
  <div ref="rootRef" class="header-search">
    <button type="button" class="header-search__toggle" aria-label="Пошук" @click="isOpen ? close() : open()">
      <BIcon name="magnifying-glass" size="md" />
    </button>

    <div v-if="isOpen" class="header-search__panel" @keydown.esc="close">
      <form class="header-search__form" @submit.prevent="submit">
        <input
            ref="inputRef"
            v-model="query"
            type="search"
            class="header-search__input"
            placeholder="Пошук виробів..."
            autocomplete="off"
        >
        <button v-if="query" type="button" class="header-search__clear" aria-label="Очистити" @click="clear">
          <BIcon name="x-mark" size="sm" />
        </button>
      </form>

      <ul v-if="suggestions.length" class="header-search__list">
        <li v-for="product in suggestions" :key="product.id">
          <NuxtLink :to="ROUTES.CATALOG_PRODUCT(product.category.slug, product.slug)" class="header-search__item">
            <img v-if="mainImage(product)" :src="mainImage(product)" :alt="product.title" class="header-search__thumb">
            <span v-else class="header-search__thumb" />
            <span class="header-search__title">{{ product.title }}</span>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink
          v-if="suggestions.length"
          :to="{ path: ROUTES.CATALOG, query: { search: query.trim() } }"
          class="header-search__all"
      >
        Показати всі результати ({{ total }})
      </NuxtLink>
      <p v-else-if="query.trim().length >= 2 && !isLoading" class="header-search__empty">Нічого не знайдено</p>
    </div>
  </div>
</template>

<style scoped>
.header-search {
  position: relative;
}

.header-search__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  /* шапка завжди темна, як і телефон у ній */
  color: #ffffff;
  background: none;
  border: none;
  cursor: pointer;
}

.header-search__toggle:hover {
  color: var(--gold);
}

.header-search__panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 200;
  width: min(360px, calc(100vw - 32px));
  padding: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.25);
}

/* на телефоні кнопка пошуку стоїть не біля правого краю, тож панель вирівнюємо по екрану, а не по кнопці */
@media (max-width: 768px) {
  .header-search__panel {
    position: fixed;
    top: 72px;
    right: 16px;
    left: 16px;
    width: auto;
    max-height: calc(100vh - 72px - var(--mobile-bar-height, 0px) - 16px);
    overflow-y: auto;
  }
}

.header-search__form {
  position: relative;
}

.header-search__input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  outline: none;
}

.header-search__input:focus {
  border-color: var(--gold);
}

/* власна іконка очищення замість стандартної браузерної */
.header-search__input::-webkit-search-cancel-button {
  display: none;
  appearance: none;
}

.header-search__clear {
  position: absolute;
  top: 50%;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-top: -12px;
  padding: 0;
  color: var(--text-muted);
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.header-search__clear:hover {
  color: var(--gold);
}

.header-search__all {
  display: block;
  margin-top: 8px;
  padding: 10px 8px 2px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: var(--gold);
  text-decoration: none;
  border-top: 1px solid var(--border);
}

.header-search__all:hover {
  text-decoration: underline;
}

.header-search__list {
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.header-search__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 6px;
}

.header-search__item:hover {
  background: var(--bg-secondary);
}

.header-search__thumb {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 4px;
  background: var(--bg-secondary);
}

.header-search__title {
  font-size: 14px;
}

.header-search__empty {
  margin: 12px 0 4px;
  font-size: 14px;
  color: var(--text-muted);
  text-align: center;
}
</style>
