import type { LeadStatus, LeadSource } from './constants'

export interface CreateLeadPayload {
    name: string
    phone: string
    email?: string
    message?: string
    productId?: string
    source?: LeadSource
    pixel?: string
}

export interface UpdateLeadPayload {
    name?: string
    phone?: string
    email?: string | null
    message?: string | null
    status?: LeadStatus
    adminComment?: string
}

export interface LeadProduct {
    id: string
    title: string
    slug: string
    category: { slug: string } | null
}

export interface LeadResponse {
    id: string
    number: number
    name: string
    phone: string
    email: string | null
    message: string | null
    productId: string | null
    status: LeadStatus
    source: LeadSource
    pixel: string | null
    adminComment: string | null
    createdAt: string
    updatedAt: string
    product: LeadProduct | null
}

export interface LeadFilters {
    status?: LeadStatus | ''
    source?: LeadSource | ''
}