<script setup lang="ts">
import { useProductApi } from '~/modules/product/ProductApi'
import { ROUTES } from '~/modules/common/constants/routes'
import ProductGallery from '~/modules/product/components/ProductGallery.vue'
import ProductTabs from '~/modules/product/components/ProductTabs.vue'
import ProductAdvantages from '~/modules/product/components/ProductAdvantages.vue'
import ProductBottomCta from '~/modules/product/components/ProductBottomCta.vue'
import ProductStickyBar from '~/modules/product/components/ ProductStickyBar.vue'


definePageMeta({ layout: 'default' })

const route = useRoute()
const productApi = useProductApi()

const showStickyBtn = ref(false)
const visibleSections = ref<Set<string>>(new Set())
const inquiryOpen = ref(false)

const slug = computed(() => String(route.params.slug))

const { data: product } = await useAsyncData(`product-${slug.value}`, () =>
    productApi.getBySlug(slug.value)
)

const siteUrl = useRuntimeConfig().public.siteUrl

useSeoMeta({
  title: () => product.value?.seoTitle || `${product.value?.title} — Арт Моноліт`,
  description: () => product.value?.seoDescription || product.value?.description || '',
  ogType: 'product',
  ogTitle: () => product.value?.seoTitle || `${product.value?.title} — Арт Моноліт`,
  ogDescription: () => product.value?.seoDescription || product.value?.description || '',
  ogImage: () => product.value?.images?.[0] || `${siteUrl}/og-image.jpg`,
  ogUrl: () => `${siteUrl}/catalog/${slug.value}`,
  ogLocale: 'uk_UA',
  ogSiteName: 'Арт Моноліт',
  twitterCard: 'summary_large_image',
  twitterTitle: () => product.value?.seoTitle || `${product.value?.title} — Арт Моноліт`,
  twitterDescription: () => product.value?.seoDescription || product.value?.description || '',
  twitterImage: () => product.value?.images?.[0] || `${siteUrl}/og-image.jpg`,
})

const quickFacts = [
  { icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Гарантія 25 років' },
  { icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12', text: 'Безкоштовна доставка' },
  { icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Від 25 днів' },
]

function openInquiry() {
  inquiryOpen.value = true
}

function closeInquiry() {
  inquiryOpen.value = false
}

function handleScroll() {
  showStickyBtn.value = window.scrollY > 400
}

function observeSections() {
  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.value.add(entry.target.id)
          }
        })
      },
      { threshold: 0.1 },
  )

  document.querySelectorAll('[data-animate]').forEach((el) => {
    observer.observe(el)
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  observeSections()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="product-page">
    <template v-if="product">
      <BBreadcrumbs
          :items="[
          { label: 'Каталог', to: ROUTES.CATALOG },
          { label: product.category?.name, to: ROUTES.CATALOG_CATEGORY(product.category?.slug) },
          { label: product.title },
        ]"
      />

      <div class="product-page__body">
        <ProductGallery :product="product" />

        <div class="product-page__info">
          <NuxtLink
              v-if="product.category"
              :to="ROUTES.CATALOG_CATEGORY(product.category.slug)"
              class="product-page__category-link"
          >
            {{ product.category.name }}
          </NuxtLink>

          <h1 class="product-page__title">{{ product.title }}</h1>

          <div class="product-page__status">
            <span class="product-page__stock">В наявності</span>
            <span class="product-page__sku">Код: {{ product.id.slice(0, 8).toUpperCase() }}</span>
          </div>

          <div class="product-page__quick-facts">
            <div v-for="fact in quickFacts" :key="fact.text" class="product-page__quick-fact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path :d="fact.icon" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>{{ fact.text }}</span>
            </div>
          </div>

          <BButton variant="primary" size="lg" class="product-page__cta" @click="openInquiry">
            Дізнатися ціну
          </BButton>

          <ProductTabs :product="product" />
        </div>
      </div>

      <ProductAdvantages
          id="advantages"
          data-animate
          :visible="visibleSections.has('advantages')"
      />

      <ProductBottomCta
          id="bottom-cta"
          data-animate
          :visible="visibleSections.has('bottom-cta')"
          @inquiry="openInquiry"
      />

      <ProductStickyBar
          :title="product.title"
          :visible="showStickyBtn"
          @inquiry="openInquiry"
      />
    </template>

    <div v-else class="product-page__not-found">
      <p>Товар не знайдено</p>
      <BButton :to="ROUTES.CATALOG">Повернутися до каталогу</BButton>
    </div>

    <BModal v-model="inquiryOpen" title="Дізнатися ціну">
      <BLeadForm
          source="product_page"
          :product-id="product?.id"
          :product-title="product?.title"
          @success="closeInquiry"
      />
    </BModal>
  </div>
</template>

<style scoped>
.product-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

.product-page__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: start;
  margin-top: 24px;
}

.product-page__info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-page__category-link {
  display: inline-block;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gold);
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  text-decoration: none;
  width: fit-content;
  transition: background 0.2s ease;
}

.product-page__category-link:hover {
  background: rgba(212, 175, 55, 0.2);
}

.product-page__title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--text-primary);
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.product-page__status {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-page__stock {
  padding: 5px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #2e7d32;
  border-radius: 4px;
}

.product-page__sku {
  font-size: 13px;
  color: var(--text-muted);
  font-family: monospace;
}

.product-page__quick-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.product-page__quick-fact {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.product-page__quick-fact svg {
  width: 18px;
  height: 18px;
  color: var(--gold);
  flex-shrink: 0;
}

.product-page__cta {
  width: 100%;
  margin-top: 8px;
}

.product-page__not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 100px 24px;
  color: var(--text-muted);
  font-size: 18px;
}

@media (max-width: 900px) {
  .product-page__body {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .product-page__title {
    font-size: 26px;
  }
}

@media (max-width: 600px) {
  .product-page {
    padding: 24px 16px 120px;
  }

  .product-page__title {
    font-size: 22px;
  }

  .product-page__quick-facts {
    padding: 16px;
  }

  .product-page__quick-fact {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>