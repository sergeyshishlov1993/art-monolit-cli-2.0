<script setup lang="ts">
import { useAdminCounts } from '~/modules/admin/composables/useAdminCounts'
import { useLeadStore } from '~/modules/lead/LeadStore'
import { useLeadApi } from '~/modules/lead/LeadApi'
import { SOURCE_OPTIONS, STATUS_LABELS } from '~/modules/lead/constants'
import type { LeadResponse, LeadStats } from '~/modules/lead/types'

definePageMeta({ layout: 'admin' })

const { categories, products, portfolios, leads: leadsCount, heroSlides } = useAdminCounts()
const leadStore = useLeadStore()

const recentLeads = ref<LeadResponse[]>([])
const leadStats = ref<LeadStats | null>(null)
const leadApi = useLeadApi()

const stats = computed(() => [
  { label: 'Товарів', value: products.value, icon: 'cube' },
  { label: 'Категорій', value: categories.value, icon: 'rectangle-group' },
  { label: 'Робіт', value: portfolios.value, icon: 'photo' },
  { label: 'Слайдів', value: heroSlides.value, icon: 'sparkles' },
  { label: 'Нових заявок', value: leadsCount.value, icon: 'envelope', accent: true },
])

const statusMap: Record<string, string> = {
  NEW: 'Нова',
  IN_PROGRESS: 'В роботі',
  DONE: 'Завершена',
  CANCELED: 'Скасована',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

await useAsyncData('admin-dashboard', async (): Promise<null> => {
  const response = await leadStore.fetchAll({ limit: 5, page: 1 })
  recentLeads.value = response.items
  leadStats.value = await leadApi.stats()
  return null
}, { server: false }) // токен адміна є лише в браузері, тож на сервері запити заявок падають з 401

const maxDayCount = computed(() => Math.max(1, ...(leadStats.value?.byDay.map(day => day.count) ?? [0])))
const maxUtmCount = computed(() => Math.max(1, ...(leadStats.value?.byUtm.map(item => item.count) ?? [0])))
const maxSourceCount = computed(() => Math.max(1, ...(leadStats.value?.bySource.map(item => item.count) ?? [0])))

function sourceLabel(source: string): string {
  return SOURCE_OPTIONS.find(option => option.value === source)?.label ?? source
}

function dayLabel(date: string): string {
  const [, month, day] = date.split('-')
  return `${day}.${month}`
}

function percent(count: number): number {
  return leadStats.value?.total ? Math.round((count / leadStats.value.total) * 100) : 0
}
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard__title">Дашборд</h1>

    <div class="dashboard__stats">
      <div
          v-for="stat in stats"
          :key="stat.label"
          class="dashboard__stat"
          :class="{ 'dashboard__stat--accent': stat.accent }"
      >
        <div class="dashboard__stat-icon">
          <BIcon :name="stat.icon" size="md" />
        </div>
        <div class="dashboard__stat-info">
          <span class="dashboard__stat-value">{{ stat.value }}</span>
          <span class="dashboard__stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <div v-if="leadStats && leadStats.total" class="dashboard__charts">
      <div class="dashboard__section dashboard__section--wide">
        <h2 class="dashboard__section-title">Заявки за 14 днів</h2>
        <div class="chart" role="img" :aria-label="`Заявки за 14 днів: ${leadStats.byDay.map(day => `${dayLabel(day.date)} — ${day.count}`).join(', ')}`">
          <div v-for="day in leadStats.byDay" :key="day.date" class="chart__col" :title="`${dayLabel(day.date)}: ${day.count}`">
            <span class="chart__value">{{ day.count || '' }}</span>
            <span class="chart__bar" :style="{ height: `${Math.max(2, (day.count / maxDayCount) * 100)}%` }" />
            <span class="chart__label">{{ dayLabel(day.date) }}</span>
          </div>
        </div>
      </div>

      <div class="dashboard__section">
        <h2 class="dashboard__section-title">Джерела заявок</h2>
        <ul class="bars">
          <li v-for="item in leadStats.bySource" :key="item.source" class="bars__row">
            <span class="bars__label">{{ sourceLabel(item.source) }}</span>
            <span class="bars__track"><span class="bars__fill" :style="{ width: `${(item.count / maxSourceCount) * 100}%` }" /></span>
            <span class="bars__count">{{ item.count }}</span>
          </li>
        </ul>
      </div>

      <div class="dashboard__section">
        <h2 class="dashboard__section-title">Статуси</h2>
        <ul class="bars">
          <li v-for="item in leadStats.byStatus" :key="item.status" class="bars__row">
            <span class="bars__label">{{ STATUS_LABELS[item.status]?.label ?? item.status }}</span>
            <span class="bars__track"><span class="bars__fill" :style="{ width: `${percent(item.count)}%` }" /></span>
            <span class="bars__count">{{ item.count }} · {{ percent(item.count) }}%</span>
          </li>
        </ul>
      </div>

      <div v-if="leadStats.byUtm.length" class="dashboard__section dashboard__section--wide">
        <h2 class="dashboard__section-title">Реклама (UTM): джерело / кампанія</h2>
        <ul class="bars bars--wide-label">
          <li v-for="item in leadStats.byUtm" :key="`${item.source}-${item.campaign}`" class="bars__row">
            <span class="bars__label">{{ item.source }} / {{ item.campaign || '—' }}</span>
            <span class="bars__track"><span class="bars__fill" :style="{ width: `${(item.count / maxUtmCount) * 100}%` }" /></span>
            <span class="bars__count">{{ item.count }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="dashboard__section">
      <div class="dashboard__section-header">
        <h2 class="dashboard__section-title">Останні заявки</h2>
        <NuxtLink to="/admin/leads" class="dashboard__section-link">Усі заявки →</NuxtLink>
      </div>

      <div v-if="!recentLeads.length" class="dashboard__empty">
        Заявок поки немає
      </div>

      <div v-else class="dashboard__table-wrap">
        <table class="dashboard__table">
          <thead>
          <tr>
            <th>Ім'я</th>
            <th>Телефон</th>
            <th>Статус</th>
            <th>Дата</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="lead in recentLeads" :key="lead.id">
            <td>{{ lead.name }}</td>
            <td>
              <a :href="`tel:${lead.phone}`" class="dashboard__phone">
                {{ lead.phone }}
              </a>
            </td>
            <td>
                                <span
                                    class="dashboard__status"
                                    :class="`dashboard__status--${lead.status.toLowerCase()}`"
                                >
                                    {{ statusMap[lead.status] ?? lead.status }}
                                </span>
            </td>
            <td class="dashboard__date">{{ formatDate(lead.createdAt) }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="recentLeads.length" class="dashboard__leads-cards">
        <div v-for="lead in recentLeads" :key="lead.id" class="dashboard__lead-card">
          <div class="dashboard__lead-card-header">
            <span class="dashboard__lead-card-name">{{ lead.name }}</span>
            <span
                class="dashboard__lead-card-status"
                :class="`dashboard__status--${lead.status.toLowerCase()}`"
            >
                            {{ statusMap[lead.status] ?? lead.status }}
                        </span>
          </div>
          <div class="dashboard__lead-card-body">
            <div class="dashboard__lead-card-row">
              <span class="dashboard__lead-card-label">Телефон</span>
              <a :href="`tel:${lead.phone}`" class="dashboard__lead-card-value dashboard__lead-card-value--link" @click.stop>
                {{ lead.phone }}
              </a>
            </div>
            <div class="dashboard__lead-card-row">
              <span class="dashboard__lead-card-label">Дата</span>
              <span class="dashboard__lead-card-value dashboard__lead-card-value--muted">
                                {{ formatDate(lead.createdAt) }}
                            </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard__title {
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.dashboard__stat {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.dashboard__stat--accent {
  border-color: var(--gold);
}

.dashboard__stat-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 8px;
  color: var(--text-muted);
}

.dashboard__stat--accent .dashboard__stat-icon {
  background: rgba(var(--gold-rgb, 181 155 75) / 0.1);
  color: var(--gold);
}

.dashboard__stat-info {
  display: flex;
  flex-direction: column;
}

.dashboard__stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.dashboard__stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.dashboard__charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.dashboard__section--wide {
  grid-column: 1 / -1;
}

.chart {
  display: flex;
  align-items: stretch;
  gap: 6px;
  height: 180px;
  margin-top: 16px;
}

.chart__col {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  min-width: 0;
}

.chart__bar {
  display: block;
  width: 100%;
  max-width: 28px;
  background: var(--gold);
  border-radius: 4px 4px 0 0;
  opacity: 0.85;
  transition: opacity 0.2s;
}

.chart__col:hover .chart__bar {
  opacity: 1;
}

.chart__value {
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart__label {
  margin-top: 6px;
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.bars__row {
  display: grid;
  grid-template-columns: 120px 1fr 72px;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-primary);
}

.bars--wide-label .bars__row {
  grid-template-columns: 260px 1fr 48px;
}

.bars__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bars__track {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.bars__fill {
  display: block;
  height: 100%;
  background: var(--gold);
  border-radius: 4px;
}

.bars__count {
  text-align: right;
  color: var(--text-muted);
  white-space: nowrap;
}

@media (max-width: 900px) {
  .dashboard__charts {
    grid-template-columns: 1fr;
  }

  .bars__row {
    grid-template-columns: 100px 1fr 64px;
  }
}

.dashboard__section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
}

.dashboard__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.dashboard__section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.dashboard__section-link {
  font-size: 13px;
  color: var(--gold);
  text-decoration: none;
}

.dashboard__empty {
  padding: 32px;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}

.dashboard__table-wrap {
  overflow-x: auto;
}

.dashboard__table {
  width: 100%;
  border-collapse: collapse;
}

.dashboard__table th {
  text-align: left;
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
}

.dashboard__table td {
  padding: 12px;
  font-size: 13px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
}

.dashboard__phone {
  color: var(--gold);
  text-decoration: none;
}

.dashboard__date {
  color: var(--text-muted);
  font-size: 12px;
}

.dashboard__status {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
}

.dashboard__status--new {
  background: rgba(59 130 246 / 0.15);
  color: #60a5fa;
}

.dashboard__status--in_progress {
  background: rgba(251 191 36 / 0.15);
  color: #fbbf24;
}

.dashboard__status--done {
  background: rgba(34 197 94 / 0.15);
  color: #22c55e;
}

.dashboard__status--canceled {
  background: rgba(239 68 68 / 0.15);
  color: #ef4444;
}

.dashboard__leads-cards {
  display: none;
}

@media (max-width: 1024px) {
  .dashboard__stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard__title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .dashboard__stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 24px;
  }

  .dashboard__stat {
    padding: 14px;
    gap: 12px;
  }

  .dashboard__stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 6px;
  }

  .dashboard__stat-value {
    font-size: 20px;
  }

  .dashboard__stat-label {
    font-size: 11px;
  }

  .dashboard__section {
    padding: 16px;
  }

  .dashboard__table-wrap {
    display: none;
  }

  .dashboard__leads-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .dashboard__lead-card {
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 12px;
  }

  .dashboard__lead-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 8px;
  }

  .dashboard__lead-card-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-primary);
  }

  .dashboard__lead-card-status {
    font-size: 12px;
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 4px;
  }

  .dashboard__lead-card-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .dashboard__lead-card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .dashboard__lead-card-label {
    color: var(--text-secondary);
  }

  .dashboard__lead-card-value {
    color: var(--text-primary);
    font-weight: 500;
  }

  .dashboard__lead-card-value--link {
    color: var(--gold);
    text-decoration: none;
  }

  .dashboard__lead-card-value--muted {
    color: var(--text-muted);
    font-weight: 400;
    font-size: 12px;
  }
}

@media (max-width: 400px) {
  .dashboard__stats {
    grid-template-columns: 1fr;
  }
}
</style>