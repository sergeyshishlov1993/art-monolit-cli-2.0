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

function handleBack() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-page__content">
      <h1 class="error-page__code">
        <span class="error-page__accent">{{ String(statusCode)[0] }}</span>{{ String(statusCode).slice(1) }}
      </h1>
      <p class="error-page__title">{{ title }}</p>
      <button class="error-page__btn" @click="handleBack">
        На головну
      </button>
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