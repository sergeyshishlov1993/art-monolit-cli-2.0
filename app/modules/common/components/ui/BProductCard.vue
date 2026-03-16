<!--<script setup lang="ts">-->
<!--import { ROUTES } from '~/modules/common/constants/routes'-->

<!--interface Props {-->
<!--  image: string-->
<!--  title: string-->
<!--  slug: string-->
<!--  category: string-->
<!--  alt?: string-->
<!--  badge?: string-->
<!--  imageType?: 'portrait' | 'landscape'-->
<!--}-->

<!--const props = withDefaults(defineProps<Props>(), {-->
<!--  alt: '',-->
<!--  badge: '',-->
<!--  imageType: 'landscape',-->
<!--})-->

<!--const emit = defineEmits<{-->
<!--  inquiry: []-->
<!--}>()-->

<!--const badgeClass = computed(() => {-->
<!--  const text = props.badge?.toLowerCase() || ''-->
<!--  if (text.includes('%') || text.includes('акція')) return 'product-card__badge&#45;&#45;sale'-->
<!--  if (text.includes('новинка') || text.includes('new')) return 'product-card__badge&#45;&#45;new'-->
<!--  if (text.includes('хіт') || text.includes('hit') || text.includes('топ')) return 'product-card__badge&#45;&#45;hit'-->
<!--  return ''-->
<!--})-->
<!--</script>-->

<!--<template>-->
<!--  <div class="product-card">-->
<!--    <NuxtLink-->
<!--        :to="ROUTES.CATALOG_PRODUCT(props.category, props.slug)"-->
<!--        class="product-card__link"-->
<!--    >-->
<!--      <div class="product-card__image-wrap">-->
<!--        <img-->
<!--            v-if="props.image"-->
<!--            :src="props.image"-->
<!--            :alt="props.alt || props.title"-->
<!--            class="product-card__image"-->
<!--            loading="lazy"-->
<!--        />-->
<!--        <div v-else class="product-card__placeholder">Немає фото</div>-->

<!--        <div v-if="props.badge" class="product-card__badge" :class="badgeClass">-->
<!--          {{ props.badge }}-->
<!--        </div>-->
<!--      </div>-->

<!--      <span class="product-card__title">{{ props.title }}</span>-->
<!--    </NuxtLink>-->

<!--    <div class="product-card__actions">-->
<!--      <button-->
<!--          type="button"-->
<!--          class="product-card__btn"-->
<!--          @click="emit('inquiry')"-->
<!--      >-->
<!--        Дізнатись ціну-->
<!--      </button>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped>-->
<!--.product-card {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  border-radius: 8px;-->
<!--  overflow: hidden;-->
<!--  border: 1px solid var(&#45;&#45;border);-->
<!--  transition: border-color 0.2s, box-shadow 0.2s;-->
<!--}-->

<!--.product-card:hover {-->
<!--  border-color: var(&#45;&#45;gold);-->
<!--  box-shadow: 0 4px 16px rgb(0 0 0 / 0.1);-->
<!--}-->

<!--.product-card__link {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  text-decoration: none;-->
<!--  color: inherit;-->
<!--}-->

<!--.product-card__image-wrap {-->
<!--  position: relative;-->
<!--  height: 220px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  background: var(&#45;&#45;bg-secondary);-->
<!--  overflow: hidden;-->
<!--}-->

<!--.product-card__image {-->
<!--  max-width: 100%;-->
<!--  max-height: 100%;-->
<!--  width: auto;-->
<!--  height: auto;-->
<!--  transition: transform 0.3s;-->
<!--}-->

<!--.product-card:hover .product-card__image {-->
<!--  transform: scale(1.05);-->
<!--}-->

<!--.product-card__placeholder {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--  font-size: 13px;-->
<!--}-->

<!--.product-card__badge {-->
<!--  position: absolute;-->
<!--  top: 12px;-->
<!--  left: 12px;-->
<!--  background: #333333;-->
<!--  color: #ffffff;-->
<!--  padding: 6px 12px;-->
<!--  font-size: 11px;-->
<!--  font-weight: 700;-->
<!--  text-transform: uppercase;-->
<!--  letter-spacing: 0.05em;-->
<!--  border-radius: 2px;-->
<!--}-->

<!--.product-card__badge&#45;&#45;sale {-->
<!--  background: #d32f2f;-->
<!--}-->

<!--.product-card__badge&#45;&#45;new {-->
<!--  background: #2e7d32;-->
<!--}-->

<!--.product-card__badge&#45;&#45;hit {-->
<!--  background: #ed6c02;-->
<!--}-->

<!--.product-card__title {-->
<!--  padding: 12px 16px 0;-->
<!--  font-size: 13px;-->
<!--  font-weight: 600;-->
<!--  color: var(&#45;&#45;text-primary);-->
<!--  flex-grow: 1;-->
<!--}-->

<!--.product-card__actions {-->
<!--  padding: 12px 16px 16px;-->
<!--}-->

<!--.product-card__btn {-->
<!--  width: 100%;-->
<!--  padding: 10px 16px;-->
<!--  border: none;-->
<!--  border-radius: 4px;-->
<!--  background: #d32f2f;-->
<!--  color: #fff;-->
<!--  font-family: inherit;-->
<!--  font-size: 12px;-->
<!--  font-weight: 700;-->
<!--  letter-spacing: 0.06em;-->
<!--  text-transform: uppercase;-->
<!--  cursor: pointer;-->
<!--  transition: background 0.2s;-->
<!--  box-shadow: 0 2px 8px rgba(153, 0, 24, 0.3);-->
<!--}-->

<!--.product-card__btn:hover {-->
<!--  background: #b3001c;-->
<!--}-->

<!--@media (max-width: 480px) {-->

<!--  .product-card__actions {-->
<!--    padding: 2px-->
<!--  }-->

<!--  .product-card__image-wrap {-->
<!--    height: 160px;-->
<!--  }-->

<!--  .product-card__btn {-->
<!--    padding: 8px 12px;-->
<!--    font-size: 11px;-->
<!--  }-->
<!--}-->
<!--</style>-->

<script setup lang="ts">
import { ROUTES } from '~/modules/common/constants/routes'

interface Props {
  image: string
  title: string
  slug: string
  category: string
  alt?: string
  badge?: string
  imageType?: 'portrait' | 'landscape'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  badge: '',
  imageType: 'landscape',
})

const emit = defineEmits<{
  inquiry: []
}>()

const badgeClass = computed(() => {
  const text = props.badge?.toLowerCase() || ''
  if (text.includes('%') || text.includes('акція')) return 'product-card__badge--sale'
  if (text.includes('новинка') || text.includes('new')) return 'product-card__badge--new'
  if (text.includes('хіт') || text.includes('hit') || text.includes('топ')) return 'product-card__badge--hit'
  return ''
})
</script>

<template>
  <div class="product-card">
    <NuxtLink
        :to="ROUTES.CATALOG_PRODUCT(props.category, props.slug)"
        class="product-card__link"
    >
      <div class="product-card__image-wrap">
        <img
            v-if="props.image"
            :src="props.image"
            :alt="props.alt || props.title"
            class="product-card__image"
            loading="lazy"
        />
        <div v-else class="product-card__placeholder">Немає фото</div>

        <div v-if="props.badge" class="product-card__badge" :class="badgeClass">
          {{ props.badge }}
        </div>
      </div>
    </NuxtLink>

    <div class="product-card__footer">
      <span class="product-card__title">{{ props.title }}</span>
      <button
          type="button"
          class="product-card__btn"
          @click="emit('inquiry')"
      >
        <svg class="product-card__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>Дізнатись ціну</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.product-card__link {
  display: flex;
  text-decoration: none;
  color: inherit;
}

.product-card__image-wrap {
  position: relative;
  height: 280px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.product-card__image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  transition: transform 0.3s;
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 13px;
}

.product-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #333333;
  color: #ffffff;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 2px;
}

.product-card__badge--sale {
  background: #d32f2f;
}

.product-card__badge--new {
  background: #2e7d32;
}

.product-card__badge--hit {
  background: #ed6c02;
}

.product-card__footer {
  padding: 16px;
  background: rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-card__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
}

.product-card__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  background: var(--gold);
  color: #ffffff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.product-card__btn:hover {
  background: var(--gold-hover);
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
}

.product-card__btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .product-card:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  .product-card:hover .product-card__image {
    transform: scale(1);
  }

  .product-card__btn:hover {
    background: #d4af37;
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
  }

  .product-card__image-wrap {
    height: 200px;
    border-radius: 8px 8px 0 0;
  }

  .product-card {
    border-radius: 8px;
  }

  .product-card__footer {
    padding: 6px;
    gap: 10px;
  }

  .product-card__title {
    font-size: 12px;
  }

  .product-card__btn {
    padding: 8px 12px;
    font-size: 11px;
    gap: 6px;
  }

  .product-card__btn-icon {
    width: 14px;
    height: 14px;
  }
}
</style>