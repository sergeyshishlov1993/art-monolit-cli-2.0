<script setup lang="ts">
import { useHeroApi } from '~/modules/hero/HeroApi'
import { ROUTES } from '~/modules/common/constants/routes'
import AdminHeroSlideForm from '~/modules/admin/components/AdminHeroSlideForm.vue'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const heroApi = useHeroApi()

async function handleSave(data: Record<string, unknown>, photo: File | null) {
  const slide = await heroApi.create(data)

  if (photo) {
    await heroApi.uploadImage(slide.id, photo)
  }

  await router.push(ROUTES.ADMIN.HERO_SLIDES)
}
</script>

<template>
  <AdminHeroSlideForm
      page-title="Новий слайд"
      submit-label="Створити слайд"
      back-label="Слайдер"
      :back-to="ROUTES.ADMIN.HERO_SLIDES"
      :on-save="handleSave"
  />
</template>