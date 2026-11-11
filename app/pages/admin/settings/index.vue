<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/site-settings/SiteSettingsStore'
import { buildMapUrl } from '~/modules/common/composables/useCurrentStore'
import type { DayHours, SiteSettings } from '~/modules/site-settings/types'

definePageMeta({ layout: 'admin' })

const PHONE_PATTERN = /^\+\d{10,15}$/
const MAP_URL_PATTERN = /^https:\/\/(www\.google\.com\/maps|maps\.google\.com)\//
const MAX_STORES = 10

const store = useSiteSettingsStore()
const toast = useToast()

await useAsyncData('admin-site-settings', async (): Promise<null> => {
  await store.fetch()
  return null
})

type DayKey = 'weekdays' | 'saturday' | 'sunday'

const days: { key: DayKey; label: string }[] = [
  { key: 'weekdays', label: 'Понеділок — П\'ятниця' },
  { key: 'saturday', label: 'Субота' },
  { key: 'sunday', label: 'Неділя' },
]

interface DayForm {
  works: boolean
  from: string
  to: string
}

function toDayForm(hours: DayHours | undefined, fallback: { from: string; to: string }): DayForm {
  return hours ? { works: true, ...hours } : { works: false, ...fallback }
}

const settings = store.settings

interface StoreForm {
  id: string
  city: string
  address: string
  mapEmbedUrl: string
  logo: string
  showMap: boolean
}

function toStoreForm(item: { id: string; city: string; address: string; mapEmbedUrl: string | null; logo: string | null }): StoreForm {
  return { id: item.id, city: item.city, address: item.address, mapEmbedUrl: item.mapEmbedUrl ?? '', logo: item.logo ?? '', showMap: false }
}

const form = reactive({
  phone1: settings?.phone1 ?? '',
  phone2: settings?.phone2 ?? '',
  email: settings?.email ?? '',
  messengerPhone: settings?.messengerPhone ?? '',
  stores: (settings?.stores ?? []).map(toStoreForm),
  citySelectorModal: settings?.citySelectorModal ?? true,
  citySwitcherHeader: settings?.citySwitcherHeader ?? true,
  schedule: {
    weekdays: toDayForm(settings?.schedule.weekdays, { from: '09:00', to: '18:00' }),
    saturday: toDayForm(settings?.schedule.saturday, { from: '10:00', to: '15:00' }),
    sunday: toDayForm(settings?.schedule.sunday, { from: '10:00', to: '15:00' }),
  } as Record<DayKey, DayForm>,
})

const isSaving = ref(false)
const submitted = ref(false)

function phoneError(value: string, required = false): string {
  if (!submitted.value) return ''
  if (!value) return required ? 'Вкажіть номер' : ''
  return PHONE_PATTERN.test(value) ? '' : 'Формат: +380XXXXXXXXX'
}

const phone1Error = computed(() => phoneError(form.phone1.trim(), true))
const phone2Error = computed(() => phoneError(form.phone2.trim()))
const messengerError = computed(() => phoneError(form.messengerPhone.trim()))
const emailError = computed(() => {
  if (!submitted.value || !form.email.trim()) return ''
  return /^\S+@\S+\.\S+$/.test(form.email.trim()) ? '' : 'Невірний email'
})

function addStore() {
  if (form.stores.length >= MAX_STORES) return
  form.stores.push({ id: `store-${Date.now().toString(36)}`, city: '', address: '', mapEmbedUrl: '', logo: '', showMap: false })
}

function removeStore(index: number) {
  if (form.stores.length > 1) form.stores.splice(index, 1)
}

function mapSrc(item: StoreForm): string {
  return item.mapEmbedUrl.trim() || buildMapUrl(item.address.trim())
}

function storeError(item: StoreForm): string {
  if (!submitted.value) return ''
  if (!item.city.trim() || !item.address.trim()) return 'Вкажіть місто та адресу'
  if (item.mapEmbedUrl.trim() && !MAP_URL_PATTERN.test(item.mapEmbedUrl.trim())) return 'Посилання карти має починатися з https://www.google.com/maps/ або https://maps.google.com/'
  return ''
}

const hasStoreError = computed(() => submitted.value && form.stores.some(item => storeError(item)))

const hasTimeError = computed(() => submitted.value && days.some(({ key }) => {
  const day = form.schedule[key]
  return day.works && (!day.from || !day.to || day.from >= day.to)
}))

async function handleSubmit() {
  submitted.value = true

  if (phone1Error.value || phone2Error.value || messengerError.value || emailError.value || hasTimeError.value || hasStoreError.value) return

  const toHours = (day: DayForm): DayHours => (day.works ? { from: day.from, to: day.to } : null)

  const payload: SiteSettings = {
    phone1: form.phone1.trim(),
    phone2: form.phone2.trim() || null,
    email: form.email.trim() || null,
    messengerPhone: form.messengerPhone.trim() || null,
    schedule: {
      weekdays: toHours(form.schedule.weekdays),
      saturday: toHours(form.schedule.saturday),
      sunday: toHours(form.schedule.sunday),
    },
    stores: form.stores.map(item => ({
      id: item.id,
      city: item.city.trim(),
      address: item.address.trim(),
      mapEmbedUrl: item.mapEmbedUrl.trim() || null,
      logo: item.logo.trim() || null,
    })),
    citySelectorModal: form.citySelectorModal,
    citySwitcherHeader: form.citySwitcherHeader,
  }

  isSaving.value = true
  try {
    await store.save(payload)
    toast.success('Налаштування збережено')
  } catch {
    toast.error('Не вдалося зберегти налаштування')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="admin-edit">
    <div class="admin-edit__header">
      <h1 class="admin-edit__title">Налаштування сайту</h1>
    </div>

    <form class="settings" @submit.prevent="handleSubmit">
      <div class="admin-card">
        <h3 class="admin-card__title">Контакти</h3>
        <div class="admin-form">
          <BInput v-model="form.phone1" label="Основний телефон" placeholder="+380XXXXXXXXX" required :error="phone1Error" />
          <BInput v-model="form.phone2" label="Другий телефон" placeholder="+380XXXXXXXXX" :error="phone2Error" />
          <BInput v-model="form.email" label="Email" placeholder="mail@example.com" :error="emailError" />
          <BInput
              v-model="form.messengerPhone"
              label="Телефон для Telegram / Viber / WhatsApp"
              placeholder="+380XXXXXXXXX"
              :error="messengerError"
          />
        </div>
      </div>

      <div class="admin-card">
        <h3 class="admin-card__title">Графік роботи</h3>
        <div class="settings__schedule">
          <div v-for="day in days" :key="day.key" class="settings__day">
            <span class="settings__day-label">{{ day.label }}</span>
            <label class="admin-checkbox">
              <input v-model="form.schedule[day.key].works" type="checkbox">
              Працюємо
            </label>
            <template v-if="form.schedule[day.key].works">
              <input v-model="form.schedule[day.key].from" type="time" class="settings__time" aria-label="Початок">
              <span>—</span>
              <input v-model="form.schedule[day.key].to" type="time" class="settings__time" aria-label="Кінець">
            </template>
            <span v-else class="settings__off">Вихідний</span>
          </div>
        </div>
        <p v-if="hasTimeError" class="settings__error">Вкажіть час: початок має бути раніше за кінець</p>
        <p class="settings__hint">Графік використовується на сайті, у розмітці для Google і для нагадувань про необроблені заявки.</p>
      </div>

      <div class="admin-card">
        <h3 class="admin-card__title">Магазини та вибір міста</h3>

        <div class="settings__toggles">
          <label class="admin-checkbox">
            <input v-model="form.citySelectorModal" type="checkbox">
            Вікно вибору міста при першому відвідуванні
          </label>
          <label class="admin-checkbox">
            <input v-model="form.citySwitcherHeader" type="checkbox">
            Перемикач міста в шапці сайту
          </label>
          <p class="settings__hint">Якщо магазин один, вибір міста на сайті не показується незалежно від цих перемикачів.</p>
        </div>

        <div v-for="(item, index) in form.stores" :key="item.id" class="settings__store">
          <div class="settings__store-head">
            <span class="settings__store-title">Магазин {{ index + 1 }}{{ item.city ? ` — ${item.city}` : '' }}</span>
            <button
                type="button"
                class="settings__store-remove"
                :disabled="form.stores.length === 1"
                :title="form.stores.length === 1 ? 'Має бути хоча б один магазин' : 'Видалити магазин'"
                @click="removeStore(index)"
            >
              <BIcon name="trash" size="sm" />
            </button>
          </div>

          <div class="admin-form">
            <BInput v-model="item.city" label="Місто" placeholder="Запоріжжя" required />
            <BInput v-model="item.address" label="Адреса" placeholder="м. Запоріжжя, вул. Космічна, 63/1" required />
            <BInput v-model="item.logo" label="Логотип міста (необов'язково)" placeholder="/cities/zaporizhzhia.png" />
            <BInput
                v-model="item.mapEmbedUrl"
                label="Своє посилання карти (необов'язково)"
                placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
          <p class="settings__hint">Якщо власне посилання не вказано, карта будується за адресою.</p>
          <p v-if="storeError(item)" class="settings__error">{{ storeError(item) }}</p>

          <button type="button" class="settings__map-toggle" :disabled="!item.address.trim() && !item.mapEmbedUrl.trim()" @click="item.showMap = !item.showMap">
            {{ item.showMap ? 'Сховати карту' : 'Показати карту' }}
          </button>
          <iframe
              v-if="item.showMap"
              :src="mapSrc(item)"
              class="settings__map"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              :title="`Карта: ${item.city}`"
          />
        </div>

        <BButton type="button" variant="outline" :disabled="form.stores.length >= 10" @click="addStore">
          <BIcon name="plus" size="sm" />
          Додати магазин
        </BButton>
      </div>

      <BButton type="submit" size="lg" :loading="isSaving" class="settings__submit">Зберегти</BButton>
    </form>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings__schedule {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.settings__day {
  display: grid;
  grid-template-columns: 200px 130px auto auto auto;
  align-items: center;
  justify-content: start;
  gap: 12px;
  font-size: 14px;
  color: var(--text-primary);
}

.settings__day-label {
  font-weight: 600;
}

.settings__time {
  padding: 8px 10px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.settings__off {
  grid-column: span 3;
  color: var(--text-muted);
}

.settings__error {
  margin: 12px 0 0;
  font-size: 13px;
  color: #d32f2f;
}

.settings__hint {
  margin: 14px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.settings__submit {
  align-self: flex-start;
}

.settings__toggles {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.settings__store {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.settings__store-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.settings__store-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.settings__store-remove {
  display: flex;
  padding: 6px;
  color: var(--text-muted);
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.settings__store-remove:hover:not(:disabled) {
  color: #ef4444;
  background: var(--bg-secondary);
}

.settings__store-remove:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.settings__map-toggle {
  margin-top: 12px;
  padding: 6px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
  background: none;
  border: none;
  cursor: pointer;
}

.settings__map-toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.settings__map {
  display: block;
  width: 100%;
  height: 260px;
  margin-top: 8px;
  border: 1px solid var(--border);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .settings__day {
    grid-template-columns: 1fr auto;
  }

  .settings__day-label {
    grid-column: 1 / -1;
  }
}
</style>
