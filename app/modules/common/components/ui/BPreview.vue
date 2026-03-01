<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  fit?: 'cover' | 'contain' | 'fill'
  aspectRatio?: string
  removable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  fit: 'cover',
  aspectRatio: '16/9',
})

const emit = defineEmits<{
  remove: []
}>()

const isZoomed = ref(false)
</script>

<template>
  <div class="b-preview">
    <div class="b-preview__container" :style="{ aspectRatio: props.aspectRatio }">
      <img
        :src="props.src"
        :alt="props.alt"
        class="b-preview__image"
        :style="{ objectFit: props.fit }"
        @click="isZoomed = true"
      />
      <button v-if="props.removable" type="button" class="b-preview__remove" @click="emit('remove')">
        <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="zoom">
        <div v-if="isZoomed" class="b-preview__zoom" @click="isZoomed = false">
          <img :src="props.src" :alt="props.alt" class="b-preview__zoom-img" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.b-preview__container {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--bg-card);
}

.b-preview__image {
  width: 100%;
  height: 100%;
  display: block;
  cursor: zoom-in;
  transition: transform 0.3s;
}

.b-preview__container:hover .b-preview__image {
  transform: scale(1.03);
}

.b-preview__remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.b-preview__container:hover .b-preview__remove {
  opacity: 1;
}

.b-preview__remove:hover {
  background: #ef4444;
}

.b-preview__zoom {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  cursor: zoom-out;
  padding: 40px;
}

.b-preview__zoom-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: opacity 0.2s;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
}
</style>
