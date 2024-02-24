
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetLessonPlanListData } from '~~/types/api/lesson-plan/GetLessonPlanList';

const props = defineProps({
    getLessonPlanListData: Array as any,
});

onMounted(() => {
    detailLessonPlan.value = <GetLessonPlanListData>props.getLessonPlanListData
});
const detailLessonPlan = ref(<GetLessonPlanListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama" :value="detailLessonPlan.name" />
                <PagesStudyProgramsDetailItem title="Umur" :value-number="detailLessonPlan.age" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
