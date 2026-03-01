<script setup lang="ts">
import { useQuickContact } from '~/modules/common/composables/useQuickContact'
import { CONTACTS } from '~/modules/common/constants/contacts'

const { isOpen, toggle, close } = useQuickContact()

const socials = [
  ...CONTACTS.SOCIALS,
  {
    name: 'Зателефонувати',
    href: CONTACTS.PHONE_1_HREF,
    color: '#d32f2f',
    icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
  },
]

function onClickOutside(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.quick-contact')) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div class="quick-contact" aria-label="Швидкий контакт">
    <TransitionGroup name="quick-contact-item" tag="div" class="quick-contact__items">
      <a
          v-for="(social, index) in socials"
          v-if="isOpen"
          :key="social.name"
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          class="quick-contact__item"
          :style="{
          '--item-color': social.color,
          bottom: `${(index + 1) * 56}px`,
          transitionDelay: `${index * 60}ms`,
        }"
          :title="social.name"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" :fill="social.color" aria-hidden="true" focusable="false">
          <path :d="social.icon" />
        </svg>
      </a>
    </TransitionGroup>

    <button
        type="button"
        class="quick-contact__trigger"
        :aria-expanded="isOpen"
        aria-label="Зв'язатися"
        @click="toggle"
    >
      <svg v-if="!isOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
      <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.quick-contact {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: auto;
}

.quick-contact__items {
  position: relative;
  width: 52px;
  margin-bottom: -30px;
}

.quick-contact__item {
  position: absolute;
  right: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.12);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  z-index: 101;
}

.quick-contact__item:hover {
  transform: scale(1.12);
  border-color: var(--item-color);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.18);
}

.quick-contact-item-enter-active,
.quick-contact-item-leave-active {
  transition: all 0.3s ease;
}

.quick-contact-item-enter-from {
  opacity: 0;
  transform: scale(0.3) translateY(20px);
}

.quick-contact-item-leave-to {
  opacity: 0;
  transform: scale(0.3);
}

.quick-contact__trigger {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--gold);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
  transition: background 0.3s, transform 0.3s;
  position: relative;
  z-index: 102;

  svg {
    pointer-events: none;
  }
}

.quick-contact__trigger:hover {
  transform: scale(1.08);
}

.quick-contact__trigger--open {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

@media (max-width: 768px) {
  .quick-contact {
    bottom: 16px;
    right: 16px;
  }

  .quick-contact__items {
    width: 48px;
    margin-bottom: 6px;
  }

  .quick-contact__item {
    width: 40px;
    height: 40px;
  }

  .quick-contact__trigger {
    width: 48px;
    height: 48px;
  }
}
</style>