<script setup lang="ts">
interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue?: string
  options: SelectOption[]
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement>()

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found?.label ?? ''
})

function select(value: string) {
  emit('update:modelValue', value)
  isOpen.value = false
}

function toggle() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function onClickOutside(event: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="selectRef" class="b-select">
    <label v-if="props.label" class="b-select__label">
      {{ props.label }}
      <span v-if="props.required" class="b-select__required">*</span>
    </label>
    <button
        type="button"
        class="b-select__trigger"
        :class="[
        props.error ? 'b-select__trigger--error' : '',
        props.disabled ? 'b-select__trigger--disabled' : '',
        isOpen ? 'b-select__trigger--open' : '',
      ]"
        :disabled="props.disabled"
        @click="toggle"
    >
      <span :class="selectedLabel ? '' : 'b-select__placeholder'">
        {{ selectedLabel || props.placeholder || 'Выберите...' }}
      </span>
      <svg style="width: 16px; height: 16px; flex-shrink: 0; transition: transform 0.2s;" :style="isOpen ? 'transform: rotate(180deg)' : ''" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="b-select__dropdown">
        <button
            v-for="opt in props.options"
            :key="opt.value"
            type="button"
            class="b-select__option"
            :class="opt.value === props.modelValue ? 'b-select__option--active' : ''"
            @click="select(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
    </Transition>

    <span v-if="props.error" class="b-select__error">{{ props.error }}</span>
  </div>
</template>

<style scoped>
.b-select {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10;
}

.b-select__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.b-select__required {
  color: var(--gold);
}

.b-select__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 2px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s;
  text-align: left;
}

.b-select__trigger:hover:not(:disabled) {
  border-color: var(--border-hover);
}

.b-select__trigger--open {
  border-color: var(--gold);
}

.b-select__trigger--error {
  border-color: #ef4444;
}

.b-select__trigger--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.b-select__placeholder {
  color: var(--text-muted);
}

.b-select__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 2px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-height: 240px;
  overflow-y: auto;
}

.b-select__option {
  display: block;
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}

.b-select__option:hover {
  background: var(--bg-card);
}

.b-select__option--active {
  color: var(--gold);
  background: var(--bg-card);
}

.b-select__error {
  font-size: 12px;
  color: #ef4444;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>