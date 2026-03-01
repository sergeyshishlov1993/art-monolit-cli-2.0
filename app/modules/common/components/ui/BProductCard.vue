<script setup lang="ts">
import { ROUTES } from '~/modules/common/constants/routes'

interface Props {
  image: string
  title: string
  slug: string
  category: string
  alt?: string
  badge?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  badge: '',
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

      <span class="product-card__title">{{ props.title }}</span>
    </NuxtLink>

    <div class="product-card__actions">
      <button
          type="button"
          class="product-card__btn"
          @click="emit('inquiry')"
      >
        Дізнатись вартість
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  border-color: var(--gold);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.1);
}

.product-card__link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.product-card__image-wrap {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
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

.product-card__title {
  padding: 12px 16px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.product-card__actions {
  padding: 12px 16px 16px;
}

.product-card__btn {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background: #d32f2f;
  color: #fff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(153, 0, 24, 0.3);
}

.product-card__btn:hover {
  background: #b3001c;
}
</style>