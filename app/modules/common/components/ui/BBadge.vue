<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <span class="b-badge" :class="`b-badge--${props.variant}`">
    <slot />
  </span>
</template>

<style scoped>
.b-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid;
}
.b-badge--default {
  background: var(--bg-card);
  color: var(--text-secondary);
  border-color: var(--border);
}
.b-badge--gold {
  background: rgba(200, 169, 96, 0.1);
  color: var(--gold);
  border-color: rgba(200, 169, 96, 0.3);
}
.b-badge--success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}
.b-badge--warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}
.b-badge--danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}
.b-badge--info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.3);
}
</style>
