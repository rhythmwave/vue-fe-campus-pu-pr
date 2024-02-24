
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentActivityListData } from '~~/types/api/student-activity/GetStudentActivityList';

const props = defineProps({
    getStudentActivityListData: Array as any,
});

onMounted(() => {
    detailStudentActivity.value = <GetStudentActivityListData>props.getStudentActivityListData
});
const detailStudentActivity = ref(<GetStudentActivityListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Aktifitas Mahasiswa</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailStudentActivity.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailStudentActivity.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
