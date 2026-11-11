<script setup lang="ts">
import { useLeadStore } from '~/modules/lead/LeadStore'
import { trackEvent } from '~/modules/common/composables/useTrack'
import { ROUTES } from '~/modules/common/constants/routes'
import type { PortfolioWork } from '~/modules/portfolio/types'

const props = defineProps<{
  modelValue: boolean
  work: PortfolioWork | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const leadStore = useLeadStore()

const inquiryName = ref('')
const inquiryPhone = ref('')
const inquiryMessage = ref('')
const submitError = ref(false)

const touchStartX = ref(0)
const touchStartY = ref(0)

const workLabel = computed(() => {
  if (!props.work) return ''
  const parts = [props.work.category.name]
  if (props.work.materials.length) {
    parts.push(props.work.materials.map((material) => material.name).join(', '))
  }
  return parts.join(' · ')
})

watch(() => props.modelValue, (open) => {
  if (open) {
    inquiryName.value = ''
    inquiryPhone.value = ''
    inquiryMessage.value = ''
    submitError.value = false
    leadStore.reset()
  }
})

function handleTouchStart(event: TouchEvent) {
  if (!event.touches[0]) return
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
}

function handleTouchEnd(event: TouchEvent) {
  if (!event.changedTouches[0]) return

  const deltaX = event.changedTouches[0].clientX - touchStartX.value
  const deltaY = event.changedTouches[0].clientY - touchStartY.value

  if (deltaY > 80 && Math.abs(deltaY) > Math.abs(deltaX)) {
    close()
  }
}

async function submit() {
  if (!inquiryName.value.trim() || !inquiryPhone.value.trim()) return
  submitError.value = false

  try {
    await leadStore.submit({
      name: inquiryName.value.trim(),
      phone: inquiryPhone.value.trim(),
      message: inquiryMessage.value.trim()
          ? `[Портфоліо: ${workLabel.value}] ${inquiryMessage.value.trim()}`
          : `Запит по роботі: ${workLabel.value}`,
      source: 'portfolio',
    })
  } catch {
    submitError.value = true
    return
  }

  trackEvent('lead_submit', { source: 'portfolio' })
  close()
  await navigateTo({ path: ROUTES.THANKS, query: { from: 'portfolio' } })
}

function close() {
  emit('update:modelValue', false)
  leadStore.reset()
}
</script>

<template>
  <BModal :model-value="modelValue" title="Замовити подібну роботу" @update:model-value="emit('update:modelValue', $event)">
    <div
        class="works-inquiry__content"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
    >
      <p v-if="workLabel" class="works-inquiry__ref">Робота: {{ workLabel }}</p>
      <div class="works-inquiry">
        <BInput v-model="inquiryName" label="Ім'я" placeholder="Ваше ім'я" required />
        <BInput v-model="inquiryPhone" label="Телефон" placeholder="+380 (__) ___-__-__" required phone />
        <BTextarea v-model="inquiryMessage" label="Побажання" placeholder="Опишіть, що б ви хотіли..." />
        <p v-if="submitError" class="works-inquiry__error" role="alert">Не вдалося надіслати заявку. Спробуйте ще раз.</p>
      </div>
    </div>
    <template #footer>
      <BButton variant="ghost" @click="close">Скасувати</BButton>
      <BButton :loading="leadStore.isSubmitting" @click="submit">Відправити</BButton>
    </template>
  </BModal>
</template>

<style scoped>
.works-inquiry__content {
  touch-action: pan-y;
}

.works-inquiry__ref {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 16px;
}

.works-inquiry {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.works-inquiry__error {
  margin: 0;
  font-size: 14px;
  color: #d32f2f;
}
</style>