export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    CONTACTS: '/contacts',
    DELIVERY: '/delivery',
    PORTFOLIO: '/portfolio',
    UI_KIT: '/ui-kit',

    CATALOG: '/catalog',
    CATALOG_CATEGORY: (category: string) => `/catalog/${category}`,
    CATALOG_PRODUCT: (category: string, slug: string) => `/catalog/${category}/${slug}`,

    ADMIN: {
        ROOT: '/admin',
        LOGIN: '/admin/login',
        CATEGORIES: '/admin/categories',
        PRODUCTS: '/admin/products',
        PRODUCT_CREATE: '/admin/products/create',
        PRODUCT_EDIT: (id: string) => `/admin/products/${id}`,
        PORTFOLIOS: '/admin/portfolios',
        PORTFOLIO_CREATE: '/admin/portfolios/create',
        PORTFOLIO_EDIT: (id: string) => `/admin/portfolios/${id}`,
        HERO_SLIDES: '/admin/hero-slides',
        HERO_SLIDE_CREATE: '/admin/hero-slides/create',
        HERO_SLIDE_EDIT: (id: string) => `/admin/hero-slides/${id}`,
        LEADS: '/admin/leads',
    },
} as const