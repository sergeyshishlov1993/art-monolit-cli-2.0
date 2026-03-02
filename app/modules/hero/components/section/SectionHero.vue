<script setup lang="ts">
import { useHeroStore } from '~/modules/hero/HeroStore'

const heroStore = useHeroStore()

await heroStore.fetchAll()

const currentIndex = ref<number>(0)
let timer: ReturnType<typeof setInterval> | null = null

const currentSlide = computed(() => heroStore.slides[currentIndex.value])

function next(): void {
  if (heroStore.slides.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % heroStore.slides.length
}

function goTo(index: number): void {
  currentIndex.value = index
  restartTimer()
}

function restartTimer(): void {
  if (timer) clearInterval(timer)
  if (heroStore.slides.length > 1) {
    timer = setInterval(next, 6000)
  }
}

function handleButtonClick(): void {
  if (currentSlide.value?.buttonLink) {
    navigateTo(currentSlide.value.buttonLink)
  }
}

onMounted(() => {
  restartTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

watch(() => heroStore.slides, () => {
  if (currentIndex.value >= heroStore.slides.length) {
    currentIndex.value = 0
  }
  restartTimer()
})
</script>

<template>
  <section class="hero">
    <div v-if="heroStore.loading && !heroStore.loaded" class="hero__loading">
      Завантаження...
    </div>

    <template v-else-if="heroStore.slides.length > 0 && currentSlide">
      <div class="hero__slides">
        <div
            v-for="(slide, index) in heroStore.slides"
            :key="slide.id"
            class="hero__slide"
            :class="{ 'hero__slide--active': currentIndex === index }"
        >
          <img
              v-if="slide.imageUrl"
              :src="slide.imageUrl"
              :alt="slide.title"
              class="hero__bg"
          >
          <div v-else class="hero__bg hero__bg--placeholder" />
        </div>
      </div>

      <div class="hero__overlay" />

      <div class="hero__content">
        <div class="hero__text-block">
          <Transition name="hero-text" mode="out-in">
            <div :key="currentIndex" class="hero__text">
              <h1 class="hero__title">{{ currentSlide.title }}</h1>
              <p v-if="currentSlide.subtitle" class="hero__subtitle">
                {{ currentSlide.subtitle }}
              </p>
            </div>
          </Transition>
        </div>

        <div class="hero__actions">
          <BButton
              v-if="currentSlide.buttonText && currentSlide.buttonLink"
              variant="secondary"
              size="lg"
              @click="handleButtonClick"
          >
            {{ currentSlide.buttonText }}
            <BIcon name="arrow-right" size="sm" />
          </BButton>
          <BButton variant="danger" size="lg" @click="navigateTo('/contacts')">
            Зв'язатися з нами
          </BButton>
        </div>

        <div v-if="heroStore.slides.length > 1" class="hero__dots">
          <button
              v-for="(_, index) in heroStore.slides"
              :key="index"
              class="hero__dot"
              :class="{ 'hero__dot--active': currentIndex === index }"
              @click="goTo(index)"
          />
        </div>
      </div>
    </template>

    <div v-else class="hero__empty">
      Слайди відсутні
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 85vh;
  min-height: 500px;
  max-height: 800px;
  overflow: hidden;
}

.hero__loading,
.hero__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 18px;
  color: var(--text-muted);
  background: var(--bg-secondary);
}

.hero__slides {
  position: absolute;
  inset: 0;
}

.hero__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1s ease;
}

.hero__slide--active {
  opacity: 1;
}

.hero__bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__bg--placeholder {
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.6) 60%,
      rgba(0, 0, 0, 0.8) 100%
  );
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.hero__text-block {
  position: relative;
  min-height: 160px;
}

.hero__text {
  display: flex;
  flex-direction: column;
}

.hero__title {
  margin: 0;
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  line-height: 1.15;
  letter-spacing: 0.02em;
  max-width: 700px;
}

.hero__subtitle {
  margin: 16px 0 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.75);
  max-width: 550px;
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.hero__dots {
  position: absolute;
  bottom: 32px;
  left: 24px;
  display: flex;
  gap: 10px;
}

.hero__dot {
  width: 40px;
  height: 3px;
  border: none;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
}

.hero__dot--active {
  background: var(--gold);
  width: 60px;
}

.hero-text-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.hero-text-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.hero-text-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.hero-text-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .hero {
    height: 70vh;
    min-height: 400px;
  }

  .hero__text-block {
    min-height: 120px;
  }

  .hero__title {
    font-size: 32px;
  }

  .hero__subtitle {
    font-size: 15px;
  }

  .hero__actions {
    flex-direction: column;
  }
}
</style>