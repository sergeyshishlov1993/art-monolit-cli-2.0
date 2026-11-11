<script setup lang="ts">
const { current, enabled, chooserOpen } = useCurrentStore()
</script>

<template>
  <button v-if="enabled" type="button" class="city-switcher" title="Змінити місто" :aria-label="`Змінити місто: ${current.city}`" @click="chooserOpen = true">
    <BIcon name="map-pin" size="sm" />
    <span class="city-switcher__text">{{ current.city }}</span>
  </button>
</template>

<style scoped>
.city-switcher {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  font: inherit;
  font-size: 13px;
  /* шапка завжди темна, як і телефон у ній */
  color: #ffffff;
  background: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

/* на вузьких екранах лишається лише іконка */
@media (max-width: 480px) {
  .city-switcher__text {
    display: none;
  }
}

.city-switcher:hover {
  color: var(--gold);
}
</style>
