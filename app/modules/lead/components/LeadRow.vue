<script setup lang="ts">
import { STATUS_LABELS } from '~/modules/lead/constants'
import { useLeadFormat } from '~/modules/lead/composables/useLeadFormat'
import type { LeadResponse } from '~/modules/lead/types'

defineProps<{
  lead: LeadResponse
  isSelected: boolean
}>()

const emit = defineEmits<{
  click: []
  delete: []
}>()

const { formatDate, formatNumber } = useLeadFormat()

function handleClick() {
  emit('click')
}

function handleDelete() {
  emit('delete')
}
</script>

<template>
  <div
      class="lead-row"
      :class="{ 'lead-row--selected': isSelected }"
      @click="handleClick"
  >
    <div class="lead-row__left">
      <span class="lead-row__number">{{ formatNumber(lead.number) }}</span>
      <div class="lead-row__info">
        <span class="lead-row__name">{{ lead.name }}</span>
        <span class="lead-row__phone">{{ lead.phone }}</span>
      </div>
    </div>
    <div class="lead-row__right">
      <span
          class="lead-row__badge"
          :class="`lead-row__badge--${STATUS_LABELS[lead.status].variant}`"
      >
        {{ STATUS_LABELS[lead.status].label }}
      </span>
      <span class="lead-row__date">{{ formatDate(lead.createdAt) }}</span>
      <button
          type="button"
          class="lead-row__delete"
          title="Видалити"
          @click.stop="handleDelete"
      >
        <BIcon name="trash" size="sm" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.lead-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.lead-row:hover {
  border-color: var(--border-hover);
}

.lead-row--selected {
  border-color: var(--gold);
  box-shadow: 0 0 0 1px var(--gold);
}

.lead-row__left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.lead-row__number {
  font-family: monospace;
  font-size: 12px;
  color: var(--gold);
  flex-shrink: 0;
}

.lead-row__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.lead-row__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lead-row__phone {
  font-size: 12px;
  color: var(--text-muted);
}

.lead-row__right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.lead-row__badge {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  white-space: nowrap;
}

.lead-row__badge--blue {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.lead-row__badge--yellow {
  background: rgba(234, 179, 8, 0.1);
  color: #ca8a04;
}

.lead-row__badge--green {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.lead-row__badge--gray {
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
}

.lead-row__date {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.lead-row__delete {
  all: unset;
  cursor: pointer;
  padding: 4px;
  color: var(--text-muted);
  transition: color 0.15s;
}

.lead-row__delete:hover {
  color: var(--error);
}

@media (max-width: 768px) {
  .lead-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
  }

  .lead-row__right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>