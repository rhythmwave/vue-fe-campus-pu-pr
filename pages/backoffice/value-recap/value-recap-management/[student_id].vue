<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetStudyPlanListData } from '~~/types/api/study-plan/GetStudyPlan';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { getStudyPlanList } from '~~/composables/api/study-plan/getStudyPlanList';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { getYearBatch } from '~~/utils/helpers/graduation';
import moment from 'moment';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
var page = 1
var limit = 20
const search = ref('')
const title = ref('Detail Manajemen Rekap Nilai')
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
const studyPlans = ref<GetStudyPlanListData[]>([])
const studentId = ref('')
const studentDetail = ref(<GetStudentDetailData>{})
const gradePointAccumulation = ref(0)
const creditAccumulation = ref(0)
async function getStudyPlan(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getStudyPlanList(limit, page, search, studentId.value, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyPlans.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getStudent() {
    try {
        const { response: resp, error: error } = await getStudentDetail(studentId.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentDetail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    studentId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getStudyPlan(limit, page, search.value)
    await getStudent()
    studyPlans.value.forEach(function(value){
        creditAccumulation.value += value.total_mandatory_credit + value.total_optional_credit
        gradePointAccumulation.value += value.grade_point
    })
})
</script>
<template>
    <div>
        <v-col cols="12">
            <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        </v-col>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <NuxtLink class="text-decoration-none color-inherits" :to="'/backoffice/value-recap/value-recap-management'">
                                <VIcon class="mr-2">
                                    mdi-keyboard-backspace
                                </VIcon>Kembali
                            </NuxtLink>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">Mahasiswa</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>NIM</td>
                    <td>{{ studentDetail.nim_number }}</td>
                </tr>
                <tr>
                    <td>Nama</td>
                    <td>{{ studentDetail.name }}</td>
                </tr>
                <tr>
                    <td>Program Studi</td>
                    <td>{{ studentDetail.study_program_name }}</td>
                </tr>
            </tbody>
        </v-table>
        <v-table class="mt-5">
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">No</th>
                <th class="text-subtitle-1 font-weight-semibold">Nama Semester</th>
                <th class="text-subtitle-1 font-weight-semibold">SKS</th>
                <th class="text-subtitle-1 font-weight-semibold">IP</th>
            </tr>
            <tbody>
                <tr v-for="(item, index) in studyPlans">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.semester_start_year }} - {{ item.semester_type }}</td>
                    <td>{{ item.total_mandatory_credit + item.total_optional_credit }}</td>
                    <td>{{ item.grade_point }}</td>
                </tr>
            </tbody>
        </v-table>
        <v-col cols="12">
            <v-alert type="info" variant="tonal">
            Petunjuk : 
            <br />
            SKS Kumulatif : {{ creditAccumulation }}
            <br />
            Ip Kumulatif : {{ gradePointAccumulation / studyPlans.length }}
            </v-alert>
        </v-col>
    </div>
</template>