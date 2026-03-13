<script setup lang="ts">
import { usePortfolioApi } from '~/modules/portfolio/PortfolioApi'
import { useToast } from '~/modules/common/composables/useToast'
import { ROUTES } from '~/modules/common/constants/routes'
import type { PortfolioWork } from '~/modules/portfolio/types'
import AdminPortfolioForm from "~/modules/admin/components/AdminPortfolioForm.vue";

definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()
const portfolioApi = usePortfolioApi()
const toast = useToast()

const portfolioId = computed(() => String(route.params.id))
const loading = ref(true)
const work = ref<PortfolioWork | null>(null)
const isSaving = ref(false)
const isDeleting = ref(false)

const initialData = ref<{
  categoryId: string
  targetGroupIds: string[]
  materialIds: string[]
  sortOrder: number
  isActive: boolean
}>({
  categoryId: '',
  targetGroupIds: [],
  materialIds: [],
  sortOrder: 0,
  isActive: true,
})

const initialPhoto = ref<{ id: string; url: string } | null>(null)

async function fetchWork() {
  loading.value = true
  work.value = await portfolioApi.getById(portfolioId.value)

  if (work.value) {
    initialData.value = {
      categoryId: work.value.categoryId,
      targetGroupIds: work.value.targetGroups.map(targetGroup => targetGroup.id),
      materialIds: work.value.materials.map(material => material.id),
      sortOrder: work.value.sortOrder,
      isActive: work.value.isActive,
    }

    if (work.value.images.length) {
      initialPhoto.value = {
        id: work.value.images[0].id,
        url: work.value.images[0].url,
      }
    }
  }

  loading.value = false
}

interface FormData {
  categoryId: string
  targetGroupIds: string[]
  materialIds: string[]
  sortOrder: number
  isActive: boolean
}

async function handleSave(data: FormData, files: File[], deletePhoto: boolean) {
  isSaving.value = true
  try {
    await portfolioApi.update(portfolioId.value, {
      categoryId: data.categoryId,
      targetGroupIds: data.targetGroupIds,
      materialIds: data.materialIds,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    })

    if (deletePhoto && initialPhoto.value) {
      await portfolioApi.deleteImage(initialPhoto.value.id)
    }

    if (files.length) {
      await portfolioApi.uploadImage(portfolioId.value, files[0])
    }

    toast.success('Роботу збережено')
    await router.push(ROUTES.ADMIN.PORTFOLIOS)
  } catch {
    toast.error('Помилка при збереженні роботи')
  } finally {
    isSaving.value = false
  }
}

async function handleDelete() {
  isDeleting.value = true
  try {
    await portfolioApi.remove(portfolioId.value)
    toast.success('Роботу видалено')
    await router.push(ROUTES.ADMIN.PORTFOLIOS)
  } catch {
    toast.error('Помилка при видаленні роботи')
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchWork)
</script>

<template>
  <div v-if="loading" class="admin-loading">Завантаження...</div>

  <AdminPortfolioForm
      v-else-if="work"
      :initial-data="initialData"
      :initial-photo="initialPhoto"
      page-title="Редагування роботи"
      submit-label="Зберегти змiни"
      :back-to="ROUTES.ADMIN.PORTFOLIOS"
      :is-saving="isSaving"
      :is-deleting="isDeleting"
      show-settings
      show-delete
      @save="handleSave"
      @delete="handleDelete"
  />
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