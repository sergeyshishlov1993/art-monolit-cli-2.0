<script setup lang="ts">
import { STATUS_OPTIONS, STATUS_LABELS, SOURCE_LABELS, type LeadStatus } from '~/modules/lead/constants'
import { useLeadFormat } from '~/modules/lead/composables/useLeadFormat'
import type { LeadResponse } from '~/modules/lead/types'

const props = defineProps<{
  lead: LeadResponse | null
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update': [payload: { name: string; phone: string; email: string | null; message: string | null; status: string; adminComment?: string }]
  'delete': []
}>()

const { formatDate, formatNumber, buildProductUrl } = useLeadFormat()

const editName = ref('')
const editPhone = ref('')
const editEmail = ref('')
const editMessage = ref('')
const editComment = ref('')
const editStatus = ref('')
const deleteConfirm = ref(false)
const isEditing = ref(false)

const productUrl = computed(() => {
  if (!props.lead?.product?.category?.slug) return null
  return buildProductUrl(props.lead.product.category.slug, props.lead.product.slug)
})

const activeStatusOptions = computed(() =>
    STATUS_OPTIONS.filter(option => option.value !== '') as { value: LeadStatus; label: string }[]
)

function fillForm() {
  if (!props.lead) return
  editName.value = props.lead.name
  editPhone.value = props.lead.phone
  editEmail.value = props.lead.email || ''
  editMessage.value = props.lead.message || ''
  editComment.value = props.lead.adminComment || ''
  editStatus.value = props.lead.status
}

function resetState() {
  fillForm()
  deleteConfirm.value = false
  isEditing.value = false
}

function close() {
  emit('update:modelValue', false)
}

function startEdit() {
  isEditing.value = true
}

function cancelEdit() {
  fillForm()
  isEditing.value = false
}

function save() {
  emit('update', {
    name: editName.value,
    phone: editPhone.value,
    email: editEmail.value || null,
    message: editMessage.value || null,
    status: editStatus.value,
    adminComment: editComment.value || undefined,
  })
  isEditing.value = false
}

function confirmDelete() {
  emit('delete')
  deleteConfirm.value = false
}

function callPhone() {
  if (!props.lead) return
  window.open(`tel:${props.lead.phone}`)
}

function setStatus(status: string) {
  editStatus.value = status
}

watch(() => props.lead, resetState, { immediate: true })

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) resetState()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="modelValue && lead" class="drawer-overlay" @click.self="close">
        <div class="drawer">
          <div class="drawer__header">
            <div class="drawer__header-left">
              <span class="drawer__number">{{ formatNumber(lead.number) }}</span>
              <span v-if="!isEditing" class="drawer__name">{{ lead.name }}</span>
            </div>
            <div class="drawer__header-actions">
              <button v-if="!isEditing" type="button" class="drawer__icon-btn" @click="startEdit">
                <BIcon name="edit" size="sm" />
              </button>
              <button type="button" class="drawer__icon-btn" @click="close">
                <BIcon name="close" size="md" />
              </button>
            </div>
          </div>

          <div class="drawer__body">
            <div class="drawer__section">
              <button type="button" class="drawer__call" @click="callPhone">
                <BIcon name="phone" size="sm" />
                <span>{{ lead.phone }}</span>
              </button>
            </div>

            <div v-if="isEditing" class="drawer__section">
              <h3 class="drawer__section-title">Редагування</h3>
              <div class="drawer__form">
                <BInput v-model="editName" label="Ім'я" />
                <BInput v-model="editPhone" label="Телефон" phone />
                <BInput v-model="editEmail" label="Email" />
                <BTextarea v-model="editMessage" label="Повідомлення" :rows="2" />
              </div>
            </div>

            <div v-else class="drawer__section">
              <h3 class="drawer__section-title">Інформація</h3>
              <div class="drawer__field">
                <span class="drawer__label">Email</span>
                <span class="drawer__value">{{ lead.email || '—' }}</span>
              </div>
              <div class="drawer__field">
                <span class="drawer__label">Повідомлення</span>
                <span class="drawer__value">{{ lead.message || '—' }}</span>
              </div>
              <div class="drawer__field">
                <span class="drawer__label">Товар</span>
                <span class="drawer__value">
                  <a
                      v-if="lead.product && productUrl"
                      :href="productUrl"
                      target="_blank"
                      class="drawer__product-link"
                  >
                    {{ lead.product.title }}
                    <BIcon name="external-link" size="xs" />
                  </a>
                  <template v-else>—</template>
                </span>
              </div>
              <div class="drawer__field">
                <span class="drawer__label">Джерело</span>
                <span class="drawer__value">{{ SOURCE_LABELS[lead.source] || lead.source }}</span>
              </div>
              <div class="drawer__field">
                <span class="drawer__label">Піксель</span>
                <span class="drawer__value drawer__value--mono">{{ lead.pixel || '—' }}</span>
              </div>
              <div class="drawer__field">
                <span class="drawer__label">Створено</span>
                <span class="drawer__value">{{ formatDate(lead.createdAt) }}</span>
              </div>
              <div class="drawer__field">
                <span class="drawer__label">Оновлено</span>
                <span class="drawer__value">{{ formatDate(lead.updatedAt) }}</span>
              </div>
            </div>

            <div class="drawer__section">
              <h3 class="drawer__section-title">Статус</h3>
              <div class="drawer__status-grid">
                <button
                    v-for="option in activeStatusOptions"
                    :key="option.value"
                    type="button"
                    class="drawer__status-btn"
                    :class="[
                    `drawer__status-btn--${STATUS_LABELS[option.value].variant}`,
                    { 'drawer__status-btn--active': editStatus === option.value }
                  ]"
                    @click="setStatus(option.value)"
                >
                  {{ STATUS_LABELS[option.value].label }}
                </button>
              </div>
            </div>

            <div class="drawer__section">
              <h3 class="drawer__section-title">Коментар</h3>
              <BTextarea v-model="editComment" placeholder="Нотатки..." :rows="3" />
            </div>
          </div>

          <div class="drawer__footer">
            <div class="drawer__footer-main">
              <template v-if="isEditing">
                <button type="button" class="drawer__cancel-btn" @click="cancelEdit">
                  Скасувати
                </button>
                <BButton class="drawer__save-btn" @click="save">Зберегти</BButton>
              </template>
              <template v-else>
                <BButton block @click="save">Зберегти</BButton>
              </template>
            </div>

            <button
                v-if="!deleteConfirm"
                type="button"
                class="drawer__delete-btn"
                @click="deleteConfirm = true"
            >
              <BIcon name="trash" size="sm" />
              Видалити заявку
            </button>

            <div v-else class="drawer__delete-bar">
              <span class="drawer__delete-text">Видалити {{ formatNumber(lead.number) }}?</span>
              <div class="drawer__delete-actions">
                <button type="button" class="drawer__delete-cancel" @click="deleteConfirm = false">
                  Ні
                </button>
                <button type="button" class="drawer__delete-yes" @click="confirmDelete">
                  Так, видалити
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: 440px;
  max-width: 100%;
  height: 100%;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.drawer__header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.drawer__header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.drawer__number {
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--gold);
  flex-shrink: 0;
}

.drawer__name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer__icon-btn {
  all: unset;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  color: var(--text-muted);
  transition: background 0.15s, color 0.15s;
}

.drawer__icon-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.drawer__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drawer__section-title {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.drawer__call {
  all: unset;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: color-mix(in srgb, var(--gold) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--gold) 20%, transparent);
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: var(--gold);
  transition: background 0.15s;
}

.drawer__call:hover {
  background: color-mix(in srgb, var(--gold) 15%, transparent);
}

.drawer__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.drawer__field {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}

.drawer__field:last-of-type {
  border-bottom: none;
}

.drawer__label {
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.drawer__value {
  font-size: 13px;
  color: var(--text-primary);
  text-align: right;
  word-break: break-word;
}

.drawer__value--mono {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-muted);
}

.drawer__product-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--gold);
  text-decoration: none;
  transition: color 0.15s;
}

.drawer__product-link:hover {
  color: var(--gold-hover);
  text-decoration: underline;
}

.drawer__status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.drawer__status-btn {
  all: unset;
  cursor: pointer;
  text-align: center;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.15s;
}

.drawer__status-btn--blue {
  background: rgba(59, 130, 246, 0.06);
  color: #3b82f6;
}

.drawer__status-btn--blue.drawer__status-btn--active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
}

.drawer__status-btn--yellow {
  background: rgba(234, 179, 8, 0.06);
  color: #ca8a04;
}

.drawer__status-btn--yellow.drawer__status-btn--active {
  border-color: #ca8a04;
  background: rgba(234, 179, 8, 0.12);
}

.drawer__status-btn--green {
  background: rgba(34, 197, 94, 0.06);
  color: #16a34a;
}

.drawer__status-btn--green.drawer__status-btn--active {
  border-color: #16a34a;
  background: rgba(34, 197, 94, 0.12);
}

.drawer__status-btn--gray {
  background: rgba(148, 163, 184, 0.06);
  color: #94a3b8;
}

.drawer__status-btn--gray.drawer__status-btn--active {
  border-color: #94a3b8;
  background: rgba(148, 163, 184, 0.12);
}

.drawer__status-btn:hover {
  opacity: 0.85;
}

.drawer__footer {
  padding: 16px 24px 20px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drawer__footer-main {
  display: flex;
  gap: 8px;
}

.drawer__save-btn {
  flex: 1;
}

.drawer__cancel-btn {
  all: unset;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}

.drawer__cancel-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.drawer__delete-btn {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--error);
  background: color-mix(in srgb, var(--error) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--error) 15%, transparent);
  border-radius: 8px;
  transition: background 0.15s, border-color 0.15s;
  box-sizing: border-box;
}

.drawer__delete-btn:hover {
  background: color-mix(in srgb, var(--error) 12%, transparent);
  border-color: color-mix(in srgb, var(--error) 30%, transparent);
}

.drawer__delete-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background: color-mix(in srgb, var(--error) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--error) 25%, transparent);
  border-radius: 8px;
  box-sizing: border-box;
}

.drawer__delete-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--error);
}

.drawer__delete-actions {
  display: flex;
  gap: 8px;
}

.drawer__delete-cancel {
  all: unset;
  cursor: pointer;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  border-radius: 6px;
  transition: background 0.15s;
}

.drawer__delete-cancel:hover {
  background: var(--bg-secondary);
}

.drawer__delete-yes {
  all: unset;
  cursor: pointer;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: var(--error);
  border-radius: 6px;
  transition: background 0.15s;
}

.drawer__delete-yes:hover {
  background: color-mix(in srgb, var(--error) 80%, black);
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.25s ease;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .drawer {
    width: 100%;
  }

  .drawer__header {
    padding: 16px 18px;
  }

  .drawer__body {
    padding: 18px;
  }

  .drawer__footer {
    padding: 14px 18px 18px;
  }

  .drawer__field {
    flex-direction: column;
    gap: 2px;
  }

  .drawer__value {
    text-align: left;
  }

  .drawer__delete-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>