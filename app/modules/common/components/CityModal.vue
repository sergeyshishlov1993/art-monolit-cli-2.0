<script setup lang="ts">
const { stores, current, needsChoice, chooserOpen, select } = useCurrentStore()

onMounted(() => {
  if (needsChoice.value) chooserOpen.value = true
})

const isOpen = computed({
  get: () => chooserOpen.value,
  set: (value: boolean) => {
    if (value) chooserOpen.value = true
    else select(current.value.id)
  },
})
</script>

<template>
  <BModal v-model="isOpen" title="Оберіть ваше місто" size="md">
    <div class="city-modal">
      <button
          v-for="store in stores"
          :key="store.id"
          type="button"
          class="city-modal__card"
          :class="{ 'city-modal__card--active': store.id === current.id }"
          @click="select(store.id)"
      >
        <img v-if="store.logo" :src="store.logo" :alt="store.city" class="city-modal__logo">
        <span class="city-modal__name">{{ store.city }}</span>
      </button>
    </div>
  </BModal>
</template>

<style scoped>
.city-modal {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.city-modal__card {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 12px;
  font: inherit;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}

.city-modal__card:hover {
  border-color: var(--gold);
  transform: translateY(-2px);
}

.city-modal__card--active {
  border-color: var(--gold);
}

.city-modal__logo {
  width: 100%;
  height: 96px;
  object-fit: contain;
}

.city-modal__name {
  font-size: 16px;
  font-weight: 600;
}
</style>
