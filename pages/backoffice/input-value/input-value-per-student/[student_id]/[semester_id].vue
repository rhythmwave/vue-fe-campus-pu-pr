<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { GetStudentClassRequest } from '~~/types/api/student-class/GetStudentClassRequest1';
import { GetStudentClassList } from '~~/types/api/student-class/GetStudentClassList1';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getStudyPlanList } from '~~/composables/api/study-plan/getStudyPlanList';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';
import moment from 'moment';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { getStudentClassList } from '~~/composables/api/student-class/getStudentClassList1';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Kelas Input Nilai Per Mahasiswa')
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
const studentClasses = ref(<GetStudentClassList[]>[])
const classId = ref('')
const studentId = ref('')
const semesterId = ref('')
const subjectId = ref('')

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
async function getStudentClass(limit: number, page: number, search: string) {
  try {
    const { response: resp, error: error } = await getStudentClassList(limit, page, search, <GetStudentClassRequest>{
        studyPlanId: '',
        studentId: studentId.value,
        semesterId: semesterId.value,
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
async function create(item: any){
  subjectId.value = item.subject_id
  classId.value = item.class_id
  mode.value = 'create'
  dialog.value = true
}
async function close(){
  dialog.value = false
}
onMounted(async () => {
  studentId.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
  semesterId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
  await detailStudent(studentId.value)
  await getStudentClass(limit, page, '')
})
</script>
<template>
  <div>
    <div v-if="mode == 'create'">
        <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="1200">
            <PagesBackofficeInputValueCreate :subjectId="subjectId" :classId="classId" :studentId="studentId" @close="close" />
        </v-dialog>
        </v-col>
    </div>
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
              <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/input-value/input-value-per-student/' + studentId">
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
                <th colspan="2" class="text-subtitle-1 font-weight-semibold text-center">Mata Kuliah</th>
            </tr>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold"></th>
                <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                <th class="text-subtitle-1 font-weight-semibold">Jumlah SKS</th>
                <th class="text-subtitle-1 font-weight-semibold">Ke</th>
                <th class="text-subtitle-1 font-weight-semibold">Bobot Nilai</th>
                <th class="text-subtitle-1 font-weight-semibold">Kode Nilai</th>
                <th class="text-subtitle-1 font-weight-semibold">SKS * Bobot</th>
                <th class="text-subtitle-1 font-weight-semibold">Nama Pengubah</th>
                <th class="text-subtitle-1 font-weight-semibold">Tanggal Pengubah</th>
                <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in studentClasses">
                <td>{{ index + 1 }}</td>
                <td>{{ item.subject_code }}</td>
                <td>{{ item.subject_name }}</td>
                <td>{{ item.class_name }}</td>
                <td>{{ item.subject_total_credit }}</td>
                <td>{{ item.subject_repetition }}</td>
                <td>{{ item.grade_point }}</td>
                <td>{{ item.grade_code }}</td>
                <td>{{ item.grade_point *  item.subject_total_credit }}</td>
                <td>{{ item.graded_by_admin_name ? item.graded_by_admin_name : item.graded_by_lecturer_name }}</td>
                <td>{{ item.graded_at ? formatYearMonthDate(item.graded_at) : '' }}</td>
                <td>
                  <v-btn title="Add" icon flat class="float-left" @click="create(item)">
                      <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                  </v-btn>    
                </td>
            </tr>
        </tbody>
    </v-table>
  </div>
</template>
