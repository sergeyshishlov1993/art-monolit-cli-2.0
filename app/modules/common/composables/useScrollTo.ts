export function scrollToElement(element: HTMLElement | null, offset = 90): void {
    if (!element) return

    const top = Math.max(window.scrollY + element.getBoundingClientRect().top - offset, 0)
    if (Math.abs(top - window.scrollY) < 8) return

    window.scrollTo({ top, behavior: 'smooth' })
}
