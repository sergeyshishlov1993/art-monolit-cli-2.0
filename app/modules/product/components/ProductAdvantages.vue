<script setup lang="ts">
const props = defineProps<{
  visible: boolean
}>()

const advantages = [
  {
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    title: 'Гарантія якості',
    text: 'Надаємо гарантію на всі вироби від 25 років',
  },
  {
    icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    title: 'Безкоштовна доставка',
    text: 'Доставляємо по всій Україні службою Delivery',
  },
  {
    icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
    title: 'Індивідуальний проєкт',
    text: 'Розробимо унікальний дизайн під ваші побажання',
  },
  {
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Виготовлення від 25 днів',
    text: 'Дотримуємось термінів без затримок',
  },
]
</script>

<template>
  <section
      class="advantages"
      :class="{ 'advantages--visible': visible }"
  >
    <h2 class="advantages__title">Чому обирають нас</h2>
    <div class="advantages__grid">
      <div
          v-for="(item, index) in advantages"
          :key="item.title"
          class="advantages__item"
          :style="{ '--delay': index * 0.1 + 's' }"
      >
        <div class="advantages__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path :d="item.icon" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h4 class="advantages__item-title">{{ item.title }}</h4>
        <p class="advantages__item-text">{{ item.text }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.advantages {
  margin-top: 100px;
  padding-top: 60px;
  border-top: 1px solid var(--border);
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.advantages--visible {
  opacity: 1;
  transform: translateY(0);
}

.advantages__title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-primary);
  margin: 0 0 48px;
}

.advantages__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.advantages__item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease var(--delay), transform 0.5s ease var(--delay);
}

.advantages--visible .advantages__item {
  opacity: 1;
  transform: translateY(0);
}

.advantages__icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold) 0%, #b8962e 100%);
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.3);
}

.advantages__icon svg {
  width: 36px;
  height: 36px;
  color: white;
}

.advantages__item-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.advantages__item-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .advantages {
    margin-top: 50px;
  }

  .advantages__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

@media (max-width: 600px) {
  .advantages__grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .advantages__title {
    font-size: 22px;
  }
}
</style>