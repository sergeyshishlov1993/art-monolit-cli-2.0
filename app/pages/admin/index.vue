<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const stats = ref([
  { label: 'Товарів', value: '—', icon: 'cube' },
  { label: 'Категорій', value: '—', icon: 'rectangle-group' },
  { label: 'Робіт', value: '—', icon: 'photo' },
  { label: 'Нових заявок', value: '—', icon: 'envelope', accent: true },
])

const recentLeads = ref<{ id: string; name: string; phone: string; status: string; createdAt: string }[]>([])

onMounted(async () => {
  // TODO: fetch from API
})
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
            <td>{{ lead.phone }}</td>
            <td>{{ lead.status }}</td>
            <td>{{ lead.createdAt }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="recentLeads.length" class="dashboard__leads-cards">
        <div v-for="lead in recentLeads" :key="lead.id" class="dashboard__lead-card">
          <div class="dashboard__lead-card-header">
            <span class="dashboard__lead-card-name">{{ lead.name }}</span>
            <span class="dashboard__lead-card-status">{{ lead.status }}</span>
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
              <span class="dashboard__lead-card-value dashboard__lead-card-value--muted">{{ lead.createdAt }}</span>
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
  grid-template-columns: repeat(4, 1fr);
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

.dashboard__leads-cards {
  display: none;
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
    color: var(--text-muted);
    font-weight: 500;
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