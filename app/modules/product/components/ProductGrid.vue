<script setup lang="ts">
import type { ProductFilters, Product } from '~/modules/product/types'
import { useProductApi } from '~/modules/product/ProductApi'

const props = defineProps<{
  filters: ProductFilters
}>()

const productApi = useProductApi()

const products = ref<Product[]>([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)
const isFetching = ref(false)
const totalCount = ref(0)
const limit = 12

async function fetchProducts(reset = false) {
  if (isFetching.value) return

  if (reset) {
    currentPage.value = 1
    hasMore.value = true
    products.value = []
  }

  if (!hasMore.value) return
  isFetching.value = true

  if (reset) {
    isLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const response = await productApi.getAll({
      categoryId: props.filters.categoryId || undefined,
      material: props.filters.material || undefined,
      badge: props.filters.badge || undefined,
      targetGroup: props.filters.targetGroup || undefined,
      search: props.filters.search || undefined,
      page: currentPage.value,
      limit,
    })

    if (reset) {
      products.value = response.items
    } else {
      products.value.push(...response.items)
    }

    hasMore.value = response.hasMore
    totalCount.value = response.total
    currentPage.value++
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
    isFetching.value = false
  }
}

const { data: initialData } = await useAsyncData('catalog-products', () =>
    productApi.getAll({ page: 1, limit })
)

if (initialData.value) {
  products.value = initialData.value.items
  hasMore.value = initialData.value.hasMore
  totalCount.value = initialData.value.total
  currentPage.value = 2
}

watch(
    () => props.filters,
    () => fetchProducts(true),
    { deep: true },
)

const loadMoreTrigger = ref<HTMLElement | null>(null)

function onScroll() {
  if (!loadMoreTrigger.value) return
  if (!hasMore.value) return
  if (isFetching.value) return

  const rect = loadMoreTrigger.value.getBoundingClientRect()

  if (rect.top <= window.innerHeight + 300) {
    fetchProducts()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function getBadgeLabel(badges: string[]) {
  if (badges.includes('SALE')) return 'Акція'
  if (badges.includes('NEW')) return 'Новинка'
  if (badges.includes('HIT')) return 'Хіт'
  return ''
}

function getMainImage(product: Product): string {
  if (!product.images.length) return ''
  const main = product.images.find(img => img.isMain)
  return main?.url || product.images[0]?.url || ''
}

const inquiryOpen = ref(false)
const inquiryProductTitle = ref('')
const inquiryProductId = ref('')

function openInquiry(product: Product) {
  inquiryProductTitle.value = product.title
  inquiryProductId.value = product.id
  inquiryOpen.value = true
}

function closeInquiry() {
  inquiryOpen.value = false
}
</script>

<template>
  <div class="catalog-grid">
    <div class="catalog-grid__info">
      <span class="catalog-grid__count">{{ totalCount }} виробів</span>
    </div>

    <div v-if="isLoading" class="catalog-grid__empty">
      Завантаження...
    </div>

    <div v-else-if="!products.length" class="catalog-grid__empty">
      Нічого не знайдено
    </div>

    <div v-else class="catalog-grid__items">
      <BProductCard
          v-for="product in products"
          :key="product.id"
          :image="getMainImage(product)"
          :title="product.title"
          :slug="product.slug"
          :category="product.category.slug"
          :badge="getBadgeLabel(product.badges)"
          @inquiry="openInquiry(product)"
      />
    </div>

    <div v-if="hasMore && products.length > 0" ref="loadMoreTrigger" class="catalog-grid__trigger">
      <div v-if="isLoadingMore" class="catalog-grid__loading">
        Завантаження...
      </div>
    </div>

    <BModal v-model="inquiryOpen" title="Дізнатись вартість">
      <BLeadForm
          source="product_card"
          :product-id="inquiryProductId"
          :product-title="inquiryProductTitle"
          @success="closeInquiry"
      />
    </BModal>
  </div>
</template>

<style scoped>
.catalog-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.catalog-grid__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.catalog-grid__count {
  font-size: 13px;
  color: var(--text-muted);
}

.catalog-grid__items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.catalog-grid__empty {
  text-align: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--text-muted);
}

.catalog-grid__trigger {
  height: 40px;
}

.catalog-grid__loading {
  text-align: center;
  padding: 32px 0;
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .catalog-grid__items {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .catalog-grid__items {
    grid-template-columns: 1fr;
  }
}
</style>