<script setup lang="ts">
import { useAuthStore } from '~/modules/auth/AuthStore'
import { ROUTES } from '~/modules/common/constants/routes'

definePageMeta({ layout: false })

const authStore = useAuthStore()
authStore.init()

if (authStore.isAuthenticated) {
  await navigateTo(ROUTES.ADMIN.ROOT)
}

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await authStore.login(email.value, password.value)
    navigateTo(ROUTES.ADMIN.ROOT)
  } catch {
    error.value = 'Невірний email або пароль'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <form class="login__form" @submit.prevent="handleLogin">
      <h1 class="login__title">ART MONOLIT</h1>
      <p class="login__sub">Вхід в адмін-панель</p>

      <div v-if="error" class="login__error">{{ error }}</div>

      <BInput v-model="email" label="Email" type="email" placeholder="admin@artmonolit.com" required />

      <div class="login__password">
        <BInput
            v-model="password"
            label="Пароль"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            required
        />
        <button
            type="button"
            class="login__toggle"
            @click="showPassword = !showPassword"
        >
          <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      <BButton type="submit" :disabled="loading" block>
        {{ loading ? 'Вхід...' : 'Увійти' }}
      </BButton>
    </form>
  </div>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  padding: 24px;
}

.login__form {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px;
  background: #111;
  border: 1px solid rgba(255 255 255 / 0.08);
  border-radius: 8px;
}

.login__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.1em;
  text-align: center;
}

.login__sub {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
}

.login__error {
  padding: 10px 14px;
  font-size: 13px;
  color: #ef4444;
  background: rgba(239 68 68 / 0.1);
  border: 1px solid rgba(239 68 68 / 0.2);
  border-radius: 6px;
}

.login__password {
  position: relative;
}

.login__toggle {
  position: absolute;
  right: 12px;
  top: 32px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-muted);
  transition: color 0.15s;
}

.login__toggle:hover {
  color: var(--text-primary);
}
</style>