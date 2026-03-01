<script setup lang="ts">
defineProps<{
  visible: boolean
}>()

defineEmits<{
  inquiry: []
}>()
</script>

<template>
  <section
      class="bottom-cta"
      :class="{ 'bottom-cta--visible': visible }"
  >
    <div class="bottom-cta__content">
      <h2 class="bottom-cta__title">Бажаєте замовити або дізнатися ціну?</h2>
      <p class="bottom-cta__text">
        Залиште заявку — ми зв'яжемося з вами протягом 30 хвилин у робочий час
      </p>
      <BButton variant="primary" size="lg" @click="$emit('inquiry')">
        Залишити заявку
      </BButton>
    </div>
  </section>
</template>

<style scoped>
.bottom-cta {
  margin-top: 80px;
  padding: 56px 48px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  text-align: center;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.bottom-cta--visible {
  opacity: 1;
  transform: translateY(0);
}

.bottom-cta__content {
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.bottom-cta__title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
}

.bottom-cta__text {
  margin: 0;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .bottom-cta {
    padding: 40px 28px;
  }

  .bottom-cta__title {
    font-size: 22px;
  }
}
</style>