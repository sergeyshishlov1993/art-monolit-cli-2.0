<script setup lang="ts">
interface SliderSlide {
  image: string
  alt?: string
}

interface Props {
  slides: SliderSlide[]
  autoplay?: boolean
  interval?: number
  aspectRatio?: string
  loop?: boolean
  thumbs?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  interval: 5000,
  aspectRatio: '16/9',
  loop: true,
  thumbs: true,
})

const currentIndex = ref(0)
const isTransitioning = ref(false)
const thumbsContainer = ref<HTMLElement | null>(null)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const slidesCount = computed(() => props.slides.length)
const canGoPrev = computed(() => props.loop || currentIndex.value > 0)
const canGoNext = computed(() => props.loop || currentIndex.value < slidesCount.value - 1)

function goTo(index: number) {
  if (isTransitioning.value) return
  isTransitioning.value = true

  if (props.loop) {
    currentIndex.value = (index + slidesCount.value) % slidesCount.value
  } else {
    currentIndex.value = Math.max(0, Math.min(index, slidesCount.value - 1))
  }

  scrollThumbIntoView()

  setTimeout(() => {
    isTransitioning.value = false
  }, 400)
}

function prev() {
  if (canGoPrev.value) goTo(currentIndex.value - 1)
}

function next() {
  if (canGoNext.value) goTo(currentIndex.value + 1)
}

function scrollThumbIntoView() {
  nextTick(() => {
    if (!thumbsContainer.value) return
    const activeThumb = thumbsContainer.value.children[currentIndex.value] as HTMLElement
    if (!activeThumb) return

    const container = thumbsContainer.value
    const thumbLeft = activeThumb.offsetLeft
    const thumbWidth = activeThumb.offsetWidth
    const containerWidth = container.clientWidth
    const scrollLeft = container.scrollLeft

    if (thumbLeft < scrollLeft) {
      container.scrollTo({ left: thumbLeft - 8, behavior: 'smooth' })
    } else if (thumbLeft + thumbWidth > scrollLeft + containerWidth) {
      container.scrollTo({ left: thumbLeft + thumbWidth - containerWidth + 8, behavior: 'smooth' })
    }
  })
}

function startAutoplay() {
  stopAutoplay()
  if (props.autoplay && slidesCount.value > 1) {
    autoplayTimer = setInterval(next, props.interval)
  }
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

let touchStartX = 0

function onTouchStart(event: TouchEvent) {
  touchStartX = event.touches[0].clientX
  stopAutoplay()
}

function onTouchEnd(event: TouchEvent) {
  const diff = touchStartX - event.changedTouches[0].clientX

  if (Math.abs(diff) > 50) {
    if (diff > 0) next()
    else prev()
  }

  startAutoplay()
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

watch(() => props.autoplay, (value) => {
  if (value) startAutoplay()
  else stopAutoplay()
})
</script>

<template>
  <div
      class="b-slider"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
  >
    <div
        class="b-slider__viewport"
        :style="{ aspectRatio }"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
    >
      <div
          class="b-slider__track"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
            v-for="(slide, index) in slides"
            :key="index"
            class="b-slider__slide"
        >
          <img
              :src="slide.image"
              :alt="slide.alt || `Slide ${index + 1}`"
              class="b-slider__image"
          >
          <slot name="slide" :slide="slide" :index="index" />
        </div>
      </div>

      <template v-if="slidesCount > 1">
        <button
            class="b-slider__arrow b-slider__arrow--prev"
            :disabled="!canGoPrev"
            @click="prev"
        >
          <BIcon name="chevron-left" size="md" />
        </button>

        <button
            class="b-slider__arrow b-slider__arrow--next"
            :disabled="!canGoNext"
            @click="next"
        >
          <BIcon name="chevron-right" size="md" />
        </button>
      </template>
    </div>

    <div v-if="thumbs && slidesCount > 1" class="b-slider__thumbs-wrapper">
      <div ref="thumbsContainer" class="b-slider__thumbs">
        <button
            v-for="(slide, index) in slides"
            :key="index"
            class="b-slider__thumb"
            :class="{ 'b-slider__thumb--active': currentIndex === index }"
            @click="goTo(index)"
        >
          <img
              :src="slide.image"
              :alt="slide.alt || `Thumb ${index + 1}`"
              class="b-slider__thumb-image"
          >
        </button>
      </div>
    </div>

    <div v-if="!thumbs && slidesCount > 1" class="b-slider__dots">
      <button
          v-for="index in slidesCount"
          :key="index"
          class="b-slider__dot"
          :class="{ 'b-slider__dot--active': currentIndex === index - 1 }"
          @click="goTo(index - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
.b-slider {
  position: relative;
  width: 100%;
}

.b-slider__viewport {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  background: var(--bg-secondary);
}

.b-slider__track {
  display: flex;
  transition: transform 0.4s ease;
  height: 100%;
}

.b-slider__slide {
  min-width: 100%;
  position: relative;
  height: 100%;
}

.b-slider__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.b-slider__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.b-slider__arrow:hover {
  background: rgba(0, 0, 0, 0.7);
}

.b-slider__arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.b-slider__arrow--prev {
  left: 12px;
}

.b-slider__arrow--next {
  right: 12px;
}

.b-slider__thumbs-wrapper {
  margin-top: 12px;
}

.b-slider__thumbs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 2px;
}

.b-slider__thumbs::-webkit-scrollbar {
  display: none;
}

.b-slider__thumb {
  flex-shrink: 0;
  width: 72px;
  height: 52px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s, border-color 0.2s;
  background: var(--bg-secondary);
}

.b-slider__thumb:hover {
  opacity: 0.8;
}

.b-slider__thumb--active {
  opacity: 1;
  border-color: var(--gold, #c9a84c);
}

.b-slider__thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.b-slider__dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.b-slider__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
}

.b-slider__dot--active {
  background: var(--gold, #c9a84c);
  border-color: var(--gold, #c9a84c);
}

.b-slider__dot:hover:not(.b-slider__dot--active) {
  background: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .b-slider__arrow {
    width: 32px;
    height: 32px;
  }

  .b-slider__arrow--prev {
    left: 8px;
  }

  .b-slider__arrow--next {
    right: 8px;
  }

  .b-slider__thumb {
    width: 56px;
    height: 40px;
  }
}
</style>