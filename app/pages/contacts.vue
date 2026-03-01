<script setup lang="ts">
import { CONTACTS } from '~/modules/common/constants/contacts'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Контакти — ART MONOLIT',
  description: 'Зв\'яжіться з нами для замовлення пам\'ятників з граніту та мармуру',
})

const contacts = [
  { icon: 'phone', label: 'Телефон', value: CONTACTS.PHONE_1, href: CONTACTS.PHONE_1_HREF },
  { icon: 'phone', label: 'Телефон 2', value: CONTACTS.PHONE_2, href: CONTACTS.PHONE_2_HREF },
  { icon: 'envelope', label: 'Email', value: CONTACTS.EMAIL, href: CONTACTS.EMAIL_HREF },
  { icon: 'location', label: 'Адреса', value: CONTACTS.ADDRESS, href: null },
]

const inquiryOpen = ref(false)

function closeInquiry() {
  inquiryOpen.value = false
}
</script>

<template>
  <div class="contacts-page">
    <BBreadcrumbs :items="[{ label: 'Контакти' }]" />

    <div class="contacts-page__header">
      <h1 class="contacts-page__title">
        <span class="contacts-page__accent">К</span>онтакти
      </h1>
      <p class="contacts-page__sub">Зв'яжіться з нами зручним для вас способом</p>
    </div>

    <div class="contacts-page__body">
      <div class="contacts-page__info">
        <div class="contacts-block">
          <h2 class="contacts-block__title">Зв'язок</h2>
          <ul class="contacts-list">
            <li v-for="item in contacts" :key="item.label" class="contacts-list__item">
              <BIcon :name="item.icon" size="sm" class="contacts-list__icon" />
              <div class="contacts-list__content">
                <span class="contacts-list__label">{{ item.label }}</span>
                <a
                    v-if="item.href"
                    :href="item.href"
                    class="contacts-list__value contacts-list__value--link"
                >
                  {{ item.value }}
                </a>
                <span v-else class="contacts-list__value">{{ item.value }}</span>
              </div>
            </li>
          </ul>
        </div>

        <div class="contacts-block">
          <h2 class="contacts-block__title">Графік роботи</h2>
          <ul class="schedule">
            <li v-for="item in CONTACTS.SCHEDULE" :key="item.day" class="schedule__item">
              <span class="schedule__day">{{ item.day }}</span>
              <span class="schedule__time" :class="{ 'schedule__time--off': item.time === 'Вихідний' }">
                {{ item.time }}
              </span>
            </li>
          </ul>
        </div>

        <div class="contacts-block">
          <h2 class="contacts-block__title">Соціальні мережі</h2>
          <div class="socials">
            <a
                v-for="social in CONTACTS.SOCIALS"
                :key="social.name"
                :href="social.href"
                class="socials__item"
                target="_blank"
                rel="noopener"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" :fill="social.color">
                <path :d="social.icon" />
              </svg>
              {{ social.name }}
            </a>
          </div>
        </div>

        <div class="contacts-block contacts-block--cta">
          <div class="contacts-cta">
            <div class="contacts-cta__text">
              <h3 class="contacts-cta__title">Маєте запитання?</h3>
              <p class="contacts-cta__sub">Залиште заявку і ми зв'яжемося з вами протягом 30 хвилин</p>
            </div>
            <BButton variant="primary" size="lg" @click="inquiryOpen = true">
              Залишити заявку
            </BButton>
          </div>
        </div>
      </div>

      <div class="contacts-page__map">
        <div class="contacts-map">
          <iframe
              :src="CONTACTS.MAP_EMBED_URL"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>

    <BModal v-model="inquiryOpen" title="Залишити заявку">
      <BLeadForm source="contacts_page_modal" @success="closeInquiry" />
    </BModal>
  </div>
</template>

<style scoped>
.contacts-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.contacts-page__header {
  margin-bottom: 40px;
}

.contacts-page__title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.contacts-page__accent {
  color: var(--gold);
  font-size: 40px;
}

.contacts-page__sub {
  margin: 8px 0 0;
  font-size: 15px;
  color: var(--text-muted);
}

.contacts-page__body {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  align-items: start;
}

.contacts-page__info {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.contacts-block__title {
  margin: 0 0 16px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.contacts-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contacts-list__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.contacts-list__icon {
  color: var(--gold);
  margin-top: 2px;
  flex-shrink: 0;
}

.contacts-list__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contacts-list__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.contacts-list__value {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.contacts-list__value--link {
  text-decoration: none;
  transition: color 0.2s;
}

.contacts-list__value--link:hover {
  color: var(--gold);
}

.schedule {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.schedule__item:last-child {
  border-bottom: none;
}

.schedule__day {
  font-size: 14px;
  color: var(--text-secondary);
}

.schedule__time {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.schedule__time--off {
  color: var(--text-muted);
  font-weight: 400;
}

.socials {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.socials__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: all 0.2s;
}

.socials__item:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.contacts-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.contacts-cta__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.contacts-cta__sub {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.contacts-page__map {
  position: sticky;
  top: 100px;
}

.contacts-map {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
}

.contacts-map iframe {
  display: block;
}

@media (max-width: 900px) {
  .contacts-page__body {
    grid-template-columns: 1fr;
  }

  .contacts-page__map {
    position: static;
  }

  .contacts-map {
    height: 350px;
  }

  .contacts-page__title {
    font-size: 24px;
  }

  .contacts-page__accent {
    font-size: 30px;
  }

  .contacts-cta {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
}
</style>