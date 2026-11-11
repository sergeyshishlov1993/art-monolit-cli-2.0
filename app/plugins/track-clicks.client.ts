import { trackEvent } from '~/modules/common/composables/useTrack'

const CLICK_EVENTS: Array<{ selector: string; event: string }> = [
    { selector: 'a[href^="tel:"]', event: 'click_phone' },
    { selector: 'a[href*="t.me"], a[href^="viber:"], a[href*="wa.me"]', event: 'click_messenger' },
]

export default defineNuxtPlugin(() => {
    document.addEventListener('click', (clickEvent) => {
        const target = clickEvent.target as HTMLElement | null
        if (!target) return

        for (const { selector, event } of CLICK_EVENTS) {
            const link = target.closest<HTMLAnchorElement>(selector)
            if (link) {
                trackEvent(event, { link_url: link.getAttribute('href') })
                return
            }
        }
    })
})
