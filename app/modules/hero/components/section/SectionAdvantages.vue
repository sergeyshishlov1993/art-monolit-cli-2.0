<script setup lang="ts">
const advantages = [
  {
    icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0V21',
    title: 'Власне виробництво',
    desc: 'Повний цикл виробництва на сучасному обладнанні',
  },
  {
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    title: 'Гарантія 25 років',
    desc: 'Впевненість у якості на довгі роки',
  },
  {
    icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    title: 'Доставка та встановлення',
    desc: 'Організуємо доставку та монтаж під ключ',
  },
  {
    icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
    title: 'Індивідуальний дизайн',
    desc: 'Розробка унікальних проєктів за вашими побажаннями',
  },
]
</script>

<template>
  <section class="advantages">
    <div class="advantages__inner">
      <div v-for="item in advantages" :key="item.title" class="advantages__item">
        <div class="advantages__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="item.icon" />
          </svg>
        </div>
        <h3 class="advantages__title">{{ item.title }}</h3>
        <p class="advantages__desc">{{ item.desc }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.advantages {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
}

.advantages__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.advantages__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.advantages__icon {
  width: 48px;
  height: 48px;
  color: var(--gold);
}

.advantages__icon svg {
  width: 100%;
  height: 100%;
}

.advantages__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.advantages__desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .advantages__inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .advantages__inner {
    grid-template-columns: 1fr;
  }
}
</style>