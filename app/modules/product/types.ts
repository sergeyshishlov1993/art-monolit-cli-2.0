export type ProductBadge = 'NEW' | 'HIT' | 'SALE'

export interface ProductImage {
    id: string
    productId: string
    s3Key: string
    url: string
    sortOrder: number
    alt: string | null
    isMain: boolean
}


export interface ProductSpec {
    id: string
    productId: string
    key: string
    value: string
    sortOrder: number
}

export interface RelatedEntity {
    id: string
    name: string
    slug: string
}

export interface Product {
    id: string
    categoryId: string
    title: string
    slug: string
    description: string | null
    discountPercent: number | null
    badges: ProductBadge[]
    isActive: boolean
    seoTitle: string | null
    seoDescription: string | null
    category: RelatedEntity
    targetGroups: RelatedEntity[]
    materials: RelatedEntity[]
    variants: ProductVariant[]
    images: ProductImage[]
    specs: ProductSpec[]
    _count?: { variants: number; images: number }
}

export interface ProductListResponse {
    items: Product[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
}

export interface ProductFilters {
    categoryId?: string
    targetGroup?: string
    material?: string
    badge?: string
    size?: string
    search?: string
    all?: boolean
    page?: number
    limit?: number
}

export interface FilterCountItem {
    slug: string
    count: number
}

export interface FilterBadgeCountItem {
    badge: string
    count: number
}

export interface FilterCounts {
    total: number
    categories: FilterCountItem[]
    materials: FilterCountItem[]
    targetGroups: FilterCountItem[]
    badges: FilterBadgeCountItem[]
}