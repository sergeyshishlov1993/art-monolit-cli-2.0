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
        Дізнатись ціну
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
  border: 2px solid #d32f2f;
  border-radius: 6px;
  background: transparent;
  color: #d32f2f;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card__btn:hover {
  background: #d32f2f;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
}

.product-card__btn-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 480px) {
  .product-card__image-wrap {
    height: 200px;
    border-radius: 8px 8px 0 0;
  }

  .product-card {
    border-radius: 8px;
  }

  .product-card__footer {
    padding: 12px;
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

