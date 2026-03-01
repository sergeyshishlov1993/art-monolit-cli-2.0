<script setup lang="ts">
import BIconLogo from '~/assets/icon/b-icon-logo.vue'
import { ROUTES } from '~/modules/common/constants/routes'
import { CONTACTS } from '~/modules/common/constants/contacts'
import { useCategoryStore } from '~/modules/category/CategoryStore'

const categoryStore = useCategoryStore()
const route = useRoute()

const isMobileOpen = ref(false)
const openDropdown = ref<string | null>(null)

interface NavItem {
  label: string
  to: string
  children?: { label: string; to: string }[]
}

const nav = computed<NavItem[]>(() => {
  const categoriesWithProducts = categoryStore.categories.filter(
      cat => cat._count && cat._count.products > 0
  )

  const catalogChildren = categoriesWithProducts.map(cat => ({
    label: cat.name,
    to: `/catalog/${cat.slug}`,
  }))

  return [
    {
      label: 'Каталог',
      to: ROUTES.CATALOG,
      children: catalogChildren.length > 0 ? catalogChildren : undefined,
    },
    { label: 'Портфоліо', to: ROUTES.PORTFOLIO },
    { label: 'Доставка', to: ROUTES.DELIVERY },
    { label: 'Про нас', to: ROUTES.ABOUT },
    { label: 'Контакти', to: ROUTES.CONTACTS },
  ]
})

function isActive(item: NavItem): boolean {
  const currentPath = route.path

  if (currentPath === item.to) return true

  if (item.children) {
    return item.children.some(child => currentPath.startsWith(child.to))
  }

  if (item.to !== '/' && currentPath.startsWith(item.to)) return true

  return false
}

function isChildActive(to: string): boolean {
  return route.path === to || route.path.startsWith(to + '/')
}

function toggleDropdown(label: string) {
  openDropdown.value = openDropdown.value === label ? null : label
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <NuxtLink :to="ROUTES.HOME" class="header__brand">
        <BIconLogo class="header__logo" />
        <span class="header__title">ART MONOLIT</span>
      </NuxtLink>

      <nav class="header__nav">
        <template v-for="item in nav" :key="item.label">
          <div v-if="item.children" class="header__dropdown">
            <button
                type="button"
                class="header__link"
                :class="{ 'header__link--active': isActive(item) }"
                @click="toggleDropdown(item.label)"
            >
              {{ item.label }}
              <svg class="header__chevron" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div v-if="openDropdown === item.label" class="header__dropdown-menu">
                <NuxtLink
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to"
                    class="header__dropdown-item"
                    :class="{ 'header__dropdown-item--active': isChildActive(child.to) }"
                    @click="openDropdown = null"
                >
                  {{ child.label }}
                </NuxtLink>
              </div>
            </Transition>
          </div>
          <NuxtLink
              v-else
              :to="item.to"
              class="header__link"
              :class="{ 'header__link--active': isActive(item) }"
          >
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>

      <a :href="CONTACTS.PHONE_1_HREF" class="header__phone">
        <svg class="header__phone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
        {{ CONTACTS.PHONE_1 }}
      </a>

      <div class="header__actions">
        <slot name="actions" />
      </div>

      <button type="button" class="header__burger" @click="isMobileOpen = !isMobileOpen">
        <svg v-if="!isMobileOpen" class="header__burger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
        </svg>
        <svg v-else class="header__burger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <Transition name="mobile-menu">
      <div v-if="isMobileOpen" class="header__mobile">
        <template v-for="item in nav" :key="item.label">
          <NuxtLink
              :to="item.to"
              class="header__mobile-link"
              :class="{ 'header__mobile-link--active': isActive(item) }"
              @click="isMobileOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
          <template v-if="item.children">
            <NuxtLink
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="header__mobile-link header__mobile-link--sub"
                :class="{ 'header__mobile-link--active': isChildActive(child.to) }"
                @click="isMobileOpen = false"
            >
              {{ child.label }}
            </NuxtLink>
          </template>
        </template>
        <a :href="CONTACTS.PHONE_1_HREF" class="header__mobile-link header__mobile-phone" @click="isMobileOpen = false">
          {{ CONTACTS.PHONE_1 }}
        </a>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #111111;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header__inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.header__logo {
  height: 32px;
  width: auto;
}

.header__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}

.header__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  font-family: inherit;
  white-space: nowrap;
}

.header__link:hover {
  color: var(--gold);
}

.header__link--active {
  color: var(--gold);
}

.header__link--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 14px;
  right: 14px;
  height: 2px;
  background: var(--gold);
  border-radius: 1px;
}

.header__chevron {
  width: 12px;
  height: 12px;
}

.header__dropdown {
  position: relative;
}

.header__dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  padding: 4px 0;
  margin-top: 4px;
}

.header__dropdown-item {
  display: block;
  padding: 10px 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.15s;
}

.header__dropdown-item:hover {
  color: var(--gold);
  background: rgba(255, 255, 255, 0.05);
}

.header__dropdown-item--active {
  color: var(--gold);
  background: rgba(255, 255, 255, 0.03);
}

.header__phone {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s;
}

.header__phone:hover {
  color: var(--gold);
}

.header__phone-icon {
  width: 18px;
  height: 18px;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header__burger {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 4px;
}

.header__burger-icon {
  width: 24px;
  height: 24px;
}

.header__mobile {
  display: none;
  flex-direction: column;
  padding: 8px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: #111111;
}

.header__mobile-link {
  display: block;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: color 0.2s;
}

.header__mobile-link:hover {
  color: var(--gold);
}

.header__mobile-link--active {
  color: var(--gold);
  border-left: 3px solid var(--gold);
  padding-left: 12px;
  margin-left: -12px;
}

.header__mobile-link--sub {
  padding-left: 20px;
  font-weight: 400;
  font-size: 13px;
}

.header__mobile-link--sub.header__mobile-link--active {
  padding-left: 32px;
}

.header__mobile-phone {
  color: var(--gold);
  font-weight: 700;
  margin-top: 8px;
  border-bottom: none;
}

@media (max-width: 768px) {
  .header__nav { display: none; }
  .header__phone { display: none; }
  .header__actions { display: none; }
  .header__burger { display: flex; margin-left: auto; }
  .header__mobile { display: flex; }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
</style>