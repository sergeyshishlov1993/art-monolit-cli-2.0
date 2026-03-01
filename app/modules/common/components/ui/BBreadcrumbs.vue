<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumbs__list">
      <li class="breadcrumbs__item">
        <NuxtLink to="/public" class="breadcrumbs__link">
          <svg class="breadcrumbs__home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m2.25 12 8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </NuxtLink>
      </li>
      <li v-for="(item, index) in items" :key="index" class="breadcrumbs__item">
        <svg class="breadcrumbs__separator" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <NuxtLink v-if="item.to" :to="item.to" class="breadcrumbs__link">
          {{ item.label }}
        </NuxtLink>
        <span v-else class="breadcrumbs__current">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  padding: 16px 0;
}

.breadcrumbs__list {
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.breadcrumbs__item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.breadcrumbs__home {
  width: 16px;
  height: 16px;
}

.breadcrumbs__separator {
  width: 12px;
  height: 12px;
  color: var(--text-muted);
  opacity: 0.5;
}

.breadcrumbs__link {
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumbs__link:hover {
  color: var(--gold);
}

.breadcrumbs__current {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
}
</style>