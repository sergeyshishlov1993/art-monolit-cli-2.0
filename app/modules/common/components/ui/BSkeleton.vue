<script setup lang="ts">
withDefaults(defineProps<{
  width?: string
  height?: string
  radius?: string
  aspect?: string
}>(), {
  width: '100%',
  radius: '8px',
})
</script>

<template>
  <span
      class="b-skeleton"
      aria-hidden="true"
      :style="{ width, height, borderRadius: radius, aspectRatio: aspect }"
  />
</template>

<style scoped>
.b-skeleton {
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--bg-secondary);
}

.b-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.2) 50%, transparent 100%);
  animation: b-skeleton-shimmer 1.6s ease-in-out infinite;
}

@keyframes b-skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .b-skeleton::after {
    animation: none;
  }
}
</style>
