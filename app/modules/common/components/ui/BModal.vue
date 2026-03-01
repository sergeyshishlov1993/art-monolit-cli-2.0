<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  if (!props.persistent) {
    emit('update:modelValue', false)
  }
}

function onBackdrop() {
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="props.modelValue" class="b-modal__backdrop" @click.self="onBackdrop">
        <div class="b-modal" :class="`b-modal--${props.size}`">
          <div class="b-modal__header">
            <h3 class="b-modal__title">{{ props.title }}</h3>
            <button type="button" class="b-modal__close" @click="close">
              <svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="b-modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="b-modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.b-modal__backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--overlay);
  padding: 20px;
}

.b-modal {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 4px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
}

.b-modal--sm { max-width: 400px; }
.b-modal--md { max-width: 560px; }
.b-modal--lg { max-width: 720px; }
.b-modal--xl { max-width: 960px; }

.b-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.b-modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.03em;
}

.b-modal__close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
  display: flex;
}

.b-modal__close:hover {
  color: var(--text-primary);
}

.b-modal__body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.b-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-active .b-modal,
.modal-leave-active .b-modal {
  transition: transform 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .b-modal,
.modal-leave-to .b-modal {
  transform: scale(0.95) translateY(10px);
}
</style>
