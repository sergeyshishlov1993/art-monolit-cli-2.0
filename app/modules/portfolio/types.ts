export interface PortfolioImageRef {
    id: string
    slug: string
    name: string
}

export interface PortfolioImage {
    id: string
    portfolioWorkId: string
    s3Key: string
    url: string
    sortOrder: number
    alt: string | null
    createdAt: string
}

export interface PortfolioWork {
    id: string
    categoryId: string
    sortOrder: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    category: PortfolioImageRef
    targetGroups: PortfolioImageRef[]
    materials: PortfolioImageRef[]
    images: PortfolioImage[]
    _count?: {
        images: number
    }
}

export interface PortfolioListResponse {
    items: PortfolioWork[]
    total: number
    page: number
    limit: number
    totalPages: number
    hasMore: boolean
}

export interface PortfolioFilterCountItem {
    slug: string
    count: number
}

export interface PortfolioFilterCounts {
    total: number
    categories: PortfolioFilterCountItem[]
    materials: PortfolioFilterCountItem[]
    targetGroups: PortfolioFilterCountItem[]
}