<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePortfolioStore } from '~/modules/portfolio/PortfolioStore'
import { ROUTES } from '~/modules/common/constants/routes'

definePageMeta({ layout: 'admin' })

const portfolioStore = usePortfolioStore()
const search = ref('')

const filtered = computed(() => portfolioStore.filteredBySearch(search.value))

const { pending } = await useAsyncData('admin-portfolio', () =>
    portfolioStore.fetchAll({ all: true })
)

async function deleteWork(workId: string) {
  await portfolioStore.remove(workId)
  await portfolioStore.fetchAll({ all: true })
}
</script>

<template>
  <div class="admin-list">
    <div class="admin-list__header">
      <h1 class="admin-list__title">Портфоліо</h1>
      <NuxtLink :to="ROUTES.ADMIN.PORTFOLIO_CREATE">
        <BButton>+ Додати</BButton>
      </NuxtLink>
    </div>

    <div class="admin-list__toolbar">
      <BInput v-model="search" placeholder="Пошук роботи..." />
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
        <tr>
          <th>Назва</th>
          <th>Категорія</th>
          <th>Матеріал</th>
          <th>Фото</th>
          <th>Статус</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="pending">
          <td colspan="6" class="admin-table__empty">Завантаження...</td>
        </tr>
        <tr v-else-if="!filtered.length">
          <td colspan="6" class="admin-table__empty">Робіт немає</td>
        </tr>
        <tr v-for="item in filtered" :key="item.id">
          <td class="admin-table__bold">{{ item.title }}</td>
          <td>{{ item.category || '—' }}</td>
          <td>{{ item.material || '—' }}</td>
          <td>{{ item._count?.images || item.images?.length || 0 }}</td>
          <td>
            <span class="admin-badge" :class="item.isActive ? 'admin-badge--green' : 'admin-badge--gray'">
              {{ item.isActive ? 'Активний' : 'Вимкнений' }}
            </span>
          </td>
          <td class="admin-table__actions">
            <NuxtLink :to="ROUTES.ADMIN.PORTFOLIO_EDIT(item.id)" class="admin-action">
              <BIcon name="pencil" size="sm" />
            </NuxtLink>
            <button class="admin-action admin-action--delete" @click="deleteWork(item.id)">
              <BIcon name="trash" size="sm" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="admin-cards">
      <div v-if="pending" class="admin-cards__empty">Завантаження...</div>
      <div v-else-if="!filtered.length" class="admin-cards__empty">Робіт немає</div>
      <div
          v-for="item in filtered"
          :key="item.id"
          class="admin-card"
      >
        <NuxtLink :to="ROUTES.ADMIN.PORTFOLIO_EDIT(item.id)" class="admin-card__link">
          <div class="admin-card__header">
            <span class="admin-card__name">{{ item.title }}</span>
            <span class="admin-badge" :class="item.isActive ? 'admin-badge--green' : 'admin-badge--gray'">
              {{ item.isActive ? 'Активний' : 'Вимкнений' }}
            </span>
          </div>
          <div class="admin-card__body">
            <div class="admin-card__row">
              <span class="admin-card__label">Категорія</span>
              <span class="admin-card__value">{{ item.category || '—' }}</span>
            </div>
            <div class="admin-card__row">
              <span class="admin-card__label">Матеріал</span>
              <span class="admin-card__value">{{ item.material || '—' }}</span>
            </div>
            <div class="admin-card__row">
              <span class="admin-card__label">Фото</span>
              <span class="admin-card__value">{{ item._count?.images || item.images?.length || 0 }}</span>
            </div>
          </div>
        </NuxtLink>
        <div class="admin-card__footer">
          <NuxtLink :to="ROUTES.ADMIN.PORTFOLIO_EDIT(item.id)" class="admin-action">
            <BIcon name="pencil" size="sm" />
          </NuxtLink>
          <button class="admin-action admin-action--delete" @click="deleteWork(item.id)">
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