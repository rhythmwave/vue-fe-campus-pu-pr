<script setup lang="ts">
import { ref } from 'vue';
import { AppsIcon, HomeIcon,Book2Icon } from 'vue-tabler-icons';
const open = ref(['Apps']);
</script>

<template>
    <div class="pt-6">
        <h5 class="text-h5 mb-4 px-5">Navigation</h5>
        <v-list-item>
            <template v-slot:prepend>
                <HomeIcon width="21" stroke-width="1.5" />
            </template>
            <NuxtLink to="/academic-portal" class="text-decoration-none custom-text-primary">  
                <h5 class="text-subtitle-1 ml-2 custom-title">Home</h5>
            </NuxtLink>
        </v-list-item>
        <v-list v-model:opened="open">
            <v-list-group value="Academics">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props">
                        <template v-slot:prepend>
                            <AppsIcon width="21" stroke-width="1.5" />
                        </template>
                        <h5 class="text-subtitle-1 ml-2">Academics</h5>
                    </v-list-item>
                </template>
                <v-list-item class="pl-0 pb-6">
                    <div>
                        <LcAcademicPortalVerticalHeaderAcademicsLink />
                    </div>
                </v-list-item>
            </v-list-group>
            <v-list-group value="VirtualClass">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props">
                        <template v-slot:prepend>
                            <AppsIcon width="21" stroke-width="1.5" />
                        </template>
                        <h5 class="text-subtitle-1 ml-2">Virtual Class</h5>
                    </v-list-item>
                </template>
                <v-list-item class="pl-0 pb-6">
                    <div>
                        <LcAcademicPortalVerticalHeaderVirtualClassLink />
                    </div>
                </v-list-item>
            </v-list-group>
            <v-list-item to="">
                <template v-slot:prepend>
                    <Book2Icon width="21" stroke-width="1.5" />
                </template>
                <NuxtLink to="/academic-portal/user-manual" class="text-decoration-none custom-text-primary">  
                    <h5 class="text-subtitle-1 ml-2 custom-title">User Manual</h5>
                </NuxtLink>
            </v-list-item>
        </v-list>
        <!-- <div class="px-5">
            <h5 class="text-h5 my-4">Quick Links</h5>
            <LcAcademicPortalVerticalHeaderQuickLinks />
        </div> -->
    </div>
</template>

<style scoped>
.right-sidebar .v-list-group__items .v-list-item {
    padding-inline-start: 26px !important;
}
</style>
