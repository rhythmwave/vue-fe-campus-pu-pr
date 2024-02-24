<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useCustomizerStore } from '@/stores/customizer';
import { pl, zhHans } from 'vuetify/locale'
const customizer = useCustomizerStore();
const title = ref("Portal Akademik");
useHead({
  meta: [{ content: title }],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `Portal Akademik`
      : "Portal Akademik";
  },
});
</script>

<template>
    <v-locale-provider >
        <v-app
            :theme="customizer.actTheme"
            :class="[
                customizer.actTheme,
                customizer.mini_sidebar ? 'mini-sidebar' : '',
                customizer.setHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
                customizer.setBorderCard ? 'cardBordered' : ''
            ]"
        >
            <LcAcademicPortalCustomizer/>
            <LcAcademicPortalVerticalHeader/>
            <v-main>
               <v-container fluid class="page-wrapper pb-sm-15 pb-10">
                    <div :class="customizer.boxed ? 'maxWidth' : ''">
                        <RouterView />
                        <!-- <v-btn
                            class="customizer-btn"
                            size="large"
                            icon
                            variant="flat"
                            color="primary"
                            @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
                        >
                            <SettingsIcon />
                        </v-btn> -->
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
