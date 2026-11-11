import type { RouterConfig } from '@nuxt/schema'

// /catalog та /catalog/:category — це один список: при зміні категорії позицію скролу не скидаємо
const CATALOG_LIST = /^\/catalog(\/[^/]+)?\/?$/

export default <RouterConfig>{
    scrollBehavior(to, from, savedPosition) {
        if (CATALOG_LIST.test(to.path) && CATALOG_LIST.test(from.path)) return false
        if (savedPosition) return savedPosition
        if (to.hash) return { el: to.hash, behavior: 'smooth' }
        return { top: 0 }
    },
}
