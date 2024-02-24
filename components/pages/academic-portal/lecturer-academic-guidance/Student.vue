
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerAcademicGuidanceListData } from '~~/types/api/lecturer-academic-guidance/GetLecturerAcademicGuidanceList';

const props = defineProps({
    getLecturerAcademicGuidanceListData: Array as any,
});

onMounted(() => {
    detailLecturerAcademicGuidance.value = <GetLecturerAcademicGuidanceListData>props.getLecturerAcademicGuidanceListData
});
const detailLecturerAcademicGuidance = ref(<GetLecturerAcademicGuidanceListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Mahasiswa</span>
        </v-card-title>
        <v-row>
            <v-col :cols="12">
                <PagesAcademicPortalLecturerAcademicGuidanceStudentItem v-for="itm in detailLecturerAcademicGuidance.students" :value="itm"/>
            </v-col>
        </v-row>
    </v-card>
</template>

<style lang="scss"></style>
