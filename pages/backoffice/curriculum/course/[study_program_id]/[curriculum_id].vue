<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetSubjectListData } from '~~/types/api/subject/GetSubjectList';
import { GetAdminStudyProgramDetailData } from '~~/types/api/admin-study-program/GetAdminStudyProgramDetail';
import { GetCuriculumDetailData } from '~~/types/api/curiculum/GetCuriculumDetail';
import { GetFacultyListData } from '~~/types/api/faculty/GetFacultyList';

import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { getAdminStudyProgramDetail } from '~~/composables/api/admin-study-program/getAdminStudyProgramDetail';
import { getFacultyList } from '~~/composables/api/faculty/getFacultyList';
import { getCuriculumDetail } from '~~/composables/api/curiculum/getCuriculumDetail';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
const curriculum_id = ref('')
const subjects = ref(<GetSubjectListData[]>[])
const arrSubjects = ref(<GetSubjectListData[][]>[])
const study_program_id = ref('')
const study_program_detail = ref(<GetAdminStudyProgramDetailData>{})
const curriculum_detail = ref(<GetCuriculumDetailData>{})
const faculties = ref(<GetFacultyListData[]>[])
const faculty_detail = ref(<GetFacultyListData>{})
const sum_sks = ref({
    sks_mandatory: 0,
    sks_optional: 0,
    total: 0
})

async function getSubject(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getSubjectList(limit, page, '', [curriculum_id.value], '', '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            subjects.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function curiculumDetail() {
    try {
        const { response: resp, error: error } = await getCuriculumDetail(curriculum_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            curriculum_detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function getStudyProgramDetail() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramDetail(study_program_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            study_program_detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function getFaculty() {
    try {
        const { response: resp, error: error } = await getFacultyList(10000, 1, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            faculties.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    curriculum_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    study_program_id.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
    await getSubject(100000, 1)
    await getStudyProgramDetail()
    await getFaculty()

    for (let index = 0; index < faculties.value.length; index++) {
        const element = faculties.value[index];
        if(study_program_detail.value.faculty_id == element.id){
            faculty_detail.value = element
        }
    }
    await curiculumDetail()
    let temp = <GetSubjectListData[][]>[]
    for (let index = 0; index < subjects.value.length; index++) {
        if(!temp[subjects.value[index].semester_package]){
            temp[subjects.value[index].semester_package] = [subjects.value[index]]
        }else{
            temp[subjects.value[index].semester_package].push(subjects.value[index])
        }

        if(subjects.value[index].is_mandatory){
            sum_sks.value.sks_mandatory += (subjects.value[index].theory_credit + subjects.value[index].practicum_credit + subjects.value[index].field_practicum_credit)
        }else{
            sum_sks.value.sks_optional += (subjects.value[index].theory_credit + subjects.value[index].practicum_credit + subjects.value[index].field_practicum_credit)
        }
    }
    sum_sks.value.total = sum_sks.value.sks_mandatory + sum_sks.value.sks_optional
    for (const key in temp) {
        if (Object.prototype.hasOwnProperty.call(temp, key)) {
            const element = temp[key];
            arrSubjects.value.push(element)   
        }
    }
    await delay(1000)
    window.print()
})
</script>
<template>
    <div>
        <table style="width: 100%;">
            <thead>
                <tr>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_semarang.png" style="width: 100%;" />
                    </th>
                    <th>
                        <h4>KURIKULUM {{ curriculum_detail.name }}</h4>
                        <h4>PROGRAM STUDI {{ study_program_detail.name }}</h4>
                        <h4>FAKULTAS {{ faculty_detail.name }}</h4>
                        <h4>POLITEKNIK PEKERJAAN UMUM</h4>
                    </th>
                    <th width="100"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="3">
                        <table class="table" v-for="(item, index) in arrSubjects" style="text-align: left; margin-top: 40px;">
                            <thead>
                                <tr>
                                    <th colspan="3">Semester {{ index + 1 }}</th>
                                </tr>
                                <tr>
                                    <th rowspan="2" class="head-title" style="text-align: center; vertical-align: middle; width: 30px;">No</th>
                                    <th colspan="2" class="head-title">Mata Kuliah</th>
                                    <th rowspan="2" class="head-title" style="text-align: center; vertical-align: middle">Sifat</th>
                                    <th rowspan="2" class="head-title" style="text-align: center; vertical-align: middle">Teori</th>
                                    <th rowspan="2" class="head-title" style="text-align: center; vertical-align: middle">Praktek</th>
                                    <th rowspan="2" class="head-title" style="text-align: center; vertical-align: middle">Praktek Lapangan</th>
                                    <th rowspan="2" class="head-title" style="text-align: center; vertical-align: middle">Prasyarat</th>
                                </tr>
                                <tr>
                                    <th class="head-title">Kode</th>
                                    <th class="head-title">Nama</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(itm, indx) in item">
                                    <td>{{ indx + 1 }}</td>
                                    <td>{{ itm.code }}</td>
                                    <td>{{ itm.name }}</td>
                                    <td>{{ itm.trait }}</td>
                                    <td>{{ itm.theory_credit }}</td>
                                    <td>{{ itm.practicum_credit }}</td>
                                    <td>{{ itm.field_practicum_credit }}</td>
                                    <td>{{ itm.prerequisite_minimum_grade_point }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table" style="text-align: left; margin-top: 40px;">
                            <thead>
                                <tr>
                                    <th width="200">Jumlah SKS Wajib</th>
                                    <th>: <b>{{ sum_sks.sks_mandatory }} SKS</b></th>
                                </tr>
                                <tr>
                                    <th width="200">Jumlah SKS Pilihan</th>
                                    <th>: <b>{{ sum_sks.sks_mandatory }} SKS</b></th>
                                </tr>
                                <tr>
                                    <th width="200">Total</th>
                                    <th>: <b>{{ sum_sks.total }} SKS</b></th>
                                </tr>
                            </thead>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
table {
    font-family: 'Tahoma' !important;
    font-size: 10px;
}
table > thead > tr > th {
    font-size: 12px;
}
table {
    background-color: transparent;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
}
.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
}
.head-title {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    border: 1px solid #2d2d2d;
}
.table > tbody > tr > td {
    border: 1px solid #2d2d2d;
}
table {
    border-spacing: 0;
    border-collapse: collapse;
}
td, th {
    padding: 0;
}
th {
    font-weight: 400;
}
.table {
    border-collapse: collapse !important;
}
.table td, .table th {
    background-color: #fff !important;
}
.font-size-10{
    font-size: 10px;
}
table { 
    page-break-inside:avoid;
    page-break-after: always;
}
</style>