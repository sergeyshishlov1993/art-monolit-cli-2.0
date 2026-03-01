<script setup lang="ts">
import { useCategoryStore } from '~/modules/category/CategoryStore'
import type { Category } from '~/modules/category/types'
import {useAuthStore} from '~/modules/auth/AuthStore'

definePageMeta({ layout: 'admin' })

const categoryStore = useCategoryStore()
const loading = ref(true)
const saving = ref(false)
const editModal = ref(false)
const deleteModal = ref(false)
const editingCategory = ref<Partial<Category> & { imageFile?: File[] }>({})
const deletingId = ref('')
const existingImageUrl = ref<string | null>(null)

async function fetchCategories() {
  loading.value = true
  await categoryStore.fetchAll(true)
  loading.value = false
}

function openCreate() {
  editingCategory.value = { name: '', slug: '', description: '', sortOrder: 0, isActive: true, imageFile: [] }
  existingImageUrl.value = null
  editModal.value = true
}

function openEdit(category: Category) {
  editingCategory.value = { ...category, imageFile: [] }
  existingImageUrl.value = category.imageUrl
  editModal.value = true
}

function openDelete(id: string) {
  deletingId.value = id
  deleteModal.value = true
}

function generateSlug(name: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
    я: 'ya', є: 'ye', і: 'i', ї: 'yi', ґ: 'g',
  }
  return name
      .toLowerCase()
      .split('')
      .map(ch => map[ch] ?? ch)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
}

function onNameInput(value: string) {
  editingCategory.value.name = value
  if (!editingCategory.value.id) {
    editingCategory.value.slug = generateSlug(value)
  }
}

async function saveCategory() {
  saving.value = true
  console.log('AUTH TOKEN:', useAuthStore().token)
  try {
    const { imageFile, ...data } = editingCategory.value

    let saved: Category
    if (data.id) {
      saved = await categoryStore.update(data.id, data)
    } else {
      saved = await categoryStore.create(data)
    }

    if (imageFile?.length) {
      await categoryStore.uploadImage(saved.id, imageFile[0])
    }

    editModal.value = false
    await fetchCategories()
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  saving.value = true
  try {
    await categoryStore.remove(deletingId.value)
    deleteModal.value = false
    await fetchCategories()
  } finally {
    saving.value = false
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="admin-list">
    <div class="admin-list__header">
      <h1 class="admin-list__title">Категорії</h1>
      <BButton @click="openCreate">+ Додати</BButton>
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
        <tr>
          <th>Фото</th>
          <th>Назва</th>
          <th>Slug</th>
          <th>Порядок</th>
          <th>Статус</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="loading">
          <td colspan="6" class="admin-table__empty">Завантаження...</td>
        </tr>
        <tr v-else-if="!categoryStore.categories.length">
          <td colspan="6" class="admin-table__empty">Категорій немає</td>
        </tr>
        <tr v-for="cat in categoryStore.categories" :key="cat.id">
          <td>
            <img
                v-if="cat.imageUrl"
                :src="cat.imageUrl"
                :alt="cat.name"
                class="admin-table__thumb"
            >
            <span v-else class="admin-table__no-img">—</span>
          </td>
          <td class="admin-table__bold" data-label="Назва">{{ cat.name }}</td>
          <td class="admin-table__mono" data-label="Slug">{{ cat.slug }}</td>
          <td data-label="Порядок">{{ cat.sortOrder }}</td>
          <td data-label="Статус">
              <span class="admin-badge" :class="cat.isActive ? 'admin-badge--green' : 'admin-badge--gray'">
                {{ cat.isActive ? 'Активна' : 'Вимкнена' }}
              </span>
          </td>
          <td class="admin-table__actions">
            <button class="admin-action" @click="openEdit(cat)">
              <BIcon name="pencil" size="sm" />
            </button>
            <button class="admin-action admin-action--danger" @click="openDelete(cat.id)">
              <BIcon name="trash" size="sm" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="admin-cards">
      <div v-if="loading" class="admin-cards__empty">Завантаження...</div>
      <div v-else-if="!categoryStore.categories.length" class="admin-cards__empty">Категорій немає</div>
      <div v-for="cat in categoryStore.categories" :key="cat.id" class="admin-card">
        <div class="admin-card__header">
          <div class="admin-card__header-left">
            <img
                v-if="cat.imageUrl"
                :src="cat.imageUrl"
                :alt="cat.name"
                class="admin-card__thumb"
            >
            <span class="admin-card__name">{{ cat.name }}</span>
          </div>
          <span class="admin-badge" :class="cat.isActive ? 'admin-badge--green' : 'admin-badge--gray'">
            {{ cat.isActive ? 'Активна' : 'Вимкнена' }}
          </span>
        </div>
        <div class="admin-card__body">
          <div class="admin-card__row">
            <span class="admin-card__label">Slug</span>
            <span class="admin-card__value admin-card__value--mono">{{ cat.slug }}</span>
          </div>
          <div class="admin-card__row">
            <span class="admin-card__label">Порядок</span>
            <span class="admin-card__value">{{ cat.sortOrder }}</span>
          </div>
        </div>
        <div class="admin-card__actions">
          <button class="admin-action" @click="openEdit(cat)">
            <BIcon name="pencil" size="sm" />
          </button>
          <button class="admin-action admin-action--danger" @click="openDelete(cat.id)">
            <BIcon name="trash" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <BModal v-model="editModal" :title="editingCategory.id ? 'Редагувати категорію' : 'Нова категорія'">
      <div class="admin-form">
        <BInput
            :model-value="editingCategory.name"
            label="Назва"
            placeholder="Одинарні"
            required
            @update:model-value="onNameInput"
        />
        <BInput v-model="editingCategory.slug" label="Slug" placeholder="single" required />
        <BInput v-model="editingCategory.description" label="Опис" placeholder="Опис категорії" />
        <BInput v-model.number="editingCategory.sortOrder" label="Порядок" type="number" />

        <div v-if="existingImageUrl" class="admin-form__current-image">
          <span class="admin-form__current-label">Поточне фото:</span>
          <img :src="existingImageUrl" alt="current" class="admin-form__current-thumb" >
        </div>

        <BFileUpload
            v-model="editingCategory.imageFile"
            :label="existingImageUrl ? 'Замінити фото' : 'Фото категорії'"
        />

        <label class="admin-checkbox">
          <input v-model="editingCategory.isActive" type="checkbox">
          <span>Активна</span>
        </label>
      </div>
      <template #footer>
        <BButton variant="ghost" @click="editModal = false">Скасувати</BButton>
        <BButton :disabled="saving" @click="saveCategory">
          {{ saving ? 'Збереження...' : 'Зберегти' }}
        </BButton>
      </template>
    </BModal>

    <BModal v-model="deleteModal" title="Видалити категорію?">
      <p class="admin-confirm-text">Ця дія незворотна. Категорію буде видалено.</p>
      <template #footer>
        <BButton variant="ghost" @click="deleteModal = false">Скасувати</BButton>
        <BButton variant="danger" :disabled="saving" @click="confirmDelete">
          {{ saving ? 'Видалення...' : 'Видалити' }}
        </BButton>
      </template>
    </BModal>
  </div>
</template>

<style scoped>
.admin-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 12px;
}

.admin-list__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-table__thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.admin-table__no-img {
  color: var(--text-muted);
}

.admin-form__current-image {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.admin-form__current-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.admin-form__current-thumb {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.admin-cards {
  display: none;
}

.admin-card__header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-card__thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border);
}

@media (max-width: 768px) {
  .admin-list__title {
    font-size: 20px;
  }

  .admin-table-wrap {
    display: none;
  }

  .admin-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .admin-cards__empty {
    padding: 32px 16px;
    text-align: center;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .admin-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
  }

  .admin-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 8px;
  }

  .admin-card__name {
    font-weight: 600;
    font-size: 15px;
    color: var(--text-primary);
  }

  .admin-card__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }

  .admin-card__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .admin-card__label {
    color: var(--text-secondary);
  }

  .admin-card__value {
    color: var(--text-primary);
    font-weight: 500;
  }

  .admin-card__value--mono {
    font-family: monospace;
  }

  .admin-card__actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 12px;
    border-top: 1px solid var(--border);
  }
}
</style>