<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { GetRoomScheduleData } from '~~/types/api/room/GetRoomSchedule';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
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
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Cetak Jadwal')
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
const pagination = ref({
  page: 1,
  limit: 20,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})
const studyPrograms = ref<GetAdminStudyProgramListData[]>([])
const semesters = ref<GetSemesterListData[]>([])
const classrooms = ref<GetClassroomListData[]>([])
const schedules = ref<GetScheduleListData[]>([])
const scheduleDetail = ref<GetScheduleListData>()
const study_program_id = ref('')
const semester_id = ref('')
const is_exam = ref(false)

async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000, 1, study_program_id.value, '')
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
async function getSchedule(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getScheduleList(limit, page, '', true, is_exam.value, '')
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

function print(item: string){
    window.open(item , '_blank');
}

function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

watch(is_exam, async (value) => {
    await getSemester()
    await getSchedule(pagination.value.limit, pagination.value.page, '')
});

watch(semester_id, async (value) => {
    await getSemester()
    await getSchedule(pagination.value.limit, pagination.value.page, '')
});

watch(study_program_id, async (value) => {
    await getSemester()
});

onMounted(async () => {
    await getAdminStudyProgram()
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="'Pilih ' + title">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="study_program_id" variant="outlined" hide-details :items="studyPrograms" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="semester_id" item-value="id" variant="outlined" hide-details :items="semesters" label="Pilih Semester" return-object>
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                    }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                            <li style="padding: 10px; margin: 2px;" @click="onClick">
                                                <span>{{ title.school_year }} - {{ title.semester_type
                                                }}</span>
                                            </li>
                                        </a>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="is_exam" variant="outlined" hide-details :items="[{title:'Reguler', value: false}, {title: 'Ujian', value: true}]" item-value="value" item-title="title" label="Reguler/Ujian"></v-select>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-tooltip text="Print">
                                <template #activator="{ props }">
                                    <!-- <NuxtLink :to="'/backoffice/schedule/schedule-print/'+study_program_id" target="_blank" :disabled="study_program_id == ''"> -->
                                        <v-btn flat color="primary" :disabled="study_program_id == ''" @click="print('/backoffice/schedule/schedule-print/'+study_program_id)">
                                            <PrinterIcon stroke-width="1.5" size="20" />
                                            Print
                                        </v-btn>
                                    <!-- </NuxtLink> -->
                                </template>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold"></th>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold"></th>
                    <th class="text-subtitle-1 font-weight-semibold"></th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Kelas</th>
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
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages" :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next" @prevPage="getSchedule(pagination.limit, pagination.prev, '')" @jumpPage="(page: number) => getSchedule(pagination.limit, page, '')" @nextPage="getSchedule(pagination.limit, pagination.next, '')" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>