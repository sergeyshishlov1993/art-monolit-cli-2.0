export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    accessToken: string
    refreshToken: string
    user: AdminUser
}

export interface RefreshResponse {
    accessToken: string
    refreshToken: string
}

export interface AdminUser {
    id: string
    email: string
    role: string
    lastLoginAt: string | null
    createdAt: string
}