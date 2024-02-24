<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { GetStudyPlanListData } from '~~/types/api/study-plan/GetStudyPlan';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { getStudyPlanList } from '~~/composables/api/study-plan/getStudyPlanList';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';


definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Detail Studi Per Mahasiswa')
const detail_student = ref(<GetStudentDetailData>{})
const studyPlans = ref<GetStudyPlanListData[]>([])
const studentId = ref('')
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

async function studentDetail(id: string) {
  try {
    const { response: resp, error: error } = await getStudentDetail(id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      detail_student.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getStudyPlan(limit: number, page: number, search: string, student_id: string, semester_id: string) {
    try {
        const { response: resp, error: error } = await getStudyPlanList(limit, page, search, student_id, semester_id)
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
onMounted(async () => {
  studentId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
  await studentDetail(studentId.value)
  await getStudyPlan(limit, page, '', studentId.value, '')
})
</script>
<template>
  <div>
    <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
    <v-row>
        <v-col cols="12">
          <UiParentCard :title="title">
            <v-col cols="12" lg="12" md="12" class="text-left">
              <v-table class="mt-5">
                <thead>
                  <tr>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">{{title}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Program Studi</td>
                    <td>{{ detail_student.study_program_name }}</td>
                  </tr>
                  <tr>
                    <td>Angkatan</td>
                    <td>{{ detail_student.student_force }}</td>
                  </tr>
                  <tr>
                    <td>NIM</td>
                    <td>{{ detail_student.nim_number }}</td>
                  </tr>
                  <tr>
                    <td>Nama</td>
                    <td>{{ detail_student.name }}</td>
                  </tr>
                  <tr>
                    <td>Dosen PA</td>
                    <td>{{ detail_student.academic_guidance_lecturer_name }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
            <v-col cols="12" lg="12" md="12" class="text-right">
              <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/study-result/study-result-per-student'">
                <v-btn color="warning" flat class="ml-auto">
                  <v-Icon class="mr-2">
                    mdi-keyboard-backspace
                  </v-Icon>Kembali
                </v-btn>
              </nuxt-Link>
            </v-col>
          </UiParentCard>
        </v-col>
      </v-row>
      <v-table class="mt-5">
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-semibold">No</th>
            <th class="text-subtitle-1 font-weight-semibold">Semester</th>
            <th colspan="3" class="text-subtitle-1 font-weight-semibold">Jumlah SKS Ditempuh</th>
          </tr>
          <tr>
            <th colspan="2" class="text-subtitle-1 font-weight-semibold"></th>
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
            <td>{{ item.school_year }} - {{ item.semester_type }}</td>
            <td>{{ item.total_mandatory_credit }}</td>
            <td>{{ item.total_optional_credit }}</td>
            <td>{{ item.total_mandatory_credit + item.total_optional_credit }}</td>
            <td>{{ item.grade_point }}</td>
            <td>
              <nuxt-link :to="'/backoffice/study-result/study-result-per-student/'+item.student_id+'/'+item.semester_id">
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