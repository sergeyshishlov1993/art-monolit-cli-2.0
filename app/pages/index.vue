<script setup lang="ts">
import SectionHero from "~/modules/hero/components/section/SectionHero.vue";
import SectionAdvantages from '~/modules/hero/components/section/SectionAdvantages.vue'
import SectionCategories from '~/modules/hero/components/section/SectionCategories.vue'
import SectionWorks from '~/modules/hero/components/section/SectionWorks.vue'
import SectionSteps from '~/modules/hero/components/section/SectionSteps.vue'
import SectionContact from '~/modules/hero/components/section/SectionContact.vue'
import SectionMap from '~/modules/hero/components/section/SectionMap.vue'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'ART MONOLIT — Вироби з натурального каменю',
  description: 'Каменеобробне підприємство. Пам\'ятники, вироби з мармуру та граніту від виробника.',
})
</script>

<template>
  <div>
    <SectionHero />
    <SectionAdvantages />
    <SectionCategories />
    <SectionWorks />
    <SectionSteps />
    <SectionContact />
    <SectionMap />
  </div>
</template>