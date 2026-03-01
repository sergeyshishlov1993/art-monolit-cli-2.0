export interface HeroSlide {
    id: string
    title: string
    subtitle: string | null
    buttonText: string | null
    buttonLink: string | null
    imageUrl: string | null
    sortOrder: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}