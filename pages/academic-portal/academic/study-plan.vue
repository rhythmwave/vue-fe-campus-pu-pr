<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import { GetStudyPlanData } from "~~/types/api/academic-portal-student-study-plan/GetStudyPlan";
import { GetOfferedClassData } from "~~/types/api/academic-portal-student-offered-class/GetOfferedClass";
import { getStudyPlan } from '~~/composables/api/academic-portal-student-study-plan/getStudyPlan';
import { getOfferedClass } from '~~/composables/api/academic-portal-offered-class/getOfferedClass';
import { createStudyPlan } from '~~/composables/api/academic-portal-student-study-plan/createStudyPlan';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const selectedData = ref(<string[]>[])
const title = ref('Kartu Rencana Studi')
const mode = ref('list')
const dialog = ref(false)
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Daftar '+title.value,
        disabled: true,
        href: '#'
    }
]);
const studyPlanLength = ref(0)
const studyPlanObj = ref(<GetStudyPlanData>{})
const offeredClasses = ref(<GetOfferedClassData[]>[])
const studyProgramId = ref('')
async function studyPlan() {
  try {
    const { response: resp, error: error } = await getStudyPlan()
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
      studyPlanObj.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function offeredClass() {
  try {
    const { response: resp, error: error } = await getOfferedClass(studyProgramId.value)
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
      offeredClasses.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function save(){
  for (let index = 0; index < offeredClasses.value.length; index++) {
    let subject = offeredClasses.value[index];
    for (let i = 0; i < subject.classes.length; i++) {
      let subjectClass = subject.classes[i];
      for (let index = 0; index < selectedData.value.length; index++) {
        let data = selectedData.value[index];
        if(data == subjectClass.id){
          if(subjectClass.subject_total_lesson_plan < 14) {
            alert("Rencana Pembelajaran Belum Memenuhi Syarat Harus Berjumlah 14 Pertemuan")
            return false
          }
        }
      }
      
    }
  }
  try {
    const { response: createRoleResponse, error } = await createStudyPlan(selectedData.value)

    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    } else {
      alert('Anda Sudah Submit KRS')
      await studyPlan()
    }
    // return true;
  } catch (error) {
    alert(error)
    // return false;
  }
}
onMounted(async () => {
  await studyPlan()
  studyProgramId.value = studyPlanObj.value.study_program_id
  if(studyPlanObj.value.classes.length == 0){
    await offeredClass()
    offeredClasses.value.sort((a, b) => {
      return a.semester_package - b.semester_package
    })
  }else{
    studyPlanLength.value = 1
  }
})
</script>
<template>
  <v-col cols="12">
    <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
  </v-col>
  <v-col cols="12">
    <v-alert type="info" variant="tonal">
      Keterangan : 
      <br />
      Kartu Rencana Studi merupakan fasilitas pengisian KRS secara online. Fasilitas KRS Online ini hanya dapat digunakan pada saat masa KRS atau masa revisi KRS. Mahasiswa dapat memilih Mata Kuliah yang ingin diambil bersesuaian dengan jatah sks yang dimiliki dan Mata Kuliah yang ditawarkan. Setelah melakukan pengisian KRS mahasiswa dapat mencetak KRS tersebut agar dapat ditandatangani oleh dosen pembimbingnya masing-masing.
    </v-alert>
  </v-col>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Kartu Rencana Studi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nama</td>
        <td>{{ studyPlanObj.student_name }}</td>
      </tr>
      <tr>
        <td>NIM</td>
        <td>{{ studyPlanObj.student_nim_number }}</td>
      </tr>
      <tr>
        <td>Program Studi</td>
        <td>{{ studyPlanObj.study_program_name }}</td>
      </tr>
      <tr>
        <td>Semester</td>
        <td>{{ studyPlanObj.semester_school_year }} - {{ studyPlanObj.semester_type }}</td>
      </tr>
      <tr>
        <td>Maksimum SKS</td>
        <td>{{ studyPlanObj.maximum_credit }}</td>
      </tr>
      <tr>
        <td>Dosen Pembimbing Akademik</td>
        <td>{{ studyPlanObj.academic_guidance_lecturer_front_title }} {{ studyPlanObj.academic_guidance_lecturer_name }} {{ studyPlanObj.academic_guidance_lecturer_back_degree }}</td>
      </tr>
      <tr>
        <td>Status KRS</td>
        <td>{{ studyPlanObj.is_approved ? 'Disetujui' : studyPlanObj.is_submitted ? 'Sudah Submit' : 'Belum Submit / Disetujui' }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5" v-if="studyPlanLength">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Kode MK</th>
        <th class="text-subtitle-1 font-weight-semibold">Nama Kelas</th>
        <th class="text-subtitle-1 font-weight-semibold">SKS</th>
        <th class="text-subtitle-1 font-weight-semibold">Jadwal Kuliah</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in studyPlanObj.classes">
        <td>{{ index + 1}}</td>
        <td>{{ item.subject_code }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.subject_name }}</td>
        <td>{{ item.subject_field_practicum_credit }}</td>
        <td>
          <ul>
            <li v-for="itm in item.schedules">
              Nama Ruang : {{ itm.room_name }}<br>
              Hari : {{ itm.day_of_week }}<br>
              Dari Jam : {{ convertTimeNumberToString(itm.start_time) }}<br>
              Sampai Jam : {{ convertTimeNumberToString(itm.end_time) }}<br>
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-row v-else>
    <v-col cols="12" v-for="item in offeredClasses">
      <v-expansion-panels>
        <v-expansion-panel :title="'Paket Semester ' + item.semester_package">
          <v-expansion-panel-text>
            <v-table class="mt-5">
              <thead>
                <tr>
                  <th class="text-subtitle-1 font-weight-semibold"></th>
                  <th class="text-subtitle-1 font-weight-semibold">No</th>
                  <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                  <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
                  <th class="text-subtitle-1 font-weight-semibold">Nama Dosen</th>
                  <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                  <th class="text-subtitle-1 font-weight-semibold">W/P</th>
                  <th class="text-subtitle-1 font-weight-semibold">SKS</th>
                  <th class="text-subtitle-1 font-weight-semibold">Kuota Kelas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(itm, indx) in item.classes">
                  <td>
                    <v-checkbox v-model="selectedData" color="primary" :value="itm.id" hide-details></v-checkbox>
                  </td>
                  <td>{{ indx == 0 ? (k = 1) : (k = k + 1) }}</td>
                  <td>{{ itm.subject_code }}</td>
                  <td>{{ itm.subject_name }}</td>
                  <td v-for="(it, i) in itm.lecturers">
                    <ul>
                      <li>{{it.name}}</li>
                    </ul>
                  </td>
                  <td>{{ itm.name }}</td>
                  <td>{{ itm.subject_is_mandatory ? 'W' : 'P' }}</td>
                  <td>{{ itm.subject_theory_credit + itm.subject_practicum_credit + itm.subject_field_practicum_credit }}</td>
                  <td>{{ itm.maximum_participant }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col cols="12">
      <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="secondary" :disabled="selectedData.length == 0"
              @click="save">
              Simpan
          </v-btn>
          <v-btn color="primary" target="_blank" class="ml-2"
                :to="'/academic-portal/academic/prints/study-plan/student'">
                <PrinterIcon stroke-width="1.5" size="20" />
                Cetak
              </v-btn>
      </v-card-actions>
    </v-col>
  </v-row>
</template>
