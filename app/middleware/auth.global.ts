import { useAuthStore } from '~/modules/auth/AuthStore'
import { ROUTES } from '~/modules/common/constants/routes'

export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.server) return

    const isAdminRoute = to.path.startsWith(ROUTES.ADMIN.ROOT)
    if (!isAdminRoute) return

    const authStore = useAuthStore()
    authStore.init()

    const isLoginPage = to.path === ROUTES.ADMIN.LOGIN

    if (isLoginPage && authStore.isAuthenticated) {
        return navigateTo(ROUTES.ADMIN.ROOT)
    }

    if (!isLoginPage && !authStore.isAuthenticated) {
        return navigateTo(ROUTES.ADMIN.LOGIN)
    }
})