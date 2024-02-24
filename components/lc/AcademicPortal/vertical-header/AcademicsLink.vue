<script setup lang="ts">
import {academicsStudentsLink, academicsLecturersLink} from '@/_mockApis/headerPortalAcademicsData';

const user = useAuth()
var links = user.value.app_type == "lecturer"? academicsLecturersLink : user.value.app_type == "student"? academicsStudentsLink : [];
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- apps link -->
    <!-- ---------------------------------------------- -->
    <v-row>
        <v-col cols="12" lg="6" v-for="(item, i) in links" :key="i">
            <NuxtLink :to="item.href" class="text-decoration-none custom-text-primary">
                <div class="d-flex align-center">
                    <div class="ml-3">
                        <h6 class="text-subtitle-1 font-weight-bold mb-2 custom-title">{{ item.title }}</h6>
                    </div>
                </div>
            </NuxtLink>
        </v-col>
    </v-row>
</template>
