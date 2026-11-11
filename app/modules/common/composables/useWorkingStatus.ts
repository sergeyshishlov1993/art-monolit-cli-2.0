import { getWorkingStatus } from '~/modules/common/composables/workingStatus'
import { useSiteSettingsStore } from '~/modules/site-settings/SiteSettingsStore'

// Статус «зараз працюємо / зачинено» за графіком із налаштувань. Рахується в браузері (час змінюється), на сервері null
export function useWorkingStatus() {
    const settingsStore = useSiteSettingsStore()
    const now = ref<Date | null>(null)
    let timer: ReturnType<typeof setInterval> | undefined

    onMounted(() => {
        now.value = new Date()
        timer = setInterval(() => { now.value = new Date() }, 60_000)
    })

    onUnmounted(() => {
        if (timer) clearInterval(timer)
    })

    return computed(() => (now.value && settingsStore.settings ? getWorkingStatus(settingsStore.settings.schedule, now.value) : null))
}
