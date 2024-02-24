
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetOfficerActionListData } from '~~/types/api/officer-action/GetOfficerActionList';

const props = defineProps({
    getOfficerActionListData: Array as any,
});

onMounted(() => {
    detailOfficerAction.value = <GetOfficerActionListData>props.getOfficerActionListData
});
const detailOfficerAction = ref(<GetOfficerActionListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailOfficerAction.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailOfficerAction.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
