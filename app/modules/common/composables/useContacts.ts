import { CONTACTS } from '~/modules/common/constants/contacts'
import { useSiteSettingsStore } from '~/modules/site-settings/SiteSettingsStore'
import type { DayHours } from '~/modules/site-settings/types'

const DAY_LABELS = {
    weekdays: 'Понеділок — П\'ятниця',
    saturday: 'Субота',
    sunday: 'Неділя',
} as const

// +380508520594 -> +380 (50) 852 05 94
export function formatPhone(raw: string): string {
    const match = raw.match(/^\+380(\d{2})(\d{3})(\d{2})(\d{2})$/)
    return match ? `+380 (${match[1]}) ${match[2]} ${match[3]} ${match[4]}` : raw
}

function formatHours(hours: DayHours): string {
    return hours ? `${hours.from} — ${hours.to}` : 'Вихідний'
}

interface SiteContacts {
    PHONE_1: string
    PHONE_1_HREF: string
    PHONE_2: string
    PHONE_2_HREF: string
    EMAIL: string
    EMAIL_HREF: string
    SCHEDULE: { day: string; time: string }[]
    SOCIALS: { name: string; href: string; color: string; icon: string }[]
}

function socialHref(name: string, phone: string): string {
    if (name === 'Viber') return `viber://chat?number=${encodeURIComponent(phone)}`
    if (name === 'WhatsApp') return `https://wa.me/${phone.replace(/\D/g, '')}`
    return `https://t.me/${phone}`
}

// Контакти з налаштувань сайту (адмінка); якщо API недоступний — значення за замовчуванням з constants/contacts.ts
export function useContacts() {
    const store = useSiteSettingsStore()

    return computed<SiteContacts>(() => {
        const settings = store.settings
        if (!settings) return CONTACTS as unknown as SiteContacts

        const { phone1, phone2, email, messengerPhone, schedule } = settings

        return {
            PHONE_1: formatPhone(phone1),
            PHONE_1_HREF: `tel:${phone1}`,
            PHONE_2: phone2 ? formatPhone(phone2) : '',
            PHONE_2_HREF: phone2 ? `tel:${phone2}` : '',
            EMAIL: email ?? '',
            EMAIL_HREF: email ? `mailto:${email}` : '',
            SCHEDULE: (Object.keys(DAY_LABELS) as (keyof typeof DAY_LABELS)[]).map((key) => ({
                day: DAY_LABELS[key],
                time: formatHours(schedule[key]),
            })),
            SOCIALS: messengerPhone
                ? CONTACTS.SOCIALS.map((social) => ({ ...social, href: socialHref(social.name, messengerPhone) }))
                : [],
        }
    })
}
