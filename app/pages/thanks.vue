<script setup lang="ts">
import { ROUTES } from '~/modules/common/constants/routes'
import { useContacts } from '~/modules/common/composables/useContacts'
import { useWorkingStatus } from '~/modules/common/composables/useWorkingStatus'

definePageMeta({ layout: 'default' })

// Сторінка лише для підтвердження заявки: у пошук її не віддаємо
useSeoMeta({
  title: 'Дякуємо за заявку — ART MONOLIT',
  robots: 'noindex, nofollow',
})

const siteContacts = useContacts()
const workingStatus = useWorkingStatus()
const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push(ROUTES.CATALOG)
}
</script>

<template>
  <section class="thanks">
    <svg class="thanks__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

    <h1 class="thanks__title">Дякуємо! Заявку отримано</h1>

    <p v-if="workingStatus?.open" class="thanks__text">
      Зараз працюємо — менеджер зв'яжеться з вами протягом 30 хвилин.
    </p>
    <p v-else-if="workingStatus" class="thanks__text">
      Зараз зачинено. Менеджер зв'яжеться з вами {{ workingStatus.text }}.
    </p>
    <p v-else class="thanks__text">Менеджер зв'яжеться з вами найближчим часом.</p>

    <p class="thanks__text">
      Питання термінове? Зателефонуйте:
      <a :href="siteContacts.PHONE_1_HREF" class="thanks__phone">{{ siteContacts.PHONE_1 }}</a>
    </p>

    <div class="thanks__actions">
      <BButton size="lg" :to="ROUTES.CATALOG">До каталогу</BButton>
      <BButton size="lg" variant="outline" :to="ROUTES.PORTFOLIO">Наші роботи</BButton>
      <BButton size="lg" variant="ghost" @click="goBack">Повернутися назад</BButton>
    </div>
  </section>
</template>

<style scoped>
.thanks {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 640px;
  margin: 0 auto;
  padding: 80px 24px 120px;
  text-align: center;
}

.thanks__icon {
  width: 72px;
  height: 72px;
  color: var(--gold);
}

.thanks__title {
  margin: 20px 0 12px;
  font-size: 30px;
  font-weight: 800;
  color: var(--text-primary);
}

.thanks__text {
  margin: 0 0 12px;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-muted);
}

.thanks__phone {
  font-weight: 700;
  color: var(--gold);
  text-decoration: none;
}

.thanks__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 600px) {
  .thanks {
    padding: 48px 16px 120px;
  }

  .thanks__title {
    font-size: 24px;
  }
}
</style>
