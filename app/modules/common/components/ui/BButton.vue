<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  to?: string
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})

const tag = computed(() => (props.to ? NuxtLink : 'button'))
</script>

<template>
  <component
      :is="tag"
      :to="props.to || undefined"
      :type="!props.to ? props.type : undefined"
      :disabled="!props.to ? (props.disabled || props.loading) : undefined"
      class="b-btn"
      :class="[
      `b-btn--${props.variant}`,
      `b-btn--${props.size}`,
      { 'b-btn--block': props.block },
    ]"
  >
    <svg v-if="props.loading" class="b-btn__spinner" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot />
  </component>
</template>

<style scoped>
.b-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 2px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
}

.b-btn--block {
  display: flex;
  width: 100%;
}

.b-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.b-btn__spinner {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.b-btn--sm { padding: 6px 14px; font-size: 11px; }
.b-btn--md { padding: 10px 20px; font-size: 13px; }
.b-btn--lg { padding: 14px 28px; font-size: 15px; }

.b-btn--primary {
  background: var(--gold);
  color: #fff;
}
.b-btn--primary:hover:not(:disabled) {
  background: var(--gold-hover);
}

.b-btn--secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: inset 0 0 0 1px var(--border);
}
.b-btn--secondary:hover:not(:disabled) {
  box-shadow: inset 0 0 0 1px var(--border-hover);
}

.b-btn--danger {
  background: #d32f2f;
  color: #fff;
}
.b-btn--danger:hover:not(:disabled) {
  background: #b91c1c;
}

.b-btn--ghost {
  background: transparent;
  color: var(--text-secondary);
}
.b-btn--ghost:hover:not(:disabled) {
  color: var(--text-primary);
  background: var(--bg-card);
}

.b-btn--outline {
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--gold);
  color: var(--gold);
}
.b-btn--outline:hover:not(:disabled) {
  background: var(--gold);
  color: #fff;
}
</style>