
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';

const props = defineProps({
    getBuildingListData: Array as any,
});

onMounted(() => {
    detailBuilding.value = <GetBuildingListData>props.getBuildingListData
});
const detailBuilding = ref(<GetBuildingListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailBuilding.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailBuilding.code" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
