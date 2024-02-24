<script setup lang="ts">
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import moment from 'moment';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';

import { GetRegistrationThesisData } from '~~/types/api/thesis/GetRegistrationThesis';
import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';
import { GetStudyProgramDetailData } from '~~/types/api/study-program/GetStudyProgramDetail';

import { getRegistrationThesis } from '~~/composables/api/admin-thesis/getRegistrationThesis';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';
import { getAdminStudyProgramDetail } from '~~/composables/api/admin-study-program/getAdminStudyProgramDetail';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const study_program_id = ref('')
const semester_id = ref('')
const registration_thesis_list = ref(<GetRegistrationThesisData[]>[])
const semester_detail = ref(<GetSemesterDetailData>{})
const study_program_detail = ref(<GetStudyProgramDetailData>{})

async function getData() {
    try {
        const { response: resp, error: error } = await getRegistrationThesis(100000, 1, '', study_program_id.value, '', semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            registration_thesis_list.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function semesterDetail() {
    try {
        const { response: resp, error: error } = await getSemesterDetail(semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semester_detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function adminStudyProgramDetail() {
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
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
onMounted(async () => {
    study_program_id.value = window.location.pathname.split('/')[window.location.pathname.split('/').length - 2]
    semester_id.value = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
    await adminStudyProgramDetail()
    await semesterDetail()
    await getData()
    await delay(1000)
    window.print()
})
</script>
<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_dinas.jpg" style="width: 100%;" />
                    </th>
                    <th colspan="4">
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
                    <th colspan="6">
                        <p><b>DAFTAR TUGAS AKHIR</b></p>
                        <p><b>Program Studi {{ study_program_detail.name }}</b></p>
                        <p><b>Semester: {{ semester_detail.semester_type }} {{ semester_detail.school_year }}</b></p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title">No</th>
                    <th class="font-size-10 head-title">NIM</th>
                    <th class="font-size-10 head-title">Nama</th>
                    <th class="font-size-10 head-title">Dosen Pembimbing</th>
                    <th class="font-size-10 head-title">Judul</th>
                    <th class="font-size-10 head-title">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in registration_thesis_list">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>lecturer</td>
                    <td>{{ item.thesis_title }}</td>
                    <td>{{ item.thesis_status }}</td>
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
    /* page-break-after: always; */
}
</style>