
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetYudiciumListData } from '~~/types/api/yudicium/GetYudiciumList';

const props = defineProps({
    getYudiciumListData: Array as any,
});

onMounted(() => {
    detailYudicium.value = <GetYudiciumListData>props.getYudiciumListData
});
const detailYudicium = ref(<GetYudiciumListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailYudicium.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailYudicium.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
