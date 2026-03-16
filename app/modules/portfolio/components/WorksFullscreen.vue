<script setup lang="ts">
import type { PortfolioWork } from '~/modules/portfolio/types'

const props = defineProps<{
  work: PortfolioWork
  index: number
  total: number
}>()

const emit = defineEmits<{
  close: []
  prev: []
  next: []
}>()

const mainImage = computed(() => {
  if (!props.work.images.length) return ''
  const sorted = [...props.work.images].sort((a, b) => a.sortOrder - b.sortOrder)
  return sorted[0]?.url ?? ''
})

let touchStartX = 0
let touchStartY = 0
let touchStartTime = 0

function handleTouchStart(event: TouchEvent) {
  if (!event.touches[0]) return
  touchStartX = event.touches[0].clientX
  touchStartY = event.touches[0].clientY
  touchStartTime = Date.now()
}

function handleTouchEnd(event: TouchEvent) {
  if (!event.changedTouches[0]) return
  const diffX = touchStartX - event.changedTouches[0].clientX
  const diffY = touchStartY - event.changedTouches[0].clientY
  const elapsed = Date.now() - touchStartTime

  if (elapsed > 500) return

  if (Math.abs(diffY) > 80 && Math.abs(diffY) > Math.abs(diffX) && diffY < 0) {
    emit('close')
    return
  }

  if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
    diffX > 0 ? emit('next') : emit('prev')
  }
}
</script>

<template>
  <Transition name="fade">
    <div
        v-if="work"
        class="works-fullscreen"
        @click="emit('close')"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
    >
      <button class="works-fullscreen__close" @click.stop="emit('close')">✕</button>

      <button class="works-fullscreen__arrow works-fullscreen__arrow--left" @click.stop="emit('prev')">‹</button>

      <Transition name="slide-fade" mode="out-in">
        <img
            :key="work.id"
            :src="mainImage"
            :alt="work.category.name"
            class="works-fullscreen__image"
            @click.stop
        >
      </Transition>

      <button class="works-fullscreen__arrow works-fullscreen__arrow--right" @click.stop="emit('next')">›</button>

      <span class="works-fullscreen__counter">{{ index + 1 }} / {{ total }}</span>

      <div class="works-fullscreen__swipe-hint">
        <span class="works-fullscreen__swipe-icon">↓</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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
  top: 16px;
  right: 16px;
  z-index: 1101;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  background: rgb(255 255 255 / 0.12);
  border-radius: 50%;
  opacity: 0.8;
  transition: opacity 0.2s, background 0.2s;
}

.works-fullscreen__close:hover {
  opacity: 1;
  background: rgb(255 255 255 / 0.2);
}

.works-fullscreen__image {
  max-height: 95vh;
  max-width: 95vw;
  object-fit: contain;
}

.works-fullscreen__arrow {
  all: unset;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1101;
  font-size: 56px;
  color: #fff;
  opacity: 0.5;
  transition: opacity 0.2s;
  padding: 20px;
  line-height: 1;
}

.works-fullscreen__arrow:hover {
  opacity: 1;
}

.works-fullscreen__arrow--left {
  left: 16px;
}

.works-fullscreen__arrow--right {
  right: 16px;
}

.works-fullscreen__counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: rgb(255 255 255 / 0.5);
  letter-spacing: 0.1em;
}

.works-fullscreen__swipe-hint {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  animation: swipe-bounce 2s infinite;
}

.works-fullscreen__swipe-icon {
  font-size: 20px;
  color: rgb(255 255 255 / 0.3);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-fade-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: scale(0.95);
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

@keyframes swipe-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

@media (max-width: 600px) {
  .works-fullscreen__close {
    top: 12px;
    right: 12px;
    width: 44px;
    height: 44px;
    font-size: 22px;
  }

  .works-fullscreen__arrow {
    font-size: 36px;
    padding: 12px;
  }

  .works-fullscreen__arrow--left {
    left: 4px;
  }

  .works-fullscreen__arrow--right {
    right: 4px;
  }

  .works-fullscreen__swipe-hint {
    display: block;
  }
}
</style>