<script setup lang="ts">
import type { Product } from '~/modules/product/types'

const props = defineProps<{
  product: Product
}>()

const DESC_MAX_LENGTH = 200

const activeTab = ref('description')
const descriptionExpanded = ref(false)

const tabs = [
  { key: 'description', label: 'Опис' },
  { key: 'chars', label: 'Характеристики' },
  { key: 'delivery', label: 'Як ми працюємо' },
]

const characteristics = computed(() => {
  const items: { label: string; value: string }[] = []

  if (props.product.materials?.length) {
    items.push({ label: 'Матеріал', value: props.product.materials.map((m) => m.name).join(', ') })
  }
  if (props.product.targetGroups?.length) {
    items.push({ label: 'Призначення', value: props.product.targetGroups.map((t) => t.name).join(', ') })
  }
  if (props.product.specs?.length) {
    props.product.specs
        .toSorted((a, b) => a.sortOrder - b.sortOrder)
        .forEach((spec) => {
          items.push({ label: spec.key, value: spec.value })
        })
  }

  return items
})

const categoryDescriptionMap: Record<string, string> = {
  'Одинарні': 'одинарних пам\'ятників',
  'Подвійні': 'подвійних пам\'ятників',
  'Комплекси': 'меморіальних комплексів',
  'Військові': 'військових пам\'ятників',
  'Хрести': 'надгробних хрестів',
  'Аксесуари': 'аксесуарів для пам\'ятників',
}

const descriptionFull = computed(() => {
  if (props.product.description) return props.product.description

  const title = props.product.title || 'Виріб'
  const categoryName = props.product.category?.name || ''
  const categoryText = categoryDescriptionMap[categoryName] || categoryName.toLowerCase()

  return `${title} - якісний виріб із категорії ${categoryText}. Виготовлений із дотриманням найвищих стандартів якості. За бажанням можна доукомплектувати додатковими аксесуарами - вазами, хрестами, лампадками та іншими елементами оздоблення. Розміри, матеріал та дизайн адаптуються під ваші побажання. Зв'яжіться з нами, щоб дізнатися деталі та отримати розрахунок вартості.`
})

const isDescriptionLong = computed(() => descriptionFull.value.length > DESC_MAX_LENGTH)

const descriptionVisible = computed(() => {
  if (!isDescriptionLong.value || descriptionExpanded.value) return descriptionFull.value
  return descriptionFull.value.slice(0, DESC_MAX_LENGTH) + '...'
})
</script>

<template>
  <div class="tabs">
    <div class="tabs__nav">
      <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tabs__btn"
          :class="{ 'tabs__btn--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="tabs__content">
      <Transition name="tab-fade" mode="out-in">
        <div v-if="activeTab === 'description'" key="description" class="tabs__panel">
          <p class="tabs__text">{{ descriptionVisible }}</p>
          <button
              v-if="isDescriptionLong"
              class="tabs__expand"
              @click="descriptionExpanded = !descriptionExpanded"
          >
            {{ descriptionExpanded ? 'Згорнути' : 'Читати далі' }}
          </button>
        </div>

        <div v-else-if="activeTab === 'chars'" key="chars" class="tabs__panel">
          <table v-if="characteristics.length" class="tabs__chars">
            <tbody>
            <tr
                v-for="(item, index) in characteristics"
                :key="item.label"
                :class="{ 'tabs__chars-row--odd': index % 2 === 0 }"
            >
              <td class="tabs__char-label">{{ item.label }}</td>
              <td class="tabs__char-value">{{ item.value }}</td>
            </tr>
            </tbody>
          </table>
          <p v-else class="tabs__empty">Характеристики ще не додані</p>
        </div>

        <div v-else-if="activeTab === 'delivery'" key="delivery" class="tabs__panel">
          <div class="tabs__workflow">
            <div class="tabs__workflow-step">
              <span class="tabs__workflow-num">01</span>
              <div>
                <h4>Консультація та проєкт</h4>
                <p>Обговорюємо побажання, підбираємо матеріал, розмір та дизайн.</p>
              </div>
            </div>
            <div class="tabs__workflow-step">
              <span class="tabs__workflow-num">02</span>
              <div>
                <h4>Виготовлення</h4>
                <p>Виробництво від 14 робочих днів з контролем якості.</p>
              </div>
            </div>
            <div class="tabs__workflow-step">
              <span class="tabs__workflow-num">03</span>
              <div>
                <h4>Доставка та гарантія</h4>
                <p>Безкоштовна доставка по Україні. Гарантія від 25 років.</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  border-top: 1px solid var(--border);
  padding-top: 24px;
  margin-top: 8px;
}

.tabs__nav {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--border);
  margin-bottom: 24px;
}

.tabs__btn {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
}

.tabs__btn:hover {
  color: var(--text-primary);
}

.tabs__btn--active {
  color: var(--gold);
  border-bottom-color: var(--gold);
}

.tabs__content {
  min-height: 150px;
}

.tabs__panel {
  animation: fadeIn 0.3s ease;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.tabs__text {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.tabs__expand {
  margin-top: 12px;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--gold);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.2s;
}

.tabs__expand:hover {
  opacity: 0.7;
}

.tabs__empty {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.tabs__chars {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.tabs__chars tr {
  border-bottom: 1px solid var(--border);
}

.tabs__chars tr:last-child {
  border-bottom: none;
}

.tabs__chars-row--odd {
  background: var(--surface-secondary);
}

.tabs__chars td {
  padding: 14px 20px;
  font-size: 14px;
  vertical-align: middle;
}

.tabs__char-label {
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
  width: 40%;
  border-right: 1px solid var(--border);
}

.tabs__char-value {
  color: var(--text-primary);
  font-weight: 600;
}

.tabs__workflow {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tabs__workflow-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.tabs__workflow-num {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: white;
  background: var(--gold);
  border-radius: 50%;
}

.tabs__workflow-step h4 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.tabs__workflow-step p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .tabs__nav {
    overflow-x: auto;
  }

  .tabs__btn {
    padding: 12px 18px;
    font-size: 13px;
    white-space: nowrap;
  }
}
</style>