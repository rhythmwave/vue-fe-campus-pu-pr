<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import { ErrorRoot } from '~~/types/api/error';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetSubjectListData } from '~~/types/api/subject/GetSubjectList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';

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
const title = ref('Cetak Presensi')
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
const subjects = ref<GetSubjectListData[]>([])
const classrooms = ref<GetClassroomListData[]>([])
const studyProgramId = ref('')
const semesterId = ref('')
const subjectId = ref('')

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
async function getSemester(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getSemesterList(limit, page, search, studyProgramId.value)
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
async function getSubject(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getSubjectList(limit, page, search, [], '', '', '', semesterId.value, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            subjects.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getClassroom(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getClassroomList(limit, page, search, studyProgramId.value, semesterId.value, true, subjectId.value, false)
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
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
watch(subjectId, async function (value) {
    if (value != '') {
        await getClassroom(pagination.value.limit, pagination.value.page, '')
    }
})
watch(semesterId, async function (value) {
    if (value != '') {
        await getSubject(10000, 1, '')
        await getClassroom(pagination.value.limit, pagination.value.page, '')
    }
})
watch(studyProgramId, async function (value) {
    if (value != '') {
        await getSemester(10000, 1, '')
        await getClassroom(pagination.value.limit, pagination.value.page, '')
    }
})
onMounted(async () => {
    await getAdminStudyProgram()
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'' + title">
            <v-row>
                <v-col cols="12" lg="12" md="12">
                    <v-col cols="12" lg="4" md="4" class="float-left">
                        <v-autocomplete v-model="studyProgramId" :items="studyPrograms" item-title="name" item-value="id"
                            density="compact" :label="'Pilih Program Studi'" hide-details variant="outlined" />
                    </v-col>
                    <v-col cols="12" lg="4" md="4" class="float-left">
                        <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details :items="semesters"
                            label="Pilih Semester">
                            <template v-slot:selection="{ item }">
                                <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
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
                        <v-autocomplete v-model="subjectId" :items="subjects" item-title="name" item-value="id"
                            density="compact" :label="'Pilih Mata Kuliah'" hide-details variant="outlined" />
                    </v-col>
                </v-col>
            </v-row>
        </SharedUiParentCard>
        <v-table class="mt-10">
            <caption>Daftar Kelas</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Rencana Tatap Muka</th>
                    <th class="text-subtitle-1 font-weight-semibold">Pertemuan Terlaksana</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Peserta</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in classrooms">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.subject_name }} ({{ item.subject_code }})</td>
                    <td>
                        <ul v-for="itm in item.lecturers">
                            {{ itm.front_title }} {{ itm.name }} {{ itm.back_degree }}
                        </ul>
                    </td>
                    <td>{{ item.total_lecture_plan }}</td>
                    <td>{{ item.total_lecture_done }}</td>
                    <td>{{ item.total_participant }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Print">
                                <template #activator="{ props }">
                                    <a target="_blank" icon flat v-bind="props"
                                        :href="'/backoffice/class-participants/prints/attendance/' + item.id">
                                        <PrinterIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </a>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">
                    <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                        :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                        :prev="pagination.prev" :next="pagination.next"
                        @prevPage="getClassroom(pagination.limit, pagination.prev, '')"
                        @jumpPage="(page: any) => getClassroom(pagination.limit, page, '')"
                        @nextPage="getClassroom(pagination.limit, pagination.next, '')" />
                </td>
            </tr>
        </tfoot>
    </v-table>
</div></template>