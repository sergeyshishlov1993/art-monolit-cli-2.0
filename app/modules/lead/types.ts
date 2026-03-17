export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELED'

export type LeadProductCategory = {
    slug: string
}

export type LeadProduct = {
    id: string
    title: string
    slug: string
    category: LeadProductCategory
}

export type LeadResponse = {
    id: string
    name: string
    phone: string
    email: string | null
    message: string | null
    source: string
    pixel: string | null
    status: LeadStatus
    adminComment?: string | null
    createdAt: string
    updatedAt: string
    product: LeadProduct | null
}

export type CreateLeadPayload = {
    name: string
    phone: string
    email?: string | null
    message?: string | null
    source?: string
    pixel?: string | null
    productId?: string | null
}

export type UpdateLeadPayload = {
    name?: string
    phone?: string
    email?: string | null
    message?: string | null
    status?: LeadStatus
    adminComment?: string | null
}

export type LeadFilters = {
    status?: string
    source?: string
    page?: number
    limit?: number
}

export type LeadsListResponse = {
    items: LeadResponse[]
    total: number
    page: number
    limit: number
    totalPages: number
}