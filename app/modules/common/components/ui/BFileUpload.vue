<script setup lang="ts">
interface Props {
  modelValue?: File[]
  label?: string
  accept?: string
  multiple?: boolean
  maxSize?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  accept: 'image/*',
  multiple: false,
  maxSize: 10,
})

const emit = defineEmits<{
  'update:modelValue': [files: File[]]
}>()

const isDragging = ref(false)
const inputRef = ref<HTMLInputElement>()
const error = ref('')

const isImageAccept = computed(() => props.accept.includes('image'))

const previews = computed(() =>
    props.modelValue.map(file => ({
      name: file.name,
      size: file.size,
      url: isImageAccept.value ? URL.createObjectURL(file) : '',
    }))
)

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function validate(files: File[]): File[] {
  error.value = ''
  const maxBytes = props.maxSize * 1024 * 1024
  const valid = files.filter(file => {
    if (file.size > maxBytes) {
      error.value = `Файл "${file.name}" перевищує ${props.maxSize} MB`
      return false
    }
    return true
  })
  return valid
}

function handleFiles(fileList: FileList | null) {
  if (!fileList) return
  const newFiles = validate(Array.from(fileList))
  if (!newFiles.length) return

  if (props.multiple) {
    emit('update:modelValue', [...props.modelValue, ...newFiles])
  } else {
    emit('update:modelValue', [newFiles[0]])
  }
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  handleFiles(event.dataTransfer?.files ?? null)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  handleFiles(target.files)
  target.value = ''
}

function removeFile(index: number) {
  const prev = previews.value[index]
  if (prev?.url) URL.revokeObjectURL(prev.url)

  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

function openPicker() {
  if (!props.disabled) inputRef.value?.click()
}

onBeforeUnmount(() => {
  previews.value.forEach(p => {
    if (p.url) URL.revokeObjectURL(p.url)
  })
})
</script>

<template>
  <div class="b-upload">
    <label v-if="props.label" class="b-upload__label">{{ props.label }}</label>

    <div
        class="b-upload__zone"
        :class="[
        isDragging ? 'b-upload__zone--drag' : '',
        props.disabled ? 'b-upload__zone--disabled' : '',
      ]"
        @click="openPicker"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
    >
      <input
          ref="inputRef"
          type="file"
          :accept="props.accept"
          :multiple="props.multiple"
          class="b-upload__input"
          @change="onInput"
      >
      <svg style="width: 32px; height: 32px; color: var(--text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 16V4m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div class="b-upload__text">
        <span class="b-upload__action">Натисніть або перетягніть</span>
        <span class="b-upload__hint">{{ isImageAccept ? 'PNG, JPG, WEBP' : props.accept }} до {{ props.maxSize }} MB</span>
      </div>
    </div>

    <span v-if="error" class="b-upload__error">{{ error }}</span>

    <div v-if="previews.length" class="b-upload__previews">
      <div v-for="(preview, index) in previews" :key="index" class="b-upload__preview">

        <BPreview
            :key="`new-${index}`"
            :src="preview.url"
            :alt="`Фото ${index + 1}`"
            removable
            aspect-ratio="3/4"
            @remove="removeFile(index)"
        />
<!--        <div class="b-upload__preview-img-wrap">-->
<!--          <img-->
<!--              v-if="preview.url"-->
<!--              :src="preview.url"-->
<!--              :alt="preview.name"-->
<!--              class="b-upload__preview-img"-->
<!--          >-->
<!--          <div v-else class="b-upload__preview-placeholder">-->
<!--            <svg style="width: 24px; height: 24px; color: var(&#45;&#45;text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">-->
<!--              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" stroke-linecap="round" stroke-linejoin="round" />-->
<!--            </svg>-->
<!--          </div>-->
<!--          <button type="button" class="b-upload__preview-remove" @click.stop="removeFile(index)">-->
<!--            <svg style="width: 12px; height: 12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">-->
<!--              <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />-->
<!--            </svg>-->
<!--          </button>-->
<!--        </div>-->
        <div class="b-upload__preview-info">
          <span class="b-upload__preview-name">{{ preview.name }}</span>
          <span class="b-upload__preview-size">{{ formatSize(preview.size) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.b-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.b-upload__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.b-upload__zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 20px;
  border: 2px dashed var(--border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.b-upload__zone:hover {
  border-color: var(--gold);
}

.b-upload__zone--drag {
  border-color: var(--gold);
  background: rgba(212, 175, 55, 0.05);
}

.b-upload__zone--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.b-upload__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  pointer-events: none;
}

.b-upload__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.b-upload__action {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.b-upload__hint {
  font-size: 12px;
  color: var(--text-muted);
}

.b-upload__error {
  font-size: 12px;
  color: #ef4444;
}

.b-upload__previews {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.b-upload__preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 96px;
}

.b-upload__preview-img-wrap {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-card);
}

.b-upload__preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.b-upload__preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.b-upload__preview-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.b-upload__preview-remove:hover {
  background: #ef4444;
}

.b-upload__preview-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.b-upload__preview-name {
  font-size: 11px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.b-upload__preview-size {
  font-size: 10px;
  color: var(--text-muted);
}
</style>