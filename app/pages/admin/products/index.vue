<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '~/modules/product/ProductStore'

definePageMeta({ layout: 'admin' })

const productStore = useProductStore()
const search = ref('')

const filteredProducts = computed(() => productStore.filteredBySearch(search.value))

const { pending } = await useAsyncData('admin-products', () =>
    productStore.fetchAll({ all: true })
)

async function deleteProduct(productId: string) {
  await productStore.remove(productId)
  await productStore.fetchAll({ all: true })
}
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
  margin-bottom: 16px;
  max-width: 320px;
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

@media (max-width: 768px) {
  .admin-list__title {
    font-size: 20px;
  }

  .admin-list__toolbar {
    max-width: 100%;
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