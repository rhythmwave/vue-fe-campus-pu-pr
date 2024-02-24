<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import { ErrorRoot } from '~~/types/api/error';

import { GetStudentListRequest, GetStudentListData } from "~~/types/api/student/GetStudentList";
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getStudentList } from '~~/composables/api/student/getStudentList';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});
const limit = 20
const paginationCreated = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const paginationSubmit = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const paginationNotSubmit = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const paginationApproved = ref<PaginationModel>({
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
const title = ref('Manajemen Rencana Studi')
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
const studyPrograms = ref<GetAdminStudyProgramListData[] | undefined>()
const semesters = ref<GetSemesterListData[] | undefined>()
const semesterId = ref('')
const studentCreateds = ref<GetStudentListData[] | undefined>()
const studentSubmits = ref<GetStudentListData[] | undefined>()
const studentNotSubmits = ref<GetStudentListData[] | undefined>()
const studentApproveds = ref<GetStudentListData[] | undefined>()
const requestStudentCreated = ref(<GetStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    address: '',
    regencyId: '',
    status: [],
    getAcademicGuidance: '',
    hasAuthentication: '',
    studyPlanSemesterId: '',
    studyPlanIsApproved: '',
    studyPlanIsSubmitted: false,
    hasStudyPlan: true,
    statusSemesterId: '',
    isRegistered: '',
    hasPaid: '',
    isGraduateEligible: '',
    isThesisEligible: '',
    yudiciumSessionId: '',
})
const requestStudentSubmit = ref(<GetStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    address: '',
    regencyId: '',
    status: [],
    getAcademicGuidance: '',
    hasAuthentication: '',
    studyPlanSemesterId: '',
    studyPlanIsApproved: '',
    studyPlanIsSubmitted: true,
    hasStudyPlan: true,
    statusSemesterId: '',
    isRegistered: '',
    hasPaid: '',
    isGraduateEligible: '',
    isThesisEligible: '',
    yudiciumSessionId: '',
})
const requestStudentHasnotSubmit = ref(<GetStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    address: '',
    regencyId: '',
    status: [],
    getAcademicGuidance: '',
    hasAuthentication: '',
    studyPlanSemesterId: '',
    studyPlanIsApproved: false,
    studyPlanIsSubmitted: true,
    hasStudyPlan: true,
    statusSemesterId: '',
    isRegistered: '',
    hasPaid: '',
    isGraduateEligible: '',
    isThesisEligible: '',
    yudiciumSessionId: '',
})
const requestStudentapproved = ref(<GetStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    address: '',
    regencyId: '',
    status: [],
    getAcademicGuidance: '',
    hasAuthentication: '',
    studyPlanSemesterId: '',
    studyPlanIsApproved: true,
    studyPlanIsSubmitted: true,
    hasStudyPlan: true,
    statusSemesterId: '',
    isRegistered: '',
    hasPaid: '',
    isGraduateEligible: '',
    isThesisEligible: '',
    yudiciumSessionId: '',
})
const studyProgramId = ref('')
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(10000, 1, '', '')
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
        const { response: resp, error: error } = await getSemesterList(10000, 1, studyProgramId.value, '')
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
async function getStudentCreated(limit: number, page: number, search: string) {
    requestStudentCreated.value.studyPlanSemesterId = semesterId.value
    requestStudentCreated.value.name = search
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, requestStudentCreated.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentCreateds.value = resp?.data
            paginationCreated.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
async function getStudentSubmit(limit: number, page: number, search: string) {
    requestStudentSubmit.value.studyPlanSemesterId = semesterId.value
    requestStudentSubmit.value.name = search
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, requestStudentSubmit.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentSubmits.value = resp?.data
            paginationSubmit.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
async function getStudentNotSubmit(limit: number, page: number, search: string) {
    requestStudentHasnotSubmit.value.studyPlanSemesterId = semesterId.value
    requestStudentHasnotSubmit.value.name = search
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, requestStudentHasnotSubmit.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentNotSubmits.value = resp?.data
            paginationNotSubmit.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
async function getStudentApproved(limit: number, page: number, search: string) {
    requestStudentapproved.value.studyPlanSemesterId = semesterId.value
    requestStudentapproved.value.name = search
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, requestStudentapproved.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentApproveds.value = resp?.data
            paginationApproved.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
async function selectedProgramStudy() {
    await getSemester()
}
watch(semesterId, async function (value) {
    if (value != '') {
        await getStudentCreated(paginationCreated.value.limit, paginationCreated.value.page, search.value)
        await getStudentSubmit(paginationSubmit.value.limit, paginationSubmit.value.page, search.value)
        await getStudentNotSubmit(paginationNotSubmit.value.limit, paginationNotSubmit.value.page, search.value)
        await getStudentApproved(paginationApproved.value.limit, paginationApproved.value.page, search.value)
    }
})
const study_plan_id = ref('')
async function show(id: string) {
    mode.value = 'show'
    dialog.value = true
    study_plan_id.value = id
}
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
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
                    <PagesBackofficeStudyPlanDetail :studyPlanId="study_plan_id" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'Daftar ' + title">
            <v-row>
                <v-col cols="12" lg="4" md="4">
                    <v-autocomplete v-model="studyProgramId" :items="studyPrograms" item-title="name" item-value="id"
                        density="compact" :label="'Pilih Program Studi'" hide-details variant="outlined"
                        @update:model-value="selectedProgramStudy" />
                </v-col>
                <v-col cols="12" lg="4" md="4">
                    <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details :items="semesters"
                        label="Pilih Semester">
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
                    <!-- <v-autocomplete v-model="semesterId" :items="semesters" item-title="school_year" item-value="id" density="compact" :label="'Pilih Semester'" hide-details variant="outlined" @update:model-value="selectedSemester" /> -->
                </v-col>
                <!-- <v-col cols="12" lg="4" md="4">
                    <v-btn color="primary" flat class="ml-auto" @click="create()">
                        <v-icon class="mr-2">
                            mdi-eye
                        </v-icon>Lihat
                    </v-btn>
                </v-col> -->
            </v-row>
        </SharedUiParentCard>
        <v-table class="mt-10">
            <caption>Mahasiswa Yang Sudah Masuk Rencana Studi Belum Submit</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nim</th>
                    <th class="text-subtitle-1 font-weight-semibold">Angkatan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jatah SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">SKS Diambil</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">KRS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentCreateds">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.student_force }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.study_plan_maximum_credit }}</td>
                    <td>{{ item.study_plan_total_mandatory_credit + item.study_plan_total_optional_credit }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.study_plan_is_approved ? 'Disetujui' : 'Belum' }}</td>
                    <td>
                        <v-btn color="primary" flat class="ml-auto" @click="show(item.study_plan_id)">
                            <v-icon class="mr-2">
                                mdi-eye
                            </v-icon>Lihat
                        </v-btn>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="paginationCreated.limit" :page="paginationCreated.page"
                            :total_pages="paginationCreated.total_pages" :total_records="paginationCreated.total_records"
                            :prev="paginationCreated.prev" :next="paginationCreated.next"
                            @prevPage="getStudentCreated(paginationCreated.limit, paginationCreated.prev, search)"
                            @jumpPage="(page: any) => getStudentCreated(paginationCreated.limit, page, search)"
                            @nextPage="getStudentCreated(paginationCreated.limit, paginationCreated.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
        <v-table class="mt-10">
            <caption>Mahasiswa Yang Sudah Masuk Rencana Studi Sudah Submit</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nim</th>
                    <th class="text-subtitle-1 font-weight-semibold">Angkatan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jatah SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">SKS Diambil</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">KRS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentSubmits">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.student_force }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.study_plan_maximum_credit }}</td>
                    <td>{{ item.study_plan_total_mandatory_credit + item.study_plan_total_optional_credit }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.study_plan_is_approved ? 'Disetujui' : 'Belum' }}</td>
                    <td>
                        <v-btn color="primary" flat class="ml-auto" @click="show(item.study_plan_id)">
                            <v-icon class="mr-2">
                                mdi-eye
                            </v-icon>Lihat
                        </v-btn>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="paginationSubmit.limit" :page="paginationSubmit.page"
                            :total_pages="paginationSubmit.total_pages" :total_records="paginationSubmit.total_records"
                            :prev="paginationSubmit.prev" :next="paginationSubmit.next"
                            @prevPage="getStudentSubmit(paginationSubmit.limit, paginationSubmit.prev, search)"
                            @jumpPage="(page: any) => getStudentSubmit(paginationSubmit.limit, page, search)"
                            @nextPage="getStudentSubmit(paginationSubmit.limit, paginationSubmit.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
        <v-table class="mt-10">
            <caption>Mahasiswa Yang Sudah Masuk Rencana Studi Belum Disetujui</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nim</th>
                    <th class="text-subtitle-1 font-weight-semibold">Angkatan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jatah SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">SKS Diambil</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">KRS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentNotSubmits">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.student_force }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.study_plan_maximum_credit }}</td>
                    <td>{{ item.study_plan_total_mandatory_credit + item.study_plan_total_optional_credit }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.study_plan_is_approved ? 'Disetujui' : 'Belum' }}</td>
                    <td>
                        <v-btn color="primary" flat class="ml-auto" @click="show(item.study_plan_id)">
                            <v-icon class="mr-2">
                                mdi-eye
                            </v-icon>Lihat
                        </v-btn>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="paginationNotSubmit.limit" :page="paginationNotSubmit.page"
                            :total_pages="paginationNotSubmit.total_pages"
                            :total_records="paginationNotSubmit.total_records" :prev="paginationNotSubmit.prev"
                            :next="paginationNotSubmit.next"
                            @prevPage="getStudentNotSubmit(paginationNotSubmit.limit, paginationNotSubmit.prev, search)"
                            @jumpPage="(page: any) => getStudentNotSubmit(paginationNotSubmit.limit, page, search)"
                            @nextPage="getStudentNotSubmit(paginationNotSubmit.limit, paginationNotSubmit.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
        <v-table class="mt-10">
            <caption>Mahasiswa Yang Sudah Masuk Rencana Studi Sudah Disetujui</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nim</th>
                    <th class="text-subtitle-1 font-weight-semibold">Angkatan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jatah SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">SKS Diambil</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">KRS</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentApproveds">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.student_force }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.study_plan_maximum_credit }}</td>
                    <td>{{ item.study_plan_total_mandatory_credit + item.study_plan_total_optional_credit }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ item.study_plan_is_approved ? 'Disetujui' : 'Belum' }}</td>
                    <td>
                        <v-btn color="primary" flat class="ml-auto" @click="show(item.study_plan_id)">
                            <v-icon class="mr-2">
                                mdi-eye
                            </v-icon>Lihat
                        </v-btn>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="paginationApproved.limit" :page="paginationApproved.page"
                            :total_pages="paginationApproved.total_pages" :total_records="paginationApproved.total_records"
                            :prev="paginationApproved.prev" :next="paginationApproved.next"
                            @prevPage="getStudentApproved(paginationApproved.limit, paginationApproved.prev, search)"
                            @jumpPage="(page: any) => getStudentApproved(paginationApproved.limit, page, search)"
                            @nextPage="getStudentApproved(paginationApproved.limit, paginationApproved.next, search)" />
                    </td>
                </tr>
            </tfoot>
    </v-table>
</div></template>