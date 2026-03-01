<script setup lang="ts">
interface Props {
  modelValue?: string
  value: string
  name: string
  label?: string
  disabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isChecked = computed(() => props.modelValue === props.value)

function select() {
  if (!props.disabled) {
    emit('update:modelValue', props.value)
  }
}
</script>

<template>
  <label class="b-radio" :class="props.disabled ? 'b-radio--disabled' : ''" @click.prevent="select">
    <span class="b-radio__circle" :class="isChecked ? 'b-radio__circle--checked' : ''">
      <span v-if="isChecked" class="b-radio__dot" />
    </span>
    <span v-if="props.label" class="b-radio__label">{{ props.label }}</span>
  </label>
</template>

<style scoped>
.b-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.b-radio--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.b-radio__circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}

.b-radio:hover .b-radio__circle:not(.b-radio__circle--checked) {
  border-color: var(--border-hover);
}

.b-radio__circle--checked {
  border-color: var(--gold);
}

.b-radio__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
}

.b-radio__label {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
