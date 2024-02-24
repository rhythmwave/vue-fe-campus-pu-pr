<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import moment from 'moment';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { GetRoomScheduleData } from '~~/types/api/room/GetRoomSchedule';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getScheduleList } from '~~/composables/api/schedule/getScheduleList';
import { deleteSchedule } from '~~/composables/api/schedule/deleteSchedule';
import { getRoomSchedule } from '~~/composables/api/room/getRoomSchedule';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});
const title = ref('Daftar Rekap Peserta Kelas')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Daftar ' + title.value,
        disabled: true,
        href: '#'
    }
]);
const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const semesters = ref<GetSemesterListData[]>([])
const classrooms = ref<GetClassroomListData[]>([])
const schedules = ref<GetScheduleListData[]>([])
const scheduleDetail = ref<GetScheduleListData>()
const study_program_id = ref(<GetAdminStudyProgramListData>{
    id: '',
    study_program_name: ''
})
const semester_id = ref(<GetSemesterListData>{
    id: '',
    semester_start_year: 0,
    school_year: '',
    semester_type: '',
    is_active: false,
    semester_type_year: '',
    study_program_id: '',
    study_program_name: '',
})
const classroom_id = ref(<GetClassroomListData>{
    id: '',
    name: '',
    subject_id: '',
    subject_code: '',
    subject_name: '',
    total_participant: 0,
})
// const schedule_id = ref('')
const is_actual_lecture = ref(false)
const dialog = ref(true)
const mode = ref('list')
const limit = 20
const page = ref(1)
const search = ref('')
const scheduleObj = ref({
    id: '',
    name: '',
})
const room_schedules = ref<GetRoomScheduleData[]>([])
const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000, 1, study_program_id.value.id, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getClassroom(limit: number, page: number, search: string, is_active: boolean) {
    try {
        if (!semester_id.value.id || !study_program_id.value.id) {
            classrooms.value = []
            pagination.value = <PaginationModel>{
                limit: 1000000,
                next: 1,
                page: 1,
                prev: 1,
                total_pages: 1,
                total_records: 0,
            }
            return;
        }
        const { response: resp, error: error } = await getClassroomList(limit, page, search, study_program_id.value.id, semester_id.value.id, is_active, '', false)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classrooms.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

async function getRoomScheduleList(limit: number, page: number, search: string, room_id: string, day_of_week: string, semesterId: string) {
    try {
        const { response: resp, error: error } = await getRoomSchedule(limit, page, search, room_id, day_of_week, semesterId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            room_schedules.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function adminStudyProgramsOnChange(item: any) {
    if (item != '') {
        study_program_id.value = item
    }
    if (study_program_id.value.id != '') {
        await getClassroom(pagination.value.limit, pagination.value.page, search.value, true)
        await getSemester()
    }
}
async function semesterOnChange(item: any) {
    if (item != '') {
        semester_id.value = item
    }
    if (semester_id.value.id != '') {
        await getClassroom(pagination.value.limit, pagination.value.page, search.value, true)
    }
}
async function classroomOnChange(item: any) {
    if (item.id != '') {
        classroom_id.value = item
    }
}

onMounted(async () => {
    await getAdminStudyProgram()
    await getSemester()
})
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>
<template>
    <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard :title="'Pilih ' + title">
                <v-row>
                    <v-col cols="12" lg="4" md="6">
                        <v-select variant="outlined" hide-details :items="adminStudyPrograms" item-value="id"
                            item-title="name" label="Pilih Program Studi"
                            @update:model-value="(sl: any) => adminStudyProgramsOnChange(sl)" return-object></v-select>
                    </v-col>
                    <v-col cols="12" lg="4" md="6">
                        <!-- <v-select variant="outlined" hide-details :items="semesters" item-value="id"
                            item-title="semester_start_year" label="Pilih Semester"
                            @update:model-value="(sl: any) => semesterOnChange(sl)"></v-select> -->
                        <v-select item-value="id" variant="outlined" hide-details :items="semesters" label="Pilih Semester"
                            @update:model-value="(sl: any) => semesterOnChange(sl)" return-object>
                            <template v-slot:selection="{ item }">
                                <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                }}</span>
                            </template>
                            <template v-slot:item="{ item, props: { onClick, title, value } }">
                                <ul>
                                    <li style="padding: 10px; margin: 2px;">
                                        <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                            @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                            <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                                            }}</span>
                                        </a>
                                    </li>
                                </ul>
                            </template>
                        </v-select>
                    </v-col>
                    <v-col cols="12" lg="8" md="8" class="text-right">
                        <v-btn color="primary" flat class="ml-auto" target="_blank"
                            :to="'/backoffice/report/prints/class-recap-list/' + study_program_id.id + '/' + semester_id.id"
                            :disabled="study_program_id.id == '' || semester_id.id == ''">

                            <v-icon class="mr-2">
                                mdi-printer
                            </v-icon>&nbsp; Cetak
                        </v-btn>
                    </v-col>
                </v-row>

            </UiParentCard>
        </v-col>
    </v-row>

    <v-table class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">No</th>
                <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
                <th class="text-subtitle-1 font-weight-semibold">Jumlah Peserta</th>
                <th class="text-subtitle-1 font-weight-semibold">Maksimal</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in classrooms" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>
                    {{ item.subject_code }} ({{ item.subject_name }})
                </td>
                <td>{{ item.total_participant }}</td>
                <td>{{ item.maximum_participant }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">
                    <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                        :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                        :prev="pagination.prev" :next="pagination.next"
                        @prevPage="getClassroom(pagination.limit, pagination.prev, '', true)"
                        @jumpPage="(page: any) => getClassroom(pagination.limit, page, '', true)"
                        @nextPage="getClassroom(pagination.limit, pagination.next, '', true)" />
                </td>
            </tr>
        </tfoot>
    </v-table>
</template>