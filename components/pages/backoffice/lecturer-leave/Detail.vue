
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerLeaveListData } from '~~/types/api/lecturer-leave/GetLecturerLeaveList';

const props = defineProps({
    getLecturerLeaveListData: Array as any,
});

onMounted(() => {
    detailLecturerLeave.value = <GetLecturerLeaveListData>props.getLecturerLeaveListData
});
const detailLecturerLeave = ref(<GetLecturerLeaveListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Cuti Dosen</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailLecturerLeave.name" />
                <PagesStudyProgramsDetailItem title="Semester" :value="detailLecturerLeave.semester_type +' ' +detailLecturerLeave.semester_school_year" />
                <PagesStudyProgramsDetailItem title="Tanggal" :value="detailLecturerLeave.start_date? moment (detailLecturerLeave.start_date).format('DD MMM yyy HH:mm'):''" />
                <PagesStudyProgramsDetailItem title="Nomor Surat Izin Cuti" :value="detailLecturerLeave.permit_number" />
                <PagesStudyProgramsDetailItem title="Alasan Cuti" :value="detailLecturerLeave.purpose" />
                <PagesStudyProgramsDetailItem title="Catatan" :value="detailLecturerLeave.remarks" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
