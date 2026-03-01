export interface PortfolioImage {
    id: string
    portfolioWorkId: string
    s3Key: string
    url: string
    sortOrder: number
    alt: string | null
}

export interface RelationItem {
    id: string
    name: string
    slug: string
}

export interface PortfolioWork {
    id: string
    categoryId: string
    title: string
    description: string | null
    sortOrder: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    category: RelationItem
    targetGroups: RelationItem[]
    materials: RelationItem[]
    images: PortfolioImage[]
    _count?: { images: number }
}

export interface PortfolioListResponse {
    items: PortfolioWork[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
}

export interface CatalogCategory {
    id: string
    name: string
    slug: string
    description: string | null
    imageUrl: string | null
    sortOrder: number
    isActive: boolean
}

export interface CatalogMaterial {
    id: string
    name: string
    slug: string
    sortOrder: number
    isActive: boolean
}

export interface CatalogTargetGroup {
    id: string
    name: string
    slug: string
    sortOrder: number
    isActive: boolean
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
    badges?: FilterBadgeCountItem[]
}