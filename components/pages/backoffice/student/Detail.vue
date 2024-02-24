
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentListData } from '~~/types/api/student/GetStudentList';

const props = defineProps({
    getStudentListData: Array as any,
});

onMounted(() => {
    detailStudent.value = <GetStudentListData>props.getStudentListData
});
const detailStudent = ref(<GetStudentListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailStudent.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailStudent.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
