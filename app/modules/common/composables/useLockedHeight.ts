import type { Ref } from 'vue'

// Плавно знімає зафіксовану висоту списку після заміни контенту (і при зменшенні, і при збільшенні),
// щоб сторінка та футер не «стрибали»
export async function releaseLockedHeight(lockedHeight: Ref<number | null>, element: HTMLElement | null): Promise<void> {
    const from = lockedHeight.value
    lockedHeight.value = null
    if (from === null || !element) return

    await nextTick()
    const to = element.offsetHeight
    if (Math.abs(to - from) < 2) return

    element.style.height = `${from}px`
    element.style.overflow = 'hidden'
    void element.offsetHeight
    element.style.transition = 'height 0.3s ease'
    element.style.height = `${to}px`

    setTimeout(() => {
        element.style.transition = ''
        element.style.height = ''
        element.style.overflow = ''
    }, 350)
}
