<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useCustomizerStore } from '@/stores/customizer'
const customizer = useCustomizerStore()
const title = ref('Modernize - Nuxt3 Typescript based Admin Dashboard Template')
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Nuxt3 Typescript based Admin Dashboard Template`
      : 'Modernize - Nuxt3 Typescript based Admin Dashboard Template'
  }
})
</script>
<template>
  <v-locale-provider>
    <v-app
      :theme="customizer.actTheme"
      :class="[
        customizer.actTheme,
        customizer.mini_sidebar ? 'mini-sidebar' : '',
        customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
        customizer.setBorderCard ? 'cardBordered' : ''
      ]"
    >
      <LcBackofficeCustomizer />
      <LcBackofficeVerticalSidebar v-if="!customizer.setHorizontalLayout" />
      <LcBackofficeVerticalHeader v-if="!customizer.setHorizontalLayout" />
      <v-main>
        <v-container fluid class="page-wrapper pb-sm-15 pb-10">
          <div :class="customizer.boxed ? 'maxWidth' : ''">
            <RouterView />
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<style>
.v-field-label--floating {
    opacity: 0.8 !important;
    color: black !important;
}
</style>
