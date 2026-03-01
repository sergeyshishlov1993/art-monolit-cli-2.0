<!--<script setup lang="ts">-->
<!--import { useRouter } from 'vue-router'-->
<!--import AdminPortfolioForm from '~/modules/admin/components/AdminPortfolioForm.vue'-->
<!--import { usePortfolioApi } from '~/modules/portfolio/PortfolioApi'-->
<!--import { ROUTES } from '~/modules/common/constants/routes'-->

<!--definePageMeta({ layout: 'admin' })-->

<!--const router = useRouter()-->
<!--const portfolioApi = usePortfolioApi()-->

<!--interface PortfolioFormData {-->
<!--  title: string-->
<!--  description: string-->
<!--  categoryId: string-->
<!--  targetGroupIds: string[]-->
<!--  materialIds: string[]-->
<!--  sortOrder: number-->
<!--  isActive: boolean-->
<!--}-->

<!--async function handleSave(data: PortfolioFormData, photo: File | null, _deletePhoto: boolean) {-->
<!--  const work = await portfolioApi.create(data)-->

<!--  if (photo) {-->
<!--    await portfolioApi.uploadImage(work.id, photo)-->
<!--  }-->

<!--  await router.push(ROUTES.ADMIN.PORTFOLIOS)-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <AdminPortfolioForm-->
<!--      page-title="Нова робота"-->
<!--      submit-label="Створити роботу"-->
<!--      back-label="Портфолiо"-->
<!--      :back-to="ROUTES.ADMIN.PORTFOLIOS"-->
<!--      @save="handleSave"-->
<!--  />-->
<!--</template>-->

<script setup lang="ts">
import { useCategoryStore } from '~/modules/category/CategoryStore'
import { useTargetGroupStore } from '~/modules/target-group/TargetGroupStore'
import { useMaterialStore } from '~/modules/material/MaterialStore'
import { usePortfolioApi } from '~/modules/portfolio/PortfolioApi'
import { ROUTES } from '~/modules/common/constants/routes'

definePageMeta({ layout: 'admin' })

const router = useRouter()
const portfolioApi = usePortfolioApi()
const categoryStore = useCategoryStore()
const targetGroupStore = useTargetGroupStore()
const materialStore = useMaterialStore()

await useAsyncData('admin-portfolio-new', async () => {
  await Promise.all([
    categoryStore.categories.length ? null : categoryStore.fetchAll(true),
    targetGroupStore.targetGroups.length ? null : targetGroupStore.fetchAll(),
    materialStore.materials.length ? null : materialStore.fetchAll(),
  ])
  return true
})

const categoryId = ref(categoryStore.categories[0]?.id || '')
const targetGroupIds = ref<string[]>([])
const materialIds = ref<string[]>([])
const files = ref<File[]>([])
const isUploading = ref(false)
const uploadProgress = ref({ current: 0, total: 0 })

const categoryOptions = computed(() =>
    categoryStore.categories.map(c => ({ value: c.id, label: c.name }))
)

function getFilePreview(file: File): string {
  return URL.createObjectURL(file)
}

function onFilesChange(newFiles: File[]) {
  files.value = [...files.value, ...newFiles]
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

function toggleTargetGroup(id: string) {
  const index = targetGroupIds.value.indexOf(id)
  index === -1 ? targetGroupIds.value.push(id) : targetGroupIds.value.splice(index, 1)
}

function toggleMaterial(id: string) {
  const index = materialIds.value.indexOf(id)
  index === -1 ? materialIds.value.push(id) : materialIds.value.splice(index, 1)
}

async function handleUpload() {
  if (!files.value.length || !categoryId.value) return

  isUploading.value = true
  uploadProgress.value = { current: 0, total: files.value.length }

  for (const file of files.value) {
    const work = await portfolioApi.create({
      categoryId: categoryId.value,
      targetGroupIds: targetGroupIds.value,
      materialIds: materialIds.value,
      isActive: true,
    })

    await portfolioApi.uploadImage(work.id, file)
    uploadProgress.value.current++
  }

  isUploading.value = false
  await router.push(ROUTES.ADMIN.PORTFOLIOS)
}
</script>

<template>
  <div class="admin-edit">
    <div class="admin-edit__header">
      <NuxtLink :to="ROUTES.ADMIN.PORTFOLIOS" class="admin-edit__back">
        <BIcon name="arrow-right" size="sm" style="transform: rotate(180deg)" />
        Портфолiо
      </NuxtLink>
      <h1 class="admin-edit__title">Додати роботи</h1>
      <p class="admin-edit__desc">Кожне фото стане окремою роботою</p>
    </div>

    <div class="admin-edit__body">
      <div class="admin-edit__main">
        <div class="admin-card">
          <h3 class="admin-card__title">Фото ({{ files.length }})</h3>

          <BFileUpload
              label="Додати фото"
              accept="image/*"
              :max-size="50"
              multiple
              @update:model-value="onFilesChange"
          />

          <div v-if="files.length" class="photo-grid">
            <div v-for="(file, index) in files" :key="index" class="photo-item">
              <img :src="getFilePreview(file)" :alt="file.name" class="photo-item__img" />
              <button type="button" class="photo-item__remove" @click="removeFile(index)">
                <BIcon name="x" size="sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="admin-edit__side">
        <div class="admin-card">
          <h3 class="admin-card__title">Категорiя</h3>
          <BSelect
              v-model="categoryId"
              :options="categoryOptions"
              placeholder="Оберiть категорiю..."
              required
          />
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Матерiал</h3>
          <div v-if="materialStore.materials.length" class="admin-checkboxes">
            <label v-for="material in materialStore.materials" :key="material.id" class="admin-checkbox">
              <input
                  type="checkbox"
                  :checked="materialIds.includes(material.id)"
                  @change="toggleMaterial(material.id)"
              />
              <span>{{ material.name }}</span>
            </label>
          </div>
          <div v-else class="admin-empty">Матерiали не додані</div>
        </div>

        <div class="admin-card">
          <h3 class="admin-card__title">Цiльова група</h3>
          <div v-if="targetGroupStore.targetGroups.length" class="admin-checkboxes">
            <label v-for="group in targetGroupStore.targetGroups" :key="group.id" class="admin-checkbox">
              <input
                  type="checkbox"
                  :checked="targetGroupIds.includes(group.id)"
                  @change="toggleTargetGroup(group.id)"
              />
              <span>{{ group.name }}</span>
            </label>
          </div>
          <div v-else class="admin-empty">Групи не додані</div>
        </div>

        <div class="admin-card admin-card--actions">
          <div v-if="isUploading" class="upload-progress">
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

          <BButton
              type="button"
              block
              :disabled="!files.length || !categoryId || isUploading"
              :loading="isUploading"
              @click="handleUpload"
          >
            <BIcon name="upload" size="sm" />
            Завантажити {{ files.length }} фото
          </BButton>
          <BButton variant="ghost" block :to="ROUTES.ADMIN.PORTFOLIOS">
            Скасувати
          </BButton>
        </div>
      </div>
    </div>
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
  gap: 12px;
}

.admin-card__title {
  margin: 0 0 20px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary);
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
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.photo-item__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-item__remove {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}

.photo-item:hover .photo-item__remove {
  opacity: 1;
}

.photo-item__remove:hover {
  background: var(--error);
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

@media (max-width: 1024px) {
  .admin-edit__body {
    grid-template-columns: 1fr;
  }

  .admin-edit__side {
    position: static;
  }
}
</style>