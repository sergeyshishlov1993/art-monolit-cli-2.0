import { useAuthStore } from '~/modules/auth/AuthStore'

export default defineNuxtRouteMiddleware((to) => {
    if (!to.path.startsWith('/admin') || to.path === '/admin/login') return

    if (import.meta.server) return

    const authStore = useAuthStore()
    authStore.init()

    if (!authStore.isAuthenticated) {
        return navigateTo('/admin/login')
    }
})