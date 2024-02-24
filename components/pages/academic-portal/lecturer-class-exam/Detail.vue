
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerClassExamListData } from '~~/types/api/lecturer-class-exam/GetLecturerClassExamList';

const props = defineProps({
    getLecturerClassExamListData: Array as any,
});

onMounted(() => {
    detailLecturerClassExam.value = <GetLecturerClassExamListData>props.getLecturerClassExamListData
});
const detailLecturerClassExam = ref(<GetLecturerClassExamListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailLecturerClassExam.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailLecturerClassExam.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
