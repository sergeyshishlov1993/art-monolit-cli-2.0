<script setup lang="ts">
import { ROUTES } from "~/modules/common/constants/routes"
import { useCategoryStore } from '~/modules/category/CategoryStore'

const categoryStore = useCategoryStore()

await categoryStore.fetchAll()

const navItems = computed(() => [
  {
    label: 'Каталог',
    to: ROUTES.CATALOG,
    children: categoryStore.categories.map(cat => ({
      label: cat.name,
      to: ROUTES.CATALOG_CATEGORY(cat.slug),
    })),
  },
  { label: 'Портфоліо', to: ROUTES.PORTFOLIO },
  { label: 'Доставка', to: ROUTES.DELIVERY },
  { label: 'Про нас', to: ROUTES.ABOUT },
  { label: 'Контакти', to: ROUTES.CONTACTS },
])

const footerColumns = computed(() => [
  {
    title: 'Навігація',
    links: [
      { label: 'Каталог', to: ROUTES.CATALOG },
      { label: 'Портфоліо', to: ROUTES.PORTFOLIO },
      { label: 'Про компанію', to: ROUTES.ABOUT },
      { label: 'Контакти', to: ROUTES.CONTACTS },
    ],
  },
  {
    title: 'Каталог',
    links: categoryStore.categories.slice(0, 5).map(cat => ({
      label: cat.name,
      to: ROUTES.CATALOG_CATEGORY(cat.slug),
    })),
  },
])

const footerContacts = [
  { icon: 'location' as const, text: 'м. Київ, вул. Прикладна 1' },
  { icon: 'phone' as const, text: '+380 (99) 123-45-67', href: 'tel:+380991234567' },
  { icon: 'email' as const, text: 'info@artmonolit.ua', href: 'mailto:info@artmonolit.ua' },
]

const route = useRoute()
</script>

<template>
  <div class="app-layout">
    <TheHeader :nav="navItems">
      <template #actions>
        <BThemeToggle />
      </template>

      <template #actionsMobile>
        <BThemeToggle />
      </template>
    </TheHeader>

    <main class="app-main">
      <Transition name="page-content" mode="out-in">
        <div :key="route.path" class="page-wrapper">
          <slot />
        </div>
      </Transition>
    </main>

    <TheFooter
        :columns="footerColumns"
        :contacts="footerContacts"
        description="Каменеобробне підприємство. Вироби з мармуру та граніту від виробника."
    />
    <BScrollTop />
    <BQuickContact />
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  position: relative;
}

.page-wrapper {
  width: 100%;
}

.page-content-enter-active {
  transition: opacity 0.35s ease-out;
}

.page-content-leave-active {
  transition: none;
  position: absolute;
  opacity: 0;
}

.page-content-enter-from {
  opacity: 0.5;
}
</style>