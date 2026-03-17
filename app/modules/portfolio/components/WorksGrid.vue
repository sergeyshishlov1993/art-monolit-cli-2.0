<script setup lang="ts">
import { usePortfolioApi } from '~/modules/portfolio/PortfolioApi'
import type { PortfolioWork } from '~/modules/portfolio/types'
import WorksCard from './WorksCard.vue'
import WorksOverlay from './WorksOverlay.vue'
import WorksInquiryModal from './WorksInquiryModal.vue'

interface WorkFilters {
  search: string
  category: string
  material: string
}

const props = defineProps<{
  filters: WorkFilters
  initialWorkId?: string
}>()

const portfolioApi = usePortfolioApi()

const works = ref<PortfolioWork[]>([])
const isLoading = ref(false)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)
const isFetching = ref(false)
const limit = 12

async function fetchWorks(reset = false) {
  if (isFetching.value) return

  if (!reset && !hasMore.value) return

  isFetching.value = true

  if (reset) {
    if (works.value.length === 0) {
      isLoading.value = true
    } else {
      isRefreshing.value = true
    }
    currentPage.value = 1
    hasMore.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const response = await portfolioApi.getAll({
      categoryId: props.filters.category || undefined,
      material: props.filters.material || undefined,
      search: props.filters.search || undefined,
      page: currentPage.value,
      limit,
    })

    if (reset) {
      works.value = response.items
    } else {
      works.value.push(...response.items)
    }

    hasMore.value = response.hasMore
    currentPage.value = reset ? 2 : currentPage.value + 1
  } finally {
    isLoading.value = false
    isRefreshing.value = false
    isLoadingMore.value = false
    isFetching.value = false
  }
}

const { data: initialData } = await useAsyncData('portfolio-works', () =>
    portfolioApi.getAll({ page: 1, limit })
)

if (initialData.value) {
  works.value = initialData.value.items
  hasMore.value = initialData.value.hasMore
  currentPage.value = 2
}

watch(
    () => props.filters,
    () => fetchWorks(true),
    { deep: true }
)

const loadMoreTrigger = ref<HTMLElement | null>(null)

function onScroll() {
  if (!loadMoreTrigger.value) return
  if (!hasMore.value) return
  if (isFetching.value) return

  const rect = loadMoreTrigger.value.getBoundingClientRect()

  if (rect.top <= window.innerHeight + 300) {
    fetchWorks()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const overlayOpen = ref(false)
const overlayIndex = ref(0)

function openOverlay(index: number) {
  overlayIndex.value = index
  overlayOpen.value = true
}

function openOverlayById(workId: string) {
  const index = works.value.findIndex((work) => work.id === workId)
  if (index !== -1) {
    openOverlay(index)
  }
}

const initialOpenHandled = ref(false)

watch(
    () => works.value,
    (newWorks) => {
      if (initialOpenHandled.value) return
      if (!props.initialWorkId) return
      if (newWorks.length === 0) return
      if (!import.meta.client) return

      openOverlayById(props.initialWorkId)
      initialOpenHandled.value = true
    },
    { immediate: true }
)

const inquiryOpen = ref(false)
const inquiryWork = ref<PortfolioWork | null>(null)

function openInquiry(work: PortfolioWork) {
  inquiryWork.value = work
  inquiryOpen.value = true
}

function handleLoadMore() {
  if (!isFetching.value && hasMore.value) {
    fetchWorks()
  }
}
</script>

<template>
  <div class="works-grid-wrap">
    <div v-if="isLoading" class="works-grid__empty">
      Завантаження...
    </div>

    <template v-else>
      <div v-if="!works.length" class="works-grid__empty">
        Нічого не знайдено
      </div>

      <div v-else class="works-grid-wrap__content">
        <div class="works-grid" :class="{ 'works-grid--refreshing': isRefreshing }">
          <WorksCard
              v-for="(work, index) in works"
              :key="work.id"
              :work="work"
              @click="openOverlay(index)"
          />
        </div>

        <div v-if="isRefreshing" class="works-grid__refreshing">
          Завантаження...
        </div>
      </div>
    </template>

    <div v-if="hasMore && works.length > 0" ref="loadMoreTrigger" class="works-grid__trigger">
      <div v-if="isLoadingMore" class="works-grid__loading">
        Завантаження...
      </div>
    </div>

    <WorksOverlay
        v-model="overlayOpen"
        :works="works"
        :initial-index="overlayIndex"
        :has-more="hasMore"
        @load-more="handleLoadMore"
        @inquiry="openInquiry"
    />

    <WorksInquiryModal
        v-model="inquiryOpen"
        :work="inquiryWork"
    />
  </div>
</template>

<style scoped>
.works-grid-wrap__content {
  position: relative;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.works-grid--refreshing {
  opacity: 0.45;
  transition: opacity 0.2s;
}

.works-grid__refreshing {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: var(--text-muted);
  background: rgb(255 255 255 / 0.35);
  backdrop-filter: blur(1px);
}

.works-grid__empty {
  text-align: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--text-muted);
}

.works-grid__trigger {
  height: 40px;
}

.works-grid__loading {
  text-align: center;
  padding: 32px 0;
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>