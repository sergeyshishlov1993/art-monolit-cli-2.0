<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useCategoryStore } from '~/modules/category/CategoryStore'
import { useTargetGroupStore } from '~/modules/target-group/TargetGroupStore'
import { useMaterialStore } from '~/modules/material/MaterialStore'
import { useSlug } from '~/modules/common/composables/useSlug'

interface ExistingImage {
  id: string
  url: string
}

interface PortfolioFormData {
  title: string
  description: string
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
}>(), {
  initialData: () => ({}),
  initialPhoto: null,
  submitLabel: 'Створити роботу',
  backLabel: 'Портфолiо',
  backTo: '',
  pageTitle: 'Нова робота',
})

const emit = defineEmits<{
  save: [data: PortfolioFormData, photo: File | null, deletePhoto: boolean]
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
  title: props.initialData.title || '',
  description: props.initialData.description || '',
  categoryId: props.initialData.categoryId || categoryStore.categories[0]?.id || '',
  targetGroupIds: props.initialData.targetGroupIds || [],
  materialIds: props.initialData.materialIds || [],
  sortOrder: props.initialData.sortOrder ?? 0,
  isActive: props.initialData.isActive ?? true,
})

const photo = ref<File | null>(null)
const existingPhoto = ref<ExistingImage | null>(props.initialPhoto ? { ...props.initialPhoto } : null)
const deleteExistingPhoto = ref(false)
const isSaving = ref(false)

const newTargetGroupName = ref('')
const isAddingTargetGroup = ref(false)
const targetGroupSaving = ref(false)

const newMaterialName = ref('')
const isAddingMaterial = ref(false)
const materialSaving = ref(false)

const photoPreview = computed(() => {
  if (photo.value) return URL.createObjectURL(photo.value)
  if (existingPhoto.value && !deleteExistingPhoto.value) return existingPhoto.value.url
  return null
})

function onFileChange(files: File[]) {
  const file = files[0]
  if (file) {
    photo.value = file
    deleteExistingPhoto.value = true
  }
}

function removePhoto() {
  photo.value = null
  if (existingPhoto.value) {
    deleteExistingPhoto.value = true
  }
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
  isSaving.value = true
  emit('save', { ...form }, photo.value, deleteExistingPhoto.value)
  isSaving.value = false
}

defineExpose({ isSaving })
</script>

<template>
  <div class="admin-edit">
    <div class="admin-edit__header">
      <NuxtLink :to="backTo" class="admin-edit__back">
        <BIcon name="arrow-right" size="sm" style="transform: rotate(180deg)" />
        {{ backLabel }}
      </NuxtLink>
      <h1 class="admin-edit__title">{{ pageTitle }}</h1>
    </div>

    <form class="admin-edit__body" @submit.prevent="handleSubmit">
      <div class="admin-edit__main">
        <div class="admin-card">
          <h3 class="admin-card__title">Основне</h3>
          <div class="admin-form">
            <BInput v-model="form.title" label="Назва" placeholder="Памятник Класика" required />
            <BTextarea v-model="form.description" label="Опис" placeholder="Опис роботи..." />
          </div>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Фото</h3>

          <div v-if="photoPreview" class="admin-single-photo">
            <img :src="photoPreview" alt="Фото роботи" class="admin-single-photo__img" />
            <div class="admin-single-photo__overlay">
              <button
                  type="button"
                  class="admin-photo__btn admin-photo__btn--danger"
                  title="Видалити"
                  @click="removePhoto"
              >
                <BIcon name="trash" size="sm" />
              </button>
            </div>
          </div>

          <BFileUpload
              v-if="!photoPreview"
              label="Завантажити фото"
              accept="image/*"
              :max-size="5"
              @update:model-value="onFileChange"
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
                label="Категорiя"
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

        <div class="admin-card">
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
          <BButton type="submit" block :loading="isSaving">
            <BIcon name="check" size="sm" />
            {{ submitLabel }}
          </BButton>
          <BButton variant="ghost" block :to="backTo">
            Скасувати
          </BButton>
        </div>
      </div>
    </form>
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

.admin-single-photo {
  position: relative;
  max-width: 320px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border);
  margin-bottom: 16px;
}

.admin-single-photo__img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}

.admin-single-photo__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--overlay);
  opacity: 0;
  transition: opacity 0.2s;
}

.admin-single-photo:hover .admin-single-photo__overlay {
  opacity: 1;
}

.admin-photo__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.admin-photo__btn:hover {
  border-color: var(--border-hover);
}

.admin-photo__btn--danger:hover {
  background: var(--error);
  border-color: var(--error);
  color: #fff;
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

@media (max-width: 1024px) {
  .admin-edit__body {
    grid-template-columns: 1fr;
  }

  .admin-edit__side {
    position: static;
  }
}
</style>