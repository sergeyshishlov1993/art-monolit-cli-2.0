export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    future: { compatibilityVersion: 4 },
    devtools: { enabled: true },
    modules: ['@pinia/nuxt', '@nuxtjs/sitemap'],
    site: { url: process.env.NUXT_PUBLIC_SITE_URL || 'https://art-monolit.com.ua' },
    sitemap: {
        exclude: ['/admin/**', '/ui-kit', '/thanks'],
        sources: ['/api/__sitemap__/urls'],
    },
    css: [
        '~/assets/css/main.css',
        '~/assets/css/themes.css',
        '~/assets/css/admin.css',
    ],
    components: [
        { path: '~/modules/common/components', pathPrefix: false },
    ],
    imports: {
        dirs: ['~/common/composables', '~/modules/*/composables'],
    },
    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000/api',
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://art-monolit.com.ua',
        },
    },
    app: {
        head: {
            htmlAttrs: { lang: 'uk' },
            title: 'Арт Моноліт — гранітна майстерня | Пам\'ятники, вироби з граніту',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Гранітна майстерня Арт Моноліт — виготовлення пам\'ятників, надгробій, огорож та виробів з граніту. Індивідуальний підхід, власне виробництво.' },
                { name: 'author', content: 'Арт Моноліт' },
                { property: 'og:type', content: 'website' },
                { property: 'og:locale', content: 'uk_UA' },
                { property: 'og:site_name', content: 'Арт Моноліт' },
                { property: 'og:title', content: 'Арт Моноліт — гранітна майстерня' },
                { property: 'og:description', content: 'Виготовлення пам\'ятників, надгробій та виробів з граніту. Власне виробництво, індивідуальний підхід.' },
                { property: 'og:image', content: '/og-image.jpg' },
                { property: 'og:image:width', content: '1200' },
                { property: 'og:image:height', content: '630' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:title', content: 'Арт Моноліт — гранітна майстерня' },
                { name: 'twitter:description', content: 'Виготовлення пам\'ятників, надгробій та виробів з граніту.' },
                { name: 'twitter:image', content: '/og-image.jpg' },
            ],
            link: [
                { rel: 'icon', type: 'image/png', href: '/favicon.png' },
            ],
            script: [
                {
                    innerHTML: `(function(){var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}document.documentElement.className='theme-'+t})()`,
                    type: 'text/javascript',
                },
            ],
        },
    },
})