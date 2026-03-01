<script setup lang="ts">
import {useTheme} from "~/modules/common/composables/useTheme";

const { initTheme } = useTheme()
initTheme()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>