
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
const props = defineProps({
    title: String,
    link: String,
    color: String,
});
</script>

<template>
    <NuxtLink :href="link" class="text-decoration-none">
        <div>
            <Vspace space="4"></Vspace>
            <Vspace space="4"></Vspace>
            <div :style="'background-color: '+color+';'">
                <v-row>
                <v-col cols="2">
                    <img src="/images/svgs/icon-dd-application.svg" width="50" height="50" />
                </v-col>
                <v-col cols="10">
                    <h4 style="color:white;">{{ title }}</h4>
                    <h6 style="color:black;" class="font-italic">Baca selengkapnya ...</h6>
                </v-col>
                </v-row>
            </div>
        </div>
    </NuxtLink>
</template>

<style lang="scss">
</style>
