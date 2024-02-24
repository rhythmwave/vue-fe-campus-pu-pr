
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetSampleApiListData } from '~~/types/api/sample-api/GetSampleApiList';

const props = defineProps({
    getSampleApiListData: Array as any,
});

onMounted(() => {
    detailSampleApi.value = <GetSampleApiListData>props.getSampleApiListData
});
const detailSampleApi = ref(<GetSampleApiListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailSampleApi.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailSampleApi.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
