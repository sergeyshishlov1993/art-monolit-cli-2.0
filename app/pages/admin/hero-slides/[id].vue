<script setup lang="ts">
import { useHeroApi } from '~/modules/hero/HeroApi'
import { ROUTES } from '~/modules/common/constants/routes'
import AdminHeroSlideForm from '~/modules/admin/components/AdminHeroSlideForm.vue'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const route = useRoute()
const heroApi = useHeroApi()

const slideId = route.params.id as string

const { data: slide } = await useAsyncData(`hero-slide-${slideId}`, () =>
    heroApi.getById(slideId)
)

const initialData = computed(() => {
  if (!slide.value) return {}
  return {
    title: slide.value.title,
    subtitle: slide.value.subtitle || '',
    buttonText: slide.value.buttonText || '',
    buttonLink: slide.value.buttonLink || '',
    sortOrder: slide.value.sortOrder,
    isActive: slide.value.isActive,
  }
})

const initialImage = computed(() => {
  if (!slide.value?.imageUrl) return null
  return {
    id: slide.value.id,
    url: slide.value.imageUrl,
  }
})

async function handleSave(data: Record<string, unknown>, photo: File | null) {
  await heroApi.update(slideId, data)

  if (photo) {
    await heroApi.uploadImage(slideId, photo)
  }

  await router.push(ROUTES.ADMIN.HERO_SLIDES)
}
</script>

<template>
  <div v-if="!slide" class="admin-loading">Завантаження...</div>

  <AdminHeroSlideForm
      v-else
      :page-title="`Редагування: ${slide.title}`"
      submit-label="Зберегти зміни"
      back-label="Слайдер"
      :back-to="ROUTES.ADMIN.HERO_SLIDES"
      :initial-data="initialData"
      :initial-image="initialImage"
      :on-save="handleSave"
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