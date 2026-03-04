export function useApi() {
    const config = useRuntimeConfig()
    const baseURL = import.meta.server
        ? 'http://127.0.0.1:4000/api'
        : (config.public.apiBase as string)

    let isRefreshing = false
    let refreshPromise: Promise<void> | null = null

    async function refreshTokens(): Promise<void> {
        if (isRefreshing && refreshPromise) return refreshPromise

        isRefreshing = true
        refreshPromise = (async () => {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token')

            const response = await $fetch<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
                baseURL,
                method: 'POST',
                body: { refreshToken },
            })

            localStorage.setItem('accessToken', response.accessToken)
            localStorage.setItem('refreshToken', response.refreshToken)
        })()

        try {
            await refreshPromise
        } finally {
            isRefreshing = false
            refreshPromise = null
        }
    }

    function getAuthHeaders(): Record<string, string> {
        if (!import.meta.client) return {}
        const token = localStorage.getItem('accessToken')
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    async function $api<T>(url: string, opts?: Parameters<typeof $fetch>[1]): Promise<T> {
        const mergedHeaders = {
            ...getAuthHeaders(),
            ...(opts?.headers as Record<string, string>),
        }

        try {
            return await $fetch<T>(url, {
                baseURL,
                ...opts,
                headers: mergedHeaders,
            })
        } catch (error: unknown) {
            const status = (error as { response?: { status?: number } })?.response?.status

            if (status !== 401) throw error

            const isAuthRoute = url.startsWith('/auth/login') || url.startsWith('/auth/refresh')
            if (isAuthRoute) throw error

            try {
                await refreshTokens()
            } catch {
                if (import.meta.client) {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                    navigateTo('/admin/login')
                }
                throw error
            }

            return await $fetch<T>(url, {
                baseURL,
                ...opts,
                headers: {
                    ...getAuthHeaders(),
                    ...(opts?.headers as Record<string, string>),
                },
            })
        }
    }

    return { $api }
}