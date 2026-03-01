import type { HeroSlide } from './types'

export function useHeroApi() {
    const { $api } = useApi()

    return {
        getAll: (params: { all?: boolean } = {}) =>
            $api<HeroSlide[]>('/hero-slides', {
                query: params.all ? { all: 'true' } : {},
            }),

        getById: (id: string) =>
            $api<HeroSlide>(`/hero-slides/${id}`),

        create: (data: Partial<HeroSlide>) =>
            $api<HeroSlide>('/hero-slides', {
                method: 'POST',
                body: data,
            }),

        update: (id: string, data: Partial<HeroSlide>) =>
            $api<HeroSlide>(`/hero-slides/${id}`, {
                method: 'PUT',
                body: data,
            }),

        remove: (id: string) =>
            $api<void>(`/hero-slides/${id}`, {
                method: 'DELETE',
            }),

        uploadImage: (slideId: string, file: File) => {
            const formData = new FormData()
            formData.append('file', file)
            return $api<HeroSlide>(`/upload/hero-slides/${slideId}`, {
                method: 'POST',
                body: formData,
            })
        },
    }
}