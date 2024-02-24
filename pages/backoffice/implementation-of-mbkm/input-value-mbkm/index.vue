<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { GetStudentListData } from '~~/types/api/student/GetStudentList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getScheduleList } from '~~/composables/api/schedule/getScheduleList';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import moment from 'moment';
import { getStudentList } from '~~/composables/api/student/getStudentList';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const title = ref('Input Nilai Per Mahasiswa')
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
async function getStudent() {
    try {
        const { response: resp, error: error } = await getStudentList(1000, 1, <GetStudentListRequest>{
            studyProgramId: studyProgramId.value,
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
            hasStudyPlan: '',
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
        }
    } catch (error) {
        alert(error)
    }
}
watch(studyProgramId, async function(value){
    if(value != ''){
        await getStudent()
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
                            <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <!-- <v-col cols="12" lg="4" md="6">
                            <v-select v-model="semesterId" variant="outlined" hide-details :items="semesters" item-value="id" item-title="school_year" label="Pilih Semester"></v-select>
                        </v-col> -->
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
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Semester Yang Di tempuh</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in students">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>1</td>
                    <td>
                        <nuxt-link :to="'/backoffice/input-value/input-value-per-student/'+ item.id">
                            <v-btn title="Add" icon flat class="float-left">
                                <EyeIcon stroke-width="1.5" size="20" class="text-success" />
                            </v-btn>    
                        </nuxt-link>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>