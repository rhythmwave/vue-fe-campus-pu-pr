<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetStudentListData, GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { BulkUpdateStudentPaymentRequest } from '~~/types/api/student/BulkUpdateStudentPayment';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { bulkUpdateStudentPayment } from '~~/composables/api/student/bulkUpdateStudentPayment';
import { getStudentList } from '~~/composables/api/student/getStudentList';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const studentRequests = ref(<GetStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    address: '',
    regencyId: '',
    status: [],
    getAcademicGuidance: '',
    hasAuthentication: '',
    studyPlanSemesterId: '',
    studyPlanIsApproved: '',
    studyPlanIsSubmitted: '',
    hasStudyPlan: '',
    statusSemesterId: '',
    isRegistered: '',
    hasPaid: '',
    isGraduateEligible: '',
    isThesisEligible: '',
    yudiciumSessionId: '',
})
const students = ref(<GetStudentListData[]>[])

async function getStudent() {
    try {
        const { response: resp, error: error } = await getStudentList(1000000, 1, studentRequests.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
onMounted(async () => {
    await getStudent()
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
                    <th colspan="3">
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
                    <th colspan="3">
                        <p><b>DAFTAR REGISTRASI MAHASISWA</b></p>
                    </th>
                    <th></th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">NIM</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Nama</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Program Studi</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Status Bayar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in students">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.has_paid ? 'Sudah' : 'Belum' }}</td>
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