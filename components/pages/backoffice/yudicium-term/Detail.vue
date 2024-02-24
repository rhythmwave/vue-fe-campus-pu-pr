
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetYudiciumTermListData } from '~~/types/api/yudicium-term/GetYudiciumTermList';

const props = defineProps({
    getYudiciumTermListData: Array as any,
});

onMounted(() => {
    detailYudiciumTerm.value = <GetYudiciumTermListData>props.getYudiciumTermListData
});
const detailYudiciumTerm = ref(<GetYudiciumTermListData>{});
console.log(detailYudiciumTerm.value)
</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Yudisium</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Syarat" :value="detailYudiciumTerm.term" />
                <PagesStudyProgramsDetailItem title="Keterangan" :value-number="detailYudiciumTerm.remarks" />
                <PagesStudyProgramsDetailItem title="Program Studi" :value-number="detailYudiciumTerm.study_program_name" />
                <PagesStudyProgramsDetailItem title="Kurikulum" :value-number="detailYudiciumTerm.curriculum_name" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
