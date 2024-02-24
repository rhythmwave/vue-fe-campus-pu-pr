
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetGradeComponentListData } from '~~/types/api/grade-component/GetGradeComponentList';

const props = defineProps({
    getGradeComponentListData: Array as any,
});

onMounted(() => {
    detailGradeComponent.value = <GetGradeComponentListData>props.getGradeComponentListData
});
const detailGradeComponent = ref(<GetGradeComponentListData>{});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Jenis Komponen Nilai</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Program Studi" :value="detailGradeComponent.study_program_name" />
                <PagesStudyProgramsDetailItem title="Kategori Mata Kuliah"
                    :value="detailGradeComponent.subject_category_name" />
                <PagesStudyProgramsDetailItem title="Nama Jenis Komponen Nilai" :value="detailGradeComponent.name" />
                <PagesStudyProgramsDetailItem title="Status"
                    :value="detailGradeComponent.is_active ? 'Aktif' : 'Tidak Aktif'" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
