<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { ErrorRoot } from '~~/types/api/error';

import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';

import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const study_program_id = ref('')
const classrooms = ref(<GetClassroomListData[]>[])

async function getClassroom() {
    try {
        const { response: resp, error: error } = await getClassroomList(100000, 1, '', study_program_id.value, '', true, '', false)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classrooms.value = resp?.data
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
    await getClassroom()
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
                <tr style="text-align: left;">
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Mata Kuliah</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Kelas</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Dosen</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Kapasitas Maksimal</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Jumlah Peserta</th>
                    <th colspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Jumlah KRS</th>
                </tr>
                <tr>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Belum Disetujui</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in classrooms">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <ul v-for="itm in item.lecturers" style="list-style: none">
                            <li>{{ itm.front_title }} {{ itm.name }} {{ itm.back_degree }}</li>
                        </ul>
                    </td>
                    <td>{{ item.maximum_participant }}</td>
                    <td>{{ item.total_participant }}</td>
                    <td>{{ item.unapproved_study_plan }}</td>
                    <td>{{ item.total_participant + item.unapproved_study_plan }}</td>
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