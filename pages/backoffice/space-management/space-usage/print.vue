<script setup lang="ts">
import moment from 'moment';
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';
import { getYearBatch } from '~~/utils/helpers/graduation';
import { convertNumberTime } from '~~/utils/helpers/convert-number-time';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetLectureListData } from '~~/types/api/lecture/GetLectureList';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { GetCalendarListData, GetCalendarListLectureData } from '~~/types/api/schedule/GetCalendarList';

import { getLectureList } from '~~/composables/api/lecture/getLectureList';
import { getCalendarList } from '~~/composables/api/schedule/getCalendar';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';
import { getRoomList } from '~~/composables/api/room/getRoomList';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const schedules = ref<GetLectureListData[]>([])

async function getSchedule(){
    try {
        const { response: resp, error: error } = await getLectureList(10000, 1, '', false, '', '')
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

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
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
                    <th colspan="6">
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
                    <th colspan="6">
                        <p><b>DAFTAR RUANG TERPAKAI</b></p>
                    </th>
                    <th></th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Ruang</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Tanggal</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Jam</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Matakuliah</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Kelas</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Dosen</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Peserta</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in schedules">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.room_name }}</td>
                    <td>{{ new Date(item.lecture_plan_date).getDay() == 0 ? convertDayOfWeek(7) : convertDayOfWeek(new Date(item.lecture_plan_date).getDay())}} , {{ new Date(item.lecture_plan_date).getDate() }} {{ convertMonthToTextString(new Date(item.lecture_plan_date).getMonth()) }} {{ new Date(item.lecture_plan_date).getFullYear() }}</td>
                    <td>{{ convertNumberTime(item.lecture_plan_start_time) }} - {{ convertNumberTime(item.lecture_plan_end_time) }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>{{ item.class_name }}</td>
                    <td>{{ item.lecturer_name }}</td>
                    <td>{{ item.total_participant }}</td>
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