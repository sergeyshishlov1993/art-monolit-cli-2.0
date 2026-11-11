import type { DayHours, SiteSchedule } from '~/modules/site-settings/types'

const TIME_ZONE = 'Europe/Kyiv'
const WEEKDAY_LABELS: Record<string, string> = {
    Mon: 'у понеділок',
    Tue: 'у вівторок',
    Wed: 'у середу',
    Thu: 'у четвер',
    Fri: 'у п\'ятницю',
    Sat: 'у суботу',
    Sun: 'у неділю',
}

export interface WorkingStatus {
    open: boolean
    // «до 18:00» коли відкрито; «завтра о 09:00» / «у понеділок о 09:00» коли зачинено
    text: string
}

function kyivParts(date: Date): { weekday: string; time: string } {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: TIME_ZONE,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(date)
    const part = (type: string): string => parts.find((item) => item.type === type)?.value ?? ''
    return { weekday: part('weekday'), time: `${part('hour')}:${part('minute')}` }
}

function hoursFor(schedule: SiteSchedule, weekday: string): DayHours {
    if (weekday === 'Sat') return schedule.saturday
    if (weekday === 'Sun') return schedule.sunday
    return schedule.weekdays
}

export function getWorkingStatus(schedule: SiteSchedule, now: Date = new Date()): WorkingStatus {
    const { weekday, time } = kyivParts(now)
    const today = hoursFor(schedule, weekday)

    if (today && time >= today.from && time < today.to) {
        return { open: true, text: `до ${today.to}` }
    }

    if (today && time < today.from) {
        return { open: false, text: `сьогодні о ${today.from}` }
    }

    // Наступний робочий день (шукаємо до 7 днів уперед)
    for (let offset = 1; offset <= 7; offset++) {
        const date = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000)
        const next = kyivParts(date).weekday
        const hours = hoursFor(schedule, next)
        if (hours) {
            const label = offset === 1 ? 'завтра' : WEEKDAY_LABELS[next]
            return { open: false, text: `${label} о ${hours.from}` }
        }
    }

    return { open: false, text: '' }
}

