<script setup lang="ts">
import type { Product } from '~/modules/product/types'

const props = defineProps<{
  product: Product
}>()

const activeThumb = ref(0)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const badgeLabels: Record<string, string> = {
  NEW: 'Новинка',
  HIT: 'Хіт продажів',
  SALE: 'Акція',
}

const slides = computed(() =>
    (props.product.images ?? [])
        .toSorted((a, b) => {
          if (a.isMain !== b.isMain) return a.isMain ? -1 : 1
          return a.sortOrder - b.sortOrder
        })
        .map((img) => ({ image: img.url, alt: img.alt || props.product.title || '' }))
)

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function lightboxPrev() {
  lightboxIndex.value = lightboxIndex.value > 0 ? lightboxIndex.value - 1 : slides.value.length - 1
}

function lightboxNext() {
  lightboxIndex.value = lightboxIndex.value < slides.value.length - 1 ? lightboxIndex.value + 1 : 0
}

function handleKeydown(event: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (event.key === 'Escape') closeLightbox()
  if (event.key === 'ArrowLeft') lightboxPrev()
  if (event.key === 'ArrowRight') lightboxNext()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="gallery">
    <div class="gallery__badges">
      <span
          v-for="badge in (product.badges || [])"
          :key="badge"
          class="gallery__badge"
          :class="`gallery__badge--${badge.toLowerCase()}`"
      >
        {{ badgeLabels[badge] || badge }}
      </span>
      <span v-if="product.discountPercent" class="gallery__badge gallery__badge--discount">
        -{{ product.discountPercent }}%
      </span>
    </div>

    <div class="gallery__main" @click="openLightbox(activeThumb)">
      <img
          v-if="slides[activeThumb]"
          :src="slides[activeThumb].image"
          :alt="slides[activeThumb].alt"
          class="gallery__main-img"
      />
      <div class="gallery__zoom">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <div v-if="slides.length > 1" class="gallery__thumbs">
      <button
          v-for="(slide, index) in slides"
          :key="index"
          class="gallery__thumb"
          :class="{ 'gallery__thumb--active': activeThumb === index }"
          @click="activeThumb = index"
      >
        <img :src="slide.image" :alt="slide.alt" />
      </button>
    </div>

    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div v-if="lightboxOpen" class="gallery__lightbox" @click.self="closeLightbox">
          <button class="gallery__lightbox-close" @click="closeLightbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button class="gallery__lightbox-nav gallery__lightbox-nav--prev" @click="lightboxPrev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15.75 19.5L8.25 12l7.5-7.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <div class="gallery__lightbox-content">
            <img
                v-if="slides[lightboxIndex]"
                :src="slides[lightboxIndex].image"
                :alt="slides[lightboxIndex].alt"
            />
          </div>

          <button class="gallery__lightbox-nav gallery__lightbox-nav--next" @click="lightboxNext">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <div class="gallery__lightbox-counter">
            {{ lightboxIndex + 1 }} / {{ slides.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery {
  position: sticky;
  top: 100px;
}

.gallery__badges {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gallery__badge {
  display: inline-block;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  border-radius: 4px;
  width: fit-content;
}

.gallery__badge--new { background: #1565c0; }
.gallery__badge--hit { background: var(--gold); color: white; }
.gallery__badge--sale { background: #c62828; }
.gallery__badge--discount { background: #c62828; font-size: 14px; font-weight: 800; }

.gallery__main {
  position: relative;
  aspect-ratio: 1/1;
  border-radius: 12px;
  overflow: hidden;
  background: var(--surface-secondary);
  cursor: zoom-in;
}

.gallery__main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery__main:hover .gallery__main-img {
  transform: scale(1.05);
}

.gallery__zoom {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery__main:hover .gallery__zoom {
  opacity: 1;
}

.gallery__zoom svg {
  width: 20px;
  height: 20px;
  color: #fff;
}

.gallery__thumbs {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.gallery__thumb {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-secondary);
  cursor: pointer;
  transition: border-color 0.2s ease, opacity 0.2s ease;
}

.gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery__thumb:hover {
  opacity: 0.8;
}

.gallery__thumb--active {
  border-color: var(--gold);
}

.gallery__lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
}

.gallery__lightbox-close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.gallery__lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.gallery__lightbox-close svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.gallery__lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.gallery__lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
}

.gallery__lightbox-nav svg {
  width: 28px;
  height: 28px;
  color: #fff;
}

.gallery__lightbox-nav--prev {
  left: 24px;
}

.gallery__lightbox-nav--next {
  right: 24px;
}

.gallery__lightbox-content {
  max-width: 90vw;
  max-height: 85vh;
}

.gallery__lightbox-content img {
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
}

.gallery__lightbox-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .gallery {
    position: static;
  }

  .gallery__lightbox-nav--prev {
    left: 12px;
  }

  .gallery__lightbox-nav--next {
    right: 12px;
  }

  .gallery__lightbox-nav {
    width: 44px;
    height: 44px;
  }

  .gallery__lightbox-nav svg {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 600px) {
  .gallery__thumbs {
    gap: 8px;
  }

  .gallery__thumb {
    width: 60px;
    height: 60px;
  }
}
</style>