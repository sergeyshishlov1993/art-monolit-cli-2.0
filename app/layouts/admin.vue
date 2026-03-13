<script setup lang="ts">
import { useAuthStore } from '~/modules/auth/AuthStore'
import {ROUTES} from '~/modules/common/constants/routes'

const route = useRoute()
const authStore = useAuthStore()

authStore.init()

const navItems = [
  { icon: 'chart-bar', label: 'Дашборд', to: '/admin' },
  { icon: 'rectangle-group', label: 'Категорії', to: ROUTES.ADMIN.CATEGORIES },
  { icon: 'cube', label: 'Товари', to: ROUTES.ADMIN.PRODUCTS },
  { icon: 'photo', label: 'Роботи', to: ROUTES.ADMIN.PORTFOLIOS },
  { icon: 'sparkles', label: 'Слайдер', to: ROUTES.ADMIN.HERO_SLIDES },
  { icon: 'envelope', label: 'Заявки', to: ROUTES.ADMIN.LEADS },
]

const isSidebarOpen = ref(true)
const isMobileMenu = ref(false)

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

function logout() {
  authStore.logout()
}

function closeMobileMenu() {
  isMobileMenu.value = false
}

watch(() => route.path, closeMobileMenu)
</script>

<template>
  <div class="admin" :class="{ 'admin--collapsed': !isSidebarOpen }">
    <div class="admin__topbar">
      <button class="admin__burger" @click="isMobileMenu = !isMobileMenu">
        <BIcon :name="isMobileMenu ? 'x-mark' : 'bars-3'" size="md" />
      </button>
      <span class="admin__topbar-logo">ART MONOLIT</span>
    </div>

    <Teleport to="body">
      <Transition name="admin-overlay">
        <div
            v-if="isMobileMenu"
            class="admin__overlay"
            @click="closeMobileMenu"
        />
      </Transition>
    </Teleport>

    <aside class="admin__sidebar" :class="{ 'admin__sidebar--open': isMobileMenu }">
      <div class="admin__sidebar-header">
        <span class="admin__logo">ART MONOLIT</span>
        <button class="admin__collapse" @click="isSidebarOpen = !isSidebarOpen">
          <BIcon :name="isSidebarOpen ? 'chevron-left' : 'chevron-right'" size="sm" />
        </button>
        <button class="admin__close-mobile" @click="closeMobileMenu">
          <BIcon name="x-mark" size="sm" />
        </button>
      </div>

      <nav class="admin__nav">
        <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="admin__nav-item"
            :class="{ 'admin__nav-item--active': isActive(item.to) }"
        >
          <BIcon :name="item.icon" size="sm" />
          <span class="admin__nav-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <button class="admin__logout" @click="logout">
        <BIcon name="arrow-right-on-rectangle" size="sm" />
        <span class="admin__logout-label">Вийти</span>
      </button>
    </aside>

    <main class="admin__main">
      <slot />
    </main>

    <BToast />
  </div>
</template>

<style scoped>
.admin {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  transition: grid-template-columns 0.2s;
}

.admin--collapsed {
  grid-template-columns: 64px 1fr;
}

.admin__topbar {
  display: none;
}

.admin__overlay {
  display: none;
}

.admin__close-mobile {
  display: none;
}

.admin__sidebar {
  display: flex;
  flex-direction: column;
  background: #111;
  border-right: 1px solid rgba(255 255 255 / 0.08);
  padding: 16px 12px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.admin__sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 20px;
  border-bottom: 1px solid rgba(255 255 255 / 0.08);
  margin-bottom: 16px;
}

.admin__logo {
  font-size: 14px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
}

.admin--collapsed .admin__logo {
  display: none;
}

.admin--collapsed .admin__nav-label {
  display: none;
}

.admin--collapsed .admin__logout-label {
  display: none;
}

.admin__collapse {
  all: unset;
  cursor: pointer;
  color: rgba(255 255 255 / 0.4);
  transition: color 0.2s;
}

.admin__collapse:hover {
  color: #fff;
}

.admin__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.admin__nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255 255 255 / 0.6);
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
}

.admin__nav-item:hover {
  background: rgba(255 255 255 / 0.06);
  color: #fff;
}

.admin__nav-item--active {
  background: rgba(255 255 255 / 0.1);
  color: var(--gold);
}

.admin__logout {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: rgba(255 255 255 / 0.4);
  transition: all 0.15s;
}

.admin__logout:hover {
  background: rgba(255 255 255 / 0.06);
  color: #ef4444;
}

.admin__main {
  padding: 32px;
  background: var(--bg-primary);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin {
    display: flex;
    flex-direction: column;
    grid-template-columns: unset;
  }

  .admin--collapsed {
    grid-template-columns: unset;
  }

  .admin__topbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #111;
    border-bottom: 1px solid rgba(255 255 255 / 0.08);
    position: sticky;
    top: 0;
    z-index: 101;
  }

  .admin__burger {
    all: unset;
    cursor: pointer;
    color: rgba(255 255 255 / 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin__topbar-logo {
    font-size: 13px;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.1em;
  }

  .admin__overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0 0 0 / 0.6);
    z-index: 199;
  }

  .admin__sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 260px;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .admin__sidebar--open {
    transform: translateX(0);
  }

  .admin__sidebar-header {
    padding: 0 4px 16px;
  }

  .admin__collapse {
    display: none;
  }

  .admin__close-mobile {
    all: unset;
    cursor: pointer;
    color: rgba(255 255 255 / 0.4);
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }

  .admin__close-mobile:hover {
    color: #fff;
  }

  .admin__nav-label,
  .admin__logout-label {
    display: inline !important;
  }

  .admin__main {
    padding: 20px 16px;
    min-height: calc(100vh - 49px);
  }
}

.admin-overlay-enter-active,
.admin-overlay-leave-active {
  transition: opacity 0.25s ease;
}

.admin-overlay-enter-from,
.admin-overlay-leave-to {
  opacity: 0;
}
</style>