<script setup lang="ts">
import { ROUTES } from "~/modules/common/constants/routes"
import { useCategoryStore } from '~/modules/category/CategoryStore'
import MobileContactBar from '~/modules/common/components/MobileContactBar.vue'

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
</script>

<template>
  <div class="app-layout">
    <TheHeader :nav="navItems">
      <template #actions>
        <CitySwitcher />
        <BThemeToggle />
      </template>

      <template #actionsMobile>
        <CitySwitcher />
        <BThemeToggle />
      </template>
    </TheHeader>

    <main class="app-main">
      <slot />
    </main>

    <ClientOnly>
      <CityModal />
    </ClientOnly>
    <CookieBanner />

    <TheFooter />
    <BScrollTop />
    <BQuickContact />
    <MobileContactBar />
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
}

/* Нижня панель зв'язку на телефоні: решта фіксованих елементів піднімається над нею */
@media (max-width: 768px) {
  .app-layout {
    --mobile-bar-height: 56px;
    padding-bottom: var(--mobile-bar-height);
  }
}
</style>