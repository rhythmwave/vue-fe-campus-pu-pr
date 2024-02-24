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

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const title = ref('Manajemen Rekap Nilai')
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
const search = ref('')
const studentForceFrom = ref('')
const studentForceTo = ref('')
const nimNumberFrom = ref('')
const nimNumberTo = ref('')
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
async function getStudent(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: studyProgramId.value,
            studentForceFrom: studentForceFrom.value,
            studentForceTo: studentForceTo.value,
            nimNumberFrom: nimNumberFrom.value,
            nimNumberTo: nimNumberTo.value,
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
            yudiciumSessionId:'',
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
watch(studentForceFrom, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page)
    }
})
watch(studentForceTo, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page)
    }
})
watch(nimNumberFrom, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page)
    }
})
watch(nimNumberTo, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page)
    }
})
watch(search, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page)
    }
})
watch(studyProgramId, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page)
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
                        <v-col cols="12" lg="3" md="3">
                            <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-text-field v-model="search" variant="outlined" hide-details label="Cari Nama"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-select v-model="studentForceFrom" :items="getYearBatch()" variant="outlined" hide-details label="Angkata Dari"></v-select>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-select v-model="studentForceTo" :items="getYearBatch()" variant="outlined" hide-details label="Angkata Dari"></v-select>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-text-field type="number" v-model="nimNumberFrom" variant="outlined" hide-details label="Nim Dari"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-text-field type="number" v-model="nimNumberTo" variant="outlined" hide-details label="Nim Ke"></v-text-field>
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
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold text-center">Kumulatif</th>
                </tr>
                <tr>
                    <th colspan="4" class="text-subtitle-1 font-weight-semibold"></th>
                    <th class="text-subtitle-1 font-weight-semibold text-center">SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold text-center">IP</th>
                    <th class="text-subtitle-1 font-weight-semibold">Transkip Diarsipkan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in students">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.gpa }}</td>
                    <td>{{ item.total_credit }}</td>
                    <td>{{ item.transacript_is_archived }}</td>
                    <td>
                        <nuxt-link :to="'/backoffice/value-recap/value-recap-management/'+ item.id">
                            <v-btn title="Add" icon flat class="float-left">
                                <EyeIcon stroke-width="1.5" size="20" class="text-success" />
                            </v-btn>    
                        </nuxt-link>
                    </td>
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