<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  phone?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const phoneDigits = ref('')

function extractDigits(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('380')) return digits.slice(3)
  if (digits.startsWith('38')) return digits.slice(2)
  if (digits.startsWith('0')) return digits.slice(1)
  return digits
}

function formatPhone(digits: string): string {
  const d = digits.slice(0, 9)
  if (!d.length) return '+380'

  let result = '+380 ('
  result += d.slice(0, 2)
  if (d.length >= 2) result += ') '
  if (d.length > 2) result += d.slice(2, 5)
  if (d.length > 5) result += ' ' + d.slice(5, 7)
  if (d.length > 7) result += ' ' + d.slice(7, 9)
  return result
}

const phoneFormatted = computed(() => {
  if (!phoneDigits.value) return ''
  return formatPhone(phoneDigits.value)
})

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  const digits = extractDigits(input.value).slice(0, 9)
  phoneDigits.value = digits

  const formatted = digits.length ? formatPhone(digits) : '+380'
  emit('update:modelValue', formatted)

  nextTick(() => {
    input.value = formatted
    input.setSelectionRange(formatted.length, formatted.length)
  })
}

function onPhoneKeydown(event: KeyboardEvent) {
  if (event.key !== 'Backspace') return

  const input = event.target as HTMLInputElement
  const pos = input.selectionStart ?? 0

  if (phoneDigits.value.length === 0) {
    event.preventDefault()
    return
  }

  event.preventDefault()
  phoneDigits.value = phoneDigits.value.slice(0, -1)

  const formatted = phoneDigits.value.length ? formatPhone(phoneDigits.value) : '+380'
  emit('update:modelValue', formatted)

  nextTick(() => {
    input.value = formatted
    input.setSelectionRange(formatted.length, formatted.length)
  })
}

function onPhoneFocus(event: Event) {
  const input = event.target as HTMLInputElement
  if (!phoneDigits.value) {
    input.value = '+380'
    nextTick(() => {
      input.setSelectionRange(4, 4)
    })
  }
}

function onPhoneBlur() {
  if (!phoneDigits.value) {
    emit('update:modelValue', '')
  }
}

function onPhonePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text') || ''
  const digits = extractDigits(pasted).slice(0, 9)
  phoneDigits.value = digits

  const formatted = digits.length ? formatPhone(digits) : '+380'
  emit('update:modelValue', formatted)
}

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

watch(() => props.modelValue, (val) => {
  if (props.phone && typeof val === 'string') {
    const digits = extractDigits(val).slice(0, 9)
    if (digits !== phoneDigits.value) {
      phoneDigits.value = digits
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="props.label" class="b-label">
      {{ props.label }}
      <span v-if="props.required" class="text-[var(--gold)]">*</span>
    </label>
    <input
        v-if="props.phone"
        type="tel"
        :value="phoneFormatted"
        placeholder="+380 (___) ___-__-__"
        :disabled="props.disabled"
        :required="props.required"
        inputmode="tel"
        class="b-field"
        :class="props.error ? 'b-field--error' : ''"
        @input="onPhoneInput"
        @keydown="onPhoneKeydown"
        @focus="onPhoneFocus"
        @blur="onPhoneBlur"
        @paste="onPhonePaste"
    >
    <input
        v-else
        :type="props.type"
        :value="props.modelValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :required="props.required"
        class="b-field"
        :class="props.error ? 'b-field--error' : ''"
        @input="onInput"
    >
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
.b-field--error:focus {
  border-color: #dc2626;
}
.b-field:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>