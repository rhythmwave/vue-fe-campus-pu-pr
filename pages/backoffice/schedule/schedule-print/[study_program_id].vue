<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetAdminStudyProgramDetailData } from '~~/types/api/admin-study-program/GetAdminStudyProgramDetail';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { GetRoomScheduleData } from '~~/types/api/room/GetRoomSchedule';
import { getAdminStudyProgramDetail } from '~~/composables/api/admin-study-program/getAdminStudyProgramDetail';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getScheduleList } from '~~/composables/api/schedule/getScheduleList';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { deleteSchedule } from '~~/composables/api/schedule/deleteSchedule';
import { getRoomSchedule } from '~~/composables/api/room/getRoomSchedule';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import moment from 'moment';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const study_program_id = ref('')
const is_exam = ref(false)
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const schedules = ref<GetScheduleListData[]>([])
const study_program_detail = ref(<GetAdminStudyProgramDetailData>{})

async function getSchedule() {
    try {
        const { response: resp, error: error } = await getScheduleList(1000000, 1, '', '', is_exam.value, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            schedules.value = resp?.data
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
onMounted(async () => {
    study_program_id.value = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
    is_exam.value = window.location.search.substring(1).split('=')[1] === 'true'
    await getStudyProgramDetail()
    await getSchedule()
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
                    <th></th>
                    <th colspan="4">
                        <p><b>DAFTAR JADWAL</b></p>
                        <p><b>Program Studi {{study_program_detail.dikti_study_program_name}} - {{ study_program_detail.dikti_study_program_type }} {{ study_program_detail.study_level_short_name }}</b></p>
                    </th>
                    <th></th>
                </tr>
                <tr style="text-align: left;">
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th colspan="2" class="font-size-10 head-title" style="text-align: center;">Mata Kuliah</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Kelas</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Hari / Tanggal</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Jam</th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title">Kode</th>
                    <th class="font-size-10 head-title">Nama</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in schedules">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_code }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>{{ item.class_name }}</td>
                    <td>{{ convertDayOfWeek(item.lecture_plan_day_of_week) }}, {{ moment(item.lecture_plan_date).format('DD-MM-YYYY') }}</td>
                    <td>{{ convertTimeNumberToString(item.lecture_plan_start_time) }} - {{ convertTimeNumberToString(item.lecture_plan_end_time) }}</td>
                </tr>
            </tbody>
        </table>
        <!-- <v-table class="table">
            <tbody>
                <tr>
                    <td></td>
                    <td class="text-center header">
                        <p><b>DAFTAR JADWAL</b></p>
                        <p><b>Program Studi TEKNOLOGI KONSTRUKSI BANGUNAN AIR - D3 Reguler</b></p>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </v-table> -->
        <!-- <v-table class="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode Mata Kuliah</th>
                    <th>Nama Mata Kuliah</th>
                    <th>Nama Kelas</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in schedules">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_code }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>{{ item.class_name }}</td>
                </tr>
            </tbody>
        </v-table> -->
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