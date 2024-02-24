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
const title = ref('Jadwal Kelas')
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
const is_regular = ref(true)
const label_is_regular = ref('Reguler')
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
        const { response: resp, error: error } = await getClassroomList(limit, page, search, study_program_id.value.id, semester_id.value.id, is_active, '', true)
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
        const { response: resp, error: error } = await getScheduleList(limit, page, classroom_id.value.id, is_regular.value, false, '')
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

async function getRoomScheduleList(limit: number, page: number, search: string, room_id: string, day_of_week: string, semester_id: string) {
    try {
        const { response: resp, error: error } = await getRoomSchedule(limit, page, search, room_id, day_of_week, semester_id)
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
        await getClassroom(limit, page.value, search.value, true)
        await getSemester()
    }
}
async function semesterOnChange(item: any) {
    if (item != '') {
        semester_id.value = item
    }
    if (semester_id.value.id != '') {
        await getClassroom(limit, page.value, search.value, true)
    }
}
async function classroomOnChange(item: any) {
    if (item != '') {
        classroom_id.value = item
    }
    if (classroom_id.value.id != '') {
        await getSchedule(limit, page.value, search.value)
    }
}
async function IsRegularOnChange(item: any) {
    if (item == 'Reguler') {
        is_regular.value = true
    }
    if (item == 'Harian') {
        is_regular.value = false
    }
    await getSchedule(limit, page.value, search.value)
}
async function create() {
    mode.value = 'create'
    dialog.value = true
}
async function editItem(item: any) {
    mode.value = 'edit'
    scheduleDetail.value = <GetScheduleListData>{
        id: item.id,
        lecture_plan_date: item.lecture_plan_date,
        lecture_plan_day_of_week: item.lecture_plan_day_of_week,
        lecture_plan_start_time: item.lecture_plan_start_time,
        lecture_plan_end_time: item.lecture_plan_end_time,
        lecture_actual_date: item.lecture_actual_date,
        lecture_actual_day_of_week: item.lecture_actual_day_of_week,
        lecture_actual_start_time: item.lecture_actual_start_time,
        lecture_actual_end_time: item.lecture_actual_end_time,
        lecturer_id: item.lecturer_id,
        lecturer_name: item.lecturer_name,
        foreign_lecturer_name: item.foreign_lecturer_name,
        foreign_lecturer_source_instance: item.foreign_lecturer_source_instance,
        is_original_lecturer: item.is_original_lecturer,
        class_id: item.class_id,
        class_name: item.class_name,
        room_id: item.room_id,
        room_name: item.room_name,
        is_midterm_exam: item.is_midterm_exam,
        is_endterm_exam: item.is_endterm_exam,
        is_theory_exam: item.is_theory_exam,
        is_practicum_exam: item.is_practicum_exam,
        is_field_practicum_exam: item.is_field_practicum_exam,
        exam_supervisors: item.exam_supervisors,
        subject_name: item.subject_name,
        subject_code: item.subject_code,
        total_participant: item.total_participant,
    }
    dialog.value = true
}
function deleteItem(item: any) {
    mode.value = 'delete'
    scheduleObj.value = {
        id: item.id,
        name: item.name,
    }
    dialog.value = true
}
function close() {
    dialog.value = false
}
async function deleteData(item: any) {
    try {
        const { response: createRoleResponse, error } = await deleteSchedule(item.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            await getSchedule(limit, page.value, search.value)
        }
    } catch (error) {
        alert(error)
        return false;
    }
    scheduleObj.value = {
        id: '',
        name: '',
    }
    await getSchedule(limit, page.value, search.value)
    close()
}
async function showRoomScheduleDaily() {
    await getRoomScheduleList(limit, 1, search.value, '', '', '')
    mode.value = 'show-room-schedule'
    dialog.value = true
}
async function showRoomScheduleSpecial() {
    console.log("wadaw")
    // await getRoomScheduleList(limit, 1, search.value, true, '', '', '')
    // mode.value = 'show-room-schedule'
    // dialog.value = true
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
    <div v-if="mode == 'delete'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">Hapus {{ title }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form" lazy-validation>
                            <v-row>
                                <h5>Nama</h5>
                            </v-row>
                            <v-row>
                                <div>{{ scheduleObj.name }}</div>
                            </v-row>
                            <v-col class="text-right">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="close()">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" @click="deleteData(scheduleObj)">
                                        Hapus
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-col>
    </div>
    <div v-if="mode == 'create'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <PagesBackofficeScheduleCreate :title="'Tambah ' + title" :isMbkm="true" :studyProgramId="study_program_id.id" :studyProgramName="study_program_id.name" :semesterId="semester_id.id" :semesterName="semester_id.school_year +'-'+semester_id.semester_type" :classroomId="classroom_id.id" :classroomName="classroom_id.subject_name +' - '+classroom_id.name+' - '+'(kapasitas: '+classroom_id.maximum_participant+')'" @close="close" @reload="getClassroom(limit, 1, '', true)" />
            </v-dialog>
        </v-col>
    </div>
    <div v-if="mode == 'edit'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <PagesBackofficeScheduleEdit :title="'Edit ' + title" :isMbkm="true" @close="close"
                    @reload="getSchedule(limit, 1, '')" :data-detail=scheduleDetail :data-study-program-id=study_program_id
                    :data-semester-id=semester_id />
            </v-dialog>
        </v-col>
    </div>
    <div v-if="mode == 'show-room-schedule'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <PagesBackofficeScheduleShowRoomSchedule :title="'Lihat Jadwal Ruangan'" :data-detail="room_schedules" />
            </v-dialog>
        </v-col>
    </div>
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
                        <v-select @update:model-value="(sl: any) => semesterOnChange(sl)" item-value="id" variant="outlined" hide-details :items="semesters" label="Pilih Semester" return-object>
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
                    <v-col cols="12" lg="4" md="6">
                        <v-select variant="outlined" hide-details :items="classrooms" item-value="id" item-title="name" label="Pilih Kelas" @update:model-value="(sl: any) => classroomOnChange(sl)" return-object></v-select>
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12">
            <UiParentCard :title="'Daftar ' + title">
                <v-row>
                    <v-col cols="12" lg="4" md="4">
                        <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                            @input="getSchedule(limit, page, $event.target.value)"></v-text-field>
                    </v-col>
                    <!-- <v-col cols="12" lg="4" md="6">
                        <v-select v-model="label_is_regular" variant="outlined" hide-details :items="['Reguler', 'Harian']"
                            item-value="id" item-title="name" label="Pilih Kelas"
                            @update:model-value="(sl: any) => IsRegularOnChange(sl)"></v-select>
                    </v-col> -->
                    <v-col cols="12" lg="8" md="8" class="text-right">
                        <v-btn color="primary" flat class="ml-auto" @click="create()" :disabled="study_program_id.id == '' || semester_id.id == '' || classroom_id.id == ''
                        ">
                            <v-icon class="mr-2">
                                mdi-account-multiple-plus
                            </v-icon>Tambah {{ title }}
                        </v-btn>
                    </v-col>
                </v-row>
                <!-- <v-row>
                    <v-col cols="12" lg="4" md="6" class="text-left"></v-col>
                    <v-col cols="12" lg="8" md="6" class="text-right">
                        <v-btn color="warning" flat class="ml-auto" @click="showRoomScheduleDaily()">
                            <v-icon class="mr-2">
                                mdi-eye
                            </v-icon>Cek {{ title }} Rutin
                        </v-btn>
                    </v-col>
                    <v-col cols="12" lg="4" md="6" class="text-right">
                        <v-btn color="warning" flat class="ml-auto" @click="showRoomScheduleSpecial()">
                            <v-icon class="mr-2">
                                mdi-eye
                            </v-icon>Cek {{ title }} Harian
                        </v-btn>
                    </v-col>
                </v-row> -->
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
                <th class="text-subtitle-1 font-weight-semibold">Jumlah Peserta</th>
                <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in schedules" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>
                    {{ item.subject_code }} ({{ item.subject_name }})
                </td>
                <td>{{ item.class_name }}</td>
                <td>{{ item.theory_credit + item.practicum_credit + item.field_practicum_credit }}</td>
                <td>{{ item.room_name }}</td>
                <td v-if="item.is_regular_schedule">{{ convertDayOfWeek(item.day_of_week) }} ({{
                    convertTimeNumberToString(item.start_time) }} - {{ convertTimeNumberToString(item.end_time) }})</td>
                <td v-else>
                    {{ moment(item.single_day_date).format('DD-MM-YYYY') }} ({{ convertTimeNumberToString(item.start_time)
                    }} - {{ convertTimeNumberToString(item.end_time) }})
                </td>
                <td v-if="item.is_regular_schedule">
                    <ul v-for="lecturer in item.lecturers">
                        <li>{{ lecturer.front_title }} {{ lecturer.name }}, {{ lecturer.back_degree }}</li>
                    </ul>
                </td>
                <td v-else>
                    {{ item.single_day_lecturer_front_title }} {{ item.single_day_lecturer_name }}
                    {{ item.single_day_lecturer_back_degree }}
                </td>
                <td>{{ item.total_participant }}</td>
                <td>
                    <!-- <v-tooltip text="Edit">
                        <template #activator="{ props }">
                            <VBtn title="Edit" icon flat @click="editItem(item)">
                                <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                            </VBtn>
                        </template>
                    </v-tooltip> -->
                    <v-tooltip text="Delete">
                        <template #activator="{ props }">
                            <VBtn title="Delete" icon flat @click="deleteItem(item)">
                                <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                            </VBtn>
                        </template>
                    </v-tooltip>
                </td>
        </tr>
    </tbody>
</v-table></template>