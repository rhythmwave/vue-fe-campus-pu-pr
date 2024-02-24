
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentStudentLeaveListData } from '~~/types/api/student-student-leave/GetStudentStudentLeaveList';

const props = defineProps({
    getStudentStudentLeaveListData: Array as any,
});

onMounted(() => {
    detailStudentStudentLeave.value = <GetStudentStudentLeaveListData>props.getStudentStudentLeaveListData
});
const detailStudentStudentLeave = ref(<GetStudentStudentLeaveListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailStudentStudentLeave.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailStudentStudentLeave.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
