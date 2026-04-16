<script setup lang="ts">
import { STATUS_OPTIONS, STATUS_LABELS, SOURCE_LABELS, type LeadStatus } from '~/modules/lead/constants'
import { useLeadFormat } from '~/modules/lead/composables/useLeadFormat'
import { useToast } from '~/modules/common/composables/useToast'
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
const toast = useToast()

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

function buildPayload(): { name: string; phone: string; email: string | null; message: string | null; status: string; adminComment?: string } {
  return {
    name: editName.value,
    phone: editPhone.value,
    email: editEmail.value || null,
    message: editMessage.value || null,
    status: editStatus.value,
    adminComment: editComment.value || undefined,
  }
}

async function emitUpdate(): Promise<void> {
  try {
    emit('update', buildPayload())
    toast.success('Збережено')
  } catch {
    toast.error('Помилка збереження')
  }
}

function save() {
  emitUpdate()
  isEditing.value = false
}

async function setStatus(status: string): Promise<void> {
  editStatus.value = status
  await emitUpdate()
}

async function saveComment(): Promise<void> {
  if (editComment.value === (props.lead?.adminComment || '')) return
  await emitUpdate()
}

function confirmDelete() {
  emit('delete')
  deleteConfirm.value = false
}

function callPhone() {
  if (!props.lead) return
  window.open(`tel:${props.lead.phone}`)
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
              <BTextarea
                  v-model="editComment"
                  placeholder="Нотатки..."
                  :rows="3"
                  @blur="saveComment"
              />
            </div>
          </div>

          <div class="drawer__footer">
            <div v-if="isEditing" class="drawer__footer-main">
              <button type="button" class="drawer__cancel-btn" @click="cancelEdit">
                Скасувати
              </button>
              <BButton class="drawer__save-btn" @click="save">Зберегти</BButton>
            </div>

            <button type="button" class="drawer__close-btn" @click="close">
              Закрити
            </button>

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

<style scoped lang="scss">
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: 100%;
  max-width: 420px;
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
  }

  &__header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  &__number {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    border-radius: 6px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__section-title {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-secondary);
    margin: 0;
  }

  &__call {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: none;
    color: var(--color-primary);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    width: fit-content;

    &:hover {
      background: var(--bg-secondary);
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__label {
    font-size: 12px;
    color: var(--text-secondary);
  }

  &__value {
    font-size: 14px;
    color: var(--text-primary);
    word-break: break-word;

    &--mono {
      font-family: monospace;
      font-size: 13px;
    }
  }

  &__product-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__status-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__status-btn {
    padding: 6px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-primary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    color: var(--text-secondary);

    &:hover {
      background: var(--bg-secondary);
    }

    &--active {
      border-color: currentColor;
      font-weight: 600;
    }

    &--new {
      color: var(--color-info);

      &.drawer__status-btn--active {
        background: var(--color-info-bg, rgba(59, 130, 246, 0.08));
      }
    }

    &--processing {
      color: var(--color-warning);

      &.drawer__status-btn--active {
        background: var(--color-warning-bg, rgba(245, 158, 11, 0.08));
      }
    }

    &--done {
      color: var(--color-success);

      &.drawer__status-btn--active {
        background: var(--color-success-bg, rgba(34, 197, 94, 0.08));
      }
    }

    &--rejected {
      color: var(--color-danger);

      &.drawer__status-btn--active {
        background: var(--color-danger-bg, rgba(239, 68, 68, 0.08));
      }
    }
  }

  &__footer {
    padding: 16px 20px;
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__footer-main {
    display: flex;
    gap: 8px;
  }

  &__cancel-btn {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: none;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: var(--bg-secondary);
    }
  }

  &__save-btn {
    flex: 1;
  }

  &__close-btn {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: none;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: var(--bg-secondary);
    }
  }

  &__delete-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px;
    border: none;
    background: none;
    font-size: 13px;
    color: var(--color-danger);
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.15s;

    &:hover {
      background: var(--color-danger-bg, rgba(239, 68, 68, 0.06));
    }
  }

  &__delete-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--color-danger-bg, rgba(239, 68, 68, 0.06));
    border-radius: 8px;
  }

  &__delete-text {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-danger);
  }

  &__delete-actions {
    display: flex;
    gap: 8px;
  }

  &__delete-cancel {
    padding: 4px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-primary);
    font-size: 13px;
    cursor: pointer;
    color: var(--text-secondary);

    &:hover {
      background: var(--bg-secondary);
    }
  }

  &__delete-yes {
    padding: 4px 12px;
    border: none;
    border-radius: 6px;
    background: var(--color-danger);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;

    &:hover {
      opacity: 0.85;
    }
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;

  .drawer {
    transition: transform 0.25s ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .drawer {
    transform: translateX(100%);
  }
}
</style>