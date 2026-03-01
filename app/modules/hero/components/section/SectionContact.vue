<script setup lang="ts">
import { CONTACTS } from '~/modules/common/constants/contacts'

const scheduleFormatted = CONTACTS.SCHEDULE
    .filter(item => item.time !== 'Вихідний')
    .map(item => `${item.day}: ${item.time}`)
    .join(', ')
</script>

<template>
  <section class="contact">
    <div class="contact__inner">
      <div class="contact__info">
        <h2 class="contact__heading">
          <span class="contact__accent">З</span>в'яжіться з нами
        </h2>
        <p class="contact__desc">
          Залиште заявку і ми зв'яжемося з вами протягом 30 хвилин у робочий час.
          Допоможемо підібрати матеріал, розмір та дизайн.
        </p>

        <div class="contact__details">
          <div class="contact__detail">
            <svg class="contact__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <div>
              <span class="contact__detail-label">Телефон</span>
              <a :href="CONTACTS.PHONE_1_HREF" class="contact__detail-value">{{ CONTACTS.PHONE_1 }}</a>
            </div>
          </div>
          <div class="contact__detail">
            <svg class="contact__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <div>
              <span class="contact__detail-label">Email</span>
              <a :href="CONTACTS.EMAIL_HREF" class="contact__detail-value">{{ CONTACTS.EMAIL }}</a>
            </div>
          </div>
          <div class="contact__detail">
            <svg class="contact__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span class="contact__detail-label">Графік роботи</span>
              <span class="contact__detail-value">{{ scheduleFormatted }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="contact__form">
        <BLeadForm source="contact_page" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 80px 0;
  background: var(--bg-secondary);
}

.contact__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}

.contact__heading {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.contact__accent {
  color: var(--gold);
  font-size: 40px;
}

.contact__desc {
  margin: 16px 0 0;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.7;
}

.contact__details {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact__detail {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.contact__icon {
  width: 20px;
  height: 20px;
  color: var(--gold);
  flex-shrink: 0;
}

.contact__detail-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.contact__detail-value {
  font-size: 14px;
  color: var(--text-primary);
  text-decoration: none;
}

a.contact__detail-value:hover {
  color: var(--gold);
}

.contact__form {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 32px;
}

@media (max-width: 768px) {
  .contact {
    padding: 48px 0;
  }

  .contact__inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .contact__heading {
    font-size: 24px;
  }

  .contact__form {
    padding: 24px;
  }
}
</style>