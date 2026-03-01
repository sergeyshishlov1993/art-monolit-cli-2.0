<script setup lang="ts">
import {useQuickContact} from "~/modules/common/composables/useQuickContact";
const { isOpen: isQuickContactOpen } = useQuickContact()

const isVisible = ref(false)

const shouldShow = computed(() => isVisible.value && !isQuickContactOpen.value)

function checkScroll() {
  isVisible.value = window.scrollY > 400
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template><Transition name="scroll-top">
  <button v-show="shouldShow" class="scroll-top" aria-label="Наверх" @click="scrollTop">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  </button>
</Transition>
</template>

<style scoped>
.scroll-top {
  position: fixed;
  bottom: 100px;
  right: 24px;
  z-index: 49;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.scroll-top:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: all 0.3s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .scroll-top {
    bottom: 80px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
}
</style>