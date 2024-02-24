
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';
import { ErrorRoot } from '~~/types/api/error';
import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';

const props = defineProps({
    getSemesterListData: Array as any,
});

onMounted(() => {
    ori.value = <GetSemesterListData>props.getSemesterListData
    getSemesterDetailData()
});
const ori = ref(<GetSemesterListData>{});
const detailSemester = ref(<GetSemesterDetailData>{
    id: '',
    semester_start_year: 0,
    school_year: '',
    semester_type: '',
    is_active: false,
    start_date: '',
    end_date: '',
    study_plan_input_start_date: '',
    study_plan_input_end_date: '',
    study_plan_approval_start_date: '',
    study_plan_approval_end_date: '',
    reference_semester_id: '',
    reference_semester_start_year: 0,
    reference_school_year: '',
    reference_semester_type: '',
    check_minimum_gpa: false,
    check_passed_credit: false,
    default_credit: 0,
    midterm_start_date: '',
    midterm_end_date: '',
    endterm_start_date: '',
    endterm_end_date: '',
    grading_start_date: '',
    grading_end_date: '',
    curriculums: [],
});

async function getSemesterDetailData() {
    try {
        const { response: resp, error: error } = await getSemesterDetail(ori.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            detailSemester.value = resp?.data
            curiculumns.value = []
            detailSemester.value.curriculums.forEach((c) => {
                curiculumns.value.push(
                    {
                        title: c.study_program_name,
                        value: c.curriculum_name,
                    }
                )
            })
        }
    } catch (error) {
        alert(error)
    }
}
let curiculumns = ref(<any[]>[])
</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Semester</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesBackofficeSemesterDetailItem title="Semester" :value="ori.school_year" />
                <PagesBackofficeSemesterDetailItemGroup title="Kurikulum yang Digunakan :" :value="curiculumns" />
                <PagesBackofficeSemesterDetailItemGroup title="PERIODE MULAI RENCANA STUDI :" :value="[
                    {
                        title: 'Tanggal Mulai',
                        value: detailSemester.start_date.substring(0, 10),
                    },
                    {
                        title: 'Tanggal Selesai',
                        value: detailSemester.end_date.substring(0, 10),
                    },
                ]" />
                <PagesBackofficeSemesterDetailItemGroup title="PERIODE PERSETUJUAN KRS :" :value="[
                    {
                        title: 'Tanggal Mulai',
                        value: detailSemester.study_plan_approval_start_date.substring(0, 10),
                    },
                    {
                        title: 'Tanggal Selesai',
                        value: detailSemester.study_plan_approval_end_date.substring(0, 10),
                    },
                ]" />
                <PagesBackofficeSemesterDetailItemGroup title="INPUT NILAI ONLINE :" :value="[
                    {
                        title: 'Tanggal Mulai',
                        value: detailSemester.study_plan_input_start_date.substring(0, 10),
                    },
                    {
                        title: 'Tanggal Selesai',
                        value: detailSemester.study_plan_input_end_date.substring(0, 10),
                    },
                ]" />
                <PagesBackofficeSemesterDetailItemGroup title="UTS :" :value="[
                    {
                        title: 'Tanggal Mulai',
                        value: detailSemester.midterm_start_date.substring(0, 10),
                    },
                    {
                        title: 'Tanggal Selesai',
                        value: detailSemester.midterm_end_date.substring(0, 10),
                    },
                ]" />
                <PagesBackofficeSemesterDetailItemGroup title="UAS :" :value="[
                    {
                        title: 'Tanggal Mulai',
                        value: detailSemester.endterm_start_date.substring(0, 10),
                    },
                    {
                        title: 'Tanggal Selesai',
                        value: detailSemester.endterm_end_date.substring(0, 10),
                    },
                ]" />
                <PagesBackofficeSemesterDetailItem title="Cek Prasyarat IPK"
                    :value="detailSemester.check_minimum_gpa ? 'Ya' : 'Tidak'" />
                <PagesBackofficeSemesterDetailItem title="Cek Prasyarat Jumlah sks Lulus"
                    :value="detailSemester.check_passed_credit.toString()" />
                <PagesBackofficeSemesterDetailItem title="SKS Default" :value="detailSemester.default_credit ? 'Ya' : 'Tidak'" />

            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
