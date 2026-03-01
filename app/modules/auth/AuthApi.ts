import type { LoginResponse, RefreshResponse, AdminUser } from './types'

export function useAuthApi() {
    const { $api } = useApi()

    return {
        login: (email: string, password: string) =>
            $api<LoginResponse>('/auth/login', {
                method: 'POST',
                body: { email, password },
            }),

        refresh: (refreshToken: string) =>
            $api<RefreshResponse>('/auth/refresh', {
                method: 'POST',
                body: { refreshToken },
            }),

        getProfile: () =>
            $api<AdminUser>('/auth/profile'),
    }
}