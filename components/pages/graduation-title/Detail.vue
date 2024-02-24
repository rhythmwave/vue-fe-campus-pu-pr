<script setup lang="ts">
import { ErrorRoot } from '~~/types/api/error';
import { GetGraduationPredicateDetailData } from '~~/types/api/graduation-title/GetGraduationPredicateDetail';

const props = defineProps({
    data: Object as any,
});

</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Predikat Kelulusan</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesGraduationTitleDetailItem title="Predikat" :value="data.predicate" />
                <PagesGraduationTitleDetailItem title="IPK Minimal" :value="data.minimum_gpa?.toString()" />
                <PagesGraduationTitleDetailItem title="Batas Mengulang" :value="data.repeat_course_limit?.toString()" />
                <PagesGraduationTitleDetailItem title="Batas Nilai C" :value="data.below_minimum_grade_point_limit?.toString()" />
            </tbody>
        </v-table>
    </v-card>
</template>