<script setup lang="ts">
defineProps<{
  title: string
  visible: boolean
}>()

defineEmits<{
  inquiry: []
}>()
</script>

<template>
  <Transition name="sticky-fade">
    <div v-if="visible" class="sticky-bar">
      <div class="sticky-bar__inner">
        <span class="sticky-bar__title">{{ title }}</span>
        <BButton variant="primary" size="md" @click="$emit('inquiry')">
          Дізнатися ціну
        </BButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  padding: 16px 24px;
}

.sticky-bar__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.sticky-bar__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sticky-fade-enter-active,
.sticky-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.sticky-fade-enter-from,
.sticky-fade-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (max-width: 900px) {
  .sticky-bar__title {
    display: none;
  }

  .sticky-bar__inner {
    justify-content: center;
  }
}
</style>