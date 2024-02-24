
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerResignationListData } from '~~/types/api/lecturer-resignation/GetLecturerResignationList';

const props = defineProps({
    getLecturerResignationListData: Array as any,
});

onMounted(() => {
    detailLecturerResignation.value = <GetLecturerResignationListData>props.getLecturerResignationListData
});
const detailLecturerResignation = ref(<GetLecturerResignationListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailLecturerResignation.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailLecturerResignation.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
