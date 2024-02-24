
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetYudiciumSessionListData } from '~~/types/api/yudicium-session/GetYudiciumSessionList';

const props = defineProps({
    getYudiciumSessionListData: Array as any,
});

onMounted(() => {
    detailYudiciumSession.value = <GetYudiciumSessionListData>props.getYudiciumSessionListData
});
const detailYudiciumSession = ref(<GetYudiciumSessionListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailYudiciumSession.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailYudiciumSession.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
