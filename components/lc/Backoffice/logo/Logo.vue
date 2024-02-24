<script setup>
// import { computed } from 'vue'
// import LogoLight from "./LogoLight.vue";
// import LogoDark from "./LogoDark.vue";
// import { useCustomizerStore } from '@/stores/customizer'

// const customizer = useCustomizerStore()

// const dark = ref(false);
// const _dark = computed(() => {
//   if (
//     customizer.actTheme === 'DARK_BLUE_THEME' ||
//     customizer.actTheme === 'DARK_AQUA_THEME' ||
//     customizer.actTheme === 'DARK_ORANGE_THEME' ||
//     customizer.actTheme === 'DARK_PURPLE_THEME' ||
//     customizer.actTheme === 'DARK_GREEN_THEME' ||
//     customizer.actTheme === 'DARK_CYAN_THEME'
//   ) {
//     return true
//   } else {
//     return false
//   }
// })
</script>
<template>
  <div class="logo">
    <NuxtLink to="/backoffice">
      <img src="~/assets/img/e-campuss-revisi.png" class="w-100">
    </NuxtLink>
  </div>
  <!-- <LcBackofficeLogoLight v-if="dark" /> -->
  <!-- <LcBackofficeLogoDark v-else /> -->
</template>
