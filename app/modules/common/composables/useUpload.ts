import { useAuthStore } from '~/modules/auth/stores/AuthStore'

interface UploadOptions {
    isMain?: boolean
    alt?: string
}

export function useUpload() {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    async function uploadCategoryImage(categoryId: string, file: File) {
        return upload(`/upload/categories/${categoryId}`, file)
    }

    async function uploadHeroSlideImage(slideId: string, file: File) {
        return upload(`/upload/hero-slides/${slideId}`, file)
    }

    async function uploadProductImage(productId: string, file: File, options?: UploadOptions) {
        return upload(`/upload/products/${productId}`, file, options)
    }

    async function uploadPortfolioImage(portfolioWorkId: string, file: File, options?: UploadOptions) {
        return upload(`/upload/portfolio/${portfolioWorkId}`, file, options)
    }

    async function deleteProductImage(imageId: string) {
        return $fetch(`${config.public.apiBase}/upload/products/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        })
    }

    async function deletePortfolioImage(imageId: string) {
        return $fetch(`${config.public.apiBase}/upload/portfolio/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        })
    }

    async function upload(endpoint: string, file: File, options?: UploadOptions) {
        const formData = new FormData()
        formData.append('file', file)

        if (options?.isMain !== undefined) {
            formData.append('isMain', String(options.isMain))
        }
        if (options?.alt) {
            formData.append('alt', options.alt)
        }

        return $fetch(`${config.public.apiBase}${endpoint}`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        })
    }

    return {
        uploadCategoryImage,
        uploadHeroSlideImage,
        uploadProductImage,
        uploadPortfolioImage,
        deleteProductImage,
        deletePortfolioImage,
    }
}