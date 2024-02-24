<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import moment from 'moment';

import { GetStudyPlanListData } from '~~/types/api/study-plan/GetStudyPlan';
import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';

import { getStudyPlanList } from '~~/composables/api/study-plan/getStudyPlanList';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const semester_id = ref('')
const semester_detail = ref(<GetSemesterDetailData>{})
const studyPlans = ref<GetStudyPlanListData[]>([])

async function getStudyPlan() {
    try {
        const { response: resp, error: error } = await getStudyPlanList(100000, 1, '', '', semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyPlans.value = resp?.data
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

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    semester_id.value = window.location.search.replaceAll('?semester_id=', '')
    await getStudyPlan()
    await semesterDetail()
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
                    <th colspan="8">
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
                    <th colspan="10">
                        <p><b>REKAP AKTIFITAS KULIAH MAHASISWA</b></p>
                        <p v-if="studyPlans.length > 0"><b>Program Studi: {{ studyPlans[0].study_program_name }}</b></p>
                        <p><b>Semester : {{ semester_detail.semester_type }} {{ semester_detail.school_year }}</b></p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">NIM</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Nama</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Program Studi</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Angkatan</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Status</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">IPS</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">IPK</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">SKS Semester</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">SKS Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in studyPlans">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <p>Rerata IPS Mahasiswa = 0.0</p>
                        <p>Rerata IPS Mahasiswa = 0.0</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <p>Keterangan :</p>
                        <p>Rerata IPS = Total IPS Mahasiswa / Jumlah Total Mahasiswa</p>
                        <p>Rerata IPK = Total IPK Mahasiswa / Jumlah Total Mahasiswa</p>
                    </td>
                </tr>
            </tfoot>
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