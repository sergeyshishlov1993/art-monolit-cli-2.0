<script setup lang="ts">
import { useContacts } from '~/modules/common/composables/useContacts'

const siteContacts = useContacts()

const telegram = computed(() => siteContacts.value.SOCIALS.find(social => social.name === 'Telegram'))
const isFormOpen = ref(false)
</script>

<template>
  <nav class="mobile-bar" aria-label="Швидкий зв'язок">
    <a :href="siteContacts.PHONE_1_HREF" class="mobile-bar__item">
      <BIcon name="phone" size="sm" />
      Подзвонити
    </a>
    <a
        v-if="telegram"
        :href="telegram.href"
        target="_blank"
        rel="noopener noreferrer"
        class="mobile-bar__item"
    >
      <svg class="mobile-bar__social" viewBox="0 0 24 24" :fill="telegram.color" aria-hidden="true"><path :d="telegram.icon" /></svg>
      Telegram
    </a>
    <button type="button" class="mobile-bar__item mobile-bar__item--primary" @click="isFormOpen = true">
      <BIcon name="envelope" size="sm" />
      Заявка
    </button>

    <BModal v-model="isFormOpen" title="Залишити заявку">
      <BLeadForm source="mobile_bar" @success="isFormOpen = false" />
    </BModal>
  </nav>
</template>

<style scoped>
.mobile-bar {
  display: none;
}

@media (max-width: 768px) {
  .mobile-bar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 110;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: var(--mobile-bar-height);
    background: #111;
    border-top: 1px solid rgb(255 255 255 / 0.12);
  }

  .mobile-bar__item {
    all: unset;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    text-decoration: none;
    cursor: pointer;
  }

  .mobile-bar__item + .mobile-bar__item {
    border-left: 1px solid rgb(255 255 255 / 0.12);
  }

  .mobile-bar__item--primary {
    color: #fff;
    background: var(--gold);
  }

  .mobile-bar__social {
    width: 18px;
    height: 18px;
  }
}
</style>
