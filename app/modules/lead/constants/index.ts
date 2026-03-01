export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELED'

export type LeadSource =
    | 'website'
    | 'contact_page'
    | 'product_card'
    | 'catalog'
    | 'phone'
    | 'telegram'
    | 'viber'
    | 'instagram'
    | 'referral'
    | 'other'

export const STATUS_OPTIONS: readonly { value: '' | LeadStatus; label: string }[] = [
    { value: '', label: 'Усі' },
    { value: 'NEW', label: 'Нові' },
    { value: 'IN_PROGRESS', label: 'В роботі' },
    { value: 'DONE', label: 'Виконані' },
    { value: 'CANCELED', label: 'Скасовані' },
]

export const STATUS_LABELS: Record<LeadStatus, { label: string; variant: string }> = {
    NEW: { label: 'Нова', variant: 'blue' },
    IN_PROGRESS: { label: 'В роботі', variant: 'yellow' },
    DONE: { label: 'Виконана', variant: 'green' },
    CANCELED: { label: 'Скасована', variant: 'gray' },
}

export const SOURCE_OPTIONS: readonly { value: '' | LeadSource; label: string }[] = [
    { value: '', label: 'Усі джерела' },
    { value: 'website', label: 'Сайт' },
    { value: 'contact_page', label: 'Контакти' },
    { value: 'product_card', label: 'Картка товару' },
    { value: 'catalog', label: 'Каталог' },
    { value: 'phone', label: 'Телефон' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'viber', label: 'Viber' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'referral', label: 'Рекомендація' },
    { value: 'other', label: 'Інше' },
]

export const SOURCE_LABELS: Record<LeadSource, string> = {
    website: 'Сайт',
    contact_page: 'Контакти',
    product_card: 'Картка товару',
    catalog: 'Каталог',
    phone: 'Телефон',
    telegram: 'Telegram',
    viber: 'Viber',
    instagram: 'Instagram',
    referral: 'Рекомендація',
    other: 'Інше',
}