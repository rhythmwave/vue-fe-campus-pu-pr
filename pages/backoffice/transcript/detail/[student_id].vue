<script setup lang="ts">
import { GetSKPIRegistrationDataDetail } from '~/types/api/admin-skpi/GetSKPIRegistration'
import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { GetStudentSubjectGradeListData } from '~~/types/api/student/GetStudentSubjectGradeList';
import { getStudentSubjectGradeList } from '~~/composables/api/student/getStudentSubjectGradeList';

definePageMeta({
  layout: "backoffice",
  middleware: ['check-auth'],
});
const title = ref('Detail Transkrip')
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

const student_id = ref('')

function back() {
  let router = useRouter()
  router.push({
    path: '/backoffice/transcript/transcript',
  })
}
onMounted(async () => {
  student_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
  await getStudentDetailData()
  await getStudentSubjectGradeData()
})

const studentDetails = ref(<GetStudentDetailData>{})
const selectedStudentDetail = ref(<GetStudentDetailData>{});
async function getStudentDetailData() {
  try {
    const { response: resp, error: error } = await getStudentDetail(student_id.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentDetails.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
// async function studentDetailOnChange(id: any) {
//   selectedStudentDetail.value = studentDetails.value.filter((x) => { return x.id == id })[0]
//   await getStudentAcademicGuidanceDetailData()
// }
const studentSubjectGrades = ref(<GetStudentSubjectGradeListData[]>[])
const selectedStudentSubjectGrade = ref(<GetStudentSubjectGradeListData>{});
async function getStudentSubjectGradeData() {
  try {
    const { response: resp, error: error } = await getStudentSubjectGradeList(100000, 1, student_id.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentSubjectGrades.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

// async function studentSubjectGradeOnChange(id: any) {
//   selectedStudentSubjectGrade.value = studentSubjectGrades.value.filter((x) => { return x.id == id })[0]
//   await getStudentAcademicGuidanceDetailData()
// }
</script>

<template>
  <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
  <SharedUiParentCard :title="title">
    <VCol cols="12" lg="12" md="12" class="text-right">
      <VBtn color="warning" flat class="ml-auto" @click="back">
        <VIcon class="mr-2">
          mdi-keyboard-backspace
        </VIcon>Kembali
      </VBtn>
    </VCol>
  </SharedUiParentCard>
  <VTable class="mt-5">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold" width="200">{{ title }}</th>
        <th class="text-subtitle-1 font-weight-semibold"></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>NIM :</td>
        <td>{{ studentDetails?.nim_number }}</td>
      </tr>
      <tr>
        <td>Nama :</td>
        <td>{{ studentDetails?.name }}</td>
      </tr>
      <tr>
        <td>Angkatan :</td>
        <td>{{ studentDetails?.student_force }}</td>
      </tr>
      <tr>
        <td>Program Studi :</td>
        <td>{{ studentDetails?.study_program_name }}</td>
      </tr>
      <tr>
        <td>Tempat Tanggal Lahir :</td>
        <td>{{ studentDetails?.birth_regency_name }} {{ studentDetails?.birth_date ? moment(new
          Date(studentDetails?.birth_date)).format("DD MM YYYY") : ''
        }}</td>
      </tr>

    </tbody>
  </VTable>
  <VTable class="mt-5">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold" colspan="6">1. Prestasi dan penghargaan / Achievement and Awards
        </th>
        <th colspan="3">
          <!-- <a style="text-decoration: none;float: right; " :href="skpi_approval_detail?.achievement_url"
            target="_blank"></a> -->
          <v-btn color="primary" v-bind="props" flat class="ml-auto text-right" target="_blank"
            :to="'/backoffice/transcript/prints/transcript/detail/normal/' + student_id">
            <v-icon class="mr-2">mdi-printer</v-icon>Print Transkrip
          </v-btn>
          &nbsp;
          <v-btn color="primary" v-bind="props" flat class="ml-auto text-right" target="_blank"
            :to="'/backoffice/transcript/prints/transcript/detail/special/' + student_id">
            <v-icon class="mr-2">mdi-printer</v-icon>Print Transkrip Khusus
          </v-btn>
        </th>
      </tr>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Kode</th>
        <th class="text-subtitle-1 font-weight-semibold">Matakuliah</th>
        <th class="text-subtitle-1 font-weight-semibold">SKS</th>
        <th class="text-subtitle-1 font-weight-semibold">W/P</th>
        <th class="text-subtitle-1 font-weight-semibold">Paket Sem</th>
        <th class="text-subtitle-1 font-weight-semibold">Tipe</th>
        <th class="text-subtitle-1 font-weight-semibold">Semester Pengambilan</th>
        <th class="text-subtitle-1 font-weight-semibold">Nilai</th>
        <th class="text-subtitle-1 font-weight-semibold">Grade</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item, index in studentSubjectGrades">
        <td>{{ index + 1 }}</td>
        <td>{{ item.subject_code }}</td>
        <td>{{ item.subject_name }}</td>
        <td>{{ item.subject_total_credit }}</td>
        <td>{{ item.subject_is_mandatory?'W':'P' }}</td>
        <td>{{ item.semester_package }}</td>
        <td>{{ item.grade_semester_type }} {{ item.grade_semester_school_year }}</td>
        <td>{{ item.subject_type }}</td>
        <td>{{ item.grade_point === 0 ? '' : item.grade_point }}</td>
        <td>{{ item.grade_code }}</td>
      </tr>
    </tbody>
  </VTable>
</template>