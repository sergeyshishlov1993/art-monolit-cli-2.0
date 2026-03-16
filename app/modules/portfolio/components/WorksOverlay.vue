<script setup lang="ts">
import type { PortfolioWork } from '~/modules/portfolio/types'
import WorksFullscreen from './WorksFullscreen.vue'

const props = defineProps<{
  works: PortfolioWork[]
  modelValue: boolean
  initialIndex: number
  hasMore: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'load-more': []
  'inquiry': [work: PortfolioWork]
}>()

const currentIndex = ref(props.initialIndex)
const direction = ref<'next' | 'prev'>('next')
const fullscreenOpen = ref(false)
const endReachedMessage = ref(false)
const thumbnailsRef = ref<HTMLElement | null>(null)

const currentWork = computed(() => props.works[currentIndex.value])

watch(() => props.initialIndex, (index) => {
  currentIndex.value = index
})

watch(() => props.modelValue, (open) => {
  if (open) {
    currentIndex.value = props.initialIndex
    if (import.meta.client) {
      document.body.style.overflow = 'hidden'
    }
    nextTick(() => scrollThumbnailIntoView(currentIndex.value))
  }
})

function getMainImage(work: PortfolioWork): string {
  if (!work.images.length) return ''
  const sorted = [...work.images].sort((firstImage, secondImage) => firstImage.sortOrder - secondImage.sortOrder)
  return sorted[0]?.url ?? ''
}

function scrollThumbnailIntoView(index: number) {
  if (!thumbnailsRef.value) return
  const thumbnail = thumbnailsRef.value.children[index] as HTMLElement | undefined
  if (!thumbnail) return
  thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

watch(currentIndex, (index) => {
  nextTick(() => scrollThumbnailIntoView(index))

  if (props.hasMore && index >= props.works.length - 2) {
    emit('load-more')
  }
})

function close() {
  fullscreenOpen.value = false
  emit('update:modelValue', false)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
}

function goToSlide(index: number) {
  direction.value = index > currentIndex.value ? 'next' : 'prev'
  currentIndex.value = index
}

function prevSlide() {
  direction.value = 'prev'
  currentIndex.value = currentIndex.value === 0
      ? props.works.length - 1
      : currentIndex.value - 1
}

function nextSlide() {
  direction.value = 'next'

  if (currentIndex.value === props.works.length - 1) {
    if (!props.hasMore) {
      endReachedMessage.value = true
      setTimeout(() => {
        endReachedMessage.value = false
        currentIndex.value = 0
      }, 1500)
      return
    }
  }

  currentIndex.value = currentIndex.value === props.works.length - 1
      ? 0
      : currentIndex.value + 1
}

function openFullscreen() {
  fullscreenOpen.value = true
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
  if (!props.modelValue) return
  if (event.key === 'Escape') {
    if (fullscreenOpen.value) {
      fullscreenOpen.value = false
    } else {
      close()
    }
  }
  if (event.key === 'ArrowLeft') prevSlide()
  if (event.key === 'ArrowRight') nextSlide()
}

function openInquiry() {
  if (!currentWork.value) return
  close()
  emit('inquiry', currentWork.value)
}

onMounted(() => window.addEventListener('keydown', handleKeydown))

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
          v-if="modelValue && currentWork"
          class="works-overlay"
          @click.self="close"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
      >
        <button class="works-overlay__close" @click="close">✕</button>

        <button class="works-overlay__arrow works-overlay__arrow--left" @click="prevSlide">‹</button>

        <div class="works-overlay__center">
          <div class="works-overlay__image-wrap">
            <Transition :name="direction === 'next' ? 'slide-next' : 'slide-prev'" mode="out-in">
              <img
                  :key="currentWork.id"
                  :src="getMainImage(currentWork)"
                  :alt="currentWork.title"
                  class="works-overlay__image"
                  @click="openFullscreen"
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

    <WorksFullscreen
        v-if="fullscreenOpen && currentWork"
        :work="currentWork"
        :index="currentIndex"
        :total="works.length"
        @close="fullscreenOpen = false"
        @prev="prevSlide"
        @next="nextSlide"
    />
  </Teleport>
</template>

<style scoped>
.works-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgb(0 0 0 / 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  padding: 24px;
  box-sizing: border-box;
}

.works-overlay__close {
  all: unset;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1002;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  opacity: 0.85;
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
  max-width: 90vw;
  width: 100%;
  height: calc(100vh - 48px);
  max-height: calc(100vh - 48px);
  box-sizing: border-box;
}

.works-overlay__image-wrap {
  flex: 1;
  width: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.works-overlay__image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  cursor: zoom-in;
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
  .works-overlay__arrow {
    font-size: 40px;
    padding: 16px;
  }

  .works-overlay__arrow--left {
    left: 8px;
  }

  .works-overlay__arrow--right {
    right: 8px;
  }
}

@media (max-width: 600px) {
  .works-overlay {
    padding: 16px;
  }

  .works-overlay__center {
    max-width: 100%;
    width: 100%;
    height: calc(100vh - 32px);
    max-height: calc(100vh - 32px);
    gap: 12px;
  }

  .works-overlay__image-wrap {
    flex: 1;
    width: 100%;
    min-height: 0;
  }

  .works-overlay__close {
    top: 12px;
    right: 12px;
    width: 56px;
    height: 56px;
    font-size: 36px;
  }

  .works-overlay__arrow {
    font-size: 32px;
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

  .works-overlay__cta-title {
    font-size: 14px;
  }

  .works-overlay__cta-sub {
    font-size: 11px;
  }

  .works-overlay__thumb {
    width: 40px;
    height: 52px;
  }
}
</style>