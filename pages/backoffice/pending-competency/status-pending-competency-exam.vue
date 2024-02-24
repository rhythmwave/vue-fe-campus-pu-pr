<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetStudentListData } from "~~/types/api/student/GetStudentList";
import { GetStudentListRequest } from "~~/types/api/student/GetStudentList";
import { GetSemesterListData } from "~~/types/api/semester/GetSemesterList";

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getStudentList } from '~~/composables/api/student/getStudentList';

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
const title = ref('Status Menunggu UKOM')
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
const students = ref(<GetStudentListData[]>[])
const status = ref('')

async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, '', "")
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
async function getStudent(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: studyProgramId.value,
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: search,
            address: '',
            regencyId: '',
            status: ['MENUNGGU-UKOM'],
            getAcademicGuidance: '',
            hasAuthentication: '',
            studyPlanSemesterId: '',
            studyPlanIsApproved: '',
            studyPlanIsSubmitted: '',
            hasStudyPlan: '',
            statusSemesterId: semesterId.value,
            isRegistered: '',
            hasPaid: '',
            isGraduateEligible: '',
            isThesisEligible: '',
        })
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
watch(search, async function (value) {
    if (value != '') {
        await getStudent(pagination.value.limit, pagination.value.page, search.value)
    }
})
watch(semesterId, async function (value) {
    if (value != '') {
        await getStudent(pagination.value.limit, pagination.value.page, search.value)
    }
})
watch(studyProgramId, async function (value) {
    if (value != '') {
        await getSemester(10000, 1, '')
        await getStudent(pagination.value.limit, pagination.value.page, search.value)
    }
})
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
async function close() {
    dialog.value = false
}
async function updateStudent(item: string) {
    if (studyProgramId.value == '') {
        alert('Pilih Program Studi Terlebih Dahulu')
        return false
    }
    status.value = item
    mode.value = 'update-status'
    dialog.value = true
}
onMounted(async () => {
    await getAdminStudyProgram()
})
</script>

<template>
    <div>
        <div v-if="mode == 'update-status'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeStudentUpdateStatus :studyProgramId="studyProgramId" :isMbkm="false" :status="status"
                        @close="close" @reload="getStudent(limit, page, '')" />
                </v-dialog>
            </v-col>
        </div>
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
                        <v-col cols="12">
                            <v-col cols="12" lg="12" md="12" class="float-left">
                                <v-btn title="Dropout" flat color="error" @click="updateStudent('MENUNGGU-UKOM')"
                                    class="mr-5">
                                    <TrashIcon stroke-width="1.5" size="20" class="white" />
                                    Ganti Status Mahasiswa UKOM
                                </v-btn>
                            </v-col>
                            <v-col cols="12" lg="12" md="12" class="text-right">

                                <a target="_blank"
                                    :href="'/backoffice/pending-competency/prints/' + studyProgramId + '/' + semesterId">
                                    <v-btn color="success float-right" flat class="ml-2 mb-2"
                                        :disabled="studyProgramId == '' || semesterId == ''">
                                        <PrinterIcon />Cetak
                                    </v-btn>
                                </a>
                            </v-col>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-10">
            <caption>Status Menunggu UKOM</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status Akademik Terakhir</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in students">
                    <td>{{ index + 1 }}</td>
                <td>{{ item.nim_number }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.status }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">
                    <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                        :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                        :prev="pagination.prev" :next="pagination.next"
                        @prevPage="getStudent(pagination.limit, pagination.prev, search)"
                        @jumpPage="(page: any) => getStudent(pagination.limit, page, search)"
                        @nextPage="getStudent(pagination.limit, pagination.next, search)" />
                </td>
            </tr>
        </tfoot>
    </v-table>
</div></template>