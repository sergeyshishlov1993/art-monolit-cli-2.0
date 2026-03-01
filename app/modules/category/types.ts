export interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    imageUrl: string | null
    sortOrder: number
    isActive: boolean
    _count?: {
        products: number
    }
}