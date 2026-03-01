<script setup lang="ts">
const steps = [
  { number: '01', title: 'Консультація', desc: 'Обговорюємо побажання, матеріал та розміри' },
  { number: '02', title: 'Дизайн-проєкт', desc: 'Розробляємо макет та узгоджуємо деталі' },
  { number: '03', title: 'Виробництво', desc: 'Виготовляємо виріб на власному обладнанні' },
  { number: '04', title: 'Доставка та монтаж', desc: 'Доставляємо та встановлюємо на місці' },
]
</script>

<template>
  <section class="steps">
    <div class="steps__inner">
      <div class="steps__header">
        <h2 class="steps__heading">
          <span class="steps__accent">Е</span>тапи роботи
        </h2>
        <p class="steps__sub">Від замовлення до встановлення — простий та прозорий процес</p>
      </div>

      <div class="steps__grid">
        <div v-for="step in steps" :key="step.number" class="steps__item">
          <span class="steps__number">{{ step.number }}</span>
          <div class="steps__line" />
          <h3 class="steps__title">{{ step.title }}</h3>
          <p class="steps__desc">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.steps {
  padding: 80px 0;
}

.steps__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.steps__header {
  text-align: center;
  margin-bottom: 48px;
}

.steps__heading {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.steps__accent {
  color: var(--gold);
  font-size: 40px;
}

.steps__sub {
  margin: 12px 0 0;
  font-size: 15px;
  color: var(--text-muted);
}

.steps__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.steps__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.steps__number {
  font-size: 36px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.05em;
}

.steps__line {
  width: 40px;
  height: 2px;
  background: var(--gold);
  opacity: 0.4;
}

.steps__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.steps__desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .steps {
    padding: 48px 0;
  }

  .steps__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  .steps__heading {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .steps__grid {
    grid-template-columns: 1fr;
  }
}
</style>