<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetStudentLeaveRequest, GetStudentLeaveList } from "~~/types/api/student-leave/GetStudentLeave";
import { GetSemesterListData } from "~~/types/api/semester/GetSemesterList";

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getStudentLeaveList } from '~~/composables/api/student-leave/getStudentLeaveList';

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
const title = ref('Cuti Mahasiswa')
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
const studyProgramId = ref('')
const semesterId = ref('')
const studyPrograms = ref(<GetAdminStudyProgramListData[]>[])
const semesters = ref(<GetSemesterListData[]>[])
const studentLeaves = ref(<GetStudentLeaveList[]>[])
const studentLeave = ref(<GetStudentLeaveList>{})

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
async function getSemester(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getSemesterList(limit, page, search, "")
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
async function getStudentLeave(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getStudentLeaveList(limit, page, search, <GetStudentLeaveRequest>{
            studyProgramId: studyProgramId.value,
            semesterId: semesterId.value,
            isApproved: false,
        })
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentLeaves.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
watch(search, async function (value) {
    if (value != '') {
        await getStudentLeave(pagination.value.limit, pagination.value.page, search.value)
    }
})
watch(semesterId, async function (value) {
    if (value != '') {
        await getStudentLeave(pagination.value.limit, pagination.value.page, search.value)
    }
})
watch(studyProgramId, async function (value) {
    if (value != '') {
        await getStudentLeave(pagination.value.limit, pagination.value.page, search.value)
        await getSemester(100000, 1, search.value)
    }
})
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
async function create() {
    if (studyProgramId.value == '') {
        alert('Harap Pilih Program Studi')
        return false
    }
    mode.value = 'create'
    dialog.value = true
}
async function edit(item: GetStudentLeaveList) {
    if (studyProgramId.value == '') {
        alert('Harap Pilih Program Studi')
        return false
    }
    studentLeave.value = <GetStudentLeaveList>{
        id: item.id,
        nim_number: item.nim_number,
        name: item.name,
        dikti_study_program_code: item.dikti_study_program_code,
        study_program_name: item.study_program_name,
        study_level_short_name: item.study_level_short_name,
        dikti_study_program_type: item.dikti_study_program_type,
        start_date: item.start_date,
        total_leave_duration_semester: item.total_leave_duration_semester,
        permit_number: item.permit_number,
        purpose: item.purpose,
        remarks: item.remarks,
        is_approved: item.is_approved,
    }
    mode.value = 'edit'
    dialog.value = true
}
async function close() {
    dialog.value = false
}
onMounted(async () => {
    await getAdminStudyProgram('')
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12">
                            <v-col cols="12" lg="4" md="4" class="float-left">
                                <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms"
                                    item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" class="float-left">
                                <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details
                                    :items="semesters" label="Pilih Semester">
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
                            <v-col cols="12" lg="4" md="4" class="float-left">
                                <v-text-field v-model="search" variant="outlined" hide-details
                                    label="Cari Nama"></v-text-field>
                            </v-col>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" lg="12" md="12" class="text-right">

                            <a target="_blank" :href="'/backoffice/student-affairs/prints/student-leave/' + studyProgramId + '/' + semesterId">
                                <v-btn color="success float-right" flat class="ml-2 mb-2"
                                    :disabled="studyProgramId == '' || semesterId == ''">
                                    <PrinterIcon />Cetak Cuti Mahasiswa
                                </v-btn>
                            </a>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-10">
            <caption>Mahasiswa Yang Menjalani Cuti</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Semester</th>
                    <th colspan="3" class="text-subtitle-1 font-weight-semibold text-center">Data Cuti</th>
                </tr>
                <tr>
                    <th colspan="4" class="text-subtitle-1 font-weight-semibold"></th>
                    <th class="text-subtitle-1 font-weight-semibold">Nomor</th>
                    <th class="text-subtitle-1 font-weight-semibold">Alasan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Catatan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentLeaves">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.semester_school_year }} - {{ item.semester_type }}</td>
                    <td>{{ item.permit_number }}</td>
                    <td>{{ item.purpose }}</td>
                    <td>{{ item.remarks }}</td>
                    <td>{{ item.study_program_name }} ({{ item.dikti_study_program_code }} / {{
                    item.dikti_study_program_type }})</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">
                    <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                        :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                        :prev="pagination.prev" :next="pagination.next"
                        @prevPage="getStudentLeave(pagination.limit, pagination.prev, '')"
                        @jumpPage="(page: any) => getStudentLeave(pagination.limit, page, '')"
                        @nextPage="getStudentLeave(pagination.limit, pagination.next, '')" />
                </td>
            </tr>
        </tfoot>
    </v-table>
</div></template>