<script setup>
import { ref } from 'vue';
import { HelpIcon,ChevronDownIcon } from 'vue-tabler-icons';

const user = useAuth()
var height = user.value.app_type == "lecturer" ? 210 : user.value.app_type == "student" ? 392 : 0;
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- mega menu DD -->
    <!-- ---------------------------------------------- -->
    
    <NuxtLink  to='/academic-portal' class="text-decoration-none">
        <v-btn variant="text" color="primary">Home </v-btn>
    </NuxtLink>
    <v-menu open-on-hover :close-on-content-click="true">
        <template v-slot:activator="{ props }">
            <v-btn class="hidden-sm-and-down custom-hover-primary" rounded="sm" variant="text" color="primary" v-bind="props"> Academics  <ChevronDownIcon size="18" class="mt-1 ml-1" /> </v-btn>
        </template>
        <v-sheet width="900" :height="height" elevation="10" rounded="md" class="pa-4 pb-0">
            <div>
                <v-row>
                    <v-col cols="12" lg="12" class="d-flex py-0">
                        <div class="pa-4 pb-0 pr-0">
                            <LcAcademicPortalVerticalHeaderAcademicsLink />
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-sheet>
    </v-menu>
    <v-menu open-on-hover :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn class="hidden-sm-and-down custom-hover-primary" rounded="sm" variant="text" color="primary" v-bind="props"> Virtual Class  <ChevronDownIcon size="18" class="mt-1 ml-1" /> </v-btn>
        </template>
        <v-sheet width="900" height="260" elevation="10" rounded="md" class="pa-4 pb-0">
            <div>
                <v-row>
                    <v-col cols="12" lg="12" class="d-flex py-0">
                        <div class="pa-4 pb-0 pr-0">
                            <LcAcademicPortalVerticalHeaderVirtualClassLink/>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-sheet>
    </v-menu>
    <NuxtLink to="/academic-portal/user-manual" class="text-decoration-none">
        <v-btn variant="text" color="primary">User Manual </v-btn>
    </NuxtLink>
</template>
