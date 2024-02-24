<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { convertStringTimeToNumberTime } from '~~/utils/helpers/date-utils';
import moment from 'moment';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getScheduleList } from '~~/composables/api/schedule/getScheduleList';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});
const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Rekap Pengawas Ujian')
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
const studyPrograms = ref<GetAdminStudyProgramListData[]>([])
const studyProgramId = ref('')
const semesters = ref<GetSemesterListData[]>([])
const semesterId = ref('')
const classrooms = ref<GetClassroomListData[]>([])
const classroomId = ref('')
const examType = ref('')
const schedules = ref<GetScheduleListData[]>([])
const scheduleSupervisor = ref(<GetScheduleListData>{})

async function getAdminStudyProgram(search: string) {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, search, "")
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
        const { response: resp, error: error } = await getSemesterList(1000, 1, studyProgramId.value, '')
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
        const { response: resp, error: error } = await getClassroomList(limit, page, search, studyProgramId.value, semesterId.value, is_active, '', false)
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
async function getSchedule(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getScheduleList(limit, page, classroomId.value, false, true, examType.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            schedules.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
async function create(item: any) {
    mode.value = 'create'
    dialog.value = true
    scheduleSupervisor.value = item
}
async function close() {
    dialog.value = false
}
watch(examType, async function (value) {
    if (value != '') {
        await getSchedule(limit, pagination.value.page, '')
    }
})
watch(classroomId, async function (value) {
    if (value != '') {
        await getSchedule(limit, pagination.value.page, '')
    }
})
watch(semesterId, async function (value) {
    if (value != '') {
        await getClassroom(10000, 1, '', true)
    }
})
watch(studyProgramId, async function (value) {
    if (value != '') {
        await getSemester()
    }
})
onMounted(async () => {
    await getAdminStudyProgram('')
})

function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>
<template>
    <div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeClassParticipantExamSupervisorRecapCreate @reload="getSchedule(limit, 1, '')"
                        @close="close" :data="scheduleSupervisor" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="'Pilih ' + title">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms"
                                item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <!-- <v-select v-model="semesterId" variant="outlined" hide-details :items="semesters" item-value="id" item-title="school_year" label="Pilih Semester"></v-select> -->
                            <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details
                                :items="semesters" label="Pilih Semester">
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
                        <v-col cols="12" lg="4" md="6">
                            <!-- <v-select v-model="classroomId" variant="outlined" hide-details :items="classrooms"
                                item-value="id" item-title="name" label="Pilih Kelas"></v-select> -->
                            <v-select v-model="classroomId" item-value="id" variant="outlined" hide-details
                                :items="classrooms" label="Pilih Kelas">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.subject_code }} - {{ item.props.title.subject_name }} -
                                        {{ item.props.title.name }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <li style="padding: 10px; margin: 2px;">
                                            <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                <span @click="onClick">{{ title.subject_code }} - {{ title.subject_name }} - {{title.name }} (kapasitas: {{ title.maximum_participant }} orang)</span>
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="'Daftar ' + title">
                    <v-row>
                        <v-col cols="12" lg="6" md="6">
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined" @input="getSchedule(limit, pagination.page, $event.target.value)"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6" md="6">
                            <v-select v-model="examType" variant="outlined" hide-details
                                :items="[{ id: 'midterm', name: 'UTS' }, { id: 'endterm', name: 'UAS' }]" item-value="id"
                                item-title="name" label="Pilih Tipe"></v-select>
                        </v-col>
                        <!-- <v-col cols="12" lg="4" md="4" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create">
                                <v-icon class="mr-2">
                                mdi-plus
                                </v-icon>Tambah
                            </v-btn>
                        </v-col> -->
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">Ruang</th>
                    <th class="text-subtitle-1 font-weight-semibold">Hari / Jam</th>
                    <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Pengawas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Peserta</th>
                    <th width="200" class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in schedules" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                        {{ item.subject_code }} ({{ item.subject_name }})
                    </td>
                    <td>{{ item.class_name }}</td>
                    <td>
                        {{ !isNaN(item.theory_credit + item.practicum_credit + item.field_practicum_credit) ? (item.theory_credit + item.practicum_credit + item.field_practicum_credit) : 0 }}
                    </td>
                    <td>{{ item.room_name }}</td>
                    <td>
                        {{ item.single_day_date != '' ? moment(item.single_day_date).format('DD-MM-YYYY') : '' }} ({{ convertStringTimeToNumberTime(item.start_time) }} - {{ convertStringTimeToNumberTime(item.end_time) }})
                    </td>
                    <td>
                        {{ item.single_day_lecturer_front_title }} {{ item.single_day_lecturer_name }}
                        {{ item.single_day_lecturer_back_degree }}
                    </td>
                    <td>
                        <ul>
                            <li v-for="itm in item.exam_supervisors">{{ itm.front_title }} {{ itm.name }} {{ itm.back_degree
                            }} sebagai ({{ itm.exam_supervisor_role_name }})</li>
                        </ul>
                    </td>
                    <td>{{ item.total_participant }}</td>
                    <td>
                        <v-btn title="Add" icon flat @click="create(item)" class="float-left">
                            <PlusIcon stroke-width="1.5" size="20" class="text-success" />
                        </v-btn>
                        <!-- <v-btn title="Edit" icon flat @click="editItem(item)" class="float-left">
                            <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                        </v-btn>
                        <v-btn title="Delete" icon flat @click="deleteItem(item)" class="float-left">
                            <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                        </v-btn> -->
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getSchedule(pagination.limit, pagination.prev, '')"
                            @jumpPage="(page: any) => getSchedule(pagination.limit, page, '')"
                            @nextPage="getSchedule(pagination.limit, pagination.next, '')" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>