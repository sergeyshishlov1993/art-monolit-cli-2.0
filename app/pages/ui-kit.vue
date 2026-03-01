<script setup lang="ts">
const modalOpen = ref(false)
const files = ref<File[]>([])
const selectValue = ref('')
const checkboxValues = ref({ terms: false, active: true, disabled: false })
const radioValue = ref('1')
const toggleValues = ref({ activate: false, enabled: true, disabled: false })

const selectOptions = [
  { value: 'granite', label: 'Граніт' },
  { value: 'marble', label: 'Мармур' },
  { value: 'gabbro', label: 'Габро' },
]

const navItems = [
  { label: 'Каталог', to: '/catalog', children: [
      { label: 'Гранітні пам\'ятники', to: '/catalog/granite' },
      { label: 'Мармурові пам\'ятники', to: '/catalog/marble' },
    ]},
  { label: 'Наші роботи', to: '/works' },
  { label: 'Про компанію', to: '/about' },
  { label: 'Доставка та оплата', to: '/delivery' },
  { label: 'Контакти', to: '/contacts' },
]

const footerColumns = [
  {
    title: 'Навігація',
    links: [
      { label: 'Каталог', to: '/catalog' },
      { label: 'Про компанію', to: '/about' },
      { label: 'Наші роботи', to: '/works' },
      { label: 'Контакти', to: '/contacts' },
    ],
  },
  {
    title: 'Каталог',
    links: [
      { label: 'Гранітні пам\'ятники', to: '/catalog/granite' },
      { label: 'Мармурові пам\'ятники', to: '/catalog/marble' },
      { label: 'Плитка', to: '/catalog/tiles' },
      { label: 'Бордюри', to: '/catalog/borders' },
    ],
  },
]

const footerContacts = [
  { icon: 'location' as const, text: 'м. Київ, вул. Прикладна 1' },
  { icon: 'phone' as const, text: '+380 (99) 123-45-67', href: 'tel:+380991234567' },
  { icon: 'email' as const, text: 'info@artmonolit.ua', href: 'mailto:info@artmonolit.ua' },
]

const demoProducts = [
  {
    image: 'https://picsum.photos/400/533?1',
    title: 'Пам\'ятник одинарний «Класика»',
    slug: 'classic-single',
    badge: 'Хіт продажу'
  },
  {
    image: 'https://picsum.photos/400/533?2',
    title: 'Пам\'ятник подвійний «Сімейний»',
    slug: 'family-double',
    badge: '-15%'
  },
  {
    image: 'https://picsum.photos/400/533?3',
    title: 'Пам\'ятник з граніту «Елегант»',
    slug: 'elegant-granite'
  },
  {
    image: 'https://picsum.photos/400/533?4',
    title: 'Пам\'ятник мармуровий «Тиша»',
    slug: 'silence-marble',
    badge: 'Новинка'
  },
]


function handleInquiry(title: string) {
  console.log('Запит вартості:', title)
}
</script>

<template>
  <div class="ui-layout">
    <TheHeader :nav="navItems">
      <template #actions>
        <BThemeToggle />
      </template>
    </TheHeader>

    <main class="ui-page">
      <h1 class="ui-page-title">UI Kit</h1>

      <section class="ui-section">
        <h2 class="ui-section-title">Слайдер з превʼю</h2>
        <div class="ui-grid-2">
          <BSlider
              :slides="[
        { image: 'https://picsum.photos/800/500?10', alt: 'Фото 1' },
        { image: 'https://picsum.photos/800/500?11', alt: 'Фото 2' },
        { image: 'https://picsum.photos/800/500?12', alt: 'Фото 3' },
        { image: 'https://picsum.photos/800/500?13', alt: 'Фото 4' },
        { image: 'https://picsum.photos/800/500?14', alt: 'Фото 5' },
        { image: 'https://picsum.photos/800/500?15', alt: 'Фото 6' },
      ]"
              autoplay
              :interval="4000"
          />
          <BSlider
              :slides="[
        { image: 'https://picsum.photos/800/500?20', alt: 'Слайд 1' },
        { image: 'https://picsum.photos/800/500?21', alt: 'Слайд 2' },
        { image: 'https://picsum.photos/800/500?22', alt: 'Слайд 3' },
      ]"
              :thumbs="false"
              aspect-ratio="4/3"
          />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Картка товару</h2>
        <div class="ui-grid-4">

          <BProductCard
              v-for="product in demoProducts"
              :key="product.slug"
              :image="product.image"
              :title="product.title"
              :slug="product.slug"
              :badge="product.badge"
              @inquiry="handleInquiry(product.title)"
          />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Кнопки</h2>
        <div class="ui-group">
          <span class="ui-group-label">Варіанти</span>
          <div class="ui-row">
            <BButton variant="primary">Primary</BButton>
            <BButton variant="secondary">Secondary</BButton>
            <BButton variant="outline">Outline</BButton>
            <BButton variant="danger">Danger</BButton>
            <BButton variant="ghost">Ghost</BButton>
          </div>
        </div>
        <div class="ui-group">
          <span class="ui-group-label">Розміри</span>
          <div class="ui-row">
            <BButton size="sm">Small</BButton>
            <BButton size="md">Medium</BButton>
            <BButton size="lg">Large</BButton>
          </div>
        </div>
        <div class="ui-group">
          <span class="ui-group-label">Стани</span>
          <div class="ui-row">
            <BButton loading>Завантаження</BButton>
            <BButton disabled>Заблоковано</BButton>
          </div>
        </div>
        <div class="ui-group">
          <span class="ui-group-label">З іконками</span>
          <div class="ui-row">
            <BButton><BIcon name="plus" size="sm" /> Додати</BButton>
            <BButton variant="danger"><BIcon name="trash" size="sm" /> Видалити</BButton>
            <BButton variant="outline"><BIcon name="pencil" size="sm" /> Редагувати</BButton>
          </div>
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Поля введення</h2>
        <div class="ui-grid-3">
          <BInput label="Звичайне" placeholder="Введіть текст" />
          <BInput label="Обов'язкове" placeholder="Ім'я" required />
          <BInput label="З помилкою" placeholder="Email" error="Введіть коректний email" />
          <BInput label="Заблоковане" model-value="Не можна змінити" disabled />
          <BInput label="Пароль" type="password" placeholder="••••••••" />
          <BInput label="Число" type="number" placeholder="0" />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Текстове поле</h2>
        <div class="ui-grid-2">
          <BTextarea label="Опис" placeholder="Введіть опис..." />
          <BTextarea label="З помилкою" error="Обов'язкове поле" placeholder="Текст..." />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Вибір</h2>
        <div class="ui-grid-3">
          <BSelect v-model="selectValue" :options="selectOptions" label="Матеріал" placeholder="Оберіть..." />
          <BSelect :options="selectOptions" label="Обов'язковий" required placeholder="Оберіть..." />
          <BSelect :options="selectOptions" label="З помилкою" error="Оберіть значення" placeholder="..." />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Чекбокс</h2>
        <div class="ui-row">
          <BCheckbox v-model="checkboxValues.terms" label="Погоджуюсь з умовами" />
          <BCheckbox v-model="checkboxValues.active" label="Активний" />
          <BCheckbox v-model="checkboxValues.disabled" label="Заблокований" disabled />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Радіо</h2>
        <div class="ui-row">
          <BRadio v-model="radioValue" name="variant" value="1" label="Варіант 1" />
          <BRadio v-model="radioValue" name="variant" value="2" label="Варіант 2" />
          <BRadio v-model="radioValue" name="variant" value="3" label="Варіант 3" />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Перемикач</h2>
        <div class="ui-row">
          <BToggle v-model="toggleValues.activate" label="Активувати" />
          <BToggle v-model="toggleValues.enabled" label="Увімкнено" />
          <BToggle v-model="toggleValues.disabled" label="Заблоковано" disabled />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Завантаження файлів</h2>
        <div class="ui-grid-2">
          <BFileUpload v-model="files" label="Завантажити фото" multiple :max-size="5" />
          <BFileUpload label="Один файл" accept=".pdf,.doc" :max-size="10" />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Прев'ю</h2>
        <div class="ui-grid-3">
          <BPreview src="https://picsum.photos/400/300?1" alt="Фото 1" removable />
          <BPreview src="https://picsum.photos/400/300?2" alt="Фото 2" aspect-ratio="1/1" />
          <BPreview src="https://picsum.photos/400/300?3" alt="Фото 3" fit="contain" />
        </div>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Модальне вікно</h2>
        <BButton @click="modalOpen = true">Відкрити модалку</BButton>
        <BModal v-model="modalOpen" title="Заголовок модалки">
          <p style="color: var(--text-secondary); line-height: 1.6;">
            Вміст модального вікна. Тут може бути форма, текст або будь-який інший контент.
          </p>
          <template #footer>
            <BButton variant="ghost" @click="modalOpen = false">Скасувати</BButton>
            <BButton @click="modalOpen = false">Зберегти</BButton>
          </template>
        </BModal>
      </section>

      <section class="ui-section">
        <h2 class="ui-section-title">Іконки</h2>
        <div class="ui-row" style="flex-wrap: wrap; gap: 16px;">
          <div v-for="name in ['home', 'user', 'cog-6-tooth', 'plus', 'trash', 'pencil', 'eye', 'heart', 'star', 'magnifying-glass', 'arrow-right', 'check', 'x-mark', 'phone', 'envelope']" :key="name" class="ui-icon-item">
            <BIcon :name="name" size="md" />
            <span class="ui-icon-name">{{ name }}</span>
          </div>
        </div>
      </section>
    </main>

    <TheFooter
        :columns="footerColumns"
        :contacts="footerContacts"
        description="Каменеобробне підприємство. Вироби з мармуру та граніту від виробника."
    />
  </div>
</template>

<style scoped>
.ui-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.ui-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px;
  width: 100%;
  flex: 1;
}

.ui-page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--gold);
  margin: 0 0 40px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.ui-section {
  margin-bottom: 48px;
}

.ui-section-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gold);
  margin: 0 0 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.ui-group {
  margin-bottom: 20px;
}

.ui-group-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.ui-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.ui-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.ui-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.ui-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.ui-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  min-width: 80px;
}

.ui-icon-name {
  font-size: 9px;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .ui-grid-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .ui-grid-4 { grid-template-columns: repeat(2, 1fr); }
  .ui-grid-3 { grid-template-columns: 1fr; }
  .ui-grid-2 { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .ui-grid-4 { grid-template-columns: 1fr; }
}
</style>