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
    number?: number
    name: string
    phone: string
    email: string | null
    message: string | null
    source: string
    pixel: string | null
    utmSource?: string | null
    utmMedium?: string | null
    utmCampaign?: string | null
    status: LeadStatus
    adminComment?: string | null
    createdAt: string
    updatedAt: string
    product: LeadProduct | null
}

export type LeadStats = {
    total: number
    byDay: { date: string; count: number }[]
    bySource: { source: string; count: number }[]
    byStatus: { status: LeadStatus; count: number }[]
    byUtm: { source: string; campaign: string | null; count: number }[]
}

export type CreateLeadPayload = {
    name: string
    phone: string
    email?: string | null
    message?: string | null
    source?: string
    pixel?: string | null
    productId?: string | null
    website?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
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
    search?: string
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