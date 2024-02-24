<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { GetStudentListData } from '~~/types/api/student/GetStudentList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { getYearBatch } from '~~/utils/helpers/graduation';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const pagination = ref({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Hasil Studi Per Mahasiswa')
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
const studentForceFrom = ref('')
const studentForceTo = ref('')
const nimNumberFrom = ref('')
const nimNumberTo = ref('')
const name = ref('')
const students = ref(<GetStudentListData[]>[])
const studyPrograms = ref(<GetAdminStudyProgramListData[]>[])
const yearBatch = ref(getYearBatch())

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
async function getStudent(limit: number, page: number, study_program_id: string, student_force_from: string, student_force_to: string, nim_number_from: string, nim_number_to: string, name: string) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: study_program_id,
            studentForceFrom: student_force_from,
            studentForceTo: student_force_to,
            nimNumberFrom: nim_number_from,
            nimNumberTo: nim_number_to,
            name: name,
            address: '',
            regencyId: '',
            status: [],
            getAcademicGuidance: '',
            hasAuthentication: '',
            studyPlanSemesterId: '',
            studyPlanIsApproved: true,
            studyPlanIsSubmitted: '',
            hasStudyPlan: true,
            statusSemesterId: '',
            isRegistered: '',
            hasPaid: '',
            isGraduateEligible: '',
            isThesisEligible: '',
            yudiciumSessionId: '',
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
        await getStudent(pagination.value.limit, pagination.value.page, studyProgramId.value, studentForceFrom.value, studentForceTo.value, nimNumberFrom.value, nimNumberTo.value, name.value)
    }
})
watch(studentForceTo, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page, studyProgramId.value, studentForceFrom.value, studentForceTo.value, nimNumberFrom.value, nimNumberTo.value, name.value)
    }
})
watch(nimNumberFrom, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page, studyProgramId.value, studentForceFrom.value, studentForceTo.value, nimNumberFrom.value, nimNumberTo.value, name.value)
    }
})
watch(nimNumberTo, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page, studyProgramId.value, studentForceFrom.value, studentForceTo.value, nimNumberFrom.value, nimNumberTo.value, name.value)
    }
})
watch(name, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page, studyProgramId.value, studentForceFrom.value, studentForceTo.value, nimNumberFrom.value, nimNumberTo.value, name.value)
    }
})
watch(studyProgramId, async function(value){
    if(value != ''){
        await getStudent(pagination.value.limit, pagination.value.page, studyProgramId.value, studentForceFrom.value, studentForceTo.value, nimNumberFrom.value, nimNumberTo.value, name.value)
    }
})

const student_ids = ref(<string[]>[])

async function selectedAll(){
    if(student_ids.value.length > 0){
        student_ids.value = <string[]>[]
    }else{
        student_ids.value = <string[]>[]
        for (let index = 0; index < students.value.length; index++) {
            const element = students.value[index];
            student_ids.value.push(element.id)
        }
    }
}

function recapOfStudyResultCard(){
    mode.value = 'recap-of-study-result-card'
    dialog.value = true
}
function recapOfStudyResultCardOpen(){
    dialog.value = false
    let arr = ''
    for (let index = 0; index < student_ids.value.length; index++) {
        const element = student_ids.value[index];
        if(element != 'all'){
            arr += '&student_id=' + element
        }
    }
    window.open('/backoffice/study-result/study-result-per-student/print/card/'+studyProgramId.value+'?'+arr, '_blank')
}
function recapOfStudyResult(){
    mode.value = 'recap-of-study-result'
    dialog.value = true
}
function recapOfStudyResultOpen(){
    dialog.value = false
    let arr = ''
    for (let index = 0; index < student_ids.value.length; index++) {
        const element = student_ids.value[index];
        if(element != 'all'){
            arr += '&student_id=' + element
        }
    }
    window.open('/backoffice/study-result/study-result-per-student/print/result/'+studyProgramId.value+'?'+arr, '_blank')
}
onMounted(async () => {
    await getAdminStudyProgram('')
})
</script>

<template>
    <div>
        <div v-if="mode == 'recap-of-study-result-card'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="1200">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Pilih Mahasiswa</span>
                        </v-card-title>
                        <v-table class="month-table">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">
                                        <v-checkbox v-model="student_ids" :value="'all'" @click="selectedAll"></v-checkbox>
                                    </th>
                                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in students">
                                    <td><v-checkbox v-model="student_ids" :value="item.id"></v-checkbox></td>
                                    <td>{{ item.nim_number }}</td>
                                    <td>{{ item.name }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">
                                        <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages"
                                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                                            @prevPage="getStudent(pagination.limit, pagination.prev, studyProgramId, studentForceFrom, studentForceTo, nimNumberFrom, nimNumberTo, name)" @jumpPage="(page: number) => getStudent(pagination.limit, page, studyProgramId, studentForceFrom, studentForceTo, nimNumberFrom, nimNumberTo, name)"
                                            @nextPage="getStudent(pagination.limit, pagination.next, studyProgramId, studentForceFrom, studentForceTo, nimNumberFrom, nimNumberTo, name)" />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2"></td>
                                    <td>
                                        <v-btn color="primary" flat class="text-right ml-2" :disabled="student_ids.length == 0" @click="recapOfStudyResultCardOpen">
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
        <div v-if="mode == 'recap-of-study-result'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="1200">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Pilih Mahasiswa</span>
                        </v-card-title>
                        <v-table class="month-table">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">
                                        <v-checkbox v-model="student_ids" :value="'all'" @click="selectedAll"></v-checkbox>
                                    </th>
                                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in students">
                                    <td><v-checkbox v-model="student_ids" :value="item.id"></v-checkbox></td>
                                    <td>{{ item.nim_number }}</td>
                                    <td>{{ item.name }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">
                                        <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages"
                                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                                            @prevPage="getStudent(pagination.limit, pagination.prev, studyProgramId, studentForceFrom, studentForceTo, nimNumberFrom, nimNumberTo, name)" @jumpPage="(page: number) => getStudent(pagination.limit, page, studyProgramId, studentForceFrom, studentForceTo, nimNumberFrom, nimNumberTo, name)"
                                            @nextPage="getStudent(pagination.limit, pagination.next, studyProgramId, studentForceFrom, studentForceTo, nimNumberFrom, nimNumberTo, name)" />
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2"></td>
                                    <td>
                                        <v-btn color="primary" flat class="text-right ml-2" :disabled="student_ids.length == 0" @click="recapOfStudyResultOpen">
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
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="studentForceFrom" variant="outlined" hide-details :items="yearBatch" label="Angkatan Dari"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="studentForceTo" variant="outlined" hide-details :items="yearBatch" label="Angkatan Ke"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field v-model="nimNumberFrom" variant="outlined" hide-details label="Nim Dari"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field v-model="nimNumberTo" variant="outlined" hide-details label="Nim Ke"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field v-model="name" variant="outlined" hide-details label="Nama"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-btn title="Add" flat color="primary" class="ml-2" :disabled="studyProgramId == ''" @click="recapOfStudyResultCard">
                                Cetak Rekap KHS Semua Mahasiswa
                            </v-btn>
                            <v-btn title="Add" flat color="primary" class="ml-2" :disabled="studyProgramId == ''" @click="recapOfStudyResult">
                                Cetak Khusus Rekap KHS Semua Mahasiswa
                            </v-btn>
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
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in students">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>
                        <nuxt-link :to="'/backoffice/study-result/study-result-per-student/'+item.id">
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
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getStudent(pagination.limit, pagination.prev, studyProgramId, studentForceFrom, studentForceTo, nimNumberFrom, nimNumberTo, name)" @jumpPage="(page: number) => getStudent(pagination.limit, page, studyProgramId, studentForceFrom, studentForceTo, nimNumberFrom, nimNumberTo, name)"
                            @nextPage="getStudent(pagination.limit, pagination.next, studyProgramId, studentForceFrom, studentForceTo, nimNumberFrom, nimNumberTo, name)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>