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
</script>

<template>
  <label class="b-toggle" :class="props.disabled ? 'b-toggle--disabled' : ''">
    <button
      type="button"
      role="switch"
      :aria-checked="props.modelValue"
      :disabled="props.disabled"
      class="b-toggle__track"
      :class="props.modelValue ? 'b-toggle__track--on' : ''"
      @click="emit('update:modelValue', !props.modelValue)"
    >
      <span class="b-toggle__thumb" :class="props.modelValue ? 'b-toggle__thumb--on' : ''" />
    </button>
    <span v-if="props.label" class="b-toggle__label">{{ props.label }}</span>
  </label>
</template>

<style scoped>
.b-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.b-toggle--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.b-toggle__track {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: var(--border);
  border: none;
  cursor: inherit;
  padding: 0;
  transition: background 0.2s;
  flex-shrink: 0;
}

.b-toggle__track--on {
  background: var(--gold);
}

.b-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.b-toggle__thumb--on {
  transform: translateX(18px);
}

.b-toggle__label {
  font-size: 14px;
  color: var(--text-secondary);
}
</style>
