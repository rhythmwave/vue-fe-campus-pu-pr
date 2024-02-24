<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetStudentClassRequest } from '~~/types/api/student-class/GetStudentClassRequest1';
import { GetStudentClassList } from '~~/types/api/student-class/GetStudentClassList1';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { ErrorRoot } from '~~/types/api/error';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { getStudentClassList } from '~~/composables/api/student-class/getStudentClassList1';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const studentId = ref('')
const studyPlanId = ref('')
const classId = ref('')
const mode = ref('list')
const dialog = ref(false)
const student_detail = ref(<GetStudentDetailData>{})
const studentClasses = ref(<GetStudentClassList[]>[])
async function getStudentClass(limit: number, page: number, search: string, study_plan_id: string) {
    try {
        const { response: resp, error: error } = await getStudentClassList(limit, page, '', <GetStudentClassRequest>{studyPlanId: study_plan_id, studentId: '', semesterId: ''})
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
async function studentDetail(id: string) {
    try {
        const { response: resp, error: error } = await getStudentDetail(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
          student_detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function show(class_id: string, student_id: string){
  mode.value = 'show'
  dialog.value = true
  classId.value = class_id
  studentId.value = student_id
}
onMounted(async () => {
  studentId.value = window.location.href.split('/')[window.location.href.split('/').length - 1].split('?')[0]
  studyPlanId.value = window.location.href.split('/')[window.location.href.split('/').length - 1].split('?')[1].replaceAll('studyPlanId=', '')
  await studentDetail(studentId.value)
  await getStudentClass(limit, page, '', studyPlanId.value)
})
</script>
<template>
    <div>
      <div v-if="mode == 'show'">
        <v-col cols="12" lg="8" md="6" class="text-right">
          <v-dialog v-model="dialog" max-width="800">
            <PagesBackofficeClassParticipantStudentAttendanceRecapDetail :studentId="studentId" :classId="classId" />
          </v-dialog>
        </v-col>
      </div>
      <SharedUiParentCard :title="'Mahasiswa'">
        <v-row>
          <v-col cols="12" lg="12" md="12">
            <v-table class="mt-10">
              <thead>
                <tr>
                  <th colspan="2" class="text-subtitle-1 font-weight-semibold"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nama :</td>
                  <td>{{ student_detail.name }}</td>
                </tr>
                <tr>
                  <td>NIM :</td>
                  <td>{{ student_detail.nim_number }}</td>
                </tr>
                <tr>
                  <td>Program Studi :</td>
                  <td>{{ student_detail.study_program_name }}</td>
                </tr>
                <tr>
                  <td>Dosen Pembimbing Akademik :</td>
                  <td>{{ student_detail.academic_guidance_lecturer_name }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
          <v-col cols="12" lg="12" md="12" class="text-right">
            <nuxt-link :to="'/backoffice/class-participants/student-attendance-recap'">
              <v-btn color="error" flat class="ml-auto">
                <v-icon class="mr-2">
                  mdi-arrow-collapse-left
                </v-icon>Kembali
              </v-btn>
            </nuxt-link>
          </v-col>
        </v-row>
      </SharedUiParentCard>
      <v-table class="mt-10">
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-semibold">No</th>
            <th class="text-subtitle-1 font-weight-semibold">Kode Mata Kuliah</th>
            <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
            <th class="text-subtitle-1 font-weight-semibold">SKS</th>
            <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
            <th class="text-subtitle-1 font-weight-semibold">Hadir</th>
            <th class="text-subtitle-1 font-weight-semibold">Izin</th>
            <th class="text-subtitle-1 font-weight-semibold">Sakit</th>
            <th class="text-subtitle-1 font-weight-semibold">Alpa</th>
            <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in studentClasses">
            <td>{{ index + 1 }}</td>
            <td>{{ item.subject_code }}</td>
            <td>{{ item.subject_name }}</td>
            <td>{{ item.subject_total_credit }}</td>
            <td>{{ item.class_name }}</td>
            <td>{{ item.total_attendance }}</td>
            <td>{{ item.total_leave }}</td>
            <td>{{ item.total_sick }}</td>
            <td>{{ item.total_awol }}</td>
            <td>
              <v-tooltip text="Absence Summary">
                <template #activator="{ props }">
                  <v-btn icon flat v-bind="props" @click="show(item.class_id, studentId)">
                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                  </v-btn>
                </template>
              </v-tooltip>  
            </td>
          </tr>
        </tbody>
      </v-table>
      <!-- <nuxt-link :to="'/backoffice/class-participants/student-attendance-recap/' + studyPlanId +'/asdasda'">asdasd</nuxt-link> -->
    </div>
</template>