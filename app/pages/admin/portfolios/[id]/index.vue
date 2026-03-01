<!--<script setup lang="ts">-->
<!--import { ref, computed, onMounted } from 'vue'-->
<!--import { useRoute, useRouter } from 'vue-router'-->
<!--import AdminPortfolioForm from '~/modules/admin/components/AdminPortfolioForm.vue'-->
<!--import { usePortfolioApi } from '~/modules/portfolio/PortfolioApi'-->
<!--import { ROUTES } from '~/modules/common/constants/routes'-->
<!--import type { PortfolioWork } from '~/modules/portfolio/types'-->

<!--definePageMeta({ layout: 'admin' })-->

<!--const route = useRoute()-->
<!--const router = useRouter()-->
<!--const portfolioApi = usePortfolioApi()-->

<!--const portfolioId = computed(() => String(route.params.id))-->
<!--const loading = ref(true)-->
<!--const work = ref<PortfolioWork | null>(null)-->
<!--const deleteModal = ref(false)-->

<!--const initialData = computed(() => {-->
<!--  if (!work.value) return {}-->
<!--  return {-->
<!--    title: work.value.title,-->
<!--    description: work.value.description || '',-->
<!--    categoryId: work.value.categoryId,-->
<!--    targetGroupIds: work.value.targetGroups.map(t => t.id),-->
<!--    materialIds: work.value.materials.map(m => m.id),-->
<!--    sortOrder: work.value.sortOrder,-->
<!--    isActive: work.value.isActive,-->
<!--  }-->
<!--})-->

<!--const initialPhoto = computed(() => {-->
<!--  if (!work.value || !work.value.images.length) return null-->
<!--  const img = work.value.images[0]-->
<!--  return { id: img.id, url: img.url }-->
<!--})-->

<!--async function fetchWork() {-->
<!--  loading.value = true-->
<!--  work.value = await portfolioApi.getById(portfolioId.value)-->
<!--  loading.value = false-->
<!--}-->

<!--async function handleSave(data: Record<string, unknown>, photo: File | null, deletePhoto: boolean) {-->
<!--  await portfolioApi.update(portfolioId.value, data)-->

<!--  if (deletePhoto && work.value?.images.length) {-->
<!--    for (const img of work.value.images) {-->
<!--      await portfolioApi.deleteImage(img.id)-->
<!--    }-->
<!--  }-->

<!--  if (photo) {-->
<!--    await portfolioApi.uploadImage(portfolioId.value, photo)-->
<!--  }-->

<!--  await router.push(ROUTES.ADMIN.PORTFOLIOS)-->
<!--}-->

<!--async function handleDelete() {-->
<!--  await portfolioApi.remove(portfolioId.value)-->
<!--  await router.push(ROUTES.ADMIN.PORTFOLIOS)-->
<!--}-->

<!--onMounted(fetchWork)-->
<!--</script>-->

<!--<template>-->
<!--  <div v-if="loading" class="admin-loading">Завантаження...</div>-->

<!--  <template v-else-if="work">-->
<!--    <AdminPortfolioForm-->
<!--        :page-title="work.title"-->
<!--        submit-label="Зберегти зміни"-->
<!--        back-label="Портфоліо"-->
<!--        :back-to="ROUTES.ADMIN.PORTFOLIOS"-->
<!--        :initial-data="initialData"-->
<!--        :initial-photo="initialPhoto"-->
<!--        @save="handleSave"-->
<!--    />-->

<!--    <div class="admin-danger-zone">-->
<!--      <div class="admin-card">-->
<!--        <BButton variant="danger" block @click="deleteModal = true">-->
<!--          Видалити роботу-->
<!--        </BButton>-->
<!--      </div>-->
<!--    </div>-->

<!--    <BModal v-model="deleteModal" title="Видалити роботу?">-->
<!--      <p class="admin-confirm-text">Роботу та всі її зображення буде видалено назавжди.</p>-->
<!--      <template #footer>-->
<!--        <BButton variant="ghost" @click="deleteModal = false">Скасувати</BButton>-->
<!--        <BButton variant="danger" @click="handleDelete">Видалити</BButton>-->
<!--      </template>-->
<!--    </BModal>-->
<!--  </template>-->
<!--</template>-->

<!--<style scoped>-->
<!--.admin-loading {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  padding: 80px;-->
<!--  font-size: 14px;-->
<!--  color: var(&#45;&#45;text-muted);-->
<!--}-->

<!--.admin-danger-zone {-->
<!--  max-width: 1200px;-->
<!--  margin: 24px auto 0;-->
<!--}-->

<!--.admin-danger-zone .admin-card {-->
<!--  background: var(&#45;&#45;bg-card);-->
<!--  border: 1px solid var(&#45;&#45;border);-->
<!--  border-radius: 8px;-->
<!--  padding: 24px;-->
<!--  max-width: 320px;-->
<!--  margin-left: auto;-->
<!--}-->

<!--.admin-confirm-text {-->
<!--  margin: 0;-->
<!--  font-size: 14px;-->
<!--  color: var(&#45;&#45;text-secondary);-->
<!--}-->
<!--</style>-->

<script setup lang="ts">
import { useCategoryStore } from '~/modules/category/CategoryStore'
import { useTargetGroupStore } from '~/modules/target-group/TargetGroupStore'
import { useMaterialStore } from '~/modules/material/MaterialStore'
import { usePortfolioApi } from '~/modules/portfolio/PortfolioApi'
import { ROUTES } from '~/modules/common/constants/routes'
import type { PortfolioWork } from '~/modules/portfolio/types'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()
const portfolioApi = usePortfolioApi()
const categoryStore = useCategoryStore()
const targetGroupStore = useTargetGroupStore()
const materialStore = useMaterialStore()

const portfolioId = computed(() => String(route.params.id))
const loading = ref(true)
const work = ref<PortfolioWork | null>(null)
const deleteModal = ref(false)
const isSaving = ref(false)

const categoryId = ref('')
const targetGroupIds = ref<string[]>([])
const materialIds = ref<string[]>([])
const sortOrder = ref(0)
const isActive = ref(true)

const photo = ref<File | null>(null)
const existingPhoto = ref<{ id: string; url: string } | null>(null)
const deleteExistingPhoto = ref(false)

await useAsyncData('admin-portfolio-edit', async () => {
  await Promise.all([
    categoryStore.categories.length ? null : categoryStore.fetchAll(true),
    targetGroupStore.targetGroups.length ? null : targetGroupStore.fetchAll(),
    materialStore.materials.length ? null : materialStore.fetchAll(),
  ])
  return true
})

const categoryOptions = computed(() =>
    categoryStore.categories.map(c => ({ value: c.id, label: c.name }))
)

const photoPreview = computed(() => {
  if (photo.value) return URL.createObjectURL(photo.value)
  if (existingPhoto.value && !deleteExistingPhoto.value) return existingPhoto.value.url
  return null
})

async function fetchWork() {
  loading.value = true
  work.value = await portfolioApi.getById(portfolioId.value)

  if (work.value) {
    categoryId.value = work.value.categoryId
    targetGroupIds.value = work.value.targetGroups.map(t => t.id)
    materialIds.value = work.value.materials.map(m => m.id)
    sortOrder.value = work.value.sortOrder
    isActive.value = work.value.isActive

    if (work.value.images.length) {
      existingPhoto.value = { id: work.value.images[0].id, url: work.value.images[0].url }
    }
  }

  loading.value = false
}

function onFileChange(files: File[]) {
  if (files.length) {
    photo.value = files[0]
    deleteExistingPhoto.value = true
  }
}

function removePhoto() {
  photo.value = null
  if (existingPhoto.value) {
    deleteExistingPhoto.value = true
  }
}

function toggleTargetGroup(id: string) {
  const index = targetGroupIds.value.indexOf(id)
  index === -1 ? targetGroupIds.value.push(id) : targetGroupIds.value.splice(index, 1)
}

function toggleMaterial(id: string) {
  const index = materialIds.value.indexOf(id)
  index === -1 ? materialIds.value.push(id) : materialIds.value.splice(index, 1)
}

async function handleSave() {
  isSaving.value = true

  await portfolioApi.update(portfolioId.value, {
    categoryId: categoryId.value,
    targetGroupIds: targetGroupIds.value,
    materialIds: materialIds.value,
    sortOrder: sortOrder.value,
    isActive: isActive.value,
  })

  if (deleteExistingPhoto.value && existingPhoto.value) {
    await portfolioApi.deleteImage(existingPhoto.value.id)
  }

  if (photo.value) {
    await portfolioApi.uploadImage(portfolioId.value, photo.value)
  }

  isSaving.value = false
  await router.push(ROUTES.ADMIN.PORTFOLIOS)
}

async function handleDelete() {
  await portfolioApi.remove(portfolioId.value)
  await router.push(ROUTES.ADMIN.PORTFOLIOS)
}

onMounted(fetchWork)
</script>

<template>
  <div v-if="loading" class="admin-loading">Завантаження...</div>

  <div v-else-if="work" class="admin-edit">
    <div class="admin-edit__header">
      <NuxtLink :to="ROUTES.ADMIN.PORTFOLIOS" class="admin-edit__back">
        <BIcon name="arrow-right" size="sm" style="transform: rotate(180deg)" />
        Портфолiо
      </NuxtLink>
      <h1 class="admin-edit__title">Редагування роботи</h1>
    </div>

    <div class="admin-edit__body">
      <div class="admin-edit__main">
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
              :max-size="50"
              @update:model-value="onFileChange"
          />
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

        <div class="admin-card">
          <h3 class="admin-card__title">Налаштування</h3>
          <div class="admin-form">
            <BInput
                :model-value="String(sortOrder)"
                label="Порядок сортування"
                type="number"
                placeholder="0"
                @update:model-value="sortOrder = Number($event) || 0"
            />
            <label class="admin-checkbox">
              <input v-model="isActive" type="checkbox" />
              <span>Активний (видимий на сайтi)</span>
            </label>
          </div>
        </div>

        <div class="admin-card admin-card--actions">
          <BButton type="button" block :loading="isSaving" @click="handleSave">
            <BIcon name="check" size="sm" />
            Зберегти змiни
          </BButton>
          <BButton variant="ghost" block :to="ROUTES.ADMIN.PORTFOLIOS">
            Скасувати
          </BButton>
        </div>

        <div class="admin-card">
          <BButton variant="danger" block @click="deleteModal = true">
            Видалити роботу
          </BButton>
        </div>
      </div>
    </div>

    <BModal v-model="deleteModal" title="Видалити роботу?">
      <p class="admin-confirm-text">Роботу та всі її зображення буде видалено назавжди.</p>
      <template #footer>
        <BButton variant="ghost" @click="deleteModal = false">Скасувати</BButton>
        <BButton variant="danger" @click="handleDelete">Видалити</BButton>
      </template>
    </BModal>
  </div>
</template>

<style scoped>
.admin-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
  font-size: 14px;
  color: var(--text-muted);
}

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
}

.admin-single-photo {
  position: relative;
  max-width: 400px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border);
}

.admin-single-photo__img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}

.admin-single-photo__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
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
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.admin-photo__btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.admin-photo__btn--danger:hover {
  background: var(--error);
  border-color: var(--error);
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