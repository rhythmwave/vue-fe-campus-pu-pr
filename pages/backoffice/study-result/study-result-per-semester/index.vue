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
import { GetStudyPlanListData } from '~~/types/api/study-plan/GetStudyPlan';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getStudyPlanList } from '~~/composables/api/study-plan/getStudyPlanList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';

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
const title = ref('Hasil Studi Per Semester')
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
const studyPlans = ref<GetStudyPlanListData[]>([])
const studyProgramId = ref('')
const semesterId = ref('')
const study_plan_ids = ref(<string[]>[])

async function getAdminStudyProgram(search: string) {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(10000, 1, search, "")
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
async function getStudyPlan(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getStudyPlanList(limit, page, search, '', semesterId.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyPlans.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
watch(semesterId, async function(value){
    if(value != ''){
        await getStudyPlan(pagination.value.limit, pagination.value.page, search.value)
    }
})
watch(studyProgramId, async function(value){
    if(value != ''){
        await getSemester()
    }
})

async function selectedAll(){
    if(study_plan_ids.value.length > 0){
        study_plan_ids.value = <string[]>[]
    }else{
        study_plan_ids.value = <string[]>[]
        for (let index = 0; index < studyPlans.value.length; index++) {
            const element = studyPlans.value[index];
            study_plan_ids.value.push(element.student_id)
        }
    }
}
function studentStudyProgressReport(){
    mode.value = 'student-study-progress-report'
    dialog.value = true
}
function studentStudyProgressReportOpen(){
    dialog.value = false
    let arr = ''
    for (let index = 0; index < study_plan_ids.value.length; index++) {
        const element = study_plan_ids.value[index];
        if(element != 'all'){
            arr += '&student_id=' + element
        }
    }
    window.open('/backoffice/study-result/study-result-per-semester/print/student-study-progress-report?semester_id='+semesterId.value+arr, '_blank')
}
function studentStudyResultReport(){
    mode.value = 'student-study-result-report'
    dialog.value = true
}
function studentStudyResultReportOpen(){
    dialog.value = false
    let arr = ''
    for (let index = 0; index < study_plan_ids.value.length; index++) {
        const element = study_plan_ids.value[index];
        if(element != 'all'){
            arr += '&student_id=' + element
        }
    }
    window.open('/backoffice/study-result/study-result-per-semester/print/student-study-result-report?semester_id='+semesterId.value+arr, '_blank')
}
function studyResultCard(){
    mode.value = 'study-result-card'
    dialog.value = true
}
function studyResultCardOpen(){
    dialog.value = false
    let arr = ''
    for (let index = 0; index < study_plan_ids.value.length; index++) {
        const element = study_plan_ids.value[index];
        if(element != 'all'){
            arr += '&student_id=' + element
        }
    }
    window.open('/backoffice/study-result/study-result-per-semester/print/study-result-card?semester_id='+semesterId.value+arr, '_blank')
}
function recapOfStudentCollegeActivities(){
    window.open('/backoffice/study-result/study-result-per-semester/print/recap-of-student-college-activities?semester_id='+semesterId.value, '_blank')
}

onMounted(async () => {
    await getAdminStudyProgram('')
})
</script>

<template>
    <div>
        <div v-if="mode == 'study-result-card'">
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
                                        <v-checkbox v-model="study_plan_ids" :value="'all'" @click="selectedAll"></v-checkbox>
                                    </th>
                                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in studyPlans">
                                    <td><v-checkbox v-model="study_plan_ids" :value="item.student_id"></v-checkbox></td>
                                    <td>{{ item.student_nim_number }}</td>
                                    <td>{{ item.student_name }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2"></td>
                                    <td>
                                        <v-btn color="primary" flat class="text-right ml-2" :disabled="study_plan_ids.length == 0" @click="studyResultCardOpen">
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
        <div v-if="mode == 'student-study-progress-report'">
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
                                        <v-checkbox v-model="study_plan_ids" :value="'all'" @click="selectedAll"></v-checkbox>
                                    </th>
                                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in studyPlans">
                                    <td><v-checkbox v-model="study_plan_ids" :value="item.student_id"></v-checkbox></td>
                                    <td>{{ item.student_nim_number }}</td>
                                    <td>{{ item.student_name }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2"></td>
                                    <td>
                                        <v-btn color="primary" flat class="text-right ml-2" :disabled="study_plan_ids.length == 0" @click="studentStudyProgressReportOpen">
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
        <div v-if="mode == 'student-study-result-report'">
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
                                        <v-checkbox v-model="study_plan_ids" :value="'all'" @click="selectedAll"></v-checkbox>
                                    </th>
                                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in studyPlans">
                                    <td><v-checkbox v-model="study_plan_ids" :value="item.student_id"></v-checkbox></td>
                                    <td>{{ item.student_nim_number }}</td>
                                    <td>{{ item.student_name }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2"></td>
                                    <td>
                                        <v-btn color="primary" flat class="text-right ml-2" :disabled="study_plan_ids.length == 0" @click="studentStudyResultReportOpen">
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
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details :items="semesters" label="Pilih Semester">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
                                </template>
                                <template v-slot:item="{item, props: {onClick, title, value}}">
                                    <ul>
                                        <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)" @click="onClick">
                                            <li style="padding: 10px; margin: 2px;">
                                                <span>{{ title.school_year }} - {{ title.semester_type }}</span>
                                            </li>
                                        </a>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-btn color="primary" class="ml-2" :disabled="semesterId == '' || studyProgramId == ''" @click="studentStudyProgressReport">
                                <PrinterIcon stroke-width="1.5" size="20" />
                                Cetak Semua Laporan KHS
                            </v-btn>
                            <v-btn color="primary" class="ml-2" :disabled="semesterId == '' || studyProgramId == ''" @click="studentStudyResultReport">
                                <PrinterIcon stroke-width="1.5" size="20" />
                                Cetak Khusus Semua KHS
                            </v-btn>
                            <v-btn color="primary" class="ml-2" :disabled="semesterId == '' || studyProgramId == ''" @click="studyResultCard">
                                <PrinterIcon stroke-width="1.5" size="20" />
                                Cetak Semua KHS
                            </v-btn>
                            <v-btn color="primary" class="ml-2" :disabled="semesterId == '' || studyProgramId == ''" @click="recapOfStudentCollegeActivities">
                                <PrinterIcon stroke-width="1.5" size="20" />
                                Cetak Kuliah Mahasiswa
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
                    <th colspan="3" class="text-subtitle-1 font-weight-semibold text-center">Jumlah SKS Diambil</th>
                </tr>
                <tr>
                    <th colspan="4" class="text-subtitle-1 font-weight-semibold"></th>
                    <th class="text-subtitle-1 font-weight-semibold">Wajib</th>
                    <th class="text-subtitle-1 font-weight-semibold">Pilihan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Total</th>
                    <th class="text-subtitle-1 font-weight-semibold">IP</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studyPlans">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.total_mandatory_credit }}</td>
                    <td>{{ item.total_optional_credit }}</td>
                    <td>{{ item.total_mandatory_credit + item.total_optional_credit }}</td>
                    <td>{{ item.grade_point }}</td>
                    <td>
                        <nuxt-link :to="'/backoffice/study-result/study-result-per-semester/'+item.student_id+'/'+item.semester_id">
                            <v-btn title="Add" icon flat class="float-left">
                                <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
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
                            @prevPage="getStudyPlan(pagination.limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getStudyPlan(pagination.limit, page, search)"
                            @nextPage="getStudyPlan(pagination.limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>