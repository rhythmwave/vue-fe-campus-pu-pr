<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
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
const title = ref('Input Nilai Per Kelas')
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
watch(semesterId, async function (value) {
    if (value != '') {
        await getClassroom(limit, pagination.value.page, '', true)
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
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms"
                                item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details
                                :items="semesters" label="Pilih Semester">
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
                            <!-- <v-select v-model="semesterId" variant="outlined" hide-details :items="semesters" item-value="id" item-title="school_year" label="Pilih Semester"></v-select> -->
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Telah Dinilai</th>
                    <th class="text-subtitle-1 font-weight-semibold">Belum Dinilai</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in classrooms">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_code }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.total_graded_participant }}</td>
                    <td>{{ item.total_participant - item.total_graded_participant }}</td>
                    <td>
                        <nuxt-link :to="'/backoffice/input-value/input-value-per-class/' + item.id">
                            <v-btn title="Add" icon flat class="float-left">
                                <EyeIcon stroke-width="1.5" size="20" class="text-success" />
                            </v-btn>
                        </nuxt-link>
                        <a target="_blank"
                            :href="'/backoffice/input-value/prints/per-class/' + studyProgramId + '/' + semesterId + '/' + item.id">
                            <v-btn title="Print" icon flat class="float-left">
                                <PrinterIcon stroke-width="1.5" size="20" class="text-success" />
                            </v-btn>
                        </a>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getClassroom(pagination.limit, pagination.prev, '', true)"
                            @jumpPage="(page: any) => getClassroom(pagination.limit, page, '', true)"
                            @nextPage="getClassroom(pagination.limit, pagination.next, '', true)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>