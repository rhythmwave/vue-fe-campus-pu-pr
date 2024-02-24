<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import { ErrorRoot } from '~~/types/api/error';

import { GetStudentListData, GetStudentListRequest } from '~~/types/api/student/GetStudentList';
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
const title = ref('Rekap Kehadiran Mahasiswa')
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
const students = ref(<GetStudentListData[]>[])
const semesters = ref<GetSemesterListData[]>([])
const semesterId = ref('')
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
async function getSemester(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getSemesterList(limit, page, studyProgramId.value, "")
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
    let req = <GetStudentListRequest>{
        studyProgramId: studyProgramId.value,
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
        studyPlanSemesterId: semesterId.value,
        studyPlanIsApproved: '',
        studyPlanIsSubmitted: '',
        hasStudyPlan: true,
        statusSemesterId: '',
        isRegistered: '',
        hasPaid: '',
        isGraduateEligible: '',
        isThesisEligible: '',
        yudiciumSessionId: '',
    }
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, req)
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
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
watch(studyProgramId, async function (value) {
    if (value != '') {
        await getSemester(10000, 1)
    }
})
watch(semesterId, async function (value) {
    if (value != '') {
        await getStudent(pagination.value.limit, pagination.value.page, search.value)
    }
})
watch(search, async function (value) {
    await getStudent(pagination.value.limit, pagination.value.page, value)
})
onMounted(async () => {
    await getAdminStudyProgram()
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'Daftar ' + title">
            <v-row>
                <v-col cols="12" lg="12" md="12">
                    <v-col cols="12" lg="4" md="4" class="float-left">
                        <v-autocomplete v-model="studyProgramId" :items="studyPrograms" item-title="name" item-value="id"
                            density="compact" :label="'Pilih Program Studi'" hide-details variant="outlined" />
                    </v-col>
                    <v-col cols="12" lg="4" md="4" class="float-left">
                        <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details :items="semesters"
                            label="Semester">
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
                        <!-- <v-autocomplete v-model="semesterId" :items="semesters" item-title="school_year" item-value="id" density="compact" :label="'Pilih Semester'" hide-details variant="outlined" /> -->
                    </v-col>
                    <v-col cols="12" lg="4" md="4" class="float-left">
                        <v-text-field v-model="search" hide-details variant="outlined" label="Cari Nama"></v-text-field>
                    </v-col>
                </v-col>
            </v-row>
        </SharedUiParentCard>
        <v-table class="mt-10">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in students">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_plan_is_approved ? 'Disetujui' : 'Belum Disetujui' }}</td>
                    <td>
                        <v-tooltip text="Absence Summary">
                            <template #activator="{ props }">
                                <nuxt-link
                                    :to="{ path: '/backoffice/class-participants/student-attendance-recap/' + item.id, query: { studyPlanId: item.study_plan_id } }">
                                    <v-btn icon flat v-bind="props">
                                        <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </nuxt-link>
                            </template>
                        </v-tooltip>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getStudent(pagination.limit, pagination.prev, '')"
                            @jumpPage="(page: any) => getStudent(pagination.limit, page, '')"
                            @nextPage="getStudent(pagination.limit, pagination.next, '')" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
</div></template>