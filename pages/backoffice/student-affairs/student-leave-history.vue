<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetStudentListData } from "~~/types/api/student/GetStudentList";
import { GetStudentListRequest } from "~~/types/api/student/GetStudentList";
import { GetSemesterListData } from "~~/types/api/semester/GetSemesterList";
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Riwayat Cuti / Keluar / Drop Out Mahasiswa')
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
const studentLeaves = ref(<GetStudentListData[]>[])
const studentOuts = ref(<GetStudentListData[]>[])
const studentDropOuts = ref(<GetStudentListData[]>[])
const studentActives = ref(<GetStudentListData[]>[])
const status = ref('')

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
async function getStudentLeave(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: '',
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: '',
            address: '',
            regencyId: '',
            status: ['CUTI'],
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
            studentLeaves.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function studentOut(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: '',
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: '',
            address: '',
            regencyId: '',
            status: ['KELUAR'],
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
            studentOuts.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function studentDropOut(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: '',
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: '',
            address: '',
            regencyId: '',
            status: ['DROP-OUT'],
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
            studentDropOuts.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function studentActive(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: '',
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: '',
            address: '',
            regencyId: '',
            status: ['AKTIF', 'NON-AKTIF'],
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
            studentActives.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
watch(search, async function(value){
    if(value != ''){
        await refresh()
    }
})
watch(semesterId, async function(value){
    if(value != ''){
        await refresh()
    }
})
watch(studyProgramId, async function(value){
    if(value != ''){
        await refresh()
        await getSemester(limit, page, search.value)
    }
})
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
async function close(){
    dialog.value = false
}
async function updateStudent(item: string){
    if(studyProgramId.value == ''){
        alert('Pilih Program Studi Terlebih Dahulu')
        return false
    }
    status.value = item
    mode.value = 'update-status'
    dialog.value = true
}
async function refresh(){
    await getStudentLeave(limit, page, search.value)
    await studentOut(limit, page, search.value)
    await studentDropOut(limit, page, search.value)
    await studentActive(limit, page, search.value)
}
onMounted(async () => {
    await getAdminStudyProgram('')
})
</script>

<template>
    <div>
        <div v-if="mode == 'update-status'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeStudentUpdateStatus :studyProgramId="studyProgramId" :isMbkm="false" :status="status" @close="close" @reload="refresh" />
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
                                <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" class="float-left">
                                <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details :items="semesters" label="Pilih Semester">
                                    <template v-slot:selection="{ item }">
                                        <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
                                    </template>
                                    <template v-slot:item="{item, props: {onClick, title, value}}">
                                        <ul>
                                            <li style="padding: 10px; margin: 2px;">
                                                <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                    <span @click="onClick">{{ title.school_year }} - {{ title.semester_type }}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" lg="4" md="4" class="float-left">
                                <v-text-field v-model="search" variant="outlined" hide-details label="Cari Nama"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12">
                            <v-col cols="12" lg="12" md="12" class="float-left">
                                <v-btn title="Dropout" flat color="error" @click="updateStudent('DROP-OUT')" class="mr-5">
                                    <TrashIcon stroke-width="1.5" size="20" class="white" />
                                    Dropout Mahasiswa
                                </v-btn>
                                <v-btn title="Out" flat color="error" @click="updateStudent('KELUAR')" class="mr-5">
                                    <TrashIcon stroke-width="1.5" size="20" class="white" />
                                    Keluarkan Mahasiswa
                                </v-btn>
                                <v-btn title="NonActive" flat color="error" @click="updateStudent('NON-AKTIF')" class="mr-5">
                                    <TrashIcon stroke-width="1.5" size="20" class="white" />
                                    Non-Aktifkan Mahasiswa
                                </v-btn>
                            </v-col>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-10">
            <caption>Mahasiswa Cuti</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status Akademik Terakhir</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentLeaves">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </v-table>
        <v-table class="mt-10">
            <caption>Mahasiswa Keluar</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status Akademik Terakhir</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentOuts">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </v-table>
        <v-table class="mt-10">
            <caption>Mahasiswa Drop Out</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status Akademik Terakhir</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentDropOuts">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </v-table>
        <v-table class="mt-10">
            <caption>Mahasiswa Aktif / Non Aktif</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status Akademik Terakhir</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentActives">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>