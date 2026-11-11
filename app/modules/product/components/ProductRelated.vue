<script setup lang="ts">
import { useProductApi } from '~/modules/product/ProductApi'
import { ROUTES } from '~/modules/common/constants/routes'
import type { Product } from '~/modules/product/types'

const RELATED_COUNT = 4

const props = defineProps<{
  categoryId: string
  currentId: string
}>()

const productApi = useProductApi()

const { data: related } = await useAsyncData(`related-${props.categoryId}-${props.currentId}`, async () => {
  const response = await productApi.getAll({ categoryId: props.categoryId, limit: RELATED_COUNT + 1 })
  return response.items.filter((item) => item.id !== props.currentId).slice(0, RELATED_COUNT)
})

function getMainImage(product: Product): string {
  return product.images.find((image) => image.isMain)?.url || product.images[0]?.url || ''
}

function openProduct(product: Product): void {
  navigateTo(ROUTES.CATALOG_PRODUCT(product.category.slug, product.slug))
}
</script>

<template>
  <section v-if="related?.length" class="related">
    <h2 class="related__title">Схожі вироби</h2>
    <div class="related__grid">
      <BProductCard
          v-for="product in related"
          :key="product.id"
          :image="getMainImage(product)"
          :title="product.title"
          :slug="product.slug"
          :category="product.category.slug"
          @inquiry="openProduct(product)"
      />
    </div>
  </section>
</template>

<style scoped>
.related {
  margin-top: 80px;
}

.related__title {
  margin: 0 0 24px;
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
}

.related__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .related__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .related {
    margin-top: 48px;
  }

  .related__title {
    font-size: 22px;
  }
}
</style>
