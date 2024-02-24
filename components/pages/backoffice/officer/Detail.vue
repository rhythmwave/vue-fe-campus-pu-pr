
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetOfficerListData } from '~~/types/api/officer/GetOfficerList';

const props = defineProps({
    getOfficerListData: Array as any,
});

onMounted(() => {
    detailOfficer.value = <GetOfficerListData>props.getOfficerListData
});
const detailOfficer = ref(<GetOfficerListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailOfficer.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailOfficer.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
