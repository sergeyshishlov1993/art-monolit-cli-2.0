<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode || 404)

const title = computed(() => {
  if (statusCode.value === 404) return 'Сторінку не знайдено'
  if (statusCode.value === 500) return 'Помилка сервера'
  return 'Щось пішло не так'
})

const searchText = ref('')

function handleBack() {
  clearError({ redirect: '/' })
}

function handleSearch() {
  const text = searchText.value.trim()
  clearError({ redirect: text ? `/catalog?search=${encodeURIComponent(text)}` : '/catalog' })
}

function handleCatalog() {
  clearError({ redirect: '/catalog' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-page__content">
      <h1 class="error-page__code">
        <span class="error-page__accent">{{ String(statusCode)[0] }}</span>{{ String(statusCode).slice(1) }}
      </h1>
      <p class="error-page__title">{{ title }}</p>
      <form v-if="statusCode === 404" class="error-page__search" @submit.prevent="handleSearch">
        <input v-model="searchText" type="text" class="error-page__input" placeholder="Пошук виробів..." autocomplete="off">
        <button type="submit" class="error-page__btn">Знайти</button>
      </form>
      <div class="error-page__actions">
        <button class="error-page__btn" @click="handleBack">
          На головну
        </button>
        <button v-if="statusCode === 404" class="error-page__btn error-page__btn--outline" @click="handleCatalog">
          До каталогу
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.error-page__content {
  text-align: center;
}

.error-page__code {
  margin: 0;
  font-size: 120px;
  font-weight: 700;
  color: var(--text-primary, #1a1a1a);
  line-height: 1;
}

.error-page__accent {
  color: var(--gold, #c9a84c);
  font-size: 140px;
}

.error-page__title {
  margin: 16px 0 0;
  font-size: 20px;
  color: var(--text-muted, #666);
}

.error-page__search {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 28px;
}

.error-page__input {
  width: 260px;
  max-width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  color: var(--text-primary, #1a1a1a);
  background: transparent;
  border: 1px solid var(--border, #ccc);
  border-radius: 8px;
  outline: none;
}

.error-page__input:focus {
  border-color: var(--gold, #c9a84c);
}

.error-page__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-page__search .error-page__btn {
  margin-top: 0;
  padding: 12px 20px;
}

.error-page__btn {
  margin-top: 32px;
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: var(--gold, #c9a84c);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.error-page__btn:hover {
  opacity: 0.85;
}

.error-page__btn--outline {
  color: var(--gold, #c9a84c);
  background: transparent;
  border: 1px solid var(--gold, #c9a84c);
}

@media (max-width: 768px) {
  .error-page__code {
    font-size: 80px;
  }

  .error-page__accent {
    font-size: 96px;
  }

  .error-page__title {
    font-size: 17px;
  }
}
</style>