<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import { useLeadApi } from '~/modules/lead/LeadApi'
import { useLeadFormat } from '~/modules/lead/composables/useLeadFormat'
import { useLeadStore } from '~/modules/lead/LeadStore'
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '~/modules/lead/constants'
import LeadRow from '~/modules/lead/components/LeadRow.vue'
import LeadDrawer from '~/modules/lead/components/LeadDrawer.vue'
import type { LeadResponse, LeadStatus } from '~/modules/lead/types'

definePageMeta({ layout: 'admin' })

type LeadUpdatePayload = {
  name: string
  phone: string
  email: string | null
  message: string | null
  status: string
  adminComment?: string
}

const leadStore = useLeadStore()

const statusFilter = ref<string>('')
const sourceFilter = ref<string>('')
const search = ref<string>('')
const debouncedSearch = refDebounced(search, 400)
const isExporting = ref<boolean>(false)
const drawerOpen = ref<boolean>(false)
const loadMoreTrigger = ref<HTMLDivElement | null>(null)

let observer: IntersectionObserver | null = null

const hasLeads = computed<boolean>(() => leadStore.leads.length > 0)

async function fetchLeads(): Promise<void> {
  await leadStore.fetchAll({
    status: statusFilter.value || undefined,
    source: sourceFilter.value || undefined,
    search: debouncedSearch.value || undefined,
    page: 1,
    limit: 20,
  })
}

function openDetail(lead: LeadResponse): void {
  leadStore.selectedLead = lead
  drawerOpen.value = true
}

function closeDrawer(): void {
  drawerOpen.value = false
}

async function updateLead(payload: LeadUpdatePayload): Promise<void> {
  if (!leadStore.selectedLead) {
    return
  }

  await leadStore.update(leadStore.selectedLead.id, {
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    message: payload.message,
    status: payload.status as LeadStatus,
    adminComment: payload.adminComment,
  })
}

async function deleteLead(): Promise<void> {
  if (!leadStore.selectedLead) {
    return
  }

  await leadStore.remove(leadStore.selectedLead.id)
  closeDrawer()
}

async function changeStatus(leadId: string, status: LeadStatus): Promise<void> {
  await leadStore.update(leadId, { status })
}

function csvCell(value: string | null | undefined): string {
  const text = (value ?? '').replace(/"/g, '""')
  // захист від формул у Excel (=, +, -, @)
  return /^[=+\-@]/.test(text) ? `"'${text}"` : `"${text}"`
}

async function exportCsv(): Promise<void> {
  isExporting.value = true

  try {
    const { formatDate, formatNumber } = useLeadFormat()
    const response = await useLeadApi().findAll({
      status: statusFilter.value || undefined,
      source: sourceFilter.value || undefined,
      search: debouncedSearch.value || undefined,
      page: 1,
      limit: 10000,
    })

    const header = ['№', 'Ім\'я', 'Телефон', 'Email', 'Статус', 'Джерело', 'Товар', 'Повідомлення', 'Дата']
    const rows = response.items.map((lead: LeadResponse) => [
      formatNumber(lead.number),
      lead.name,
      lead.phone,
      lead.email,
      lead.status,
      lead.source,
      lead.product?.title,
      lead.message,
      formatDate(lead.createdAt),
    ].map(csvCell).join(','))

    const blob = new Blob(['\uFEFF' + [header.map(csvCell).join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  } finally {
    isExporting.value = false
  }
}

async function deleteLeadFromList(leadId: string): Promise<void> {
  await leadStore.remove(leadId)
}

async function handleIntersection(entries: IntersectionObserverEntry[]): Promise<void> {
  const [entry] = entries

  if (!entry?.isIntersecting) {
    return
  }

  await leadStore.fetchNextPage()
}

async function initObserver(): Promise<void> {
  await nextTick()

  if (observer) {
    observer.disconnect()
  }

  if (!loadMoreTrigger.value) {
    return
  }

  observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        void handleIntersection(entries)
      },
      {
        root: null,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0,
      },
  )

  observer.observe(loadMoreTrigger.value)
}

await useAsyncData('admin-leads', async (): Promise<null> => {
  await fetchLeads()
  return null
})

watch([statusFilter, sourceFilter, debouncedSearch], async (): Promise<void> => {
  await fetchLeads()
  await initObserver()
})

watch(loadMoreTrigger, async (): Promise<void> => {
  await initObserver()
})

await initObserver()

onBeforeUnmount((): void => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="leads">
    <div class="leads__header">
      <h1 class="leads__title">Заявки</h1>
      <div class="leads__search">
        <BInput v-model="search" placeholder="Пошук: ім'я, телефон, email" />
      </div>
      <BButton variant="outline" size="sm" :loading="isExporting" @click="exportCsv">
        Експорт CSV
      </BButton>
      <div class="leads__source-filter">
        <BSelect
            v-model="sourceFilter"
            :options="SOURCE_OPTIONS"
            placeholder="Джерело..."
        />
      </div>
    </div>

    <div class="leads__tabs">
      <button
          v-for="opt in STATUS_OPTIONS"
          :key="opt.value"
          class="leads__tab"
          :class="{ 'leads__tab--active': statusFilter === opt.value }"
          @click="statusFilter = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>

    <div v-if="leadStore.isLoading" class="leads__empty">
      Завантаження...
    </div>

    <div v-else-if="!hasLeads" class="leads__empty">
      Заявок немає
    </div>

    <div v-else class="leads__list">
      <LeadRow
          v-for="lead in leadStore.leads"
          :key="lead.id"
          :lead="lead"
          :is-selected="leadStore.selectedLead?.id === lead.id"
          @click="openDetail(lead)"
          @delete="deleteLeadFromList(lead.id)"
          @status="changeStatus(lead.id, $event)"
      />

      <div
          v-if="leadStore.hasMore"
          ref="loadMoreTrigger"
          class="leads__load-more-trigger"
      />

      <div v-if="leadStore.isLoadingMore" class="leads__more-loading">
        Завантаження...
      </div>
    </div>

    <LeadDrawer
        v-model="drawerOpen"
        :lead="leadStore.selectedLead"
        @update="updateLead"
        @delete="deleteLead"
    />
  </div>
</template>

<style scoped>
.leads__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.leads__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.leads__search {
  flex: 1;
  max-width: 320px;
  margin-left: auto;
}

.leads__source-filter {
  width: 180px;
}

.leads__tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
}

.leads__tab {
  all: unset;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  border-radius: 6px;
  transition: all 0.15s;
  white-space: nowrap;
}

.leads__tab:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.leads__tab--active {
  background: var(--bg-secondary);
  color: var(--gold);
}

.leads__empty {
  padding: 48px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

.leads__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leads__load-more-trigger {
  width: 100%;
  height: 1px;
}

.leads__more-loading {
  padding: 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .leads__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .leads__title {
    font-size: 20px;
  }

  .leads__source-filter {
    width: 100%;
  }

  .leads__tab {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>