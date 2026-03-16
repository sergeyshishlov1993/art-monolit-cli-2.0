<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCategoryStore } from '~/modules/category/CategoryStore'
import { useProductStore } from '~/modules/product/ProductStore'
import type { Product } from '~/modules/product/types'

definePageMeta({ layout: 'admin' })

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const search = ref('')
const selectedCategoryId = ref('')
const loadMoreTrigger = ref<HTMLElement | null>(null)

let intersectionObserver: IntersectionObserver | null = null

const categoryOptions = computed(() => [
  { value: '', label: 'Всі категорії' },
  ...categoryStore.categories.map(cat => ({ value: cat.id, label: cat.name })),
])

const filteredProducts = computed<Product[]>(() => {
  const query = search.value.trim().toLowerCase()

  return productStore.products.filter((product: Product) => {
    const matchesCategory = selectedCategoryId.value
        ? product.categoryId === selectedCategoryId.value
        : true

    const matchesSearch = query
        ? product.title.toLowerCase().includes(query)
        : true

    return matchesCategory && matchesSearch
  })
})

const { pending } = await useAsyncData('admin-products', async (): Promise<true> => {
  await Promise.all([
    categoryStore.categories.length ? Promise.resolve() : categoryStore.fetchAll(true),
    productStore.fetchAll({ all: true }),
  ])
  return true
})

async function deleteProduct(productId: string): Promise<void> {
  await productStore.remove(productId)
  await productStore.fetchAll({ all: true })
}

async function loadMore(): Promise<void> {
  if (productStore.isLoading || !productStore.hasMore) {
    return
  }

  await productStore.fetchMore({ all: true })
}

function setupIntersectionObserver(): void {
  if (!loadMoreTrigger.value) {
    return
  }

  intersectionObserver = new IntersectionObserver(
      async (entries: IntersectionObserverEntry[]) => {
        const targetEntry = entries[0]

        if (!targetEntry?.isIntersecting) {
          return
        }

        await loadMore()
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0,
      },
  )

  intersectionObserver.observe(loadMoreTrigger.value)
}

watch(loadMoreTrigger, () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }

  setupIntersectionObserver()
})

onMounted(() => {
  setupIntersectionObserver()
})

onBeforeUnmount(() => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
})
</script>

<template>
  <div class="admin-list">
    <div class="admin-list__header">
      <h1 class="admin-list__title">Товари</h1>
      <NuxtLink to="/admin/products/create">
        <BButton>+ Додати</BButton>
      </NuxtLink>
    </div>

    <div class="admin-list__toolbar">
      <BInput v-model="search" placeholder="Пошук товару..." />

      <BSelect v-model="selectedCategoryId" :options="categoryOptions" />
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
        <tr>
          <th>Назва</th>
          <th>Категорія</th>
          <th>Варіанти</th>
          <th>Фото</th>
          <th>Статус</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="pending">
          <td colspan="6" class="admin-table__empty">Завантаження...</td>
        </tr>
        <tr v-else-if="!filteredProducts.length">
          <td colspan="6" class="admin-table__empty">Товарів немає</td>
        </tr>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td class="admin-table__bold">{{ product.title }}</td>
          <td>{{ product.category?.name || '—' }}</td>
          <td>{{ product._count?.variants || product.variants?.length || 0 }}</td>
          <td>{{ product._count?.images || product.images?.length || 0 }}</td>
          <td>
              <span class="admin-badge" :class="product.isActive ? 'admin-badge--green' : 'admin-badge--gray'">
                {{ product.isActive ? 'Активний' : 'Вимкнений' }}
              </span>
          </td>
          <td class="admin-table__actions">
            <NuxtLink :to="`/admin/products/${product.id}`" class="admin-action">
              <BIcon name="pencil" size="sm" />
            </NuxtLink>
            <button class="admin-action admin-action--delete" @click="deleteProduct(product.id)">
              <BIcon name="trash" size="sm" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="admin-cards">
      <div v-if="pending" class="admin-cards__empty">Завантаження...</div>
      <div v-else-if="!filteredProducts.length" class="admin-cards__empty">Товарів немає</div>
      <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="admin-card"
      >
        <NuxtLink :to="`/admin/products/${product.id}`" class="admin-card__link">
          <div class="admin-card__header">
            <span class="admin-card__name">{{ product.title }}</span>
            <span class="admin-badge" :class="product.isActive ? 'admin-badge--green' : 'admin-badge--gray'">
              {{ product.isActive ? 'Активний' : 'Вимкнений' }}
            </span>
          </div>
          <div class="admin-card__body">
            <div class="admin-card__row">
              <span class="admin-card__label">Категорія</span>
              <span class="admin-card__value">{{ product.category?.name || '—' }}</span>
            </div>
            <div class="admin-card__row">
              <span class="admin-card__label">Варіанти</span>
              <span class="admin-card__value">{{ product._count?.variants || product.variants?.length || 0 }}</span>
            </div>
            <div class="admin-card__row">
              <span class="admin-card__label">Фото</span>
              <span class="admin-card__value">{{ product._count?.images || product.images?.length || 0 }}</span>
            </div>
          </div>
        </NuxtLink>
        <div class="admin-card__footer">
          <NuxtLink :to="`/admin/products/${product.id}`" class="admin-action">
            <BIcon name="pencil" size="sm" />
          </NuxtLink>
          <button class="admin-action admin-action--delete" @click="deleteProduct(product.id)">
            <BIcon name="trash" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <div ref="loadMoreTrigger" class="admin-list__load-more-trigger" />

    <div v-if="productStore.isLoading && !pending" class="admin-list__loading-more">
      Завантаження...
    </div>
  </div>
</template>

<style scoped>
.admin-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 12px;
}

.admin-list__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-list__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 240px);
  gap: 12px;
  margin-bottom: 16px;
}

.admin-action--delete {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  transition: color 0.15s;
}

.admin-action--delete:hover {
  color: var(--error, #dc3545);
}

.admin-cards {
  display: none;
}

.admin-list__load-more-trigger {
  width: 100%;
  height: 1px;
}

.admin-list__loading-more {
  padding: 16px 0;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .admin-list__title {
    font-size: 20px;
  }

  .admin-list__toolbar {
    grid-template-columns: 1fr;
  }

  .admin-table-wrap {
    display: none;
  }

  .admin-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .admin-cards__empty {
    padding: 32px 16px;
    text-align: center;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .admin-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    transition: border-color 0.15s;
  }

  .admin-card__link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .admin-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 8px;
  }

  .admin-card__name {
    font-weight: 600;
    font-size: 15px;
    color: var(--text-primary);
  }

  .admin-card__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .admin-card__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .admin-card__label {
    color: var(--text-secondary);
  }

  .admin-card__value {
    color: var(--text-primary);
    font-weight: 500;
  }

  .admin-card__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 12px;
    margin-top: 12px;
    border-top: 1px solid var(--border);
    color: var(--text-muted);
  }
}
</style>