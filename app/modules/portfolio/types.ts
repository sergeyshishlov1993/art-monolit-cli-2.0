export interface ProductImage {
    id: string
    productId: string
    s3Key: string
    url: string
    sortOrder: number
    alt: string | null
    isMain: boolean
    createdAt: string
}

export interface ProductCategory {
    id: string
    name: string
    slug: string
    description: string | null
    imageUrl: string | null
    sortOrder: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface ProductMaterial {
    id: string
    name: string
    slug: string
    sortOrder: number
    isActive: boolean
}

export interface ProductTargetGroup {
    id: string
    name: string
    slug: string
    sortOrder: number
    isActive: boolean
}

export interface Product {
    id: string
    title: string
    slug: string
    description: string | null
    categoryId: string
    materialId: string | null
    targetGroupId: string | null
    price: number | null
    oldPrice: number | null
    discountPercent: number | null
    badges: string[]
    isActive: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
    category: ProductCategory
    material: ProductMaterial | null
    targetGroup: ProductTargetGroup | null
    images: ProductImage[]
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
    page?: number
    limit?: number
    categoryId?: string
    material?: string
    badge?: string
    targetGroup?: string
    search?: string
}

export interface FilterCategoryCountItem {
    id: string
    name: string
    slug: string
    description: string
    imageUrl: string | null
    sortOrder: number
    isActive: boolean
    createdAt: string
    updatedAt: string
    _count: {
        products: number
    }
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
    categories: FilterCategoryCountItem[]
    materials: FilterCountItem[]
    targetGroups: FilterCountItem[]
    badges: FilterBadgeCountItem[]
}