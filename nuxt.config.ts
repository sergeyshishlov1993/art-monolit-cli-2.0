export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    future: { compatibilityVersion: 4 },
    devtools: { enabled: true },
    modules: ['@pinia/nuxt'],
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
        },
    },
    app: {
        head: {
            script: [
                {
                    innerHTML: `(function(){var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}document.documentElement.className='theme-'+t})()`,
                    type: 'text/javascript',
                },
            ],
        },
    },
})