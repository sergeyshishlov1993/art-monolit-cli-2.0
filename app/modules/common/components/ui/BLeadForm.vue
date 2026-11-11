<script setup lang="ts">
import { useLeadStore } from '~/modules/lead/LeadStore'
import { usePixel } from '~/modules/common/composables/usePixel'
import { useContacts } from '~/modules/common/composables/useContacts'
import { trackEvent } from '~/modules/common/composables/useTrack'
import { useWorkingStatus } from '~/modules/common/composables/useWorkingStatus'
import { ROUTES } from '~/modules/common/constants/routes'

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
const formWebsite = ref('')
const submitted = ref(false)
const submitError = ref(false)

const siteContacts = useContacts()
const workingStatus = useWorkingStatus()

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
  formWebsite.value = ''
  submitted.value = false
  submitError.value = false
  leadStore.reset()
}

async function handleSubmit() {
  submitted.value = true

  if (nameError.value || phoneError.value) return

  submitError.value = false

  const message = props.productTitle
      ? formMessage.value.trim()
          ? `[Виріб: ${props.productTitle}] ${formMessage.value.trim()}`
          : `Запит по виробу: ${props.productTitle}`
      : formMessage.value.trim() || undefined

  try {
    await leadStore.submit({
      name: formName.value.trim(),
      phone: formPhone.value.trim(),
      message,
      productId: props.productId || undefined,
      source: props.source,
      pixel,
      website: formWebsite.value || undefined,
    })
  } catch {
    submitError.value = true
    return
  }

  if (leadStore.isSuccess) {
    trackEvent('lead_submit', { source: props.source, product: props.productTitle || undefined })
    resetForm()
    emit('success')
    // Окрема сторінка подяки: дає чітку ціль для реклами та аналітики
    await navigateTo({ path: ROUTES.THANKS, query: { from: props.source } })
  }
}

onUnmounted(() => {
  leadStore.reset()
})
</script>

<template>
  <div class="lead-form__fields">
  <p v-if="props.productTitle" class="lead-form__ref">Виріб: {{ props.productTitle }}</p>

  <div class="lead-form__hp" aria-hidden="true">
    <label>Website <input v-model="formWebsite" type="text" name="website" tabindex="-1" autocomplete="off"></label>
  </div>

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
  <p v-if="submitError" class="lead-form__error" role="alert">
    Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте:
    <a :href="siteContacts.PHONE_1_HREF">{{ siteContacts.PHONE_1 }}</a>
  </p>
  <BButton
      size="lg"
      :loading="leadStore.isSubmitting"
      class="lead-form__submit"
      @click="handleSubmit"
  >
    Надіслати заявку
  </BButton>
  <p v-if="workingStatus" class="lead-form__status">
    <span class="lead-form__dot" :class="{ 'lead-form__dot--open': workingStatus.open }" />
    <template v-if="workingStatus.open">Зараз працюємо ({{ workingStatus.text }}) — передзвонимо протягом 30 хвилин</template>
    <template v-else>Зараз зачинено — передзвонимо {{ workingStatus.text }}</template>
  </p>
</div>
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

.lead-form__hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.lead-form__error {
  margin: 0;
  font-size: 14px;
  color: #d32f2f;
}

.lead-form__error a {
  color: inherit;
  font-weight: 600;
}

.lead-form__status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
}

.lead-form__dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  background: #9e9e9e;
  border-radius: 50%;
}

.lead-form__dot--open {
  background: #2e7d32;
}
</style>