<script setup lang="ts">
import { usePortfolioApi } from '~/modules/portfolio/PortfolioApi'
import { useLeadStore } from '~/modules/lead/LeadStore'
import type { PortfolioWork } from '~/modules/portfolio/types'

interface WorkFilters {
  search: string
  category: string
  material: string
}

const props = defineProps<{
  filters: WorkFilters
  initialWorkId?: string
}>()

const portfolioApi = usePortfolioApi()
const leadStore = useLeadStore()

const works = ref<PortfolioWork[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)
const isFetching = ref(false)
const limit = 12

async function fetchWorks(reset = false) {
  if (isFetching.value) return

  if (reset) {
    currentPage.value = 1
    hasMore.value = true
    works.value = []
  }

  if (!hasMore.value) return
  isFetching.value = true

  if (reset) {
    isLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const response = await portfolioApi.getAll({
      categoryId: props.filters.category || undefined,
      material: props.filters.material || undefined,
      search: props.filters.search || undefined,
      page: currentPage.value,
      limit,
    })

    if (reset) {
      works.value = response.items
    } else {
      works.value.push(...response.items)
    }

    hasMore.value = response.hasMore
    currentPage.value++
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
    isFetching.value = false
  }
}

const { data: initialData } = await useAsyncData('portfolio-works', () =>
    portfolioApi.getAll({ page: 1, limit })
)

if (initialData.value) {
  works.value = initialData.value.items
  hasMore.value = initialData.value.hasMore
  currentPage.value = 2
}

watch(
    () => props.filters,
    () => fetchWorks(true),
    { deep: true }
)

const loadMoreTrigger = ref<HTMLElement | null>(null)

function onScroll() {
  if (!loadMoreTrigger.value) return
  if (!hasMore.value) return
  if (isFetching.value) return

  const rect = loadMoreTrigger.value.getBoundingClientRect()

  if (rect.top <= window.innerHeight + 300) {
    fetchWorks()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function getMainImage(work: PortfolioWork): string {
  if (!work.images.length) return ''
  const sorted = [...work.images].sort((a, b) => a.sortOrder - b.sortOrder)
  return sorted[0]?.url ?? ''
}

const overlayOpen = ref(false)
const fullscreenOpen = ref(false)
const currentIndex = ref(0)
const direction = ref<'next' | 'prev'>('next')
const thumbnailsRef = ref<HTMLElement | null>(null)
const endReachedMessage = ref(false)

const currentWork = computed(() => works.value[currentIndex.value])

function scrollThumbnailIntoView(index: number) {
  if (!thumbnailsRef.value) return
  const thumbnail = thumbnailsRef.value.children[index] as HTMLElement | undefined
  if (!thumbnail) return
  thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

watch(currentIndex, (index) => {
  nextTick(() => scrollThumbnailIntoView(index))

  if (hasMore.value && !isFetching.value && index >= works.value.length - 2) {
    fetchWorks()
  }
})

function openOverlay(index: number) {
  currentIndex.value = index
  overlayOpen.value = true
  if (import.meta.client) {
    document.body.style.overflow = 'hidden'
  }
  nextTick(() => scrollThumbnailIntoView(index))
}

function openOverlayById(workId: string) {
  const index = works.value.findIndex((work) => work.id === workId)
  if (index !== -1) {
    openOverlay(index)
  }
}

function closeOverlay() {
  overlayOpen.value = false
  fullscreenOpen.value = false
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
}

function openFullscreen() {
  fullscreenOpen.value = true
}

function closeFullscreen() {
  fullscreenOpen.value = false
}

function goToSlide(index: number) {
  direction.value = index > currentIndex.value ? 'next' : 'prev'
  currentIndex.value = index
}

function prevSlide() {
  direction.value = 'prev'
  currentIndex.value = currentIndex.value === 0
      ? works.value.length - 1
      : currentIndex.value - 1
}

function nextSlide() {
  direction.value = 'next'

  if (currentIndex.value === works.value.length - 1) {
    if (!hasMore.value) {
      endReachedMessage.value = true
      setTimeout(() => {
        endReachedMessage.value = false
        currentIndex.value = 0
      }, 1500)
      return
    }
  }

  currentIndex.value = currentIndex.value === works.value.length - 1
      ? 0
      : currentIndex.value + 1
}

let touchStartX = 0

function handleTouchStart(event: TouchEvent) {
  if (!event.touches[0]) return
  touchStartX = event.touches[0].clientX
}

function handleTouchEnd(event: TouchEvent) {
  if (!event.changedTouches[0]) return
  const diff = touchStartX - event.changedTouches[0].clientX
  if (Math.abs(diff) > 50) {
    diff > 0 ? nextSlide() : prevSlide()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!overlayOpen.value) return
  if (event.key === 'Escape') {
    if (fullscreenOpen.value) {
      closeFullscreen()
    } else {
      closeOverlay()
    }
  }
  if (event.key === 'ArrowLeft') prevSlide()
  if (event.key === 'ArrowRight') nextSlide()
}

const initialOpenHandled = ref(false)

watch(
    () => works.value,
    (newWorks) => {
      if (initialOpenHandled.value) return
      if (!props.initialWorkId) return
      if (newWorks.length === 0) return
      if (!import.meta.client) return

      openOverlayById(props.initialWorkId)
      initialOpenHandled.value = true
    },
    { immediate: true }
)

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

const inquiryOpen = ref(false)
const inquiryWorkTitle = ref('')
const inquiryName = ref('')
const inquiryPhone = ref('')
const inquiryMessage = ref('')

function openInquiry() {
  if (!currentWork.value) return
  inquiryWorkTitle.value = currentWork.value.title
  closeOverlay()
  inquiryName.value = ''
  inquiryPhone.value = ''
  inquiryMessage.value = ''
  leadStore.reset()
  inquiryOpen.value = true
}

async function submitInquiry() {
  if (!inquiryName.value.trim() || !inquiryPhone.value.trim()) return
  await leadStore.submit({
    name: inquiryName.value.trim(),
    phone: inquiryPhone.value.trim(),
    message: inquiryMessage.value.trim()
        ? `[Каталог: ${inquiryWorkTitle.value}] ${inquiryMessage.value.trim()}`
        : `Запит по роботі: ${inquiryWorkTitle.value}`,
    source: 'catalog',
  })
}

function closeInquiry() {
  inquiryOpen.value = false
  leadStore.reset()
}
</script>

<template>
  <div class="works-grid-wrap">
    <div v-if="isLoading" class="works-grid__empty">
      Завантаження...
    </div>
    <div v-else-if="!works.length" class="works-grid__empty">
      Нічого не знайдено
    </div>
    <div v-else class="works-grid">
      <button
          v-for="(work, index) in works"
          :key="work.id"
          class="works-card"
          @click="openOverlay(index)"
      >
        <div class="works-card__image">
          <img
              v-if="getMainImage(work)"
              :src="getMainImage(work)"
              :alt="work.title"
          >
          <div v-else class="works-card__placeholder">Немає фото</div>
        </div>
        <span class="works-card__title">{{ work.title }}</span>
      </button>
    </div>

    <div v-if="hasMore && works.length > 0" ref="loadMoreTrigger" class="works-grid__trigger">
      <div v-if="isLoadingMore" class="works-grid__loading">
        Завантаження...
      </div>
    </div>

    <Teleport to="body">
      <Transition name="overlay">
        <div
            v-if="overlayOpen && currentWork"
            class="works-overlay"
            @click.self="closeOverlay"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
        >
          <button class="works-overlay__close" @click="closeOverlay">✕</button>

          <button class="works-overlay__arrow works-overlay__arrow--left" @click="prevSlide">‹</button>

          <div class="works-overlay__center">
            <div class="works-overlay__image-wrap" @click="openFullscreen">
              <Transition :name="direction === 'next' ? 'slide-next' : 'slide-prev'" mode="out-in">
                <img
                    :key="currentWork.id"
                    :src="getMainImage(currentWork)"
                    :alt="currentWork.title"
                    class="works-overlay__image"
                >
              </Transition>
            </div>

            <Transition name="fade">
              <div v-if="endReachedMessage" class="works-overlay__end-message">
                Це всі роботи. Повертаємось на початок...
              </div>
            </Transition>

            <div class="works-overlay__thumbnails-wrap">
              <div ref="thumbnailsRef" class="works-overlay__thumbnails">
                <button
                    v-for="(work, index) in works"
                    :key="work.id"
                    class="works-overlay__thumb"
                    :class="{ 'works-overlay__thumb--active': index === currentIndex }"
                    @click="goToSlide(index)"
                >
                  <img
                      v-if="getMainImage(work)"
                      :src="getMainImage(work)"
                      :alt="work.title"
                  >
                  <div v-else class="works-overlay__thumb-empty" />
                </button>
              </div>
            </div>

            <div class="works-overlay__bottom">
              <div class="works-overlay__meta">
                <span class="works-overlay__counter">{{ currentIndex + 1 }} / {{ works.length }}</span>
              </div>

              <div class="works-overlay__cta">
                <div class="works-overlay__cta-inner">
                  <span class="works-overlay__cta-title">Створимо для вас подібний пам'ятник</span>
                  <span class="works-overlay__cta-sub">Індивідуальний підхід · Гарантія якості · Доставка по Україні</span>
                </div>
                <BButton variant="primary" size="lg" @click="openInquiry">
                  Обговорити проєкт
                </BButton>
              </div>
            </div>
          </div>

          <button class="works-overlay__arrow works-overlay__arrow--right" @click="nextSlide">›</button>
        </div>
      </Transition>

      <Transition name="fade">
        <div
            v-if="fullscreenOpen && currentWork"
            class="works-fullscreen"
            @click="closeFullscreen"
        >
          <button class="works-fullscreen__close" @click.stop="closeFullscreen">✕</button>
          <img
              :src="getMainImage(currentWork)"
              :alt="currentWork.title"
              class="works-fullscreen__image"
              @click.stop
          >
        </div>
      </Transition>
    </Teleport>

    <BModal v-model="inquiryOpen" title="Замовити подібну роботу">
      <template v-if="leadStore.isSuccess">
        <div class="works-inquiry__success">
          <p class="works-inquiry__success-title">Заявку відправлено!</p>
          <p class="works-inquiry__success-text">Ми зв'яжемося з вами найближчим часом</p>
        </div>
      </template>
      <template v-else>
        <p class="works-inquiry__ref">Робота: {{ inquiryWorkTitle }}</p>
        <div class="works-inquiry">
          <BInput v-model="inquiryName" label="Ім'я" placeholder="Ваше ім'я" required />
          <BInput v-model="inquiryPhone" label="Телефон" placeholder="+380 (__) ___-__-__" required phone />
          <BTextarea v-model="inquiryMessage" label="Побажання" placeholder="Опишіть, що б ви хотіли..." />
        </div>
      </template>
      <template #footer>
        <template v-if="leadStore.isSuccess">
          <BButton @click="closeInquiry">Закрити</BButton>
        </template>
        <template v-else>
          <BButton variant="ghost" @click="closeInquiry">Скасувати</BButton>
          <BButton :loading="leadStore.isSubmitting" @click="submitInquiry">Відправити</BButton>
        </template>
      </template>
    </BModal>
  </div>
</template>

<style scoped>
.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.works-card {
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.works-card:hover {
  border-color: var(--gold);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.1);
}

.works-card__image {
  aspect-ratio: 3/4;
  overflow: hidden;
}

.works-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.works-card:hover .works-card__image img {
  transform: scale(1.05);
}

.works-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  color: var(--text-muted);
  font-size: 13px;
}

.works-card__title {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.works-grid__empty {
  text-align: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--text-muted);
}

.works-grid__trigger {
  height: 40px;
}

.works-grid__loading {
  text-align: center;
  padding: 32px 0;
  font-size: 14px;
  color: var(--text-muted);
}

.works-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgb(0 0 0 / 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.works-overlay__close {
  all: unset;
  cursor: pointer;
  position: absolute;
  top: 24px;
  right: 28px;
  z-index: 1001;
  font-size: 28px;
  color: #fff;
  opacity: 0.6;
  transition: opacity 0.2s;
  line-height: 1;
}

.works-overlay__close:hover {
  opacity: 1;
}

.works-overlay__arrow {
  all: unset;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
  font-size: 48px;
  color: #fff;
  opacity: 0.4;
  transition: opacity 0.2s;
  padding: 20px;
  line-height: 1;
}

.works-overlay__arrow:hover {
  opacity: 1;
}

.works-overlay__arrow--left {
  left: 16px;
}

.works-overlay__arrow--right {
  right: 16px;
}

.works-overlay__center {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 900px;
  width: 100%;
  height: 100%;
  padding: 60px 100px 24px;
  box-sizing: border-box;
}

.works-overlay__image-wrap {
  flex: 1;
  width: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
}

.works-overlay__image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.works-overlay__end-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgb(0 0 0 / 0.85);
  border: 1px solid var(--gold);
  border-radius: 8px;
  padding: 16px 24px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  z-index: 10;
}

.works-overlay__thumbnails-wrap {
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
}

.works-overlay__thumbnails {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: thin;
  scrollbar-color: rgb(255 255 255 / 0.2) transparent;
}

.works-overlay__thumbnails::-webkit-scrollbar {
  height: 4px;
}

.works-overlay__thumbnails::-webkit-scrollbar-track {
  background: transparent;
}

.works-overlay__thumbnails::-webkit-scrollbar-thumb {
  background: rgb(255 255 255 / 0.2);
  border-radius: 2px;
}

.works-overlay__thumb {
  all: unset;
  cursor: pointer;
  flex-shrink: 0;
  width: 48px;
  height: 64px;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid transparent;
  opacity: 0.5;
  transition: opacity 0.2s, border-color 0.2s;
}

.works-overlay__thumb:hover {
  opacity: 0.8;
}

.works-overlay__thumb--active {
  opacity: 1;
  border-color: var(--gold);
}

.works-overlay__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.works-overlay__thumb-empty {
  width: 100%;
  height: 100%;
  background: rgb(255 255 255 / 0.1);
}

.works-overlay__bottom {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.works-overlay__meta {
  text-align: center;
}

.works-overlay__counter {
  font-size: 13px;
  color: rgb(255 255 255 / 0.35);
  letter-spacing: 0.1em;
}

.works-overlay__cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: rgb(255 255 255 / 0.06);
  border: 1px solid rgb(255 255 255 / 0.1);
  border-radius: 12px;
  padding: 20px 24px;
}

.works-overlay__cta-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.works-overlay__cta-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.works-overlay__cta-sub {
  font-size: 12px;
  color: rgb(255 255 255 / 0.4);
  letter-spacing: 0.02em;
}

.works-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgb(0 0 0 / 0.98);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.works-fullscreen__close {
  all: unset;
  cursor: pointer;
  position: absolute;
  top: 24px;
  right: 28px;
  z-index: 1101;
  font-size: 32px;
  color: #fff;
  opacity: 0.7;
  transition: opacity 0.2s;
  line-height: 1;
}

.works-fullscreen__close:hover {
  opacity: 1;
}

.works-fullscreen__image {
  max-height: 95vh;
  max-width: 95vw;
  object-fit: contain;
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

.works-inquiry__success {
  text-align: center;
  padding: 24px 0;
}

.works-inquiry__success-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.works-inquiry__success-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-next-enter-from {
  transform: translateX(60px);
  opacity: 0;
}

.slide-next-leave-to {
  transform: translateX(-60px);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-60px);
  opacity: 0;
}

.slide-prev-leave-to {
  transform: translateX(60px);
  opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .works-grid {
    grid-template-columns: 1fr;
  }

  .works-overlay__center {
    padding: 60px 12px 16px;
  }

  .works-overlay__arrow {
    font-size: 36px;
    padding: 12px;
  }

  .works-overlay__arrow--left {
    left: 4px;
  }

  .works-overlay__arrow--right {
    right: 4px;
  }

  .works-overlay__cta {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 16px;
  }

  .works-overlay__thumb {
    width: 40px;
    height: 52px;
  }
}
</style>