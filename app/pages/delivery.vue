<script setup lang="ts">


definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Доставка — ART MONOLIT',
  description: 'Безкоштовна доставка пам\'ятників по всій Україні службою Delivery',
})

const deliveryFeatures = [
  {
    icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    title: 'Безкоштовна доставка',
    description: 'При замовленні пам\'ятника доставка по всій Україні — безкоштовно',
  },
  {
    icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
    title: 'Надійне пакування',
    description: 'Кожен виріб ретельно пакується для максимального захисту під час транспортування',
  },
  {
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Швидкі терміни',
    description: 'Доставка протягом 3-7 робочих днів залежно від регіону',
  },
  {
    icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    title: 'По всій Україні',
    description: 'Доставляємо у будь-який населений пункт України без винятків',
  },
]

const deliverySteps = [
  { number: '01', title: 'Оформлення замовлення', description: 'Ви залишаєте заявку на сайті або телефонуєте нам' },
  { number: '02', title: 'Виготовлення', description: 'Ми виготовляємо пам\'ятник за вашим замовленням' },
  { number: '03', title: 'Пакування', description: 'Ретельно пакуємо виріб для безпечного транспортування' },
  { number: '04', title: 'Відправка', description: 'Передаємо замовлення службі доставки Delivery' },
  { number: '05', title: 'Отримання', description: 'Ви отримуєте пам\'ятник у відділенні або за адресою' },
]

const faqItems = [
  {
    question: 'Чи дійсно доставка безкоштовна?',
    answer: 'Так, при замовленні пам\'ятника доставка по всій території України службою Delivery здійснюється безкоштовно. Ви не сплачуєте жодних додаткових коштів за транспортування.',
  },
  {
    question: 'Як довго чекати на доставку?',
    answer: 'Термін доставки залежить від вашого регіону та становить від 3 до 7 робочих днів після відправки. Ви отримаєте ТТН для відстеження замовлення.',
  },
  {
    question: 'Чи можна отримати на відділення?',
    answer: 'Так, ви можете обрати зручне відділення Delivery у вашому місті. Також доступна адресна доставка.',
  },
  {
    question: 'Що робити, якщо виріб пошкоджено?',
    answer: 'При отриманні обов\'язково огляньте пакування. У разі виявлення пошкоджень — зафіксуйте це з представником служби доставки та зв\'яжіться з нами. Ми вирішимо питання.',
  },
]

const openFaqIndex = ref<number | null>(null)
const inquiryOpen = ref(false)

function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

function closeInquiry() {
  inquiryOpen.value = false
}
</script>

<template>
  <div class="delivery-page">
    <BBreadcrumbs :items="[{ label: 'Доставка' }]" />

    <div class="delivery-page__header">
      <h1 class="delivery-page__title">
        <span class="delivery-page__accent">Д</span>оставка
      </h1>
      <p class="delivery-page__sub">Безкоштовна доставка пам'ятників по всій Україні</p>
    </div>

    <div class="delivery-hero">
      <div class="delivery-hero__content">
        <div class="delivery-hero__badge">Безкоштовно</div>
        <h2 class="delivery-hero__title">Доставка службою Delivery</h2>
        <p class="delivery-hero__text">
          При замовленні пам'ятника ми беремо на себе всі витрати на доставку.
          Ваше замовлення буде надійно запаковане та доставлене у будь-який куточок України.
        </p>
        <BButton variant="primary" size="lg" @click="inquiryOpen = true">
          Замовити з доставкою
        </BButton>
      </div>
      <div class="delivery-hero__visual">
        <img
            src="/delivery.webp"
            alt="Доставка пам'ятників"
            class="delivery-hero__image"
        />
      </div>
    </div>

    <div class="delivery-features">
      <h2 class="delivery-section__title">Переваги доставки</h2>
      <div class="delivery-features__grid">
        <div v-for="feature in deliveryFeatures" :key="feature.title" class="delivery-feature">
          <div class="delivery-feature__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path :d="feature.icon" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h3 class="delivery-feature__title">{{ feature.title }}</h3>
          <p class="delivery-feature__desc">{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <div class="delivery-steps">
      <h2 class="delivery-section__title">Як відбувається доставка</h2>
      <div class="delivery-steps__list">
        <div v-for="step in deliverySteps" :key="step.number" class="delivery-step">
          <div class="delivery-step__number">{{ step.number }}</div>
          <div class="delivery-step__content">
            <h3 class="delivery-step__title">{{ step.title }}</h3>
            <p class="delivery-step__desc">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="delivery-faq">
      <h2 class="delivery-section__title">Часті запитання</h2>
      <div class="delivery-faq__list">
        <div
            v-for="(item, index) in faqItems"
            :key="item.question"
            class="delivery-faq__item"
            :class="{ 'delivery-faq__item--open': openFaqIndex === index }"
        >
          <button class="delivery-faq__question" @click="toggleFaq(index)">
            {{ item.question }}
            <svg
                class="delivery-faq__chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
              <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div class="delivery-faq__answer-wrapper">
            <p class="delivery-faq__answer">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="delivery-cta">
      <div class="delivery-cta__content">
        <h2 class="delivery-cta__title">Готові замовити?</h2>
        <p class="delivery-cta__text">Залиште заявку і ми зв'яжемося з вами для уточнення деталей доставки</p>
      </div>
      <BButton variant="primary" size="lg" @click="inquiryOpen = true">
        Залишити заявку
      </BButton>
    </div>

    <BModal v-model="inquiryOpen" title="Замовити з доставкою">
      <BLeadForm source="delivery_page_modal" @success="closeInquiry" />
    </BModal>
  </div>
</template>

<style scoped>
.delivery-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.delivery-page__header {
  margin-bottom: 40px;
}

.delivery-page__title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.delivery-page__accent {
  color: var(--gold);
  font-size: 40px;
}

.delivery-page__sub {
  margin: 8px 0 0;
  font-size: 15px;
  color: var(--text-muted);
}

.delivery-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 48px;
  background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
  border: 1px solid var(--border);
  border-radius: 16px;
  margin-bottom: 64px;
}

.delivery-hero__badge {
  display: inline-block;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--bg-primary);
  background: var(--gold);
  border-radius: 100px;
  margin-bottom: 16px;
}

.delivery-hero__title {
  margin: 0 0 16px;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.delivery-hero__text {
  margin: 0 0 24px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.delivery-hero__visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.delivery-hero__image {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
}

.delivery-section__title {
  margin: 0 0 32px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.delivery-features {
  margin-bottom: 64px;
}

.delivery-features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.delivery-feature {
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: border-color 0.2s;
}

.delivery-feature:hover {
  border-color: var(--gold);
}

.delivery-feature__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-bottom: 16px;
}

.delivery-feature__icon svg {
  width: 24px;
  height: 24px;
  color: var(--gold);
}

.delivery-feature__title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.delivery-feature__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted);
}

.delivery-steps {
  margin-bottom: 64px;
}

.delivery-steps__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.delivery-step {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
}

.delivery-step:last-child {
  border-bottom: none;
}

.delivery-step__number {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--gold);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 50%;
}

.delivery-step__title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.delivery-step__desc {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.delivery-faq {
  margin-bottom: 64px;
}

.delivery-faq__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.delivery-faq__item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.delivery-faq__item--open {
  border-color: var(--gold);
}

.delivery-faq__question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.delivery-faq__question:hover {
  color: var(--gold);
}

.delivery-faq__chevron {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  transition: transform 0.3s ease;
}

.delivery-faq__item--open .delivery-faq__chevron {
  transform: rotate(180deg);
  color: var(--gold);
}

.delivery-faq__answer-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}

.delivery-faq__item--open .delivery-faq__answer-wrapper {
  grid-template-rows: 1fr;
}

.delivery-faq__answer {
  margin: 0;
  padding: 0 24px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
  overflow: hidden;
}

.delivery-faq__item--open .delivery-faq__answer {
  padding-bottom: 20px;
}

.delivery-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 32px 40px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.delivery-cta__title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.delivery-cta__text {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .delivery-features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .delivery-page__title {
    font-size: 24px;
  }

  .delivery-page__accent {
    font-size: 30px;
  }

  .delivery-hero {
    grid-template-columns: 1fr;
    padding: 32px 24px;
    text-align: center;
  }

  .delivery-hero__visual {
    order: -1;
  }

  .delivery-hero__image {
    max-width: 280px;
  }

  .delivery-features__grid {
    grid-template-columns: 1fr;
  }

  .delivery-step {
    gap: 16px;
  }

  .delivery-step__number {
    width: 40px;
    height: 40px;
    font-size: 12px;
  }

  .delivery-cta {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }

  .delivery-faq__question {
    padding: 16px 20px;
    font-size: 14px;
  }

  .delivery-faq__answer {
    padding: 0 20px;
  }

  .delivery-faq__item--open .delivery-faq__answer {
    padding-bottom: 16px;
  }
}
</style>