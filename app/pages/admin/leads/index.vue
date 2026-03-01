<!--<script setup lang="ts">-->
<!--import { ref, watch } from 'vue'-->
<!--import { useLeadStore } from '~/modules/lead/LeadStore'-->

<!--definePageMeta({ layout: 'admin' })-->

<!--const leadStore = useLeadStore()-->

<!--const statusFilter = ref('')-->
<!--const sourceFilter = ref('')-->
<!--const drawerOpen = ref(false)-->
<!--const editName = ref('')-->
<!--const editPhone = ref('')-->
<!--const editEmail = ref('')-->
<!--const editMessage = ref('')-->
<!--const editComment = ref('')-->
<!--const editStatus = ref('')-->
<!--const deleteConfirm = ref(false)-->
<!--const isEditing = ref(false)-->

<!--const statusOptions = [-->
<!--  { value: '', label: 'Усі' },-->
<!--  { value: 'NEW', label: 'Нові' },-->
<!--  { value: 'IN_PROGRESS', label: 'В роботі' },-->
<!--  { value: 'DONE', label: 'Виконані' },-->
<!--  { value: 'CANCELED', label: 'Скасовані' },-->
<!--]-->

<!--const statusLabels: Record<string, { label: string; variant: string }> = {-->
<!--  NEW: { label: 'Нова', variant: 'blue' },-->
<!--  IN_PROGRESS: { label: 'В роботі', variant: 'yellow' },-->
<!--  DONE: { label: 'Виконана', variant: 'green' },-->
<!--  CANCELED: { label: 'Скасована', variant: 'gray' },-->
<!--}-->

<!--const sourceOptions = [-->
<!--  { value: '', label: 'Усі джерела' },-->
<!--  { value: 'website', label: 'Сайт' },-->
<!--  { value: 'contact_page', label: 'Контакти' },-->
<!--  { value: 'phone', label: 'Телефон' },-->
<!--  { value: 'telegram', label: 'Telegram' },-->
<!--  { value: 'viber', label: 'Viber' },-->
<!--  { value: 'instagram', label: 'Instagram' },-->
<!--  { value: 'referral', label: 'Рекомендація' },-->
<!--  { value: 'other', label: 'Інше' },-->
<!--]-->

<!--const sourceLabels: Record<string, string> = {-->
<!--  website: 'Сайт',-->
<!--  contact_page: 'Контакти',-->
<!--  phone: 'Телефон',-->
<!--  telegram: 'Telegram',-->
<!--  viber: 'Viber',-->
<!--  instagram: 'Instagram',-->
<!--  referral: 'Рекомендація',-->
<!--  other: 'Інше',-->
<!--}-->

<!--function formatDate(dateString: string): string {-->
<!--  return new Date(dateString).toLocaleDateString('uk-UA', {-->
<!--    day: '2-digit',-->
<!--    month: '2-digit',-->
<!--    year: 'numeric',-->
<!--    hour: '2-digit',-->
<!--    minute: '2-digit',-->
<!--  })-->
<!--}-->

<!--function formatNumber(num: number | undefined): string {-->
<!--  if (!num) return '—'-->
<!--  return '#' + String(num).padStart(6, '0')-->
<!--}-->

<!--async function fetchLeads() {-->
<!--  await leadStore.fetchAll({-->
<!--    status: statusFilter.value || undefined,-->
<!--    source: sourceFilter.value || undefined,-->
<!--  })-->
<!--}-->

<!--function fillForm(lead: typeof leadStore.leads[number]) {-->
<!--  editName.value = lead.name-->
<!--  editPhone.value = lead.phone-->
<!--  editEmail.value = lead.email || ''-->
<!--  editMessage.value = lead.message || ''-->
<!--  editComment.value = lead.adminComment || ''-->
<!--  editStatus.value = lead.status-->
<!--}-->

<!--function openDetail(lead: typeof leadStore.leads[number]) {-->
<!--  leadStore.selectedLead = lead-->
<!--  fillForm(lead)-->
<!--  deleteConfirm.value = false-->
<!--  isEditing.value = false-->
<!--  drawerOpen.value = true-->
<!--}-->

<!--function closeDrawer() {-->
<!--  drawerOpen.value = false-->
<!--}-->

<!--function startEdit() {-->
<!--  isEditing.value = true-->
<!--}-->

<!--function cancelEdit() {-->
<!--  if (leadStore.selectedLead) {-->
<!--    fillForm(leadStore.selectedLead)-->
<!--  }-->
<!--  isEditing.value = false-->
<!--}-->

<!--async function updateLead() {-->
<!--  if (!leadStore.selectedLead) return-->
<!--  await leadStore.update(leadStore.selectedLead.id, {-->
<!--    name: editName.value,-->
<!--    phone: editPhone.value,-->
<!--    email: editEmail.value || null,-->
<!--    message: editMessage.value || null,-->
<!--    status: editStatus.value as 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELED',-->
<!--    adminComment: editComment.value || undefined,-->
<!--  })-->
<!--  isEditing.value = false-->
<!--}-->

<!--async function deleteLead() {-->
<!--  if (!leadStore.selectedLead) return-->
<!--  await leadStore.remove(leadStore.selectedLead.id)-->
<!--  deleteConfirm.value = false-->
<!--  closeDrawer()-->
<!--}-->

<!--async function deleteLeadFromList(leadId: string) {-->
<!--  await leadStore.remove(leadId)-->
<!--  await fetchLeads()-->
<!--}-->

<!--function callPhone() {-->
<!--  if (!leadStore.selectedLead) return-->
<!--  window.open(`tel:${leadStore.selectedLead.phone}`)-->
<!--}-->

<!--await useAsyncData('admin-leads', () => fetchLeads())-->

<!--watch([statusFilter, sourceFilter], () => {-->
<!--  fetchLeads()-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--  <div class="leads">-->
<!--    <div class="leads__header">-->
<!--      <h1 class="leads__title">Заявки</h1>-->
<!--      <div class="leads__source-filter">-->
<!--        <BSelect-->
<!--            v-model="sourceFilter"-->
<!--            :options="sourceOptions"-->
<!--            placeholder="Джерело..."-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="leads__tabs">-->
<!--      <button-->
<!--          v-for="opt in statusOptions"-->
<!--          :key="opt.value"-->
<!--          class="leads__tab"-->
<!--          :class="{ 'leads__tab&#45;&#45;active': statusFilter === opt.value }"-->
<!--          @click="statusFilter = opt.value"-->
<!--      >-->
<!--        {{ opt.label }}-->
<!--      </button>-->
<!--    </div>-->

<!--    <div v-if="leadStore.isLoading" class="leads__empty">-->
<!--      Завантаження...-->
<!--    </div>-->
<!--    <div v-else-if="!leadStore.leads.length" class="leads__empty">-->
<!--      Заявок немає-->
<!--    </div>-->
<!--    <div v-else class="leads__list">-->
<!--      <div-->
<!--          v-for="lead in leadStore.leads"-->
<!--          :key="lead.id"-->
<!--          class="lead-row"-->
<!--          :class="{ 'lead-row&#45;&#45;selected': leadStore.selectedLead?.id === lead.id }"-->
<!--          @click="openDetail(lead)"-->
<!--      >-->
<!--        <div class="lead-row__left">-->
<!--          <span class="lead-row__number">{{ formatNumber(lead.number) }}</span>-->
<!--          <div class="lead-row__info">-->
<!--            <span class="lead-row__name">{{ lead.name }}</span>-->
<!--            <span class="lead-row__phone">{{ lead.phone }}</span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="lead-row__right">-->
<!--          <span class="lead-row__badge" :class="`lead-row__badge&#45;&#45;${statusLabels[lead.status].variant}`">-->
<!--            {{ statusLabels[lead.status].label }}-->
<!--          </span>-->
<!--          <span class="lead-row__date">{{ formatDate(lead.createdAt) }}</span>-->
<!--          <button-->
<!--              class="lead-row__delete"-->
<!--              title="Видалити"-->
<!--              @click.stop="deleteLeadFromList(lead.id)"-->
<!--          >-->
<!--            <BIcon name="trash" size="sm" />-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <Teleport to="body">-->
<!--      <Transition name="drawer">-->
<!--        <div v-if="drawerOpen" class="drawer-overlay" @click.self="closeDrawer">-->
<!--          <div class="drawer">-->
<!--            <template v-if="leadStore.selectedLead">-->
<!--              <div class="drawer__header">-->
<!--                <div class="drawer__header-left">-->
<!--                  <span class="drawer__number">{{ formatNumber(leadStore.selectedLead.number) }}</span>-->
<!--                  <span v-if="!isEditing" class="drawer__name">{{ leadStore.selectedLead.name }}</span>-->
<!--                </div>-->
<!--                <div class="drawer__header-actions">-->
<!--                  <button-->
<!--                      v-if="!isEditing"-->
<!--                      class="drawer__edit-btn"-->
<!--                      @click="startEdit"-->
<!--                  >-->
<!--                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />-->
<!--                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />-->
<!--                    </svg>-->
<!--                  </button>-->
<!--                  <button class="drawer__close" @click="closeDrawer">-->
<!--                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--                      <path d="M18 6L6 18M6 6l12 12" />-->
<!--                    </svg>-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="drawer__body">-->
<!--                <div class="drawer__section">-->
<!--                  <div class="drawer__call" @click="callPhone">-->
<!--                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">-->
<!--                      <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />-->
<!--                    </svg>-->
<!--                    <span>{{ leadStore.selectedLead.phone }}</span>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <template v-if="isEditing">-->
<!--                  <div class="drawer__section">-->
<!--                    <h3 class="drawer__section-title">Редагування</h3>-->
<!--                    <div class="drawer__form">-->
<!--                      <BInput v-model="editName" label="Ім'я" />-->
<!--                      <BInput v-model="editPhone" label="Телефон" />-->
<!--                      <BInput v-model="editEmail" label="Email" />-->
<!--                      <BTextarea v-model="editMessage" label="Повідомлення" :rows="2" />-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </template>-->
<!--                <template v-else>-->
<!--                  <div class="drawer__section">-->
<!--                    <h3 class="drawer__section-title">Інформація</h3>-->
<!--                    <div class="drawer__field">-->
<!--                      <span class="drawer__label">Email</span>-->
<!--                      <span class="drawer__value">{{ leadStore.selectedLead.email || '—' }}</span>-->
<!--                    </div>-->
<!--                    <div class="drawer__field">-->
<!--                      <span class="drawer__label">Повідомлення</span>-->
<!--                      <span class="drawer__value">{{ leadStore.selectedLead.message || '—' }}</span>-->
<!--                    </div>-->
<!--                    <div class="drawer__field">-->
<!--                      <span class="drawer__label">Товар</span>-->
<!--                      <span class="drawer__value">{{ leadStore.selectedLead.product?.title || '—' }}</span>-->
<!--                    </div>-->
<!--                    <div class="drawer__field">-->
<!--                      <span class="drawer__label">Джерело</span>-->
<!--                      <span class="drawer__value">{{ sourceLabels[leadStore.selectedLead.source] || leadStore.selectedLead.source }}</span>-->
<!--                    </div>-->
<!--                    <div class="drawer__field">-->
<!--                      <span class="drawer__label">Піксель</span>-->
<!--                      <span class="drawer__value drawer__value&#45;&#45;mono">{{ leadStore.selectedLead.pixel || '—' }}</span>-->
<!--                    </div>-->
<!--                    <div class="drawer__field">-->
<!--                      <span class="drawer__label">Створено</span>-->
<!--                      <span class="drawer__value">{{ formatDate(leadStore.selectedLead.createdAt) }}</span>-->
<!--                    </div>-->
<!--                    <div class="drawer__field">-->
<!--                      <span class="drawer__label">Оновлено</span>-->
<!--                      <span class="drawer__value">{{ formatDate(leadStore.selectedLead.updatedAt) }}</span>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </template>-->

<!--                <div class="drawer__section">-->
<!--                  <h3 class="drawer__section-title">Статус</h3>-->
<!--                  <div class="drawer__status-grid">-->
<!--                    <button-->
<!--                        v-for="opt in statusOptions.filter(o => o.value)"-->
<!--                        :key="opt.value"-->
<!--                        class="drawer__status-btn"-->
<!--                        :class="{-->
<!--                        [`drawer__status-btn&#45;&#45;${statusLabels[opt.value].variant}`]: true,-->
<!--                        'drawer__status-btn&#45;&#45;active': editStatus === opt.value,-->
<!--                      }"-->
<!--                        @click="editStatus = opt.value"-->
<!--                    >-->
<!--                      {{ statusLabels[opt.value].label }}-->
<!--                    </button>-->
<!--                  </div>-->
<!--                </div>-->

<!--                <div class="drawer__section">-->
<!--                  <h3 class="drawer__section-title">Коментар</h3>-->
<!--                  <BTextarea-->
<!--                      v-model="editComment"-->
<!--                      placeholder="Нотатки..."-->
<!--                      :rows="3"-->
<!--                  />-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="drawer__footer">-->
<!--                <div class="drawer__footer-main">-->
<!--                  <template v-if="isEditing">-->
<!--                    <button class="drawer__cancel-btn" @click="cancelEdit">Скасувати</button>-->
<!--                    <BButton style="flex: 1;" @click="updateLead">Зберегти</BButton>-->
<!--                  </template>-->
<!--                  <template v-else>-->
<!--                    <BButton style="width: 100%;" @click="updateLead">Зберегти</BButton>-->
<!--                  </template>-->
<!--                </div>-->
<!--                <template v-if="!deleteConfirm">-->
<!--                  <button class="drawer__delete-btn" @click="deleteConfirm = true">-->
<!--                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
<!--                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14M10 11v6M14 11v6" />-->
<!--                    </svg>-->
<!--                    Видалити заявку-->
<!--                  </button>-->
<!--                </template>-->
<!--                <template v-else>-->
<!--                  <div class="drawer__delete-bar">-->
<!--                    <span class="drawer__delete-text">Видалити {{ formatNumber(leadStore.selectedLead.number) }}?</span>-->
<!--                    <div class="drawer__delete-actions">-->
<!--                      <button class="drawer__delete-cancel" @click="deleteConfirm = false">Ні</button>-->
<!--                      <button class="drawer__delete-yes" @click="deleteLead">Так, видалити</button>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </template>-->
<!--              </div>-->
<!--            </template>-->
<!--          </div>-->
<!--        </div>-->
<!--      </Transition>-->
<!--    </Teleport>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped>-->
<!--.leads__header {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: space-between;-->
<!--  gap: 16px;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.leads__title {-->
<!--  margin: 0;-->
<!--  font-size: 24px;-->
<!--  font-weight: 700;-->
<!--  color: var(&#45;&#45;text-primary);-->
<!--}-->

<!--.leads__source-filter {-->
<!--  width: 180px;-->
<!--}-->

<!--.leads__tabs {-->
<!--  display: flex;-->
<!--  gap: 4px;-->
<!--  margin-bottom: 20px;-->
<!--  overflow-x: auto;-->
<!--  padding-bottom: 4px;-->
<!--  -webkit-overflow-scrolling: touch;-->
<!--}-->

<!--.leads__tab {-->
<!--  all: unset;-->
<!--  cursor: pointer;-->
<!--  padding: 8px 16px;-->
<!--  font-size: 13px;-->
<!--  font-weight: 500;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  border-radius: 6px;-->
<!--  transition: all 0.15s;-->
<!--  white-space: nowrap;-->
<!--}-->

<!--.leads__tab:hover {-->
<!--  background: var(&#45;&#45;bg-secondary);-->
<!--  color: var(&#45;&#45;text-primary);-->
<!--}-->

<!--.leads__tab&#45;&#45;active {-->
<!--  background: var(&#45;&#45;bg-secondary);-->
<!--  color: var(&#45;&#45;gold);-->
<!--}-->

<!--.leads__empty {-->
<!--  padding: 48px 16px;-->
<!--  text-align: center;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  font-size: 14px;-->
<!--}-->

<!--.leads__list {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 8px;-->
<!--}-->

<!--.lead-row {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: space-between;-->
<!--  gap: 16px;-->
<!--  padding: 14px 18px;-->
<!--  background: var(&#45;&#45;bg-card);-->
<!--  border: 1px solid var(&#45;&#45;border);-->
<!--  border-radius: 10px;-->
<!--  cursor: pointer;-->
<!--  transition: border-color 0.15s, box-shadow 0.15s;-->
<!--}-->

<!--.lead-row:hover {-->
<!--  border-color: var(&#45;&#45;gold);-->
<!--}-->

<!--.lead-row&#45;&#45;selected {-->
<!--  border-color: var(&#45;&#45;gold);-->
<!--  box-shadow: 0 0 0 1px var(&#45;&#45;gold);-->
<!--}-->

<!--.lead-row__left {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 14px;-->
<!--  min-width: 0;-->
<!--}-->

<!--.lead-row__number {-->
<!--  font-family: monospace;-->
<!--  font-size: 12px;-->
<!--  color: var(&#45;&#45;gold);-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.lead-row__info {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 2px;-->
<!--  min-width: 0;-->
<!--}-->

<!--.lead-row__name {-->
<!--  font-size: 14px;-->
<!--  font-weight: 600;-->
<!--  color: var(&#45;&#45;text-primary);-->
<!--  white-space: nowrap;-->
<!--  overflow: hidden;-->
<!--  text-overflow: ellipsis;-->
<!--}-->

<!--.lead-row__phone {-->
<!--  font-size: 12px;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--}-->

<!--.lead-row__right {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 12px;-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.lead-row__badge {-->
<!--  padding: 4px 10px;-->
<!--  font-size: 11px;-->
<!--  font-weight: 600;-->
<!--  border-radius: 20px;-->
<!--  white-space: nowrap;-->
<!--}-->

<!--.lead-row__badge&#45;&#45;blue {-->
<!--  background: rgba(59, 130, 246, 0.1);-->
<!--  color: #3b82f6;-->
<!--}-->

<!--.lead-row__badge&#45;&#45;yellow {-->
<!--  background: rgba(234, 179, 8, 0.1);-->
<!--  color: #ca8a04;-->
<!--}-->

<!--.lead-row__badge&#45;&#45;green {-->
<!--  background: rgba(34, 197, 94, 0.1);-->
<!--  color: #16a34a;-->
<!--}-->

<!--.lead-row__badge&#45;&#45;gray {-->
<!--  background: rgba(148, 163, 184, 0.1);-->
<!--  color: #94a3b8;-->
<!--}-->

<!--.lead-row__date {-->
<!--  font-size: 12px;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  white-space: nowrap;-->
<!--}-->

<!--.lead-row__delete {-->
<!--  all: unset;-->
<!--  cursor: pointer;-->
<!--  padding: 4px;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  transition: color 0.15s;-->
<!--}-->

<!--.lead-row__delete:hover {-->
<!--  color: var(&#45;&#45;error, #dc3545);-->
<!--}-->

<!--.drawer-overlay {-->
<!--  position: fixed;-->
<!--  inset: 0;-->
<!--  background: rgba(0, 0, 0, 0.4);-->
<!--  z-index: 1000;-->
<!--  display: flex;-->
<!--  justify-content: flex-end;-->
<!--}-->

<!--.drawer {-->
<!--  width: 440px;-->
<!--  max-width: 100%;-->
<!--  height: 100%;-->
<!--  background: var(&#45;&#45;bg-card);-->
<!--  border-left: 1px solid var(&#45;&#45;border);-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.drawer__header {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: space-between;-->
<!--  gap: 12px;-->
<!--  padding: 20px 24px;-->
<!--  border-bottom: 1px solid var(&#45;&#45;border);-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.drawer__header-left {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 10px;-->
<!--  min-width: 0;-->
<!--}-->

<!--.drawer__header-actions {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 4px;-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.drawer__number {-->
<!--  font-family: monospace;-->
<!--  font-size: 14px;-->
<!--  font-weight: 700;-->
<!--  color: var(&#45;&#45;gold);-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.drawer__name {-->
<!--  font-size: 18px;-->
<!--  font-weight: 700;-->
<!--  color: var(&#45;&#45;text-primary);-->
<!--  white-space: nowrap;-->
<!--  overflow: hidden;-->
<!--  text-overflow: ellipsis;-->
<!--}-->

<!--.drawer__edit-btn {-->
<!--  all: unset;-->
<!--  cursor: pointer;-->
<!--  padding: 6px;-->
<!--  border-radius: 6px;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  transition: background 0.15s, color 0.15s;-->
<!--}-->

<!--.drawer__edit-btn:hover {-->
<!--  background: var(&#45;&#45;bg-secondary);-->
<!--  color: var(&#45;&#45;gold);-->
<!--}-->

<!--.drawer__close {-->
<!--  all: unset;-->
<!--  cursor: pointer;-->
<!--  padding: 6px;-->
<!--  border-radius: 6px;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  transition: background 0.15s, color 0.15s;-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.drawer__close:hover {-->
<!--  background: var(&#45;&#45;bg-secondary);-->
<!--  color: var(&#45;&#45;text-primary);-->
<!--}-->

<!--.drawer__body {-->
<!--  flex: 1;-->
<!--  overflow-y: auto;-->
<!--  padding: 24px;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 24px;-->
<!--}-->

<!--.drawer__section {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 10px;-->
<!--}-->

<!--.drawer__section-title {-->
<!--  margin: 0;-->
<!--  font-size: 11px;-->
<!--  font-weight: 700;-->
<!--  text-transform: uppercase;-->
<!--  letter-spacing: 0.1em;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--}-->

<!--.drawer__call {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 10px;-->
<!--  padding: 14px 18px;-->
<!--  background: rgba(196, 166, 109, 0.08);-->
<!--  border: 1px solid rgba(196, 166, 109, 0.2);-->
<!--  border-radius: 10px;-->
<!--  cursor: pointer;-->
<!--  font-size: 16px;-->
<!--  font-weight: 600;-->
<!--  color: var(&#45;&#45;gold);-->
<!--  transition: background 0.15s;-->
<!--}-->

<!--.drawer__call:hover {-->
<!--  background: rgba(196, 166, 109, 0.15);-->
<!--}-->

<!--.drawer__form {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 12px;-->
<!--}-->

<!--.drawer__field {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: baseline;-->
<!--  gap: 12px;-->
<!--  padding: 6px 0;-->
<!--  border-bottom: 1px solid var(&#45;&#45;border);-->
<!--}-->

<!--.drawer__field:last-of-type {-->
<!--  border-bottom: none;-->
<!--}-->

<!--.drawer__label {-->
<!--  font-size: 12px;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  flex-shrink: 0;-->
<!--}-->

<!--.drawer__value {-->
<!--  font-size: 13px;-->
<!--  color: var(&#45;&#45;text-primary);-->
<!--  text-align: right;-->
<!--  word-break: break-word;-->
<!--}-->

<!--.drawer__value&#45;&#45;mono {-->
<!--  font-family: monospace;-->
<!--  font-size: 12px;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--}-->

<!--.drawer__status-grid {-->
<!--  display: grid;-->
<!--  grid-template-columns: 1fr 1fr;-->
<!--  gap: 8px;-->
<!--}-->

<!--.drawer__status-btn {-->
<!--  all: unset;-->
<!--  cursor: pointer;-->
<!--  text-align: center;-->
<!--  padding: 10px;-->
<!--  font-size: 13px;-->
<!--  font-weight: 600;-->
<!--  border-radius: 8px;-->
<!--  border: 2px solid transparent;-->
<!--  transition: all 0.15s;-->
<!--}-->

<!--.drawer__status-btn&#45;&#45;blue {-->
<!--  background: rgba(59, 130, 246, 0.06);-->
<!--  color: #3b82f6;-->
<!--}-->

<!--.drawer__status-btn&#45;&#45;blue.drawer__status-btn&#45;&#45;active {-->
<!--  border-color: #3b82f6;-->
<!--  background: rgba(59, 130, 246, 0.12);-->
<!--}-->

<!--.drawer__status-btn&#45;&#45;yellow {-->
<!--  background: rgba(234, 179, 8, 0.06);-->
<!--  color: #ca8a04;-->
<!--}-->

<!--.drawer__status-btn&#45;&#45;yellow.drawer__status-btn&#45;&#45;active {-->
<!--  border-color: #ca8a04;-->
<!--  background: rgba(234, 179, 8, 0.12);-->
<!--}-->

<!--.drawer__status-btn&#45;&#45;green {-->
<!--  background: rgba(34, 197, 94, 0.06);-->
<!--  color: #16a34a;-->
<!--}-->

<!--.drawer__status-btn&#45;&#45;green.drawer__status-btn&#45;&#45;active {-->
<!--  border-color: #16a34a;-->
<!--  background: rgba(34, 197, 94, 0.12);-->
<!--}-->

<!--.drawer__status-btn&#45;&#45;gray {-->
<!--  background: rgba(148, 163, 184, 0.06);-->
<!--  color: #94a3b8;-->
<!--}-->

<!--.drawer__status-btn&#45;&#45;gray.drawer__status-btn&#45;&#45;active {-->
<!--  border-color: #94a3b8;-->
<!--  background: rgba(148, 163, 184, 0.12);-->
<!--}-->

<!--.drawer__status-btn:hover {-->
<!--  opacity: 0.85;-->
<!--}-->

<!--.drawer__footer {-->
<!--  padding: 16px 24px 20px;-->
<!--  border-top: 1px solid var(&#45;&#45;border);-->
<!--  flex-shrink: 0;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 10px;-->
<!--}-->

<!--.drawer__footer-main {-->
<!--  display: flex;-->
<!--  gap: 8px;-->
<!--}-->

<!--.drawer__cancel-btn {-->
<!--  all: unset;-->
<!--  cursor: pointer;-->
<!--  padding: 10px 20px;-->
<!--  font-size: 14px;-->
<!--  font-weight: 500;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  border: 1px solid var(&#45;&#45;border);-->
<!--  border-radius: 8px;-->
<!--  transition: background 0.15s, color 0.15s;-->
<!--}-->

<!--.drawer__cancel-btn:hover {-->
<!--  background: var(&#45;&#45;bg-secondary);-->
<!--  color: var(&#45;&#45;text-primary);-->
<!--}-->

<!--.drawer__delete-btn {-->
<!--  all: unset;-->
<!--  cursor: pointer;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  gap: 8px;-->
<!--  width: 100%;-->
<!--  padding: 12px;-->
<!--  font-size: 13px;-->
<!--  font-weight: 600;-->
<!--  color: #e53e3e;-->
<!--  background: rgba(229, 62, 62, 0.06);-->
<!--  border: 1px solid rgba(229, 62, 62, 0.15);-->
<!--  border-radius: 8px;-->
<!--  transition: background 0.15s, border-color 0.15s;-->
<!--  box-sizing: border-box;-->
<!--}-->

<!--.drawer__delete-btn:hover {-->
<!--  background: rgba(229, 62, 62, 0.12);-->
<!--  border-color: rgba(229, 62, 62, 0.3);-->
<!--}-->

<!--.drawer__delete-bar {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: space-between;-->
<!--  gap: 12px;-->
<!--  width: 100%;-->
<!--  padding: 12px 14px;-->
<!--  background: rgba(229, 62, 62, 0.08);-->
<!--  border: 1px solid rgba(229, 62, 62, 0.25);-->
<!--  border-radius: 8px;-->
<!--  box-sizing: border-box;-->
<!--}-->

<!--.drawer__delete-text {-->
<!--  font-size: 13px;-->
<!--  font-weight: 600;-->
<!--  color: #e53e3e;-->
<!--}-->

<!--.drawer__delete-actions {-->
<!--  display: flex;-->
<!--  gap: 8px;-->
<!--}-->

<!--.drawer__delete-cancel {-->
<!--  all: unset;-->
<!--  cursor: pointer;-->
<!--  padding: 6px 14px;-->
<!--  font-size: 12px;-->
<!--  font-weight: 500;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  border-radius: 6px;-->
<!--  transition: background 0.15s;-->
<!--}-->

<!--.drawer__delete-cancel:hover {-->
<!--  background: var(&#45;&#45;bg-secondary);-->
<!--}-->

<!--.drawer__delete-yes {-->
<!--  all: unset;-->
<!--  cursor: pointer;-->
<!--  padding: 6px 14px;-->
<!--  font-size: 12px;-->
<!--  font-weight: 600;-->
<!--  color: #fff;-->
<!--  background: #e53e3e;-->
<!--  border-radius: 6px;-->
<!--  transition: background 0.15s;-->
<!--}-->

<!--.drawer__delete-yes:hover {-->
<!--  background: #c53030;-->
<!--}-->

<!--.drawer-enter-active .drawer,-->
<!--.drawer-leave-active .drawer {-->
<!--  transition: transform 0.25s ease;-->
<!--}-->

<!--.drawer-enter-active,-->
<!--.drawer-leave-active {-->
<!--  transition: opacity 0.25s ease;-->
<!--}-->

<!--.drawer-enter-from,-->
<!--.drawer-leave-to {-->
<!--  opacity: 0;-->
<!--}-->

<!--.drawer-enter-from .drawer,-->
<!--.drawer-leave-to .drawer {-->
<!--  transform: translateX(100%);-->
<!--}-->

<!--@media (max-width: 768px) {-->
<!--  .leads__header {-->
<!--    flex-direction: column;-->
<!--    align-items: flex-start;-->
<!--  }-->

<!--  .leads__title {-->
<!--    font-size: 20px;-->
<!--  }-->

<!--  .leads__source-filter {-->
<!--    width: 100%;-->
<!--  }-->

<!--  .leads__tab {-->
<!--    padding: 6px 12px;-->
<!--    font-size: 12px;-->
<!--  }-->

<!--  .lead-row {-->
<!--    flex-direction: column;-->
<!--    align-items: flex-start;-->
<!--    gap: 10px;-->
<!--    padding: 12px 14px;-->
<!--  }-->

<!--  .lead-row__right {-->
<!--    width: 100%;-->
<!--    justify-content: space-between;-->
<!--  }-->

<!--  .drawer {-->
<!--    width: 100%;-->
<!--  }-->

<!--  .drawer__header {-->
<!--    padding: 16px 18px;-->
<!--  }-->

<!--  .drawer__body {-->
<!--    padding: 18px;-->
<!--  }-->

<!--  .drawer__footer {-->
<!--    padding: 14px 18px 18px;-->
<!--  }-->

<!--  .drawer__field {-->
<!--    flex-direction: column;-->
<!--    gap: 2px;-->
<!--  }-->

<!--  .drawer__value {-->
<!--    text-align: left;-->
<!--  }-->

<!--  .drawer__delete-bar {-->
<!--    flex-direction: column;-->
<!--    align-items: flex-start;-->
<!--    gap: 8px;-->
<!--  }-->
<!--}-->
<!--</style>-->

<script setup lang="ts">
import { useLeadStore } from '~/modules/lead/LeadStore'
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '~/modules/lead/constants'
import LeadRow from '~/modules/lead/components/LeadRow.vue'
import LeadDrawer from '~/modules/lead/components/LeadDrawer.vue'

definePageMeta({ layout: 'admin' })

const leadStore = useLeadStore()

const statusFilter = ref('')
const sourceFilter = ref('')
const drawerOpen = ref(false)

async function fetchLeads() {
  await leadStore.fetchAll({
    status: statusFilter.value || undefined,
    source: sourceFilter.value || undefined,
  })
}

function openDetail(lead: typeof leadStore.leads[number]) {
  leadStore.selectedLead = lead
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

async function updateLead(payload: { name: string; phone: string; email: string | null; message: string | null; status: string; adminComment?: string }) {
  if (!leadStore.selectedLead) return
  await leadStore.update(leadStore.selectedLead.id, {
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    message: payload.message,
    status: payload.status as 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELED',
    adminComment: payload.adminComment,
  })
}

async function deleteLead() {
  if (!leadStore.selectedLead) return
  await leadStore.remove(leadStore.selectedLead.id)
  closeDrawer()
}

async function deleteLeadFromList(leadId: string) {
  await leadStore.remove(leadId)
}

await useAsyncData('admin-leads', () => fetchLeads())

watch([statusFilter, sourceFilter], () => {
  fetchLeads()
})
</script>

<template>
  <div class="leads">
    <div class="leads__header">
      <h1 class="leads__title">Заявки</h1>
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
    <div v-else-if="!leadStore.leads.length" class="leads__empty">
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
      />
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