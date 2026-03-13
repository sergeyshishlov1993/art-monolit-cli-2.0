<script setup lang="ts">
import AdminProductForm from '~/modules/admin/components/AdminProductForm.vue'
import { useProductStore } from '~/modules/product/ProductStore'
import { useProductApi } from '~/modules/product/ProductApi'
import { ROUTES } from '~/modules/common/constants/routes'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const productApi = useProductApi()

const productId = computed(() => String(route.params.id))
const productData = ref<Record<string, unknown>>({})
const existingPhotos = ref<{ id: string; url: string; isMain: boolean }[]>([])
const loading = ref(true)

onMounted(async () => {
  await productStore.fetchById(productId.value)
  const product = productStore.current
  if (product) {
    productData.value = {
      title: product.title,
      slug: product.slug,
      description: product.description || '',
      categoryId: product.categoryId,
      targetGroupIds: product.targetGroups?.map((t: { id: string }) => t.id) || [],
      materialIds: product.materials?.map((m: { id: string }) => m.id) || [],
      badges: product.badges || [],
      discountPercent: product.discountPercent,
      isActive: product.isActive,
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      specs: product.specs?.map((s: { key: string; value: string; sortOrder: number }) => ({
        key: s.key,
        value: s.value,
        sortOrder: s.sortOrder,
      })) || [],
    }
    existingPhotos.value = product.images?.map((img: { id: string; url: string; isMain: boolean }) => ({
      id: img.id,
      url: img.url,
      isMain: img.isMain,
    })) || []
  }
  loading.value = false
})

async function handleSave(data: Record<string, unknown>, photos: File[], deletedImageIds: string[]) {
  const specs = data.specs as { key: string; value: string; sortOrder: number }[]
  const { specs: _, ...productPayload } = data

  await productStore.update(productId.value, productPayload)

  for (const imageId of deletedImageIds) {
    await productStore.deleteImage(imageId)
  }

  for (const file of photos) {
    await productStore.uploadImage(productId.value, file)
  }

  const currentProduct = productStore.current
  const existingSpecs = currentProduct?.specs || []

  for (const existing of existingSpecs) {
    await productApi.removeSpec(productId.value, existing.id)
  }

  for (const spec of specs) {
    if (spec.key && spec.value) {
      await productApi.addSpec(productId.value, spec)
    }
  }

  await router.push(ROUTES.ADMIN.PRODUCTS)
}

async function handleDelete() {
  await productStore.remove(productId.value)
  await router.push(ROUTES.ADMIN.PRODUCTS)
}
</script>

<template>
  <div v-if="loading" class="admin-loading">Завантаження...</div>

  <AdminProductForm
      v-else
      page-title="Редагувати товар"
      submit-label="Зберегти зміни"
      back-label="Товари"
      :back-to="ROUTES.ADMIN.PRODUCTS"
      :initial-data="productData"
      :initial-photos="existingPhotos"
      show-delete
      :on-save="handleSave"
      :on-delete="handleDelete"
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