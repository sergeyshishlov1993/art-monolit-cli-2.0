<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  rows: 3,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="props.label" class="b-label">
      {{ props.label }}
      <span v-if="props.required" class="text-[var(--gold)]">*</span>
    </label>
    <textarea
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :required="props.required"
      :rows="props.rows"
      class="b-field resize-y"
      :class="props.error ? 'b-field--error' : ''"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="props.error" class="text-xs text-red-500">{{ props.error }}</span>
  </div>
</template>

<style scoped>
.b-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}
.b-field {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 2px;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
.b-field::placeholder {
  color: var(--text-muted);
}
.b-field:focus {
  border-color: var(--gold);
}
.b-field--error {
  border-color: #ef4444;
}
.b-field:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
