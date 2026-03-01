<script setup lang="ts">
import { useLeadStore } from '~/modules/lead/LeadStore'
import { usePixel } from '~/modules/common/composables/usePixel'

const AUTO_CLOSE_DELAY = 3000
const PHONE_MIN_DIGITS = 9

const props = withDefaults(defineProps<{
  source: string
  productId?: string
  productTitle?: string
}>(), {
  productId: '',
  productTitle: '',
})

const emit = defineEmits<{
  success: []
}>()

const leadStore = useLeadStore()
const pixel = usePixel()

const formName = ref('')
const formPhone = ref('')
const formMessage = ref('')
const submitted = ref(false)

function extractDigits(value: string): string {
  return value.replace(/\D/g, '').replace(/^380/, '')
}

const nameError = computed(() => {
  if (!submitted.value) return ''
  if (!formName.value.trim()) return 'Введіть ім\'я'
  return ''
})

const phoneError = computed(() => {
  if (!submitted.value) return ''
  if (!formPhone.value.trim()) return 'Введіть телефон'
  if (extractDigits(formPhone.value).length < PHONE_MIN_DIGITS) return 'Невірний формат телефону'
  return ''
})

function resetForm() {
  formName.value = ''
  formPhone.value = ''
  formMessage.value = ''
  submitted.value = false
  leadStore.reset()
}

async function handleSubmit() {
  submitted.value = true

  if (nameError.value || phoneError.value) return

  const message = props.productTitle
      ? formMessage.value.trim()
          ? `[Виріб: ${props.productTitle}] ${formMessage.value.trim()}`
          : `Запит по виробу: ${props.productTitle}`
      : formMessage.value.trim() || undefined

  await leadStore.submit({
    name: formName.value.trim(),
    phone: formPhone.value.trim(),
    message,
    productId: props.productId || undefined,
    source: props.source,
    pixel,
  })

  if (leadStore.isSuccess) {
    setTimeout(() => {
      resetForm()
      emit('success')
    }, AUTO_CLOSE_DELAY)
  }
}

onUnmounted(() => {
  leadStore.reset()
})
</script>

<template>
  <Transition name="lead-form-fade" mode="out-in">
    <div v-if="leadStore.isSuccess" class="lead-form__success">
      <svg class="lead-form__success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <h3 class="lead-form__success-title">Дякуємо!</h3>
      <p class="lead-form__success-text">Ми зв'яжемося з вами найближчим часом</p>
    </div>

    <div v-else class="lead-form__fields">
      <p v-if="props.productTitle" class="lead-form__ref">Виріб: {{ props.productTitle }}</p>

      <BInput
          v-model="formName"
          label="Ім'я"
          placeholder="Ваше ім'я"
          required
          :error="nameError"
      />
      <BInput
          v-model="formPhone"
          label="Телефон"
          phone
          required
          :error="phoneError"
      />
      <BTextarea
          v-model="formMessage"
          label="Повідомлення"
          placeholder="Опишіть ваше замовлення або задайте питання..."
          :rows="3"
      />
      <BButton
          size="lg"
          :loading="leadStore.isSubmitting"
          class="lead-form__submit"
          @click="handleSubmit"
      >
        Надіслати заявку
      </BButton>
    </div>
  </Transition>
</template>

<style scoped>
.lead-form__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lead-form__ref {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}

.lead-form__submit {
  width: 100%;
}

.lead-form__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 40px 0;
}

.lead-form__success-icon {
  width: 48px;
  height: 48px;
  color: var(--gold);
}

.lead-form__success-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.lead-form__success-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.lead-form-fade-enter-active,
.lead-form-fade-leave-active {
  transition: opacity 0.3s;
}

.lead-form-fade-enter-from,
.lead-form-fade-leave-to {
  opacity: 0;
}
</style>