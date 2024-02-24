<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { formatYearMonthDate, } from '~~/utils/helpers/date-utils';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import moment from 'moment';
import { convertNumberTime } from '~~/utils/helpers/convert-number-time';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';
import { getYearBatch } from '~~/utils/helpers/graduation';

import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { GetCalendarListData, GetCalendarListLectureData } from '~~/types/api/schedule/GetCalendarList';

import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { getScheduleList } from '~~/composables/api/schedule/getScheduleList';
import { getCalendarList } from '~~/composables/api/schedule/getCalendar';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 10
const pagination = ref({
  page: 1,
  limit: limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})
const classId = ref('')
const title = ref('Detail Jadwal Kelas')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: title,
    disabled: true,
    href: '#'
  }
])

const dialog = ref(false)
const mode = ref('')
const classDetail = ref(<GetClassroomDetail>{})
const schedules = ref<GetScheduleListData[]>([])
const calendars = ref<GetCalendarListData[]>([])
const collectCalendars = ref<GetCalendarListData[][]>([])
const singleCalender = ref(<GetCalendarListLectureData>{})
const year = ref(0)
const month = ref(0)
const reqCalendar = ref({
    year: 0,
    month: 0,
    roomId: '',
    lecturerId: '',
    classId: '',
})

async function classroomDetail(id: string) {
    try {
        const { response: resp, error: error } = await getClassroomDetail(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classDetail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getSchedule(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getScheduleList(limit, page, classId.value, false, false, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            schedules.value = resp?.data
            pagination.value = {
                page: resp?.pagination.page,
                limit: resp?.pagination.limit,
                prev: resp?.pagination.prev,
                next: resp?.pagination.next,
                total_pages: resp?.pagination.total_pages,
                total_records: resp?.pagination.total_records,
            }
        }
    } catch (error) {
        alert(error)
    }
}
async function getCalendar() {
    try {
        const { response: resp, error: error } = await getCalendarList(reqCalendar.value.year, reqCalendar.value.month, reqCalendar.value.roomId, reqCalendar.value.lecturerId, reqCalendar.value.classId)
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
    // await getSemester()
    await getCalendar()
    if(calendars.value.length > 0){
        let loop = Math.ceil(calendars.value.length / 7);
        for (let index = 0; index < loop; index++) {
            collectCalendars.value.push(calendars.value.splice(0, 7))
        }
    }
}
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
onMounted(async () => {
    classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await classroomDetail(classId.value)
    await getSchedule(limit, 1, '')
    if(schedules.value.length > 0){
        reqCalendar.value.month = moment(schedules.value[0].lecture_plan_date).month() + 1
        reqCalendar.value.year = moment(schedules.value[0].lecture_plan_date).year()
    }
    reqCalendar.value.classId = classId.value
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
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="12" md="12" class="text-left">
                            <v-table>
                                <thead>
                                    <tr>
                                        <th colspan="2" class="text-subtitle-1 font-weight-semibold"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Program Studi</td>
                                        <td>{{ classDetail.study_program_name }}</td>
                                    </tr>
                                    <tr>
                                        <td>Semester</td>
                                        <td>{{ classDetail.semester_start_year }}</td>
                                    </tr>
                                    <tr>
                                        <td>Kode</td>
                                        <td>{{ classDetail.subject_code }}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama</td>
                                        <td>{{ classDetail.subject_name }}</td>
                                    </tr>
                                    <tr>
                                        <td>Kelas</td>
                                        <td>{{ classDetail.name }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-col cols="12" lg="4" md="4" style="float: left">
                                <v-select v-model="year" :items="getYearBatch()" variant="outlined" hide-details label="Pilih Tahun"></v-select>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" style="float: left">
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
                            <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/schedule/classroom-schedule'">
                                <v-btn color="warning" flat class="ml-auto">
                                    <v-Icon class="mr-2">
                                        mdi-keyboard-backspace
                                    </v-Icon>Kembali
                                </v-btn>
                            </nuxt-Link>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
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
                    <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Hari / Tanggal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jam</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in schedules">
                    <td>{{ ((pagination.page-1)* pagination.limit + 1) + index }}</td>
                    <td>{{ item.lecturer_name }}</td>
                    <td>{{ convertDayOfWeek(item.lecture_plan_day_of_week) }}, {{ moment(item.lecture_plan_date).format('DD-MM-YYYY') }}</td>
                    <td>{{ convertTimeNumberToString(item.lecture_plan_start_time) }} : {{ convertTimeNumberToString(item.lecture_plan_end_time) }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getSchedule(limit, pagination.prev, '')" @jumpPage="(page: number) => getSchedule(limit, page, '')"
                            @nextPage="getSchedule(limit, pagination.next, '')" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>