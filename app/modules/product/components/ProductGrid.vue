<script setup lang="ts">
import type { ProductFilters, Product } from '~/modules/product/types'
import { useProductApi } from '~/modules/product/ProductApi'
import { releaseLockedHeight } from '~/modules/common/composables/useLockedHeight'

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
const isFilterChanging = ref(false)
const limit = 12
const skeletonCards = Array.from({ length: limit }, (_, index) => index)

const contentRef = ref<HTMLElement | null>(null)
const lockedHeight = ref<number | null>(null)
const loadMoreTrigger = ref<HTMLElement | null>(null)

function buildRequestFilters(page: number): ProductFilters {
  return {
    categoryId: props.filters.categoryId || undefined,
    material: props.filters.material || undefined,
    badge: props.filters.badge || undefined,
    targetGroup: props.filters.targetGroup || undefined,
    search: props.filters.search || undefined,
    sort: props.filters.sort || undefined,
    page,
    limit,
  }
}

async function fetchProducts(reset = false): Promise<void> {
  if (isFetching.value) return

  if (reset) {
    currentPage.value = 1
    hasMore.value = true
  }

  if (!reset && !hasMore.value) return

  isFetching.value = true

  if (reset) {
    if (products.value.length === 0) {
      isLoading.value = true
    } else {
      if (contentRef.value) {
        lockedHeight.value = contentRef.value.offsetHeight
      }
      isFilterChanging.value = true
    }
  } else {
    isLoadingMore.value = true
  }

  try {
    const response = await productApi.getAll(buildRequestFilters(currentPage.value))

    if (reset) {
      products.value = response.items
    } else {
      products.value.push(...response.items)
    }

    hasMore.value = response.hasMore
    totalCount.value = response.total
    currentPage.value = response.page + 1
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
    isFetching.value = false
    isFilterChanging.value = false
    void releaseLockedHeight(lockedHeight, contentRef.value)
  }
}

// Перша сторінка вантажиться на сервері, щоб посилання на товари були в HTML (SEO)
const { data: initialData } = await useAsyncData(
    `catalog-grid-${JSON.stringify(buildRequestFilters(1))}`,
    () => productApi.getAll(buildRequestFilters(1)),
)

if (initialData.value) {
  products.value = initialData.value.items
  hasMore.value = initialData.value.hasMore
  totalCount.value = initialData.value.total
  currentPage.value = initialData.value.page + 1
} else {
  await fetchProducts(true)
}

watch(
    () => props.filters,
    async () => {
      await fetchProducts(true)
    },
    { deep: true },
)

function onScroll(): void {
  if (!loadMoreTrigger.value) return
  if (!hasMore.value) return
  if (isFetching.value) return

  const rect = loadMoreTrigger.value.getBoundingClientRect()

  if (rect.top <= window.innerHeight + 300) {
    void fetchProducts()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function getBadgeLabel(badges: string[]): string {
  if (badges.includes('SALE')) return 'Акція'
  if (badges.includes('NEW')) return 'Новинка'
  if (badges.includes('HIT')) return 'Хіт'
  return ''
}

function getMainImage(product: Product): string {
  if (!product.images.length) return ''
  const mainImage = product.images.find((image) => image.isMain)
  return mainImage?.url || product.images[0]?.url || ''
}

const inquiryOpen = ref(false)
const inquiryProductTitle = ref('')
const inquiryProductId = ref('')

function openInquiry(product: Product): void {
  inquiryProductTitle.value = product.title
  inquiryProductId.value = product.id
  inquiryOpen.value = true
}

function closeInquiry(): void {
  inquiryOpen.value = false
}

const isInitialSkeleton = computed(() => isLoading.value && !products.length)
const hasProducts = computed(() => products.value.length > 0)
const showEmpty = computed(() => !hasProducts.value && !isLoading.value && !isFilterChanging.value)

const contentStyle = computed(() => {
  if (lockedHeight.value) {
    return { minHeight: `${lockedHeight.value}px` }
  }
  return {}
})
</script>

<template>
  <div class="catalog-grid">
    <div class="catalog-grid__info">
      <span v-if="isInitialSkeleton" class="catalog-grid__count-skeleton shimmer" />
      <span v-else class="catalog-grid__count">{{ totalCount }} виробів</span>
    </div>

    <div ref="contentRef" class="catalog-grid__content" :style="contentStyle">
      <div v-show="isInitialSkeleton" class="catalog-grid__items">
        <div
            v-for="cardIndex in skeletonCards"
            :key="cardIndex"
            class="catalog-grid__card-skeleton"
        >
          <div class="catalog-grid__card-image shimmer" />
          <div class="catalog-grid__card-title shimmer" />
        </div>
      </div>

      <div v-show="showEmpty" class="catalog-grid__empty">
        Нічого не знайдено
      </div>

      <div v-show="hasProducts && !isInitialSkeleton" class="catalog-grid__items" :class="{ 'catalog-grid__items--loading': isFilterChanging }">
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

      <Transition name="catalog-fade">
        <div v-if="isFilterChanging" class="catalog-grid__overlay">
          <span class="catalog-grid__spinner catalog-grid__spinner--overlay" role="status" aria-label="Завантаження" />
          <div class="catalog-grid__overlay-grid">
            <div
                v-for="cardIndex in skeletonCards"
                :key="cardIndex"
                class="catalog-grid__card-skeleton"
            >
              <div class="catalog-grid__card-image shimmer" />
              <div class="catalog-grid__card-title shimmer" />
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div v-if="hasMore && hasProducts" ref="loadMoreTrigger" class="catalog-grid__trigger">
      <div v-if="isLoadingMore" class="catalog-grid__loading">
        <span class="catalog-grid__spinner" aria-hidden="true" />
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
  min-height: 20px;
}

.catalog-grid__count {
  font-size: 13px;
  color: var(--text-muted);
}

.catalog-grid__count-skeleton {
  display: block;
  width: 96px;
  height: 16px;
  border-radius: 6px;
  background: var(--bg-secondary);
}

.catalog-grid__content {
  position: relative;
  min-height: 520px;
}

.catalog-grid__items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-content: start;
  transition: opacity 0.35s ease;
}

/* Затемнення з невеликою затримкою: швидкі відповіді API не дають «блимання» */
.catalog-grid__items--loading {
  opacity: 0.4;
  pointer-events: none;
  transition-delay: 0.15s;
}

.catalog-grid__overlay {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.catalog-grid__spinner {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 3px solid rgb(128 128 128 / 0.25);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: catalog-spin 0.8s linear infinite;
}

.catalog-grid__spinner--overlay {
  position: absolute;
  top: 120px;
  left: 50%;
  width: 40px;
  height: 40px;
  margin-left: -20px;
  z-index: 1;
}

@keyframes catalog-spin {
  to {
    transform: rotate(360deg);
  }
}

.catalog-grid__overlay-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-content: start;
}

.catalog-fade-enter-active {
  transition: opacity 0.35s ease 0.15s;
}

.catalog-fade-leave-active {
  transition: opacity 0.35s ease;
}

.catalog-fade-enter-from,
.catalog-fade-leave-to {
  opacity: 0;
}

.catalog-grid__card-skeleton {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-primary);
}

.catalog-grid__card-image {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: var(--bg-secondary);
}

.catalog-grid__card-title {
  height: 42px;
  margin: 12px 16px;
  border-radius: 6px;
  background: var(--bg-secondary);
}

.catalog-grid__empty {
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 15px;
  color: var(--text-muted);
}

.catalog-grid__trigger {
  height: 40px;
}

.catalog-grid__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px 0;
  font-size: 14px;
  color: var(--text-muted);
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
      90deg,
      transparent 0%,
      rgb(255 255 255 / 0.2) 50%,
      transparent 100%
  );
  animation: shimmer 1.6s ease-in-out infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer::after {
    animation: none;
  }
}

@media (max-width: 1024px) {
  .catalog-grid__items,
  .catalog-grid__overlay-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .catalog-grid__content {
    min-height: 420px;
  }

  .catalog-grid__empty {
    min-height: 420px;
  }
}

@media (max-width: 480px) {
  .catalog-grid__content {
    min-height: 320px;
  }

  .catalog-grid__empty {
    min-height: 320px;
  }

  .catalog-grid__card-title {
    margin: 8px 12px;
    height: 36px;
  }
}
</style>