<script setup lang="ts">

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Про компанію — ART MONOLIT',
  description: 'Гранітна майстерня ART MONOLIT — з 2007 року одна з найкращих у Запоріжжі',
})

const services = [
  { icon: 'pencil-square', text: 'Розробка макету' },
  { icon: 'truck', text: 'Виготовлення та доставка замовлення' },
  { icon: 'wrench-screwdriver', text: 'Благоустрій місць поховання' },
  { icon: 'view-columns', text: 'Укладення тротуарної та облицювальної плитки' },
  { icon: 'home-modern', text: 'Встановлення столів, лавок, огорож' },
  { icon: 'camera', text: 'Портрети на верстаті — 100% схожості' },
]

const advantages = [
  { number: '17+', label: 'років досвіду', sub: 'працюємо з 2007 року' },
  { number: '1000+', label: 'виконаних робіт', sub: 'пам\'ятники та комплекси' },
  { number: '100%', label: 'схожість портретів', sub: 'виготовлення на верстаті' },
  { number: '∞', label: 'гарантія якості', sub: 'багаторічна гарантія' },
]

const features = [
  {
    title: 'Власне виробництво',
    text: 'Великий вибір стел з натурального граніту від виробника. Одинарні та подвійні моделі завжди в наявності.',
  },
  {
    title: 'Ручна робота або верстат',
    text: 'Оформлення пам\'ятника: ручна художня робота або точне виготовлення на сучасному верстаті.',
  },
  {
    title: 'Індивідуальні замовлення',
    text: 'Виготовимо виріб під замовлення за вашим ескізом. Кожен проєкт — унікальний.',
  },
  {
    title: 'Граніт',
    text: 'Пам\'ятники з натурального граніту — на будь-який бюджет.',
  },
]

const inquiryOpen = ref(false)

function closeInquiry() {
  inquiryOpen.value = false
}
</script>

<template>
  <div class="about-page">
    <BBreadcrumbs :items="[{ label: 'Про компанію' }]" />

    <section class="about-hero">
      <div class="about-hero__content">
        <h1 class="about-hero__title">
          <span class="about-hero__accent">Д</span>авайте знайомитись!
        </h1>
        <p class="about-hero__text">
          Наша гранітна майстерня, вже багато років, вважається однією з найкращих у&nbsp;м.&nbsp;Запоріжжя.
          Ми пропонуємо вашій увазі надгробні пам'ятники із граніту, а також виготовляємо із бетону.
        </p>
        <p class="about-hero__text">
          Наші вироби відомі <strong>найвищою якістю</strong>, <strong>доступною ціною</strong>
          і <strong>багаторічною гарантією</strong>.
        </p>
      </div>
      <div class="about-hero__image">
        <img src="/1.webp" alt="Майстерня ART MONOLIT">
      </div>
    </section>

    <section class="about-stats">
      <div
          v-for="item in advantages"
          :key="item.label"
          class="about-stats__item"
      >
        <span class="about-stats__number">{{ item.number }}</span>
        <span class="about-stats__label">{{ item.label }}</span>
        <span class="about-stats__sub">{{ item.sub }}</span>
      </div>
    </section>

    <section class="about-services">
      <h2 class="about-section-title">
        <span class="about-section-accent">П</span>овний комплекс робіт
      </h2>
      <p class="about-section-sub">Ми здійснюємо весь цикл — від розробки макету до встановлення</p>
      <div class="about-services__grid">
        <div
            v-for="service in services"
            :key="service.text"
            class="about-service"
        >
          <div class="about-service__icon">
            <BIcon :name="service.icon" size="md" />
          </div>
          <span class="about-service__text">{{ service.text }}</span>
        </div>
      </div>
    </section>

    <section class="about-features">
      <h2 class="about-section-title">
        <span class="about-section-accent">Ч</span>ому обирають нас
      </h2>
      <div class="about-features__grid">
        <div
            v-for="feature in features"
            :key="feature.title"
            class="about-feature"
        >
          <h3 class="about-feature__title">{{ feature.title }}</h3>
          <p class="about-feature__text">{{ feature.text }}</p>
        </div>
      </div>
    </section>

    <section class="about-cta">
      <div class="about-cta__inner">
        <div class="about-cta__content">
          <h2 class="about-cta__title">Готові обговорити ваш проєкт?</h2>
          <p class="about-cta__text">
            Залиште заявку — ми зв'яжемося з вами протягом 30 хвилин та допоможемо з вибором
          </p>
        </div>
        <BButton variant="primary" size="lg" @click="inquiryOpen = true">
          Залишити заявку
        </BButton>
      </div>
    </section>

    <BModal v-model="inquiryOpen" title="Залишити заявку">
      <BLeadForm source="about_page_modal" @success="closeInquiry" />
    </BModal>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.about-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  margin-bottom: 64px;
}

.about-hero__title {
  margin: 0 0 20px;
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.about-hero__accent {
  color: var(--gold);
  font-size: 44px;
}

.about-hero__text {
  margin: 0 0 12px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.about-hero__text strong {
  color: var(--text-primary);
  font-weight: 600;
}

.about-hero__image {
  border-radius: 8px;
  overflow: hidden;
}

.about-hero__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 64px;
}

.about-stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.about-stats__number {
  font-size: 36px;
  font-weight: 800;
  color: var(--gold);
  line-height: 1;
}

.about-stats__label {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.about-stats__sub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.about-section-title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.about-section-accent {
  color: var(--gold);
  font-size: 34px;
}

.about-section-sub {
  margin: 0 0 32px;
  font-size: 14px;
  color: var(--text-muted);
}

.about-services {
  margin-bottom: 64px;
}

.about-services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.about-service {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.2s;
}

.about-service:hover {
  border-color: var(--gold);
}

.about-service__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--gold-rgb, 181 155 75) / 0.1);
  border-radius: 8px;
  color: var(--gold);
}

.about-service__text {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.about-features {
  margin-bottom: 64px;
}

.about-features__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 32px;
}

.about-feature {
  padding: 28px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: border-color 0.2s;
}

.about-feature:hover {
  border-color: var(--gold);
}

.about-feature__title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.about-feature__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.about-cta__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 40px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.about-cta__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.about-cta__text {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .about-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-services__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .about-hero {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .about-hero__title {
    font-size: 26px;
  }

  .about-hero__accent {
    font-size: 32px;
  }

  .about-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .about-stats__item {
    padding: 20px 12px;
  }

  .about-stats__number {
    font-size: 28px;
  }

  .about-section-title {
    font-size: 22px;
  }

  .about-section-accent {
    font-size: 28px;
  }

  .about-services__grid {
    grid-template-columns: 1fr;
  }

  .about-features__grid {
    grid-template-columns: 1fr;
  }

  .about-cta__inner {
    flex-direction: column;
    text-align: center;
    padding: 28px 20px;
    gap: 20px;
  }
}
</style>