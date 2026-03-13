<script setup lang="ts">
import { usePortfolioApi } from '~/modules/portfolio/PortfolioApi'
import { useToast } from '~/modules/common/composables/useToast'
import { ROUTES } from '~/modules/common/constants/routes'
import AdminPortfolioForm from "~/modules/admin/components/AdminPortfolioForm.vue";

definePageMeta({ layout: 'admin' })

const router = useRouter()
const portfolioApi = usePortfolioApi()
const toast = useToast()

const isUploading = ref(false)
const uploadProgress = ref<{ current: number; total: number } | null>(null)

interface FormData {
  categoryId: string
  targetGroupIds: string[]
  materialIds: string[]
  sortOrder: number
  isActive: boolean
}

async function handleSave(data: FormData, files: File[]) {
  if (!files.length || !data.categoryId) return

  isUploading.value = true
  uploadProgress.value = { current: 0, total: files.length }

  try {
    for (const file of files) {
      const work = await portfolioApi.create({
        categoryId: data.categoryId,
        targetGroupIds: data.targetGroupIds,
        materialIds: data.materialIds,
        isActive: true,
      })

      await portfolioApi.uploadImage(work.id, file)
      uploadProgress.value.current++
    }

    toast.success(`Завантажено ${files.length} робіт`)
    await router.push(ROUTES.ADMIN.PORTFOLIOS)
  } catch {
    toast.error('Помилка при завантаженні')
  } finally {
    isUploading.value = false
    uploadProgress.value = null
  }
}
</script>

<template>
  <AdminPortfolioForm
      multiple
      page-title="Додати роботи"
      page-desc="Кожне фото стане окремою роботою"
      submit-label="Завантажити"
      :back-to="ROUTES.ADMIN.PORTFOLIOS"
      :is-saving="isUploading"
      :upload-progress="uploadProgress"
      @save="handleSave"
  />
</template>