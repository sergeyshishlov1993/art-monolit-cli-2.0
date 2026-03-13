import { defineStore } from 'pinia'
import { useAuthApi } from './AuthApi'
import type { AdminUser } from './types'
import { ROUTES } from '~/modules/common/constants/routes'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const useAuthStore = defineStore('auth', () => {
    const authApi = useAuthApi()

    const token = ref<string | null>(null)
    const refreshTokenValue = ref<string | null>(null)
    const user = ref<AdminUser | null>(null)
    const initialized = ref(false)

    const isAuthenticated = computed(() => !!token.value)

    async function login(email: string, password: string) {
        const response = await authApi.login(email, password)
        setTokens(response.accessToken, response.refreshToken)
        user.value = response.user
    }

    async function fetchProfile() {
        if (!token.value) return
        try {
            user.value = await authApi.getProfile()
        } catch {
            logout()
        }
    }

    function setTokens(access: string, refresh: string) {
        token.value = access
        refreshTokenValue.value = refresh
        if (import.meta.client) {
            localStorage.setItem(ACCESS_TOKEN_KEY, access)
            localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
        }
    }

    function logout() {
        token.value = null
        refreshTokenValue.value = null
        user.value = null
        if (import.meta.client) {
            localStorage.removeItem(ACCESS_TOKEN_KEY)
            localStorage.removeItem(REFRESH_TOKEN_KEY)
        }
        navigateTo(ROUTES.ADMIN.LOGIN)
    }

    function init() {
        if (!import.meta.client) return
        if (initialized.value && token.value) return

        const savedAccess = localStorage.getItem(ACCESS_TOKEN_KEY)
        const savedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)

        if (savedAccess && savedRefresh) {
            token.value = savedAccess
            refreshTokenValue.value = savedRefresh
            fetchProfile()
        }

        initialized.value = true
    }

    return {
        token,
        user,
        initialized,
        isAuthenticated,
        login,
        logout,
        init,
        fetchProfile,
    }
})