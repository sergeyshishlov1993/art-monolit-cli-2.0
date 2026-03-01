<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div class="theme-switcher" @click="toggleTheme">
    <div class="theme-switcher__track" :class="theme === 'light' ? 'theme-switcher__track--light' : ''">
      <svg class="theme-switcher__icon theme-switcher__icon--moon" style="width: 12px; height: 12px;" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
      <svg class="theme-switcher__icon theme-switcher__icon--sun" style="width: 12px; height: 12px;" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
      </svg>
      <div class="theme-switcher__thumb" :class="theme === 'light' ? 'theme-switcher__thumb--on' : ''" />
    </div>
  </div>
</template>

<style scoped>
.theme-switcher {
  cursor: pointer;
  user-select: none;
}

.theme-switcher__track {
  position: relative;
  width: 48px;
  height: 26px;
  border-radius: 13px;
  background: #333333;
  border: 1px solid #555555;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.theme-switcher__track--light {
  background: var(--gold);
  border-color: var(--gold);
}

.theme-switcher__icon {
  position: absolute;
  z-index: 1;
}

.theme-switcher__icon--moon {
  left: 7px;
  color: #ffd700;
}

.theme-switcher__icon--sun {
  right: 7px;
  color: #ffffff;
}

.theme-switcher__thumb {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  left: 3px;
  transition: transform 0.3s;
}

.theme-switcher__thumb--on {
  transform: translateX(22px);
}
</style>
