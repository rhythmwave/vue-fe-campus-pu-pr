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

import { GetRoomScheduleData } from '~~/types/api/room/GetRoomSchedule';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { GetCalendarListData, GetCalendarListLectureData } from '~~/types/api/schedule/GetCalendarList';

import { getRoomSchedule } from '~~/composables/api/room/getRoomSchedule';
import { getCalendarList } from '~~/composables/api/schedule/getCalendar';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';
import { getRoomList } from '~~/composables/api/room/getRoomList';

const route = useRoute()
definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Daftar Ruang Terpakai')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: title.value,
        disabled: true,
        href: '#'
    }
]);

const dialog = ref(false)
const mode = ref('')
const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit: limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

const calendars = ref<GetCalendarListData[]>([])
const collectCalendars = ref<GetCalendarListData[][]>([])
const singleCalender = ref(<GetCalendarListLectureData>{})
const year = ref(0)
const month = ref(0)

const roomSchedules = ref<GetRoomScheduleData[]>([])
const semester_id = ref('')
const buildings = ref<GetBuildingListData[]>([])
const rooms = ref<GetRoomListData[]>([])
const building_id = ref('')
const room_id = ref('')
const reqCalendar = ref({
    year: 0,
    month: 0,
    roomId: '',
    lecturerId: '',
    classId: '',
})
async function getSchedule(limit: number, page: number){
    try {
        const { response: resp, error: error } = await getRoomSchedule(limit, page, '', room_id.value, '', semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            roomSchedules.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
async function getCalendar(year: number, month: number, room_id: string) {
    try {
        const { response: resp, error: error } = await getCalendarList(year, month, room_id, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            calendars.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getBuilding() {
    try {
        const { response: resp, error: error } = await getBuildingList(1000, 1, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            buildings.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getRoom() {
    try {
        const { response: resp, error: error } = await getRoomList(1000, 1, '', building_id.value, '', '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            rooms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
watch(room_id, async (value) => {
        reqCalendar.value.roomId = value
        await getSchedule(pagination.value.limit, pagination.value.page)
        if(roomSchedules.value.length > 0){
            for (let index = 0; index < roomSchedules.value.length; index++) {
                reqCalendar.value.month = moment(roomSchedules.value[index].dates[0].date).month()+1
                reqCalendar.value.year = moment(roomSchedules.value[index].dates[0].date).year()
            }
        }
        refresh()
        year.value = reqCalendar.value.year
        month.value = reqCalendar.value.month
    }
);
watch(building_id, async (value) => {
        await getRoom()
        await refresh()
    }
);
watch(year, async (value) => {
    reqCalendar.value.year = value
    await refresh()
    }
);
watch(month, async (value) => {
    reqCalendar.value.month = value
    await refresh()
    }
);
function showSchedule(ev: GetCalendarListLectureData){
    singleCalender.value = <GetCalendarListLectureData>{
        lecture_plan_start_time: ev.lecture_plan_start_time,
        lecture_plan_end_time: ev.lecture_plan_end_time,
        class_id: ev.class_id,
        class_name: ev.class_name,
        room_id: ev.room_id,
        room_name: ev.room_name,
        lecturer_id: ev.lecturer_id,
        lecturer_name: ev.lecturer_name,
        lecturer_front_title: ev.lecturer_front_title,
        lecturer_back_degree: ev.lecturer_back_degree,
        foreign_lecturer_name: ev.foreign_lecturer_name,
        foreign_lecturer_source_instance: ev.foreign_lecturer_source_instance,
    }
    dialog.value = true
    mode.value = 'show-calendar'
}
async function refresh(){
    collectCalendars.value = []
    await getCalendar(reqCalendar.value.year, reqCalendar.value.month, reqCalendar.value.roomId)
    if(calendars.value.length > 0){
        let loop = Math.ceil(calendars.value.length / 7);
        for (let index = 0; index < loop; index++) {
            collectCalendars.value.push(calendars.value.splice(0, 7))
        }
    }
}
onMounted(async () => {
    await getBuilding()
    await getSchedule(pagination.value.limit, pagination.value.page)
    if(roomSchedules.value.length > 0){
        for (let index = 0; index < roomSchedules.value.length; index++) {
            reqCalendar.value.month = moment(roomSchedules.value[index].dates[0].date).month()+1
            reqCalendar.value.year = moment(roomSchedules.value[index].dates[0].date).year()
        }
    }
    refresh()
    year.value = reqCalendar.value.year
    month.value = reqCalendar.value.month
})
</script>

<template>
    <div>
        <div v-if="mode == 'show-calendar'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Kelas {{ singleCalender.class_name }}</span>
                        </v-card-title>
                        <v-card-text>
                            <p>Dosen:  {{ singleCalender.lecturer_front_title }} {{ singleCalender.lecturer_name }} {{ singleCalender.lecturer_back_degree }}</p>
                            <p>Ruang: {{ singleCalender.room_name }}</p>
                            <p>Dari Jam: {{ convertNumberTime(singleCalender.lecture_plan_start_time) }}</p>
                            <p>Sampai Jam: {{ convertNumberTime(singleCalender.lecture_plan_end_time) }}</p>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Pencarian Penggunaan Ruang">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="year" :items="getYearBatch()" variant="outlined" hide-details label="Pilih Tahun"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="month" :items="[
                                { title:'Januari', value: 1 },
                                { title:'Februari', value: 2 },
                                { title:'Maret', value: 3 },
                                { title:'April', value: 4 },
                                { title:'Mei', value: 5 },
                                { title:'Juni', value: 6 },
                                { title:'Juli', value: 7 },
                                { title:'Agustus', value: 8 },
                                { title:'September', value: 9 },
                                { title:'Oktober', value: 10 },
                                { title:'November', value: 11 },
                                { title:'Desember', value: 12 },
                            ]" variant="outlined" hide-details label="Pilih Bulan"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="building_id" variant="outlined" hide-details :items="buildings" item-value="id" item-title="name" label="Gedung"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="room_id" variant="outlined" hide-details :items="rooms" item-value="id" item-title="name" label="Ruangan"></v-select>
                        </v-col>
                        <v-col cols="12" lg="8" md="8" class="text-right">
                            <nuxt-link :to="'/backoffice/space-management/space-usage/print'" target="_blank">
                                <v-btn color="primary" flat class="ml-2">
                                    <v-icon class="mr-2">
                                        mdi-printer
                                    </v-icon>Cetak
                                </v-btn>
                            </nuxt-link>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <!-- <v-row>
            <v-col cols="12">
                <v-col cols="12" lg="6" md="6" class="float-left">
                    <Calendar :available-dates="{month: new Date().getMonth() + 1, year: new Date().getFullYear()}" :color="'blue'" :attributes="attrs" @click="(ev: any) => clickFunc(ev)">
                    </Calendar>
                </v-col>
                <v-col cols="12" lg="6" md="6" class="float-left">
                    <v-card flat solo height="272" style="border: 1px solid #cbd5e1">
                        <v-card-title class="pa-4 bg-secondary" style="border-radius: 5px 5px 0px 0px;">
                            <span class="title text-white">Jadwal</span>
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-col>
        </v-row> -->
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th colspan="8">
                        <h2>
                            Bulan {{ convertMonthToTextString(reqCalendar.month) }} {{ reqCalendar.year }}
                        </h2>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="items in collectCalendars">
                    <td v-for="item in items" class="text-subtitle-1" :style="'vertical-align: text-top; width: 200px'">
                        <h2 class="mt-2">{{ moment(item.date).date() }}</h2>
                        <ul class="mt-2" style="list-style-type: none">
                            <li v-for="itm in item.lectures">
                                <v-btn class="mb-2" flat solo color="primary" @click="showSchedule(itm)">
                                    {{ convertNumberTime(itm.lecture_plan_start_time) }} - {{ convertNumberTime(itm.lecture_plan_end_time) }}
                                </v-btn>
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Ruang </th>
                    <th class="text-subtitle-1 font-weight-semibold">Hari / Tanggal / Jam</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in roomSchedules">
                    <td>{{ ((pagination.page - 1)* pagination.limit) + index + 1 }}</td>
                    <td>{{ item.room_name }}</td>
                    <td>
                        <ul>
                            <li v-for="itm in item.dates">
                                {{ convertDayOfWeek(moment(itm.date).weekday()) }}, {{ moment(itm.date).format('YYYY-MM-DD') }}
                                <ul>
                                    <li v-for="i in itm.schedules">
                                        <p>{{ i.subject_name }} (Kelas {{ i.class_name }})</p>
                                        <p>
                                            Jam 
                                            {{ convertNumberTime(i.start_time) }} - {{ convertNumberTime(i.end_time) }}
                                        </p> 
                                    </li>
                                </ul>
                            </li>
                        </ul>    
                    </td>
                    <!-- <td class="text-subtitle-1">{{ ((pagination.page - 1)* pagination.limit) + index + 1 }}</td>
                    <td class="text-subtitle-1">{{ item.room_name }}</td>
                    <td class="text-subtitle-1">
                        {{ convertDayOfWeek(item.lecture_plan_day_of_week) }}, {{ moment(item.lecture_plan_date).format('DD-MM-YYYY') }}
                    </td>
                    <td class="text-subtitle-1">
                        {{ convertTimeNumberToString(item.lecture_plan_start_time) }} : {{ convertTimeNumberToString(item.lecture_plan_end_time) }}
                    </td>
                    <td class="text-subtitle-1">
                        {{ item.lecturer_name }}
                    </td> -->
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getSchedule(pagination.limit, pagination.prev)"
                            @jumpPage="(page: number) => getSchedule(pagination.limit, page)"
                            @nextPage="getSchedule(pagination.limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>
<style>
/* .vc-container, .vc-container *{
    width: 100%;
    font-size: 20px !important;
    border-radius: 10px;
} */
</style>