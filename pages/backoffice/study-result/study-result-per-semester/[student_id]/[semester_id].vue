<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';
import { GetStudentClassRequest } from '~~/types/api/student-class/GetStudentClassRequest1';
import { GetStudentClassList } from '~~/types/api/student-class/GetStudentClassList1';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';
import { getStudentClassList } from '~~/composables/api/student-class/getStudentClassList1';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import moment from 'moment';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Detail Hasil Studi Per Semester')
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
const detail_student = ref(<GetStudentDetailData>{})
const detail_semester = ref(<GetSemesterDetailData>{})
const studentClasses = ref(<GetStudentClassList[]>[])
const studentId = ref('')
const semesterId = ref('')
const sum_subject_total_credit = ref(0)
const sum_grade_point_total_credit = ref(0)

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
async function semesterDetail(id: string) {
  try {
    const { response: resp, error: error } = await getSemesterDetail(id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      detail_semester.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getStudentClass(limit: number, page: number, search: string, study_plan_id: string, student_id: string, semester_id: string) {
  try {
    const { response: resp, error: error } = await getStudentClassList(limit, page, search, <GetStudentClassRequest>{
      studyPlanId: study_plan_id,
      studentId: student_id,
      semesterId: semester_id
  })
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentClasses.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
onMounted(async () => {
  studentId.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
  semesterId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
  await studentDetail(studentId.value)
  await semesterDetail(semesterId.value)
  await getStudentClass(limit, page, '', '', studentId.value, semesterId.value)
  studentClasses.value.forEach(function(item){
    sum_subject_total_credit.value += item.subject_total_credit
    sum_grade_point_total_credit.value += item.subject_total_credit * item.grade_point
  })
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
                    <td>Semester</td>
                    <td>{{ detail_semester.school_year }} - {{ detail_semester.semester_type }}</td>
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
              <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/study-result/study-result-per-semester'">
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
            <th colspan="2" class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
          </tr>
          <tr>
            <th class="text-subtitle-1 font-weight-semibold"></th>
            <th class="text-subtitle-1 font-weight-semibold">Kode</th>
            <th class="text-subtitle-1 font-weight-semibold">Nama</th>
            <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
            <th class="text-subtitle-1 font-weight-semibold">Jenis</th>
            <th class="text-subtitle-1 font-weight-semibold">Jumlah SKS</th>
            <th class="text-subtitle-1 font-weight-semibold">Ke</th>
            <th class="text-subtitle-1 font-weight-semibold">Bobot Nilai / Kode</th>
            <th class="text-subtitle-1 font-weight-semibold">SKS * Bobot</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in studentClasses">
            <td>{{ index + 1 }}</td>
            <td>{{ item.subject_code }}</td>
            <td>{{ item.subject_name }}</td>
            <td>{{ item.class_name }}</td>
            <td>{{ item.subject_is_mandatory ? 'Wajib Program Studi' : 'Tidak Wajib' }}</td>
            <td>{{ item.subject_total_credit }}</td>
            <td>{{ item.subject_repetition }}</td>
            <td>{{ item.grade_point }} / {{ item.grade_code }}</td>
            <td>{{ item.grade_point * item.subject_total_credit }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td colspan="4">Total</td>
            <td>{{ sum_subject_total_credit }}</td>
            <td colspan="2"></td>
            <td>{{ sum_grade_point_total_credit }}</td>
          </tr>
        </tfoot>
      </v-table>
    </div>
</template>