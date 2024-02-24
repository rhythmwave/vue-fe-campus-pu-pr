<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';
import sidebarItems from './sidebarItem';
import { LoginData } from '~~/types/api/auth/Login';
import { menu } from '~~/components/lc/Full/horizontal-sidebar/horizontalItems';
const customizer = useCustomizerStore();
const sidebarMenu = shallowRef(sidebarItems());

onMounted(() => {
  const userData = <LoginData>useAuth().value;
  if (userData.app_type != "root") {
    var menus = sidebarMenu.value.filter(function (sb: menu) {
      return userData.permission_names.indexOf(<string>sb.title) != -1;
    });
    sidebarMenu.value = menus;
    console.log(" sidebarMenu.value")
    // console.log(sidebarMenu.value)
  }
})
</script>

<template>
    <v-navigation-drawer
        left
        v-model="customizer.Sidebar_drawer"
        elevation="0"
        rail-width="75"
        mobile-breakpoint="960"
        app
        class="leftSidebar"
        :rail="customizer.mini_sidebar"
        expand-on-hover width="270"
    >
        <!---Logo part -->
        <div class="pa-5">
            <LcBackofficeLogo />
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <perfect-scrollbar class="scrollnavbar">
            <v-list class="pa-6" density="compact">
                <!---Menu Loop -->
                <template v-for="(item, i) in sidebarMenu">
                    <!---Item Sub Header -->
                    <LcBackofficeVerticalSidebarNavGroup :item="item" v-if="item.header" :key="item.title" />
                    <!---If Has Child -->
                    <LcBackofficeVerticalSidebarNavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
                    <!---Single Item-->
                    <LcBackofficeVerticalSidebarNavItem :item="item" v-else class="leftPadding" />
                    <!---End Single Item-->
                </template>
            </v-list>
            <div class="pa-6 userbottom">
                <LcBackofficeVerticalSidebarProfile/>
            </div>
        </perfect-scrollbar>
    </v-navigation-drawer>
</template>
