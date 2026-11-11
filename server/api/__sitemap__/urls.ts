// SSR фронта ходить в бекенд за цим же адресом (див. useApi.ts)
const API = 'http://127.0.0.1:4000/api'

interface SitemapProduct {
    slug: string
    updatedAt?: string
    category: { slug: string }
}

export default defineSitemapEventHandler(async () => {
    const [products, categories] = await Promise.all([
        $fetch<{ items: SitemapProduct[] }>(`${API}/products`, { query: { limit: 1000 } }),
        $fetch<{ slug: string }[]>(`${API}/categories`),
    ])

    return [
        ...categories.map((category) => ({ loc: `/catalog/${category.slug}` })),
        ...products.items.map((product) => ({
            loc: `/catalog/${product.category.slug}/${product.slug}`,
            lastmod: product.updatedAt,
        })),
    ]
})
