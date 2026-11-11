<script setup lang="ts">
const { consent } = useCookieConsent()
</script>

<template>
  <div v-if="consent === null" class="cookie-banner" role="dialog" aria-label="Cookie">
    <p class="cookie-banner__text">
      Ми використовуємо cookie для аналітики, щоб покращувати сайт. Ви можете прийняти або відхилити їх.
    </p>
    <div class="cookie-banner__actions">
      <BButton variant="outline" size="sm" @click="consent = 'denied'">Відхилити</BButton>
      <BButton size="sm" @click="consent = 'granted'">Прийняти</BButton>
    </div>
  </div>
</template>

<style scoped>
.cookie-banner {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: calc(16px + var(--mobile-bar-height, 0px));
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 720px;
  margin: 0 auto;
  padding: 16px 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.25);
}

.cookie-banner__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
}

.cookie-banner__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .cookie-banner {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
