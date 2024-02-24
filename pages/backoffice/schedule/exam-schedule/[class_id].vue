<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { getScheduleList } from '~~/composables/api/schedule/getScheduleList';
import { formatYearMonthDate, } from '~~/utils/helpers/date-utils';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import moment from 'moment';

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
const title = ref('Detail Jadwal Ujian')
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

const classDetail = ref(<GetClassroomDetail>{})
const schedules = ref<GetScheduleListData[]>([])

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
        const { response: resp, error: error } = await getScheduleList(limit, page, classId.value, false, true, '')
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
onMounted(async () => {
    classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await classroomDetail(classId.value)
    await getSchedule(limit, 1, '')
})
</script>
<template>
    <div>
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
                            <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/schedule/exam-schedule'">
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
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Pengawas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Hari / Tanggal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jam</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in schedules">
                    <td>{{ ((pagination.page-1)* pagination.limit + 1) + index }}</td>
                    <td>
                        <ul>
                            <li v-for="value in item.exam_supervisors">{{ value.front_title }} {{ value.name }} {{ value.back_degree }}</li>
                        </ul>
                    </td>
                    <td>{{ convertDayOfWeek(item.lecture_plan_day_of_week) }}, {{ moment(item.lecture_plan_date).format('DD-MM-YYYY') }}</td>
                    <td>{{ convertTimeNumberToString(item.lecture_plan_start_time) }} - {{ convertTimeNumberToString(item.lecture_plan_end_time) }}</td>
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