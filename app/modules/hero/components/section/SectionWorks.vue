<script setup lang="ts">
import { usePortfolioApi } from '~/modules/portfolio/PortfolioApi'
import type { PortfolioWork, PortfolioListResponse } from '~/modules/portfolio/types'

const portfolioApi = usePortfolioApi()

const { data: works, status } = await useAsyncData(
    'home-works',
    () => portfolioApi.getAll({ page: 1, limit: 6 }),
    {
      default: () => ({ items: [], total: 0, page: 1, limit: 6, totalPages: 0, hasMore: false } as PortfolioListResponse),
    }
)

const worksList = computed<PortfolioWork[]>(() => works.value.items)

function openWork(workId: string) {
  navigateTo({
    path: '/portfolio',
    query: { workId },
  })
}

function getWorkImage(work: PortfolioWork): PortfolioWork['images'][number] | null {
  return work.images[0] || null
}
</script>

<template>
  <section class="works">
    <div class="works__inner">
      <div class="works__header">
        <h2 class="works__heading">
          <span class="works__accent">Н</span>аші роботи
        </h2>
        <p class="works__sub">Приклади виконаних замовлень</p>
      </div>

      <div v-if="status === 'pending'" class="works__loading">
        Завантаження...
      </div>

      <div v-else-if="worksList.length > 0" class="works__grid">
        <button
            v-for="work in worksList"
            :key="work.id"
            type="button"
            class="works__item"
            @click="openWork(work.id)"
        >
          <img
              v-if="getWorkImage(work)"
              :src="getWorkImage(work)!.url"
              :alt="getWorkImage(work)!.alt || work.title"
              class="works__img"
          >
          <div v-else class="works__img works__img--placeholder" />
          <div class="works__item-overlay">
            <span class="works__item-title">{{ work.title }}</span>
          </div>
        </button>
      </div>

      <div v-else class="works__empty">
        Роботи відсутні
      </div>

      <div class="works__footer">
        <BButton variant="outline" size="lg" @click="navigateTo('/portfolio')">
          Дивитись всі роботи
          <BIcon name="arrow-right" size="sm" />
        </BButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.works {
  padding: 80px 0;
  background: var(--bg-secondary);
}

.works__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.works__header {
  text-align: center;
  margin-bottom: 48px;
}

.works__heading {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.works__accent {
  color: var(--gold);
  font-size: 40px;
}

.works__sub {
  margin: 12px 0 0;
  font-size: 15px;
  color: var(--text-muted);
}

.works__loading,
.works__empty {
  text-align: center;
  padding: 48px 0;
  font-size: 16px;
  color: var(--text-muted);
}

.works__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.works__item {
  all: unset;
  position: relative;
  aspect-ratio: 6/5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.works__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.works__img--placeholder {
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
}

.works__item:hover .works__img {
  transform: scale(1.05);
}

.works__item-overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  display: flex;
  align-items: flex-end;
  padding: 16px;
  transition: background 0.3s;
}

.works__item:hover .works__item-overlay {
  background: var(--overlay);
}

.works__item-title {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s;
}

.works__item:hover .works__item-title {
  opacity: 1;
  transform: translateY(0);
}

.works__footer {
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .works {
    padding: 48px 0;
  }

  .works__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .works__heading {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .works__grid {
    grid-template-columns: 1fr;
  }
}
</style>