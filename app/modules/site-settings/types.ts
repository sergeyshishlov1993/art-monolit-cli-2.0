export type DayHours = { from: string; to: string } | null

export interface SiteSchedule {
    weekdays: DayHours
    saturday: DayHours
    sunday: DayHours
}

export interface StoreSettings {
    id: string
    city: string
    address: string
    // Якщо порожнє — карта будується за адресою
    mapEmbedUrl: string | null
    logo: string | null
}

export interface SiteSettings {
    phone1: string
    phone2: string | null
    email: string | null
    messengerPhone: string | null
    schedule: SiteSchedule
    stores: StoreSettings[]
    citySelectorModal: boolean
    citySwitcherHeader: boolean
}
