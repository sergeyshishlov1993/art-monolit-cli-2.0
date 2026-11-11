<script setup lang="ts">
import { useToast } from '~/modules/common/composables/useToast'

interface ExistingImage {
  id: string
  url: string
}

interface HeroSlideFormData {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  focusDesktop: string
  focusTablet: string
  focusMobile: string
  sortOrder: number
  isActive: boolean
}

const props = withDefaults(defineProps<{
  initialData?: Partial<HeroSlideFormData>
  initialImage?: ExistingImage | null
  submitLabel?: string
  backLabel?: string
  backTo?: string
  pageTitle?: string
  onSave?: (data: HeroSlideFormData, photo: File | null, deletePhoto: boolean) => Promise<void>
}>(), {
  initialData: () => ({}),
  initialImage: null,
  submitLabel: 'Створити слайд',
  backLabel: 'Слайдер',
  backTo: '',
  pageTitle: 'Новий слайд',
})

const toast = useToast()

const form = reactive<HeroSlideFormData>({
  title: props.initialData.title || '',
  subtitle: props.initialData.subtitle || '',
  buttonText: props.initialData.buttonText || '',
  buttonLink: props.initialData.buttonLink || '',
  focusDesktop: props.initialData.focusDesktop || '50% 50%',
  focusTablet: props.initialData.focusTablet || '50% 50%',
  focusMobile: props.initialData.focusMobile || '50% 50%',
  sortOrder: props.initialData.sortOrder ?? 0,
  isActive: props.initialData.isActive ?? true,
})

type FocusKey = 'focusDesktop' | 'focusTablet' | 'focusMobile'

const focusDevices: { key: FocusKey; label: string; aspect: string }[] = [
  { key: 'focusDesktop', label: 'Десктоп', aspect: '16 / 7' },
  { key: 'focusTablet', label: 'Планшет', aspect: '4 / 3' },
  { key: 'focusMobile', label: 'Телефон', aspect: '3 / 4' },
]
const activeFocus = ref<FocusKey>('focusDesktop')
const activeAspect = computed(() => focusDevices.find((device) => device.key === activeFocus.value)!.aspect)

function parseFocus(value: string): [number, number] {
  const [x, y] = value.split(' ').map((part) => parseInt(part, 10))
  return [x ?? 50, y ?? 50]
}

const frameRef = ref<HTMLElement | null>(null)
const naturalSize = ref<{ width: number; height: number } | null>(null)
const isDragging = ref(false)
let dragStart: { x: number; y: number; focusX: number; focusY: number } | null = null

function clampPercent(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)))
}

function onPreviewLoad(event: Event): void {
  const image = event.target as HTMLImageElement
  naturalSize.value = { width: image.naturalWidth, height: image.naturalHeight }
}

function onFocusPointerDown(event: PointerEvent): void {
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  const [focusX, focusY] = parseFocus(form[activeFocus.value])
  dragStart = { x: event.clientX, y: event.clientY, focusX, focusY }
  isDragging.value = true
}

// Перетягування зображення: рух вправо/вниз зсуває кадр, тому фокус рухається в протилежний бік
function onFocusPointerMove(event: PointerEvent): void {
  if (!dragStart || !frameRef.value || !naturalSize.value) return

  const frame = frameRef.value.getBoundingClientRect()
  const scale = Math.max(frame.width / naturalSize.value.width, frame.height / naturalSize.value.height)
  const overflowX = naturalSize.value.width * scale - frame.width
  const overflowY = naturalSize.value.height * scale - frame.height

  const nextX = overflowX > 0 ? dragStart.focusX - ((event.clientX - dragStart.x) / overflowX) * 100 : dragStart.focusX
  const nextY = overflowY > 0 ? dragStart.focusY - ((event.clientY - dragStart.y) / overflowY) * 100 : dragStart.focusY
  form[activeFocus.value] = `${clampPercent(nextX)}% ${clampPercent(nextY)}%`
}

function onFocusPointerUp(): void {
  dragStart = null
  isDragging.value = false
}

const photo = ref<File | null>(null)
const existingImage = ref<ExistingImage | null>(null)
const deleteExistingImage = ref(false)
const isSaving = ref(false)

watch(() => props.initialImage, (value) => {
  if (value) {
    existingImage.value = { ...value }
    deleteExistingImage.value = false
  }
}, { immediate: true })

const imagePreview = computed(() => {
  if (photo.value) return URL.createObjectURL(photo.value)
  if (existingImage.value && !deleteExistingImage.value) return existingImage.value.url
  return null
})

function onFileChange(files: File[]) {
  const file = files[0]
  if (file) {
    photo.value = file
    deleteExistingImage.value = true
  }
}

function removePhoto() {
  photo.value = null
  if (existingImage.value) {
    deleteExistingImage.value = true
  }
}

async function handleSubmit() {
  if (!props.onSave) return
  isSaving.value = true
  try {
    await props.onSave({ ...form }, photo.value, deleteExistingImage.value)
    toast.success('Слайд збережено')
  } catch {
    toast.error('Помилка при збереженні слайду')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="admin-edit">
    <div class="admin-edit__header">
      <NuxtLink :to="backTo" class="admin-edit__back">
        <BIcon name="arrow-right" size="sm" style="transform: rotate(180deg)" />
        {{ backLabel }}
      </NuxtLink>
      <h1 class="admin-edit__title">{{ pageTitle }}</h1>
    </div>

    <form class="admin-edit__body" @submit.prevent="handleSubmit">
      <div class="admin-edit__main">
        <div class="admin-card">
          <h3 class="admin-card__title">Основне</h3>
          <div class="admin-form">
            <BInput v-model="form.title" label="Заголовок" placeholder="Головний заголовок слайду" required />
            <BInput v-model="form.subtitle" label="Пiдзаголовок" placeholder="Додатковий текст" />
          </div>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Зображення</h3>

          <div v-if="imagePreview" class="admin-slide-preview">
            <img :src="imagePreview" alt="Зображення слайду" class="admin-slide-preview__img" />
            <div class="admin-slide-preview__overlay">
              <button
                  type="button"
                  class="admin-photo__btn admin-photo__btn--danger"
                  title="Видалити"
                  @click="removePhoto"
              >
                <BIcon name="trash" size="sm" />
              </button>
            </div>
          </div>

          <BFileUpload
              v-if="!imagePreview"
              label="Завантажити зображення"
              accept="image/*"
              :max-size="5"
              @update:model-value="onFileChange"
          />
        </div>

        <div v-if="imagePreview" class="admin-card">
          <h3 class="admin-card__title">Фокус зображення</h3>
          <div class="admin-focus__tabs">
            <button
                v-for="device in focusDevices"
                :key="device.key"
                type="button"
                class="admin-focus__tab"
                :class="{ 'admin-focus__tab--active': activeFocus === device.key }"
                @click="activeFocus = device.key"
            >
              {{ device.label }}
            </button>
          </div>
          <div
              ref="frameRef"
              class="admin-focus__frame"
              :class="[`admin-focus__frame--${activeFocus}`, { 'admin-focus__frame--dragging': isDragging }]"
              :style="{ aspectRatio: activeAspect }"
              @pointerdown.prevent="onFocusPointerDown"
              @pointermove="onFocusPointerMove"
              @pointerup="onFocusPointerUp"
              @pointercancel="onFocusPointerUp"
          >
            <img :src="imagePreview" alt="Фокус" draggable="false" :style="{ objectPosition: form[activeFocus] }" @load="onPreviewLoad">
          </div>
          <p class="admin-focus__hint">Перетягніть зображення, щоб обрати видиму область · {{ form[activeFocus] }}</p>
        </div>
      </div>

      <div class="admin-edit__side">
        <div class="admin-card">
          <h3 class="admin-card__title">Кнопка</h3>
          <div class="admin-form">
            <BInput v-model="form.buttonText" label="Текст кнопки" placeholder="Детальнiше" />
            <BInput v-model="form.buttonLink" label="Посилання" placeholder="/catalog" />
          </div>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Налаштування</h3>
          <div class="admin-form">
            <BInput
                :model-value="String(form.sortOrder)"
                label="Порядок сортування"
                type="number"
                placeholder="0"
                @update:model-value="form.sortOrder = Number($event) || 0"
            />
            <label class="admin-checkbox">
              <input v-model="form.isActive" type="checkbox">
              <span>Активний (видимий на сайтi)</span>
            </label>
          </div>
        </div>

        <div class="admin-card admin-card--actions">
          <BButton type="submit" block :loading="isSaving">
            <BIcon name="check" size="sm" />
            {{ submitLabel }}
          </BButton>
          <BButton variant="ghost" block :to="backTo">
            Скасувати
          </BButton>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.admin-edit {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-edit__header {
  margin-bottom: 32px;
}

.admin-edit__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.2s;
}

.admin-edit__back:hover {
  color: var(--gold);
}

.admin-edit__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-edit__body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

.admin-edit__main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin-edit__side {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 80px;
}

.admin-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
}

.admin-card--actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-card__title {
  margin: 0 0 20px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary);
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
}

.admin-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--gold);
  cursor: pointer;
}

.admin-focus__tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.admin-focus__tab {
  padding: 6px 14px;
  font-size: 13px;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
}

.admin-focus__tab--active {
  color: var(--gold);
  border-color: var(--gold);
}

.admin-focus__frame {
  margin: 0 auto 16px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  border: 2px solid var(--border);
  border-radius: 8px;
}

.admin-focus__frame {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.admin-focus__frame--dragging {
  cursor: grabbing;
}

.admin-focus__hint {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
}

.admin-focus__frame--focusMobile {
  max-width: 240px;
}

.admin-focus__frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.admin-slide-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border);
  margin-bottom: 16px;
}

.admin-slide-preview__img {
  width: 100%;
  aspect-ratio: 16/7;
  object-fit: cover;
  display: block;
}

.admin-slide-preview__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s;
}

.admin-slide-preview:hover .admin-slide-preview__overlay {
  opacity: 1;
}

.admin-photo__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-photo__btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.admin-photo__btn--danger:hover {
  background: var(--error);
  border-color: var(--error);
}

@media (max-width: 1024px) {
  .admin-edit__body {
    grid-template-columns: 1fr;
  }

  .admin-edit__side {
    position: static;
  }
}
</style>