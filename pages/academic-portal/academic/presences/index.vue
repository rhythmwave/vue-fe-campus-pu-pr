<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentStudyPlanDetailClass, GetStudentStudyPlanDetailData } from '~~/types/api/student-study-plan/GetStudentStudyPlanDetail';
import { getStudentStudyPlanDetail } from '~~/composables/api/student-study-plan/getStudentStudyPlanDetail';
import { attendAutonomousLecture } from '~~/composables/api/student-lecture/attendAutonomousLecture';
import { AttendAutonomousLectureRequest } from '~~/types/api/student-lecture/AttendAutonomousLecture';


definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Presensi Perkuliahan')
const mode = ref('list')
const dialog = ref(false)
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: title.value,
    disabled: true,
    href: '#'
  }
]);

const showData = ref(<GetStudentStudyPlanDetailClass>{})
function show(data: GetStudentStudyPlanDetailClass) {
  dialog.value = true
  mode.value = 'detail'
  showData.value = data
}
function close() {
  dialog.value = false
}
function download() {
  console.log("download")
}

async function presence(lectureId: string) {
  await attendAutonomousLectureData(lectureId)
  console.log("presence")
}
onMounted(async () => {
  await getStudentStudyPlanDetailData()
})
const studentStudyPlanDetails = ref(<GetStudentStudyPlanDetailData>{})
async function getStudentStudyPlanDetailData() {
  try {
    const { response: resp, error: error } = await getStudentStudyPlanDetail('')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentStudyPlanDetails.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
const attendAutonomousLectures = ref(<any>{})
async function attendAutonomousLectureData(lectureId: string) {
  try {
    const { response: resp, error: error } = await attendAutonomousLecture(
      <AttendAutonomousLectureRequest>{
        lecture_id: lectureId,
      }
    )
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      alert("Presensi berhasil");
      attendAutonomousLectures.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
</script>
<template>
  <div v-if="mode == 'detail'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="1200">
        <PagesAcademicPortalAcademicPrecensesDetail :title="'Detil ' + title" @close="close" :classId="showData.id" />
      </v-dialog>
    </v-col>
  </div>
  <v-col cols="12">
    <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
  </v-col>
  <v-col cols="12">
    <v-alert type="info" variant="tonal">
      Keterangan :
      <br />
      Presensi Perkuliahan memungkinkan mahasiswa untuk melakukan presensi mandiri sesuai dengan kelas perkuliahan yang
      sedang diambil oleh mahasiswa. Presensi mandiri hanya aktif saat dosen pengampu sedang mengaktifkan periode presensi
      mandiri.
    </v-alert>
  </v-col>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">{{ title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Semester</td>
        <td>{{ studentStudyPlanDetails.semester_type }} {{ studentStudyPlanDetails.semester_school_year }}</td>
      </tr>
      <tr>
        <td>Nama</td>
        <td>{{ studentStudyPlanDetails.student_name }}</td>
      </tr>
      <tr>
        <td>NIM</td>
        <td>{{ studentStudyPlanDetails.student_nim_number }}</td>
      </tr>
      <tr>
        <td>Program Studi</td>
        <td>{{ studentStudyPlanDetails.study_program_name }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
        <th class="text-subtitle-1 font-weight-semibold">Nama Kelas</th>
        <th class="text-subtitle-1 font-weight-semibold">SKS</th>
        <th class="text-subtitle-1 font-weight-semibold">Terlaksana</th>
        <th class="text-subtitle-1 font-weight-semibold">Hadir</th>
        <th class="text-subtitle-1 font-weight-semibold">Tidak Hadir</th>
        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="clss, i in studentStudyPlanDetails.classes ">
        <td>
          {{ i + 1 }}
          <!-- <VBtn title="Presensi" icon="mdi-check" flat @click="" class="text-primary">
          </VBtn> -->
        </td>
        <td>{{ clss.subject_name }}</td>
        <td>{{ clss.name }}</td>
        <td>{{ clss.subject_theory_credit + clss.subject_practicum_credit }}</td>
        <td>{{ clss.total_lecture_done }}</td>
        <td>{{ clss.total_attendance }}</td>
        <td>{{ clss.total_lecture_done - clss.total_attendance }}</td>
        <td>

          <v-tooltip text="Presensi">
            <template #activator="{ props }">
              <VBtn title="Presensi" icon="mdi-clock-time-eight-outline" flat
                @click="clss.active_lecture_id ? presence(clss.active_lecture_id) : () => { }"
                :style="!clss.active_lecture_id ? 'color:grey !important ;' : ''"
                :class="!clss.active_lecture_id ? 'text-primary' : ''">
              </VBtn>
            </template>
          </v-tooltip>
          <v-tooltip text="Detil">
            <template #activator="{ props }">
              <VBtn title="Detil" icon flat @click="show(clss)">
                <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
              </VBtn>
            </template>
          </v-tooltip>
          <!-- <v-tooltip text="Download">
            <template #activator="{ props }">
              <VBtn title="Download" icon flat @click="download">
                <PrinterIcon stroke-width="1.5" size="20" class="text-primary" />
              </VBtn>
            </template>
          </v-tooltip> -->
        </td>
      </tr>
    </tbody>
  </v-table>
</template>