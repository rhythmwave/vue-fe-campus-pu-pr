<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { getYearBatch } from '~~/utils/helpers/graduation';

import { GetStudentListRequest, GetStudentListData } from "~~/types/api/student/GetStudentList";
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetSubjectListData } from '~~/types/api/subject/GetSubjectList';
import { CreateStudyPlanRequest } from "~~/types/api/study-plan/CreateStudyPlanRequest";

import { getStudentList } from '~~/composables/api/student/getStudentList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { createStudyPlan } from '~~/composables/api/study-plan/createStudyPlan';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

interface StudyPlanId{
    student_id: string
    semester_package: number
}
interface ClassId{
    subject_id: string
    class_id: string
}

const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const page = 1
const search: String = ''
const title = ref('Rencana Studi Massal')
const mode = ref('list')
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
const studentNotSubmits = ref<GetStudentListData[] | undefined>()
let studentBatchs = getYearBatch()
const study_plan_ids = ref(<StudyPlanId[]>[])
const class_ids = ref(<ClassId[]>[])
const semester_package = ref(0)
const create_study_plan = ref(<CreateStudyPlanRequest>{})
const requestStudentNotSubmit = ref(<GetStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    address: '',
    regencyId: '',
    status: ['MBKM'],
    getAcademicGuidance: '',
    hasAuthentication: '',
    studyPlanSemesterId: '',
    studyPlanIsApproved: '',
    studyPlanIsSubmitted: '',
    hasStudyPlan: false,
    statusSemesterId: '',
    isRegistered: '',
    hasPaid: '',
    isGraduateEligible: '',
    isThesisEligible: '',
    yudiciumSessionId: '',
})
const studyProgramId = ref('')
const subjects = ref(<GetSubjectListData[]>[])
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(limit, page, '', '')
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
        const { response: resp, error: error } = await getSemesterList(limit, page, studyProgramId.value, '')
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
async function getStudentNotSubmit(limit: number, page: number) {
    requestStudentNotSubmit.value.studyPlanSemesterId = semesterId.value
    requestStudentNotSubmit.value.studyProgramId = studyProgramId.value
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, requestStudentNotSubmit.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentNotSubmits.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getSubject() {
    try {
        const { response: resp, error: error } = await getSubjectList(limit, 1, '', [], '', '', semester_package.value, semesterId.value, '', true)
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
async function selectedProgramStudy(){
    await getSemester()
}
async function studentBatch(ev: any){
    requestStudentNotSubmit.value.studentForceFrom = ev
    requestStudentNotSubmit.value.studentForceTo = ev
    semester_package.value = ev
    await getStudentNotSubmit(pagination.value.limit, 1)
}

async function selectedAll(ev: any){
    if(typeof study_plan_ids.value[0] == 'undefined'){
        studentNotSubmits.value?.forEach(function(item){
            let obj = <StudyPlanId>{
                student_id: item.id,
                semester_package: item.current_semester_package
            }
            study_plan_ids.value.push(obj)
        })
    }else{
        study_plan_ids.value = <StudyPlanId[]>[]
    }
}
async function next(){
    if(study_plan_ids.value.findIndex(a => a.student_id === 'all') != -1 ){
        study_plan_ids.value.splice(study_plan_ids.value.findIndex(a => a.student_id === 'all'))
    }
    for (let index = 0; index < study_plan_ids.value.length; index++) {
        let semesterPackage = study_plan_ids.value[0].semester_package
        if(study_plan_ids.value[index].semester_package != semesterPackage){
            alert('Setiap Mahasiswa Paket Semesternya Harus Sama !!!')
            mode.value = 'list'
            return false
        }
    }
    semester_package.value = study_plan_ids.value[0].semester_package + 1
    mode.value = 'next'
    await getSubject()
}
async function selectedClass(ev: any, subject_id: string){
    if(class_ids.value.findIndex(a => a.subject_id === subject_id) == -1){
        let obj = <ClassId>{
            subject_id: subject_id,
            class_id: ev
        }
        class_ids.value.push(obj)
    }else{
        let index = class_ids.value.findIndex(x => x.subject_id === subject_id);
        class_ids.value[index] = <ClassId>{
            subject_id: subject_id,
            class_id: ev,
        }
    }
}
async function process(){
    let studentIds = <string[]>[]
    let classIds = <string[]>[]
    for (let index = 0; index < study_plan_ids.value.length; index++) {
        studentIds.push(study_plan_ids.value[index].student_id)
    }
    for (let index = 0; index < class_ids.value.length; index++) {
        classIds.push(class_ids.value[index].class_id)
    }
    create_study_plan.value = <CreateStudyPlanRequest>{
        semester_id: semesterId.value,
        student_ids: studentIds,
        class_ids: classIds,
    }

    try {
        const { response: responseCreate, error } = await createStudyPlan(create_study_plan.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (responseCreate != null) {
            if(responseCreate.meta.status == 200){
                study_plan_ids.value = []
                class_ids.value = []
                create_study_plan.value = <CreateStudyPlanRequest>{}
                mode.value = 'list'
                await getStudentNotSubmit(pagination.value.limit, 1)
            }
        }
    } catch (error) {
        alert(error)
        return false;
    }
}
watch(semesterId, async function (value) {
    if(value != ''){
        await getStudentNotSubmit(pagination.value.limit, 1)
    }
})
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
onMounted(async() => {
    await getAdminStudyProgram()
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'Daftar '+title">
            <v-row>
                <v-col cols="12" lg="4" md="4">
                    <v-autocomplete v-model="studyProgramId" :items="studyPrograms" item-title="name" item-value="id" density="compact" :label="'Pilih Program Studi'" hide-details variant="outlined" @update:model-value="selectedProgramStudy" />
                </v-col>
                <v-col cols="12" lg="4" md="4">
                    <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details :items="semesters" label="Pilih Semester">
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
                <v-col cols="12" lg="4" md="4">
                    <v-autocomplete :items="studentBatchs" item-title="school_year" item-value="id" density="compact" :label="'Pilih Angkatan'" hide-details variant="outlined" @update:model-value="studentBatch" />
                </v-col>
            </v-row>
        </SharedUiParentCard>
        <v-table class="mt-5" v-if="mode == 'next'">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Paket Semester</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                </tr>   
            </thead>
            <tbody>
                <tr v-for="(item, index) in subjects">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ semester_package }}</td>
                    <td>
                        <v-select @update:model-value="selectedClass($event, item.id)" flat solo :items="item.classes" item-value="id" item-title="name"></v-select>
                    </td>
                </tr>
            </tbody>
            <tfoot v-if="subjects">
                <tr>
                    <td colspan="4" class="text-center">
                        <VBtn color="primary" flat class="ml-auto" @click="process" :disabled="semester_package == 0 || study_plan_ids.length == 0 || class_ids.length < 0 ">
                            <v-icon class="mr-2">
                                mdi-arrow-collapse-right
                            </v-icon>Proses
                        </VBtn>
                    </td>
                </tr>
            </tfoot>
        </v-table>
        <v-row v-if="mode == 'list'">
            <!-- <v-col cols="12" lg="12" md="12" class="mt-10" v-if="studentNotSubmits">
                <v-autocomplete :items="[1, 2, 3, 4, 5, 6, 7, 8]" density="compact" :label="'Pilih Paket Semester'" hide-details variant="outlined" v-model="semester_package" />
            </v-col> -->
            <v-col cols="12" lg="12" md="12">
                <v-table class="mt-5">
                    <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-semibold">
                                <td>
                                    <v-checkbox v-model="study_plan_ids" :value="{student_id: 'all', semester_package: -1}" @click="selectedAll"></v-checkbox>
                                </td>
                            </th>
                            <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                            <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                            <th class="text-subtitle-1 font-weight-semibold">Angkatan</th>
                            <th class="text-subtitle-1 font-weight-semibold">Paket Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in studentNotSubmits">
                            <td>
                                <v-checkbox v-model="study_plan_ids" :value="{student_id: item.id, semester_package: item.current_semester_package}"></v-checkbox>
                            </td>
                            <td>{{ item.nim_number }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.student_force }}</td>
                            <td>{{ item.current_semester_package }}</td>
                        </tr>
                    </tbody>
                    <tfoot v-if="studentNotSubmits">
                        <tr>
                            <td colspan="3">
                                <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages"
                                    :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                                    @prevPage="getStudentNotSubmit(pagination.limit, pagination.prev)" @jumpPage="(page: any) => getStudentNotSubmit(pagination.limit, page)"
                                    @nextPage="getStudentNotSubmit(pagination.limit, pagination.next)" />
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-center">
                                <VBtn color="primary" flat class="ml-auto" @click="next" :disabled="study_plan_ids.length == 0">
                                    <v-icon class="mr-2">
                                        mdi-arrow-collapse-right
                                    </v-icon>Lanjut
                                </VBtn>
                            </td>
                        </tr>
                    </tfoot>
                </v-table>
            </v-col>
        </v-row>
    </div>
</template>