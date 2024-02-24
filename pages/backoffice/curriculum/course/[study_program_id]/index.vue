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
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { GetFacultyListData } from '~~/types/api/faculty/GetFacultyList';

import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { getAdminStudyProgramDetail } from '~~/composables/api/admin-study-program/getAdminStudyProgramDetail';
import { getFacultyList } from '~~/composables/api/faculty/getFacultyList';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const study_program_id = ref('')
const curriculums = ref(<GetCuriculumListData[]>[])
const curriculum_ids = ref(<string[]>[])
const subjects = ref(<GetSubjectListData[]>[])
const subject_curriculums = ref(<GetCuriculumListData[]>[])

async function getCuriculum() {
    try {
        const { response: resp, error: error } = await getCuriculumList(10000, 1, '', study_program_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            curriculums.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function getSubject() {
    try {
        const { response: resp, error: error } = await getSubjectList(10000, 1, '', curriculum_ids.value, '', '', '', '', '', '')
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

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    study_program_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getCuriculum()
    curriculums.value.forEach(function(item){
        curriculum_ids.value.push(item.id)
    })
    await getSubject()
    subjects.value.forEach(function(item){
        if(!(subject_curriculums.value.map(e => e.id).indexOf(item.curriculum_id) > -1)){
            subject_curriculums.value.push(<GetCuriculumListData>{
                id: item.curriculum_id,
                study_program_id: item.study_program_id,
                name: item.curriculum_name,
                study_program_name: item.study_program_name
            })
        }
    })
    await delay(1000)
    window.print()
})
</script>
<template>
    <div>
        <table class="table" v-for="itm, indx in subject_curriculums">
            <thead>
                <tr>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_dinas.jpg" style="width: 100%;" />
                    </th>
                    <th colspan="7">
                        <p style="letter-spacing: 1px">KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT</p>
                        <p style="letter-spacing: 0px">BADAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                        <p style="letter-spacing: 7px"><b>POLITEKNIK PEKERJAAN UMUM</b></p>
                        <p style="letter-spacing: 0px">Jalan Prof. Soedarto, SH No.15 Tembalang, Semarang 50275, Telp/Fax.024-7472848</p>
                        <p style="letter-spacing: 1.5px">Web : www.politeknikpu.ac.id, e-mail : info@politeknikpu.ac.id</p>
                    </th>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_semarang.png" style="width: 100%;" />
                    </th>
                </tr>
                <tr>
                    <th></th>
                    <th colspan="7">
                        <p><b>DAFTAR MATA KULIAH</b></p>
                    </th>
                    <th></th>
                </tr>
                <tr style="text-align: left;">
                    <th colspan="2"><b>Program Studi</b></th>
                    <th><b>: {{ itm.study_program_name }}</b></th>
                </tr>
                <tr style="text-align: left;">
                    <th colspan="2"><b>Kurikulum</b></th>
                    <th><b>: {{ itm.name }}</b></th>
                </tr>
                <tr style="text-align: left;">
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th colspan="2" class="font-size-10 head-title" style="text-align: center;">Mata Kuliah</th>
                    <th colspan="3" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Jml SKS</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Paket</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Sifat</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Tipe</th>
                    <!-- <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Nilai Lulus</th>
                    <th colspan="3" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Syarat SKS Min</th>
                    <th colspan="3" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">SKS Lulus Min</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">IPK Min</th> -->
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title">Kode</th>
                    <th class="font-size-10 head-title">Nama</th>
                    <th class="font-size-10 head-title">T</th>
                    <th class="font-size-10 head-title">P</th>
                    <th class="font-size-10 head-title">L</th>
                    <!-- <th class="font-size-10 head-title">W</th>
                    <th class="font-size-10 head-title">P</th>
                    <th class="font-size-10 head-title">Total</th>
                    <th class="font-size-10 head-title">W</th>
                    <th class="font-size-10 head-title">P</th>
                    <th class="font-size-10 head-title">Total</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in subjects">
                    <td v-if="item.curriculum_id == itm.id"> {{ index + 1 }}</td>
                    <td v-if="item.curriculum_id == itm.id">{{ item.code }}</td>
                    <td v-if="item.curriculum_id == itm.id">{{ item.name }}</td>
                    <td v-if="item.curriculum_id == itm.id">{{ item.theory_credit }}</td>
                    <td v-if="item.curriculum_id == itm.id">{{ item.practicum_credit }}</td>
                    <td v-if="item.curriculum_id == itm.id">{{ item.field_practicum_credit }}</td>
                    <td v-if="item.curriculum_id == itm.id">{{ item.semester_package }}</td>
                    <td v-if="item.curriculum_id == itm.id">{{ item.trait }}</td>
                    <td v-if="item.curriculum_id == itm.id">{{ item.prerequisite_type }}</td>
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