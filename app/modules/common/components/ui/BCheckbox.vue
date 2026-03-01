<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <label class="b-checkbox" :class="props.disabled ? 'b-checkbox--disabled' : ''" @click.prevent="toggle">
    <span class="b-checkbox__box" :class="props.modelValue ? 'b-checkbox__box--checked' : ''">
      <svg v-if="props.modelValue" viewBox="0 0 12 12" fill="none" style="width: 10px; height: 10px;">
        <path d="M2 6l3 3 5-6" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span v-if="props.label" class="b-checkbox__label">{{ props.label }}</span>
  </label>
</template>

<style scoped>
.b-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.b-checkbox--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.b-checkbox__box {
  width: 18px;
  height: 18px;
  border-radius: 2px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
  background: transparent;
}

.b-checkbox:hover .b-checkbox__box:not(.b-checkbox__box--checked) {
  border-color: var(--border-hover);
}

.b-checkbox__box--checked {
  background: var(--gold);
  border-color: var(--gold);
}

.b-checkbox__label {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
