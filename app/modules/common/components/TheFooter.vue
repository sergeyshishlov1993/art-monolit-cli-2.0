<script setup lang="ts">
import BIconLogo from '~/assets/icon/b-icon-logo.vue'
import { ROUTES } from '~/modules/common/constants/routes'
import { CONTACTS } from '~/modules/common/constants/contacts'
import { useCategoryStore } from '~/modules/category/CategoryStore'

const categoryStore = useCategoryStore()

const iconPaths: Record<string, string> = {
  location: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
  phone: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
  email: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
}

const catalogLinks = computed(() =>
    categoryStore.categories.map(cat => ({
      label: cat.name,
      to: ROUTES.CATALOG_CATEGORY(cat.slug),
    }))
)

const companyLinks = [
  { label: 'Про нас', to: ROUTES.ABOUT },
  { label: 'Наші роботи', to: ROUTES.PORTFOLIO },
  { label: 'Доставка', to: ROUTES.DELIVERY },
  { label: 'Контакти', to: ROUTES.CONTACTS },
]

const contactItems = [
  { icon: 'location', text: CONTACTS.ADDRESS },
  { icon: 'phone', text: CONTACTS.PHONE_1, href: CONTACTS.PHONE_1_HREF },
  { icon: 'phone', text: CONTACTS.PHONE_2, href: CONTACTS.PHONE_2_HREF },
  { icon: 'email', text: CONTACTS.EMAIL, href: CONTACTS.EMAIL_HREF },
]

const copyright = `© ${new Date().getFullYear()} Art Monolit. Усі права захищені.`
</script>

<template>
  <footer class="footer">
    <div class="footer__main">
      <div class="footer__inner">
        <div class="footer__brand">
          <NuxtLink :to="ROUTES.HOME" class="footer__brand-link">
            <BIconLogo class="footer__logo" />
            <span class="footer__title">ART MONOLIT</span>
          </NuxtLink>
          <p class="footer__desc">Виробництво виробів з натурального каменю</p>
          <div class="footer__socials">
            <a
                v-for="social in CONTACTS.SOCIALS"
                :key="social.name"
                :href="social.href"
                target="_blank"
                rel="noopener"
                class="footer__social"
                :title="social.name"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" :fill="social.color" aria-hidden="true">
                <path :d="social.icon" />
              </svg>
            </a>
          </div>
        </div>

        <div v-if="catalogLinks.length > 0" class="footer__column">
          <h4 class="footer__column-title">
            <span class="footer__column-first">К</span>аталог
          </h4>
          <div class="footer__links">
            <NuxtLink
                v-for="link in catalogLinks"
                :key="link.to"
                :to="link.to"
                class="footer__link"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <div class="footer__column">
          <h4 class="footer__column-title">
            <span class="footer__column-first">К</span>омпанія
          </h4>
          <div class="footer__links">
            <NuxtLink
                v-for="link in companyLinks"
                :key="link.to"
                :to="link.to"
                class="footer__link"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <div class="footer__column">
          <h4 class="footer__column-title">
            <span class="footer__column-first">К</span>онтакти
          </h4>
          <div class="footer__contacts">
            <div v-for="(contact, index) in contactItems" :key="index" class="footer__contact">
              <svg class="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path :d="iconPaths[contact.icon]" />
              </svg>
              <a v-if="contact.href" :href="contact.href" class="footer__contact-text">{{ contact.text }}</a>
              <span v-else class="footer__contact-text">{{ contact.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="footer__bottom-inner">
        <span class="footer__copyright">{{ copyright }}</span>
        <slot name="bottom" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.footer__main {
  padding: 48px 0;
}

.footer__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 40px;
  justify-content: space-between;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 0 0 280px;
}

.footer__brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.footer__logo {
  height: 32px;
  width: auto;
}

.footer__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.footer__desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

.footer__socials {
  display: flex;
  gap: 8px;
}

.footer__social {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
}

.footer__social:hover {
  border-color: var(--gold);
  transform: scale(1.1);
}

.footer__column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 0 1 auto;
  min-width: 160px;
}

.footer__column-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.footer__column-first {
  color: var(--gold);
  font-size: 20px;
  font-weight: 700;
}

.footer__links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer__link {
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer__link:hover {
  color: var(--gold);
}

.footer__contacts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__contact {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.footer__contact-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--gold);
}

.footer__contact-text {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  line-height: 1.5;
}

a.footer__contact-text:hover {
  color: var(--gold);
}

.footer__bottom {
  border-top: 1px solid var(--border);
  padding: 20px 0;
}

.footer__bottom-inner {
  max-width: 1280px;
  margin: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.footer__copyright {
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .footer__inner {
    flex-direction: column;
    gap: 32px;
  }

  .footer__brand {
    flex: none;
  }
}
</style>