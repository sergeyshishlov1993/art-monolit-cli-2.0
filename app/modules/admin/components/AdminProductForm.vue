<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useCategoryStore } from '~/modules/category/CategoryStore'
import { useTargetGroupStore } from '~/modules/target-group/TargetGroupStore'
import { useMaterialStore } from '~/modules/material/MaterialStore'
import { useSlug } from '~/modules/common/composables/useSlug'
import type { ProductBadge } from '~/modules/product/types'

interface SpecRow {
  key: string
  value: string
  sortOrder: number
}

interface ExistingImage {
  id: string
  url: string
  isMain: boolean
}

interface ProductFormData {
  title: string
  slug: string
  description: string
  categoryId: string
  targetGroupIds: string[]
  materialIds: string[]
  badges: ProductBadge[]
  discountPercent: number | null
  isActive: boolean
  seoTitle: string
  seoDescription: string
  specs: SpecRow[]
}

const props = withDefaults(defineProps<{
  initialData?: Partial<ProductFormData>
  initialPhotos?: ExistingImage[]
  submitLabel?: string
  backLabel?: string
  backTo?: string
  pageTitle?: string
  showDelete?: boolean
}>(), {
  initialData: () => ({}),
  initialPhotos: () => [],
  submitLabel: 'Створити товар',
  backLabel: 'Товари',
  backTo: '',
  pageTitle: 'Новий товар',
  showDelete: false,
})

const emit = defineEmits<{
  save: [data: ProductFormData, photos: File[], deletedImageIds: string[]]
  delete: []
}>()

const { toSlug } = useSlug()
const categoryStore = useCategoryStore()
const targetGroupStore = useTargetGroupStore()
const materialStore = useMaterialStore()

await useAsyncData('admin-product-form', async () => {
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

const badgeOptions: { value: ProductBadge; label: string }[] = [
  { value: 'NEW', label: 'Новинка' },
  { value: 'HIT', label: 'Хiт' },
  { value: 'SALE', label: 'Акцiя' },
]

const form = reactive<ProductFormData>({
  title: props.initialData.title || '',
  slug: props.initialData.slug || '',
  description: props.initialData.description || '',
  categoryId: props.initialData.categoryId || categoryStore.categories[0]?.id || '',
  targetGroupIds: props.initialData.targetGroupIds || [],
  materialIds: props.initialData.materialIds || [],
  badges: props.initialData.badges || [],
  discountPercent: props.initialData.discountPercent ?? null,
  isActive: props.initialData.isActive ?? true,
  seoTitle: props.initialData.seoTitle || '',
  seoDescription: props.initialData.seoDescription || '',
  specs: props.initialData.specs || [],
})

const photos = ref<File[]>([])
const existingImages = ref<ExistingImage[]>([...props.initialPhotos])
const deletedImageIds = ref<string[]>([])
const isSaving = ref(false)
const showDeleteConfirm = ref(false)

const newTargetGroupName = ref('')
const isAddingTargetGroup = ref(false)
const targetGroupSaving = ref(false)
const editingTargetGroupId = ref<string | null>(null)
const editingTargetGroupName = ref('')
const targetGroupUpdating = ref(false)
const targetGroupDeleting = ref<string | null>(null)

const newMaterialName = ref('')
const isAddingMaterial = ref(false)
const materialSaving = ref(false)
const editingMaterialId = ref<string | null>(null)
const editingMaterialName = ref('')
const materialUpdating = ref(false)
const materialDeleting = ref<string | null>(null)

const slugManuallyEdited = ref(!!props.initialData.slug)
const seoTitleManuallyEdited = ref(!!props.initialData.seoTitle)

const hasSaleBadge = computed(() => form.badges.includes('SALE'))

watch(hasSaleBadge, (isSale) => {
  if (!isSale) form.discountPercent = null
})

watch(() => form.title, (value) => {
  if (!slugManuallyEdited.value) {
    form.slug = toSlug(value)
  }
  if (!seoTitleManuallyEdited.value) {
    form.seoTitle = value ? value + ' -- ART MONOLIT' : ''
  }
})

watch(() => form.slug, (value, oldValue) => {
  if (value !== toSlug(form.title) && oldValue === toSlug(form.title)) {
    slugManuallyEdited.value = true
  }
})

watch(() => form.seoTitle, (value, oldValue) => {
  const autoValue = form.title ? form.title + ' -- ART MONOLIT' : ''
  if (value !== autoValue && oldValue === autoValue) {
    seoTitleManuallyEdited.value = true
  }
})

function toggleBadge(badge: ProductBadge) {
  const index = form.badges.indexOf(badge)
  if (index === -1) {
    form.badges.push(badge)
  } else {
    form.badges.splice(index, 1)
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

function startEditTargetGroup(id: string, name: string) {
  editingTargetGroupId.value = id
  editingTargetGroupName.value = name
}

function cancelEditTargetGroup() {
  editingTargetGroupId.value = null
  editingTargetGroupName.value = ''
}

async function saveEditTargetGroup() {
  const id = editingTargetGroupId.value
  const name = editingTargetGroupName.value.trim()
  if (!id || !name) return
  targetGroupUpdating.value = true
  try {
    await targetGroupStore.update(id, name, toSlug(name))
    editingTargetGroupId.value = null
    editingTargetGroupName.value = ''
  } finally {
    targetGroupUpdating.value = false
  }
}

async function deleteTargetGroup(id: string) {
  targetGroupDeleting.value = id
  try {
    await targetGroupStore.remove(id)
    form.targetGroupIds = form.targetGroupIds.filter(gId => gId !== id)
  } finally {
    targetGroupDeleting.value = null
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

function startEditMaterial(id: string, name: string) {
  editingMaterialId.value = id
  editingMaterialName.value = name
}

function cancelEditMaterial() {
  editingMaterialId.value = null
  editingMaterialName.value = ''
}

async function saveEditMaterial() {
  const id = editingMaterialId.value
  const name = editingMaterialName.value.trim()
  if (!id || !name) return
  materialUpdating.value = true
  try {
    await materialStore.update(id, name, toSlug(name))
    editingMaterialId.value = null
    editingMaterialName.value = ''
  } finally {
    materialUpdating.value = false
  }
}

async function deleteMaterial(id: string) {
  materialDeleting.value = id
  try {
    await materialStore.remove(id)
    form.materialIds = form.materialIds.filter(mId => mId !== id)
  } finally {
    materialDeleting.value = null
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

function addSpec() {
  form.specs.push({ key: '', value: '', sortOrder: form.specs.length })
}

function removeSpec(index: number) {
  form.specs.splice(index, 1)
}

function removeExistingImage(imageId: string) {
  existingImages.value = existingImages.value.filter(image => image.id !== imageId)
  deletedImageIds.value.push(imageId)
}

function setMainImage(imageId: string) {
  existingImages.value = existingImages.value.map(image => ({
    ...image,
    isMain: image.id === imageId,
  }))
}

function handleDelete() {
  showDeleteConfirm.value = false
  emit('delete')
}

function handleSubmit() {
  isSaving.value = true
  emit('save', { ...form, specs: [...form.specs] }, [...photos.value], [...deletedImageIds.value])
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
            <BInput v-model="form.slug" label="Slug (URL)" placeholder="pamyatnyk-klasyka" required />
            <BTextarea v-model="form.description" label="Опис" placeholder="Детальний опис виробу..." />
          </div>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Характеристики</h3>
          <div v-if="form.specs.length" class="admin-specs">
            <div v-for="(spec, index) in form.specs" :key="index" class="admin-spec">
              <BInput v-model="spec.key" placeholder="Назва (напр. Вага)" required />
              <BInput v-model="spec.value" placeholder="Значення (напр. 120 кг)" required />
              <button type="button" class="admin-spec__remove" @click="removeSpec(index)">
                <BIcon name="trash" size="sm" />
              </button>
            </div>
          </div>
          <div v-else class="admin-empty">Характеристик немає</div>
          <BButton type="button" variant="ghost" size="sm" @click="addSpec">
            + Додати характеристику
          </BButton>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Фото</h3>

          <div v-if="existingImages.length" class="admin-photos">
            <div
                v-for="image in existingImages"
                :key="image.id"
                class="admin-photo"
                :class="{ 'admin-photo--main': image.isMain }"
            >
              <img :src="image.url" :alt="image.id" class="admin-photo__img" />
              <div class="admin-photo__overlay">
                <button
                    type="button"
                    class="admin-photo__btn"
                    title="Зробити головним"
                    :class="{ 'admin-photo__btn--active': image.isMain }"
                    @click="setMainImage(image.id)"
                >
                  <BIcon name="star" size="sm" />
                </button>
                <button
                    type="button"
                    class="admin-photo__btn admin-photo__btn--danger"
                    title="Видалити"
                    @click="removeExistingImage(image.id)"
                >
                  <BIcon name="trash" size="sm" />
                </button>
              </div>
              <span v-if="image.isMain" class="admin-photo__badge">Головне</span>
            </div>
          </div>

          <BFileUpload
              v-model="photos"
              label="Завантажити нові фото"
              multiple
              accept="image/*"
              :max-size="5"
          />
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">SEO</h3>
          <div class="admin-form">
            <BInput v-model="form.seoTitle" label="SEO Title" placeholder="Назва для пошукових систем" />
            <BTextarea v-model="form.seoDescription" label="SEO Description" placeholder="Опис для пошукових систем (до 160 символiв)" />
          </div>
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
            <div
                v-for="material in materialOptions"
                :key="material.value"
                class="admin-editable-row"
            >
              <template v-if="editingMaterialId === material.value">
                <div class="admin-editable-row__edit">
                  <BInput
                      v-model="editingMaterialName"
                      size="sm"
                      @keydown.enter.prevent="saveEditMaterial"
                      @keydown.escape="cancelEditMaterial"
                  />
                  <div class="admin-editable-row__actions">
                    <button
                        type="button"
                        class="admin-editable-row__btn admin-editable-row__btn--save"
                        :disabled="materialUpdating"
                        @click="saveEditMaterial"
                    >
                      <BIcon name="check" size="sm" />
                    </button>
                    <button
                        type="button"
                        class="admin-editable-row__btn"
                        @click="cancelEditMaterial"
                    >
                      <BIcon name="close" size="sm" />
                    </button>
                  </div>
                </div>
              </template>
              <template v-else>
                <label class="admin-checkbox">
                  <input
                      type="checkbox"
                      :checked="form.materialIds.includes(material.value)"
                      @change="toggleMaterial(material.value)"
                  >
                  <span>{{ material.label }}</span>
                </label>
                <div class="admin-editable-row__actions">
                  <button
                      type="button"
                      class="admin-editable-row__btn"
                      title="Редагувати"
                      @click="startEditMaterial(material.value, material.label)"
                  >
                    <BIcon name="edit" size="sm" />
                  </button>
                  <button
                      type="button"
                      class="admin-editable-row__btn admin-editable-row__btn--danger"
                      title="Видалити"
                      :disabled="materialDeleting === material.value"
                      @click="deleteMaterial(material.value)"
                  >
                    <BIcon name="trash" size="sm" />
                  </button>
                </div>
              </template>
            </div>
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
            <div
                v-for="group in targetGroupOptions"
                :key="group.value"
                class="admin-editable-row"
            >
              <template v-if="editingTargetGroupId === group.value">
                <div class="admin-editable-row__edit">
                  <BInput
                      v-model="editingTargetGroupName"
                      size="sm"
                      @keydown.enter.prevent="saveEditTargetGroup"
                      @keydown.escape="cancelEditTargetGroup"
                  />
                  <div class="admin-editable-row__actions">
                    <button
                        type="button"
                        class="admin-editable-row__btn admin-editable-row__btn--save"
                        :disabled="targetGroupUpdating"
                        @click="saveEditTargetGroup"
                    >
                      <BIcon name="check" size="sm" />
                    </button>
                    <button
                        type="button"
                        class="admin-editable-row__btn"
                        @click="cancelEditTargetGroup"
                    >
                      <BIcon name="close" size="sm" />
                    </button>
                  </div>
                </div>
              </template>
              <template v-else>
                <label class="admin-checkbox">
                  <input
                      type="checkbox"
                      :checked="form.targetGroupIds.includes(group.value)"
                      @change="toggleTargetGroup(group.value)"
                  >
                  <span>{{ group.label }}</span>
                </label>
                <div class="admin-editable-row__actions">
                  <button
                      type="button"
                      class="admin-editable-row__btn"
                      title="Редагувати"
                      @click="startEditTargetGroup(group.value, group.label)"
                  >
                    <BIcon name="edit" size="sm" />
                  </button>
                  <button
                      type="button"
                      class="admin-editable-row__btn admin-editable-row__btn--danger"
                      title="Видалити"
                      :disabled="targetGroupDeleting === group.value"
                      @click="deleteTargetGroup(group.value)"
                  >
                    <BIcon name="trash" size="sm" />
                  </button>
                </div>
              </template>
            </div>
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
          <h3 class="admin-card__title">Мiтки</h3>
          <div class="admin-checkboxes">
            <label
                v-for="badge in badgeOptions"
                :key="badge.value"
                class="admin-checkbox"
            >
              <input
                  type="checkbox"
                  :checked="form.badges.includes(badge.value)"
                  @change="toggleBadge(badge.value)"
              >
              <span>{{ badge.label }}</span>
            </label>
          </div>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Знижка</h3>
          <div class="admin-form">
            <BInput
                :model-value="form.discountPercent !== null ? String(form.discountPercent) : ''"
                label="Вiдсоток знижки"
                type="number"
                placeholder="0"
                :disabled="!hasSaleBadge"
                @update:model-value="form.discountPercent = $event ? Number($event) : null"
            />
            <p v-if="!hasSaleBadge" class="admin-hint">
              Увімкніть мітку «Акцiя» щоб задати знижку
            </p>
          </div>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Налаштування</h3>
          <div class="admin-form">
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

        <div v-if="showDelete" class="admin-card admin-card--danger">
          <h3 class="admin-card__title">Небезпечна зона</h3>
          <template v-if="!showDeleteConfirm">
            <BButton variant="danger" block @click="showDeleteConfirm = true">
              <BIcon name="trash" size="sm" />
              Видалити товар
            </BButton>
          </template>
          <template v-else>
            <p class="admin-delete-warning">
              Товар буде видалено назавжди разом з усіма фото, варіантами та характеристиками. Цю дію неможливо скасувати.
            </p>
            <div class="admin-delete-actions">
              <BButton variant="danger" block @click="handleDelete">
                Так, видалити
              </BButton>
              <BButton variant="ghost" block @click="showDeleteConfirm = false">
                Скасувати
              </BButton>
            </div>
          </template>
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

.admin-card--danger {
  border-color: var(--error);
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

.admin-editable-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.admin-editable-row__edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.admin-editable-row__actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.admin-editable-row__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.admin-editable-row__btn:hover {
  color: var(--text-primary);
  border-color: var(--border);
  background: var(--bg-secondary);
}

.admin-editable-row__btn--save:hover {
  color: var(--success, #22c55e);
  border-color: var(--success, #22c55e);
}

.admin-editable-row__btn--danger:hover {
  color: var(--error);
  border-color: var(--error);
}

.admin-editable-row__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin-specs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.admin-spec {
  display: grid;
  grid-template-columns: 1fr 1fr 36px;
  gap: 8px;
  align-items: end;
}

.admin-spec__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.admin-spec__remove:hover {
  color: var(--error);
  border-color: var(--error);
}

.admin-empty {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.admin-hint {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

.admin-photos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.admin-photo {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border);
  transition: border-color 0.2s;
}

.admin-photo--main {
  border-color: var(--gold);
}

.admin-photo__img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.admin-photo__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--overlay);
  opacity: 0;
  transition: opacity 0.2s;
}

.admin-photo:hover .admin-photo__overlay {
  opacity: 1;
}

.admin-photo__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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

.admin-photo__btn--active {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--bg-primary);
}

.admin-photo__btn--danger:hover {
  background: var(--error);
  border-color: var(--error);
  color: #fff;
}

.admin-photo__badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--bg-primary);
  background: var(--gold);
  border-radius: 4px;
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

.admin-delete-warning {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.admin-delete-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 1024px) {
  .admin-edit__body {
    grid-template-columns: 1fr;
  }

  .admin-edit__side {
    position: static;
  }
}

@media (max-width: 600px) {
  .admin-spec {
    grid-template-columns: 1fr 36px;
  }

  .admin-spec > :first-child,
  .admin-spec > :nth-child(2) {
    grid-column: 1;
  }

  .admin-spec > :last-child {
    grid-row: 1 / 3;
    grid-column: 2;
    align-self: center;
  }

  .admin-photos {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}
</style>