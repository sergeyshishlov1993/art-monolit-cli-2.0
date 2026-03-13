<script setup lang="ts">
import { useCategoryStore } from '~/modules/category/CategoryStore'
import { useTargetGroupStore } from '~/modules/target-group/TargetGroupStore'
import { useMaterialStore } from '~/modules/material/MaterialStore'
import { useSlug } from '~/modules/common/composables/useSlug'

interface ExistingImage {
  id: string
  url: string
}

interface PortfolioFormData {
  categoryId: string
  targetGroupIds: string[]
  materialIds: string[]
  sortOrder: number
  isActive: boolean
}

const props = withDefaults(defineProps<{
  initialData?: Partial<PortfolioFormData>
  initialPhoto?: ExistingImage | null
  submitLabel?: string
  backLabel?: string
  backTo?: string
  pageTitle?: string
  pageDesc?: string
  multiple?: boolean
  showSettings?: boolean
  showDelete?: boolean
  isSaving?: boolean
  isDeleting?: boolean
  uploadProgress?: { current: number; total: number } | null
}>(), {
  initialData: () => ({}),
  initialPhoto: null,
  submitLabel: 'Створити роботу',
  backLabel: 'Портфолiо',
  backTo: '',
  pageTitle: 'Нова робота',
  pageDesc: '',
  multiple: false,
  showSettings: false,
  showDelete: false,
  isSaving: false,
  isDeleting: false,
  uploadProgress: null,
})

const emit = defineEmits<{
  save: [data: PortfolioFormData, files: File[], deletePhoto: boolean]
  delete: []
}>()

const { toSlug } = useSlug()
const categoryStore = useCategoryStore()
const targetGroupStore = useTargetGroupStore()
const materialStore = useMaterialStore()

await useAsyncData('admin-portfolio-form', async () => {
  await Promise.all([
    categoryStore.categories.length ? null : categoryStore.fetchAll(true),
    targetGroupStore.targetGroups.length ? null : targetGroupStore.fetchAll(),
    materialStore.materials.length ? null : materialStore.fetchAll(),
  ])
  return true
})

const categoryOptions = computed(() =>
    categoryStore.categories.map(category => ({ value: category.id, label: category.name }))
)

const targetGroupOptions = computed(() =>
    targetGroupStore.targetGroups.map(group => ({ value: group.id, label: group.name }))
)

const materialOptions = computed(() =>
    materialStore.materials.map(material => ({ value: material.id, label: material.name }))
)

const form = reactive<PortfolioFormData>({
  categoryId: props.initialData.categoryId || categoryStore.categories[0]?.id || '',
  targetGroupIds: props.initialData.targetGroupIds || [],
  materialIds: props.initialData.materialIds || [],
  sortOrder: props.initialData.sortOrder ?? 0,
  isActive: props.initialData.isActive ?? true,
})

const files = ref<File[]>([])
const existingPhoto = ref<ExistingImage | null>(props.initialPhoto ? { ...props.initialPhoto } : null)
const deleteExistingPhoto = ref(false)
const showDeleteConfirm = ref(false)

const newTargetGroupName = ref('')
const isAddingTargetGroup = ref(false)
const targetGroupSaving = ref(false)

const newMaterialName = ref('')
const isAddingMaterial = ref(false)
const materialSaving = ref(false)

const hasExistingVisible = computed(() =>
    existingPhoto.value !== null && !deleteExistingPhoto.value
)

const canSubmit = computed(() => {
  if (!form.categoryId) return false
  if (props.multiple) return files.value.length > 0
  return files.value.length > 0 || hasExistingVisible.value
})

function removeExistingPhoto() {
  deleteExistingPhoto.value = true
}

function toggleTargetGroup(targetGroupId: string) {
  const index = form.targetGroupIds.indexOf(targetGroupId)
  if (index === -1) {
    form.targetGroupIds.push(targetGroupId)
  } else {
    form.targetGroupIds.splice(index, 1)
  }
}

function toggleMaterial(materialId: string) {
  const index = form.materialIds.indexOf(materialId)
  if (index === -1) {
    form.materialIds.push(materialId)
  } else {
    form.materialIds.splice(index, 1)
  }
}

async function addTargetGroup() {
  const name = newTargetGroupName.value.trim()
  if (!name) return
  targetGroupSaving.value = true
  try {
    const created = await targetGroupStore.create(name, toSlug(name))
    form.targetGroupIds.push(created.id)
    newTargetGroupName.value = ''
    isAddingTargetGroup.value = false
  } finally {
    targetGroupSaving.value = false
  }
}

async function addMaterial() {
  const name = newMaterialName.value.trim()
  if (!name) return
  materialSaving.value = true
  try {
    const created = await materialStore.create(name, toSlug(name))
    form.materialIds.push(created.id)
    newMaterialName.value = ''
    isAddingMaterial.value = false
  } finally {
    materialSaving.value = false
  }
}

function cancelAddTargetGroup() {
  isAddingTargetGroup.value = false
  newTargetGroupName.value = ''
}

function cancelAddMaterial() {
  isAddingMaterial.value = false
  newMaterialName.value = ''
}

function handleSubmit() {
  emit('save', { ...form }, [...files.value], deleteExistingPhoto.value)
}

function handleDelete() {
  emit('delete')
}
</script>

<template>
  <div class="admin-edit">
    <div class="admin-edit__header">
      <NuxtLink :to="backTo" class="admin-edit__back">
        <BIcon name="arrow-right" size="sm" style="transform: rotate(180deg)" />
        {{ backLabel }}
      </NuxtLink>
      <h1 class="admin-edit__title">{{ pageTitle }}</h1>
      <p v-if="pageDesc" class="admin-edit__desc">{{ pageDesc }}</p>
    </div>

    <form class="admin-edit__body" @submit.prevent="handleSubmit">
      <div class="admin-edit__main">
        <div class="admin-card">
          <h3 class="admin-card__title">
            Фото<template v-if="multiple"> ({{ files.length }})</template>
          </h3>

          <div v-if="hasExistingVisible" class="admin-existing-photo">
            <BPreview
                :src="existingPhoto!.url"
                alt="Поточне фото"
                removable
                aspect-ratio="3/4"
                @remove="removeExistingPhoto"
            />
          </div>

          <BFileUpload
              v-if="multiple || !hasExistingVisible"
              v-model="files"
              label="Додати фото"
              accept="image/*"
              :max-size="50"
              :multiple="multiple"
          />
        </div>
      </div>

      <div class="admin-edit__side">
        <div class="admin-card">
          <h3 class="admin-card__title">Категорiя</h3>
          <div class="admin-form">
            <BSelect
                v-model="form.categoryId"
                :options="categoryOptions"
                placeholder="Оберiть категорiю..."
                required
            />
          </div>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Матерiал</h3>
          <div v-if="materialOptions.length" class="admin-checkboxes">
            <label
                v-for="material in materialOptions"
                :key="material.value"
                class="admin-checkbox"
            >
              <input
                  type="checkbox"
                  :checked="form.materialIds.includes(material.value)"
                  @change="toggleMaterial(material.value)"
              >
              <span>{{ material.label }}</span>
            </label>
          </div>
          <div v-else class="admin-empty">Матерiали ще не додані</div>

          <div v-if="isAddingMaterial" class="admin-inline-add">
            <BInput
                v-model="newMaterialName"
                placeholder="Назва матерiалу"
                size="sm"
                @keydown.enter.prevent="addMaterial"
            />
            <div class="admin-inline-add__actions">
              <BButton type="button" size="sm" :loading="materialSaving" @click="addMaterial">
                Додати
              </BButton>
              <BButton type="button" variant="ghost" size="sm" @click="cancelAddMaterial">
                Скасувати
              </BButton>
            </div>
          </div>
          <button
              v-else
              type="button"
              class="admin-add-link"
              @click="isAddingMaterial = true"
          >
            + Додати матерiал
          </button>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Цiльова група</h3>
          <div v-if="targetGroupOptions.length" class="admin-checkboxes">
            <label
                v-for="group in targetGroupOptions"
                :key="group.value"
                class="admin-checkbox"
            >
              <input
                  type="checkbox"
                  :checked="form.targetGroupIds.includes(group.value)"
                  @change="toggleTargetGroup(group.value)"
              >
              <span>{{ group.label }}</span>
            </label>
          </div>
          <div v-else class="admin-empty">Цiльовi групи ще не додані</div>

          <div v-if="isAddingTargetGroup" class="admin-inline-add">
            <BInput
                v-model="newTargetGroupName"
                placeholder="Назва групи"
                size="sm"
                @keydown.enter.prevent="addTargetGroup"
            />
            <div class="admin-inline-add__actions">
              <BButton type="button" size="sm" :loading="targetGroupSaving" @click="addTargetGroup">
                Додати
              </BButton>
              <BButton type="button" variant="ghost" size="sm" @click="cancelAddTargetGroup">
                Скасувати
              </BButton>
            </div>
          </div>
          <button
              v-else
              type="button"
              class="admin-add-link"
              @click="isAddingTargetGroup = true"
          >
            + Додати групу
          </button>
        </div>

        <div v-if="showSettings" class="admin-card">
          <h3 class="admin-card__title">Налаштування</h3>
          <div class="admin-form">
            <BInput
                :model-value="String(form.sortOrder)"
                label="Порядок сортування"
                type="number"
                placeholder="0"
                @update:model-value="form.sortOrder = Number($event) || 0"
            />
            <label class="admin-checkbox">
              <input v-model="form.isActive" type="checkbox">
              <span>Активний (видимий на сайтi)</span>
            </label>
          </div>
        </div>

        <div class="admin-card admin-card--actions">
          <div v-if="uploadProgress" class="upload-progress">
            <div class="upload-progress__bar">
              <div
                  class="upload-progress__fill"
                  :style="{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }"
              />
            </div>
            <span class="upload-progress__text">
              {{ uploadProgress.current }} / {{ uploadProgress.total }}
            </span>
          </div>

          <BButton type="submit" block :disabled="!canSubmit || isSaving" :loading="isSaving">
            <BIcon v-if="multiple" name="upload" size="sm" />
            <BIcon v-else name="check" size="sm" />
            {{ multiple ? `Завантажити ${files.length} фото` : submitLabel }}
          </BButton>
          <BButton variant="ghost" block :to="backTo">
            Скасувати
          </BButton>
        </div>

        <div v-if="showDelete" class="admin-card">
          <BButton variant="danger" block :loading="isDeleting" @click="showDeleteConfirm = true">
            Видалити роботу
          </BButton>
        </div>
      </div>
    </form>

    <BModal v-if="showDelete" v-model="showDeleteConfirm" title="Видалити роботу?">
      <p class="admin-confirm-text">Роботу та всі її зображення буде видалено назавжди.</p>
      <template #footer>
        <BButton variant="ghost" @click="showDeleteConfirm = false">Скасувати</BButton>
        <BButton variant="danger" :loading="isDeleting" @click="handleDelete">Видалити</BButton>
      </template>
    </BModal>
  </div>
</template>

<style scoped>
.admin-edit {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-edit__header {
  margin-bottom: 32px;
}

.admin-edit__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.2s;
}

.admin-edit__back:hover {
  color: var(--gold);
}

.admin-edit__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-edit__desc {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--text-muted);
}

.admin-edit__body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

.admin-edit__main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin-edit__side {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 80px;
}

.admin-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
}

.admin-card--actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-card__title {
  margin: 0 0 20px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary);
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
}

.admin-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--gold);
  cursor: pointer;
}

.admin-empty {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.admin-existing-photo {
  max-width: 200px;
  margin-bottom: 16px;
}

.admin-inline-add {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
}

.admin-inline-add__actions {
  display: flex;
  gap: 8px;
}

.admin-add-link {
  margin-top: 12px;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.admin-add-link:hover {
  color: var(--gold-hover);
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-progress__bar {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.upload-progress__fill {
  height: 100%;
  background: var(--gold);
  transition: width 0.3s;
}

.upload-progress__text {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 50px;
  text-align: right;
}

.admin-confirm-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .admin-edit__body {
    grid-template-columns: 1fr;
  }

  .admin-edit__side {
    position: static;
  }
}
</style>