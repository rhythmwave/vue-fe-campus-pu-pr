<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';
import { useEcomStore } from '@/stores/apps/eCommerce';
// Icon Imports
import { GridDotsIcon, LanguageIcon, SearchIcon, Menu2Icon, BellRingingIcon, ShoppingCartIcon } from 'vue-tabler-icons';
const customizer = useCustomizerStore();
const showSearch = ref(false);
const drawer = ref(false);
const appsdrawer = ref(false);
const priority = ref(customizer.setHorizontalLayout ? 0 : 0);
function searchbox() {
    showSearch.value = !showSearch.value;
}
// const user = useAuth()
watch(priority, (newPriority) => {
    // yes, console.log() is a side effect
    priority.value = newPriority;
});
// count items
const store = useEcomStore();
const getCart = computed(() => {
    return store.cart;
});

</script>

<template>
    <v-app-bar elevation="0" :priority="priority" height="70" class="">
        <div class="pa-5">
            <NuxtLink to="/academic-portal" ><LcAcademicPortalLogo /></NuxtLink>
        </div>
        <!-- ---------------------------------------------- -->
        <!-- Search part -->
        <!-- ---------------------------------------------- -->
        <!-- <v-sheet class="">
            <LcAcademicPortalVerticalHeaderSearchbar />
        </v-sheet> -->

        <!---/Search part -->

        <!-- ---------------------------------------------- -->
        <!-- Mega menu -->
        <!-- ---------------------------------------------- -->
        <div class="hidden-md-and-down">
            <LcAcademicPortalVerticalHeaderNavigations />
        </div>
        <v-spacer />
        <!-- ---------------------------------------------- -->
        <!---right part -->
        <!-- ---------------------------------------------- -->
        <!-- ---------------------------------------------- -->
        <!-- translate -->
        <!-- ---------------------------------------------- -->
        <!-- <LcAcademicPortalVerticalHeaderLanguageDD /> -->

        <!-- ------------------------------------------------>
        <!-- Notification -->
        <!-- ------------------------------------------------>
        <!-- <LcAcademicPortalVerticalHeaderNotificationDD /> -->


        <!-- right sidebar -->
        <v-btn variant="text" color="primary" class="hidden-lg-and-up custom-hover-primary ml-3" icon
            @click.stop="appsdrawer = !appsdrawer">
            <GridDotsIcon size="17"/>
        </v-btn>

        <!-- ---------------------------------------------- -->
        <!-- User Profile -->
        <!-- ---------------------------------------------- -->
        <div class="ml-3">
            <LcAcademicPortalVerticalHeaderProfileDD />
        </div>
    </v-app-bar>


    <!-- ---------------------------------------------- -->
    <!-- Right Sidebar -->
    <!-- ---------------------------------------------- -->
    <v-navigation-drawer v-model="appsdrawer" location="right" temporary>
        <LcAcademicPortalVerticalHeaderRightMobileSidebar />
    </v-navigation-drawer>
</template>
