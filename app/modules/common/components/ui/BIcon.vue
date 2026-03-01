<script setup lang="ts">
import * as outlineIcons from '@heroicons/vue/24/outline'
import * as solidIcons from '@heroicons/vue/24/solid'

interface Props {
  name: string
  variant?: 'solid' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outline',
  size: 'md',
})

const sizeMap: Record<string, string> = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
}

function toPascalCase(str: string): string {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
}

const iconComponent = computed(() => {
  const pascal = toPascalCase(props.name) + 'Icon'
  const icons = props.variant === 'solid' ? solidIcons : outlineIcons
  return (icons as Record<string, unknown>)[pascal] ?? null
})

const iconStyle = computed(() => ({
  width: sizeMap[props.size],
  height: sizeMap[props.size],
  minWidth: sizeMap[props.size],
  minHeight: sizeMap[props.size],
  display: 'block',
}))
</script>

<template>
  <component v-if="iconComponent" :is="iconComponent" :style="iconStyle" />
</template>
