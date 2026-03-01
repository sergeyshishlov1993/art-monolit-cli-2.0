<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()

onMounted(() => {
  router.replace(`/admin/products/${route.params.id}/edit`)
})
</script>

<template>
  <div class="admin-loading">Перенаправлення...</div>
</template>

<style scoped>
.admin-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  font-size: 14px;
  color: var(--text-muted);
}
</style>