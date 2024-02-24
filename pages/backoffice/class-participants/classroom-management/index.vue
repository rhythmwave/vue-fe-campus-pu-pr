<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import { ErrorRoot } from '~~/types/api/error';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetStudentClassParticipantData } from "~~/types/api/student-class/GetStudentClassParticipantList";
import { BulkUpdateMaximumParticipantRequest, BulkUpdateMaximumParticipantDataRequest } from "~~/types/api/student-class/BulkUpdateMaximumParticipant";

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { bulkUpdateMaximumParticipant } from '~~/composables/api/student-class/bulkUpdateMaximumParticipant';

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
const title = ref('Manajemen Peserta Kelas')
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
const semesters = ref<GetSemesterListData[]>([])
const studyProgramId = ref('')
const semester_id = ref('')
const classrooms = ref<GetClassroomListData[]>([])
const studentParticipants = ref<GetStudentClassParticipantData[]>([])
const classroomId = ref('')
const maximum_participants = ref([])
const classroomIds = ref([])

interface UpdateMax {
    class_id: string
    maximum_participant: number
}
const updateMaxs = ref(<BulkUpdateMaximumParticipantDataRequest[]>[])
const class_ids = ref(<string[]>[])

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
// async function getSemester() {
//     try {
//         const { response: resp, error: error } = await getSemesterList(1000, 1, studyProgramId.value, '')
//         if (error) {
//             let dataError = <ErrorRoot>error;
//             alert(dataError.meta.message);
//             return;
//         }
//         if (resp != null) {
//             semesters.value = resp?.data
//         }
//     } catch (error) {
//         alert(error)
//     }
// }
async function getClassroom(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getClassroomList(limit, page, search, studyProgramId.value, semester_id.value, true, '', false)
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
async function getStudentClassParticipant(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getStudentClassParticipantList(limit, page, search, classroomId.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentParticipants.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function selectedProgramStudy(){
    await getClassroom(pagination.value.limit, pagination.value.page, '')
}
async function show(id: string){
    classroomId.value = id
    await getStudentClassParticipant(1000, 1, '')
    mode.value = 'show'
    dialog.value = true
}
async function changeMaxParticipant(class_id: string, ev: any){
    let found = updateMaxs.value.some(el => el.class_id === class_id);
    if(found){
        let index = updateMaxs.value.findIndex(x => x.class_id === class_id);
        updateMaxs.value.splice(index, 1)
    }
    let updateMax = <BulkUpdateMaximumParticipantDataRequest>{
        class_id: class_id,
        maximum_participant: ev.target.value,
    }
    updateMaxs.value.push(updateMax)
}
async function updateMaximumParticipant(){
    try {
        const { response: createRoleResponse, error } = await bulkUpdateMaximumParticipant(updateMaxs.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            close()
            await getClassroom(pagination.value.limit, pagination.value.page, '')
        }
    } catch (error) {
        alert(error)
        // return false;
    }
}

function printClass(){
    window.open('/backoffice/class-participants/classroom-management/class-print/'+studyProgramId.value, '_blank')
}

function printParticipant(){
    mode.value = 'print-participant'
    dialog.value = true
}

function printParticipantOpen(){
    let arr = ''
    for (let index = 0; index < class_ids.value.length; index++) {
        const element = class_ids.value[index];
        if(element != 'all'){
            if(index == 0){
                arr += '?class_id=' + element
            }else{
                arr += '&class_id=' + element
            }
        }
    }
    window.open('/backoffice/class-participants/classroom-management/participant-print/'+studyProgramId.value+arr, '_blank')
    dialog.value = false
}

async function selectedAll(){
    if(class_ids.value.length > 0){
        class_ids.value = <string[]>[]
    }else{
        class_ids.value = <string[]>[]
        for (let index = 0; index < classrooms.value.length; index++) {
            const element = classrooms.value[index];
            class_ids.value.push(element.id)
        }
    }
}
async function searchClass(){
    await getClassroom(pagination.value.limit, pagination.value.page, search.value)
}
onMounted(async () => {
    await getAdminStudyProgram()
})
</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="1200">
                <PagesBackofficeStudentClassDetail :studentParticipants="studentParticipants" />
            </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'print-participant'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="1200">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Pilih Kelas</span>
                        </v-card-title>
                        <v-table class="month-table">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">
                                        <v-checkbox v-model="class_ids" :value="'all'" @click="selectedAll"></v-checkbox>
                                    </th>
                                    <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama Kelas</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in classrooms">
                                    <td><v-checkbox v-model="class_ids" :value="item.id"></v-checkbox></td>
                                    <td>{{ item.subject_name }}</td>
                                    <td>{{ item.name }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2"></td>
                                    <td>
                                        <v-btn color="primary" flat class="text-right ml-2" :disabled="class_ids.length == 0" @click="printParticipantOpen">
                                            Cetak
                                        </v-btn>
                                    </td>
                                </tr>
                            </tfoot>
                        </v-table>
                    </v-card>
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
            <SharedUiParentCard :title="'Daftar '+title">
                <v-row>
                    <v-col cols="12" lg="6" md="6">
                        <v-autocomplete v-model="studyProgramId" :items="studyPrograms" item-title="name" item-value="id" density="compact" :label="'Pilih Program Studi'" hide-details variant="outlined" @update:model-value="selectedProgramStudy" />
                    </v-col>
                    <v-col cols="12" lg="6" md="6">
                        <v-text-field v-model="search" label="Cari Kelas" hide-details variant="outlined" @update:model-value="searchClass"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" lg="12" md="12" class="text-right">
                        <v-btn color="primary" flat class="ml-2" @click="updateMaximumParticipant" :disabled="updateMaxs.length == 0">
                            Update Maximum Peserta
                        </v-btn>
                        <v-btn color="primary" flat class="ml-2" :disabled="studyProgramId == ''" @click="printClass">
                            Cetak Kelas
                        </v-btn>
                        <v-btn color="primary" flat class="ml-2" :disabled="studyProgramId == ''" @click="printParticipant">
                            Cetak Peserta
                        </v-btn>
                    </v-col>
                </v-row>
            </SharedUiParentCard>
        <v-table class="mt-10">
            <caption>Daftar {{ title }}</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kapasitas Maksimal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Peserta</th>
                    <th class="text-subtitle-1 font-weight-semibold">KRS Belum Disetujui</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in classrooms">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_name }} ({{ item.subject_code }})</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <ul v-for="lecturer in item.lecturers">
                            <li>{{ lecturer.name }}</li>
                        </ul>
                    </td>
                    <td>
                        <v-text-field type="number" variant="outlined" hide-details @change="changeMaxParticipant(item.id, $event)" :label="item.maximum_participant"></v-text-field>
                    </td>
                    <td>{{ item.total_participant }}</td>
                    <td>{{ item.unapproved_study_plan }}</td>
                    <td>
                        <v-col col="12">
                            <!-- <v-col col="12" sm="12" class="float-left">
                                <v-btn color="success" flat class="ml-auto" @click="editMaximumParticipant(item.id, item.maximum_participant)" >
                                    <v-icon class="mr-2">
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                            </v-col> -->
                            <v-col col="12" sm="12" class="float-left">
                                <v-btn color="primary" flat class="ml-auto" @click="show(item.id)" >
                                    <v-icon class="mr-2">
                                        mdi-eye
                                    </v-icon>Lihat
                                </v-btn>
                            </v-col>
                        </v-col>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getClassroom(pagination.limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getClassroom(pagination.limit, page, search)"
                            @nextPage="getClassroom(pagination.limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>