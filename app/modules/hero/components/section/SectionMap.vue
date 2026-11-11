<script setup lang="ts">
const { current } = useCurrentStore()
</script>

<template>
  <section v-if="current.mapEmbedUrl" class="map-section">
    <iframe
        :src="current.mapEmbedUrl"
        :key="current.id"
        class="map-section__iframe"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
    />
  </section>
</template>

<style scoped>
.map-section {
  width: 100%;
  height: 400px;
  border-top: 1px solid var(--border);
}

.map-section__iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  filter: grayscale(0.6) contrast(1.1);
}

@media (max-width: 768px) {
  .map-section {
    height: 300px;
  }
}
</style>