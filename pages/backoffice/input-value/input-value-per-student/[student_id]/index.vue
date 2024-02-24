<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { GetStudyPlanListData } from '~~/types/api/study-plan/GetStudyPlan';
import { getStudyPlanList } from '~~/composables/api/study-plan/getStudyPlanList';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import moment from 'moment';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Detail Input Nilai Per Mahasiswa')
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
const detail = ref(<GetStudentDetailData>{})
const studyPlans = ref(<GetStudyPlanListData[]>[])
const studentId = ref('')
async function detailStudent(id: string) {
  try {
    const { response: resp, error: error } = await getStudentDetail(id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      detail.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getStudyPlan(limit: number, page: number, search: string, student_id: string) {
  try {
    const { response: resp, error: error } = await getStudyPlanList(limit, page, search, student_id, '')
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
  await detailStudent(studentId.value)
  await getStudyPlan(limit, page, '', detail.value.id)
})
</script>
<template>
  <div>
    <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
    <v-row>
      <v-col cols="12">
        <UiParentCard :title="title">
          <v-row>
            <v-col cols="12" lg="12" md="12" class="text-left">
              <v-table>
                <thead>
                  <tr>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">Mahasiswa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Program Studi</td>
                    <td>{{ detail.study_program_name }}</td>
                  </tr>
                  <tr>
                    <td>NIM</td>
                    <td>{{ detail.nim_number }}</td>
                  </tr>
                  <tr>
                    <td>Nama</td>
                    <td>{{ detail.name }}</td>
                  </tr>
                  <tr>
                    <td>Angkatan</td>
                    <td>{{ detail.student_force }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
            <v-col cols="12" lg="12" md="12" class="text-right">
              <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/input-value/input-value-per-student'">
                <v-btn color="warning" flat class="ml-auto">
                  <v-Icon class="mr-2">
                    mdi-keyboard-backspace
                  </v-Icon>Kembali
                </v-btn>
              </nuxt-Link>
            </v-col>
          </v-row>
        </UiParentCard>
      </v-col>
    </v-row>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Semester</th>
          <th colspan="5" class="text-subtitle-1 font-weight-semibold text-center">Jumlah SKS Ditempuh</th>
        </tr>
        <tr>
          <th colspan="2" class="text-subtitle-1 font-weight-semibold"></th>
          <th class="text-subtitle-1 font-weight-semibold text-center">Wajib</th>
          <th class="text-subtitle-1 font-weight-semibold text-center">Pilihan</th>
          <th class="text-subtitle-1 font-weight-semibold text-center">Total</th>
          <th class="text-subtitle-1 font-weight-semibold text-center">IP</th>
          <th class="text-subtitle-1 font-weight-semibold text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in studyPlans">
          <td>{{ index + 1 }}</td>
          <td>{{ item.school_year }} {{ item.semester_type }}</td>
          <td class="text-center">{{ item.total_mandatory_credit }}</td>
          <td class="text-center">{{ item.total_optional_credit }}</td>
          <td class="text-center">{{ item.total_mandatory_credit + item.total_optional_credit }}</td>
          <td class="text-center">{{ item.grade_point }}</td>
          <td class="text-center">
            <nuxt-link :to="'/backoffice/input-value/input-value-per-student/'+ item.student_id+'/'+item.semester_id">
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