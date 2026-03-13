<script setup lang="ts">
import AdminProductForm from '~/modules/admin/components/AdminProductForm.vue'
import { useProductStore } from '~/modules/product/ProductStore'
import { useProductApi } from '~/modules/product/ProductApi'
import { ROUTES } from '~/modules/common/constants/routes'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const productStore = useProductStore()
const productApi = useProductApi()

async function handleSave(data: Record<string, unknown>, photos: File[]) {
  const specs = data.specs as { key: string; value: string; sortOrder: number }[]
  const { specs: _, ...productData } = data

  const product = await productStore.create(productData) as { id: string }

  for (let index = 0; index < photos.length; index++) {
    await productStore.uploadImage(product.id, photos[index], index === 0)
  }

  for (const spec of specs) {
    if (spec.key && spec.value) {
      await productApi.addSpec(product.id, spec)
    }
  }

  await router.push(ROUTES.ADMIN.PRODUCTS)
}
</script>

<template>
  <AdminProductForm
      page-title="Новий товар"
      submit-label="Створити товар"
      back-label="Товари"
      :back-to="ROUTES.ADMIN.PRODUCTS"
      :on-save="handleSave"
  />
</template>