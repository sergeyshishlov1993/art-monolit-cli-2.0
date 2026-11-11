<script setup lang="ts">
import { useTheme } from "~/modules/common/composables/useTheme"

const { initTheme } = useTheme()
initTheme()

const route = useRoute()
const siteUrl = useRuntimeConfig().public.siteUrl

useHead({
  link: [{ rel: 'canonical', href: () => `${siteUrl}${route.path}` }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>