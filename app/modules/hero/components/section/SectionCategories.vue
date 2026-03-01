<script setup lang="ts">
import { useCategoryStore } from '~/modules/category/CategoryStore'

const categoryStore = useCategoryStore()
</script>

<template>
  <section class="categories">
    <div class="categories__inner">
      <div class="categories__header">
        <h2 class="categories__heading">
          <span class="categories__accent">К</span>аталог продукції
        </h2>
        <p class="categories__sub">Оберіть категорію для перегляду асортименту</p>
      </div>

      <div v-if="categoryStore.loading" class="categories__loading">
        Завантаження...
      </div>

      <div v-else-if="categoryStore.categories.length > 0" class="categories__grid">
        <NuxtLink
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            :to="`/catalog/${cat.slug}`"
            class="categories__card"
        >
          <img
              v-if="cat.imageUrl"
              :src="cat.imageUrl"
              :alt="cat.name"
              class="categories__card-img"
          >
          <div v-else class="categories__card-img categories__card-img--placeholder" />
          <div class="categories__card-overlay" />
          <div class="categories__card-content">
            <h3 class="categories__card-title">{{ cat.name }}</h3>
            <span v-if="cat._count" class="categories__card-count">
              {{ cat._count.products }} виробів
            </span>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="categories__empty">
        Категорії відсутні
      </div>
    </div>
  </section>
</template>

<style scoped>
.categories {
  padding: 80px 0;
}

.categories__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.categories__header {
  text-align: center;
  margin-bottom: 48px;
}

.categories__heading {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.categories__accent {
  color: var(--gold);
  font-size: 40px;
}

.categories__sub {
  margin: 12px 0 0;
  font-size: 15px;
  color: var(--text-muted);
}

.categories__loading,
.categories__empty {
  text-align: center;
  padding: 48px 0;
  font-size: 16px;
  color: var(--text-muted);
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.categories__card {
  position: relative;
  aspect-ratio: 3/2;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
}

.categories__card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.categories__card-img--placeholder {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.categories__card:hover .categories__card-img {
  transform: scale(1.05);
}

.categories__card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.1) 60%);
  transition: background 0.3s;
}

.categories__card:hover .categories__card-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%);
}

.categories__card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
}

.categories__card-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #fff;
}

.categories__card-count {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: white;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .categories {
    padding: 48px 0;
  }

  .categories__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .categories__heading {
    font-size: 24px;
  }

  .categories__accent {
    font-size: 30px;
  }
}

@media (max-width: 480px) {
  .categories__grid {
    grid-template-columns: 1fr;
  }
}
</style>