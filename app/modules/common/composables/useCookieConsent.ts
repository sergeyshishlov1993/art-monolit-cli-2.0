export type CookieConsent = 'granted' | 'denied'

export function useCookieConsent() {
    const consent = useCookie<CookieConsent | null>('cookie-consent', {
        maxAge: 60 * 60 * 24 * 180,
        sameSite: 'lax',
        default: () => null,
    })

    return { consent }
}
