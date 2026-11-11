import { captureUtm } from '~/modules/common/composables/useUtm'

export default defineNuxtPlugin(() => {
    captureUtm(useRoute().query)
})
