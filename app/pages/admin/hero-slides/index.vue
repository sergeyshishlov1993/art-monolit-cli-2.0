<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHeroApi } from '~/modules/hero/HeroApi'
import { ROUTES } from '~/modules/common/constants/routes'
import type { HeroSlide } from '~/modules/hero/types'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const heroApi = useHeroApi()

const slides = ref<HeroSlide[]>([])
const loading = ref(true)
const deleteModal = ref(false)
const slideToDelete = ref<HeroSlide | null>(null)

async function fetchSlides() {
  loading.value = true
  try {
    slides.value = await heroApi.getAll({ all: true })
  } finally {
    loading.value = false
  }
}

function confirmDelete(slide: HeroSlide) {
  slideToDelete.value = slide
  deleteModal.value = true
}

async function handleDelete() {
  if (!slideToDelete.value) return
  await heroApi.remove(slideToDelete.value.id)
  deleteModal.value = false
  slideToDelete.value = null
  await fetchSlides()
}

onMounted(fetchSlides)
</script>

<template>
  <div class="admin-list">
    <div class="admin-list__header">
      <h1 class="admin-list__title">Слайдер</h1>
      <BButton :to="ROUTES.ADMIN.HERO_SLIDE_CREATE">
        <BIcon name="plus" size="sm" />
        Додати слайд
      </BButton>
    </div>

    <div v-if="loading" class="admin-loading">Завантаження...</div>

    <div v-else-if="!slides.length" class="admin-empty">
      Слайди ще не додані
    </div>

    <div v-else class="admin-slides">
      <div
          v-for="slide in slides"
          :key="slide.id"
          class="admin-slide"
          :class="{ 'admin-slide--inactive': !slide.isActive }"
      >
        <div class="admin-slide__image">
          <img
              v-if="slide.imageUrl"
              :src="slide.imageUrl"
              :alt="slide.title"
              class="admin-slide__img"
          />
          <div v-else class="admin-slide__placeholder">
            <BIcon name="image" size="lg" />
          </div>
        </div>

        <div class="admin-slide__body">
          <div class="admin-slide__info">
            <h3 class="admin-slide__title">{{ slide.title }}</h3>
            <p v-if="slide.subtitle" class="admin-slide__subtitle">{{ slide.subtitle }}</p>
            <div class="admin-slide__meta">
              <span class="admin-slide__order">Порядок: {{ slide.sortOrder }}</span>
              <span
                  class="admin-slide__status"
                  :class="slide.isActive ? 'admin-slide__status--active' : 'admin-slide__status--inactive'"
              >
                {{ slide.isActive ? 'Активний' : 'Неактивний' }}
              </span>
              <span v-if="slide.buttonText" class="admin-slide__button-info">
                Кнопка: {{ slide.buttonText }} → {{ slide.buttonLink }}
              </span>
            </div>
          </div>

          <div class="admin-slide__actions">
            <BButton
                variant="ghost"
                size="sm"
                @click="router.push(ROUTES.ADMIN.HERO_SLIDE_EDIT(slide.id))"
            >
              <BIcon name="edit" size="sm" />
              Редагувати
            </BButton>
            <BButton
                variant="ghost"
                size="sm"
                @click="confirmDelete(slide)"
            >
              <BIcon name="trash" size="sm" />
            </BButton>
          </div>
        </div>
      </div>
    </div>

    <BModal v-model="deleteModal" title="Видалити слайд?">
      <p class="admin-confirm-text">
        Слайд «{{ slideToDelete?.title }}» буде видалено назавжди.
      </p>
      <template #footer>
        <BButton variant="ghost" @click="deleteModal = false">Скасувати</BButton>
        <BButton variant="danger" @click="handleDelete">Видалити</BButton>
      </template>
    </BModal>
  </div>
</template>

<style scoped>
.admin-list {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.admin-list__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-loading,
.admin-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  font-size: 14px;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.admin-slides {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-slide {
  display: flex;
  gap: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.admin-slide:hover {
  border-color: var(--gold);
}

.admin-slide--inactive {
  opacity: 0.5;
}

.admin-slide__image {
  flex-shrink: 0;
  width: 280px;
}

.admin-slide__img {
  width: 100%;
  height: 100%;
  min-height: 140px;
  object-fit: cover;
  display: block;
}

.admin-slide__placeholder {
  width: 100%;
  height: 100%;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-secondary, rgba(255, 255, 255, 0.03));
  color: var(--text-muted);
}

.admin-slide__body {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 20px 20px 0;
}

.admin-slide__info {
  flex: 1;
}

.admin-slide__title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-slide__subtitle {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.admin-slide__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

.admin-slide__status {
  font-weight: 600;
}

.admin-slide__status--active {
  color: var(--success, #4caf50);
}

.admin-slide__status--inactive {
  color: var(--error);
}

.admin-slide__actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.admin-confirm-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .admin-slide {
    flex-direction: column;
  }

  .admin-slide__image {
    width: 100%;
    height: 180px;
  }

  .admin-slide__body {
    padding: 16px;
    flex-direction: column;
  }
}
</style>