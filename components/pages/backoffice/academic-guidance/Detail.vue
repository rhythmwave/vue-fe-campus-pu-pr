
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetAcademicGuidanceListData } from '~~/types/api/academic-guidance/GetAcademicGuidanceList';

const props = defineProps({
    getAcademicGuidanceListData: Array as any,
});

onMounted(() => {
    detailAcademicGuidance.value = <GetAcademicGuidanceListData>props.getAcademicGuidanceListData
});
const detailAcademicGuidance = ref(<GetAcademicGuidanceListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailAcademicGuidance.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailAcademicGuidance.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
