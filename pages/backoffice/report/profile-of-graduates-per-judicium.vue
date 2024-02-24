<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { getYearBatch } from '~~/utils/helpers/graduation';
import moment from 'moment';
import { PaginationModel } from '~~/types/api/pagination';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { GetStudentListData } from '~~/types/api/student/GetStudentList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getScheduleList } from '~~/composables/api/schedule/getScheduleList';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { GetYudiciumSessionListData } from '~~/types/api/yudicium-session/GetYudiciumSessionList';
import { getYudiciumSessionList } from '~~/composables/api/yudicium-session/getYudiciumSessionList';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});
const title = ref('Profile Lulusan Per Yudisium')
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
const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const studyPrograms = ref<GetAdminStudyProgramListData[]>([])
const studyProgramId = ref('')
const yudiciumSessions = ref<GetYudiciumSessionListData[]>([])
const yudiciumSessionId = ref('')
const search = ref('')
const students = ref<GetStudentListData[]>([])

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
async function getYudiciumSession(search: string) {
    try {
        const { response: resp, error: error } = await getYudiciumSessionList(1000, 1, search)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            yudiciumSessions.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getStudent(limit: number, page: number) {
    try {
        if (studyProgramId.value == '' || yudiciumSessionId.value == '') {
            students.value = []
            pagination.value = {
                page: 1,
                limit: 20,
                prev: 1,
                next: 1,
                total_pages: 1,
                total_records: 0
            }
            return
        }
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: studyProgramId.value,
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: search.value,
            address: '',
            regencyId: '',
            status: ['AKTIF'],
            getAcademicGuidance: '',
            hasAuthentication: '',
            studyPlanSemesterId: '',
            studyPlanIsApproved: '',
            studyPlanIsSubmitted: '',
            hasStudyPlan: '',
            statusSemesterId: '',
            isRegistered: '',
            hasPaid: '',
            isGraduateEligible: '',
            isThesisEligible: '',
            yudiciumSessionId: yudiciumSessionId.value,
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
        await getStudent(pagination.value.limit, pagination.value.page)
    }
})
watch(studyProgramId, async function (value) {
    if (value != '') {
        await getStudent(pagination.value.limit, pagination.value.page)
    }
})
watch(yudiciumSessionId, async function (value) {
    if (value != '') {
        await getStudent(pagination.value.limit, pagination.value.page)
    }
})
onMounted(async () => {
    await getAdminStudyProgram('')
    await getYudiciumSession('')
})
</script>
<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="3" md="3">
                            <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms"
                                item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-select v-model="yudiciumSessionId" variant="outlined" hide-details :items="yudiciumSessions"
                                item-value="id" item-title="name" label="Sesi Yudisium"></v-select>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-text-field v-model="search" variant="outlined" hide-details label="Cari Nama"></v-text-field>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Name</th>
                    <th class="text-subtitle-1 font-weight-semibold">Prodi</th>
                    <th class="text-subtitle-1 font-weight-semibold text-center">Lama Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold text-center">Lama Tugas Akhir</th>
                    <th class="text-subtitle-1 font-weight-semibold text-center">Predikat</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in students">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.gpa }}</td>
                    <td>{{ item.admittance_semester }} Semester, {{ item.study_duration_month }}</td>
                    <td>{{ item.thesis_duration_semester }} Semester, {{ item.thesis_duration_semester }}</td>
                    <td>{{ item.graduation_predicate }}</td>
                    
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getStudent(pagination.limit, pagination.prev)"
                            @jumpPage="(page: any) => getStudent(pagination.limit, page)"
                            @nextPage="getStudent(pagination.limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>