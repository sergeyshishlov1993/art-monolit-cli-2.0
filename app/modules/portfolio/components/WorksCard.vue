<script setup lang="ts">
import type { PortfolioWork } from '~/modules/portfolio/types'

const props = defineProps<{
  work: PortfolioWork
}>()

const mainImage = computed(() => {
  if (!props.work.images.length) return ''
  const sorted = [...props.work.images].sort((firstImage, secondImage) => firstImage.sortOrder - secondImage.sortOrder)
  return sorted[0]?.url ?? ''
})
</script>

<template>
  <button class="works-card">
    <div class="works-card__image">
      <img
          v-if="mainImage"
          :src="mainImage"
          :alt="work.title"
      >
      <div v-else class="works-card__placeholder">Немає фото</div>
    </div>
    <span class="works-card__title">{{ work.title }}</span>
  </button>
</template>

<style scoped>
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

@media (max-width: 600px) {
  .works-card__title {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>