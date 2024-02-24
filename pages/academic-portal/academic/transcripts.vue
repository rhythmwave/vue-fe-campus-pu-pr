<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentTranscriptDetailData } from '~~/types/api/student-transcript/GetStudentTranscriptDetail';
import { getStudentTranscriptDetail } from '~~/composables/api/student-transcript/getStudentTranscriptDetail';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Transkrip')
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
onMounted(async () => {
  await getStudentTranscriptDetailData()
})
const studentTranscriptDetails = ref(<GetStudentTranscriptDetailData>{
  id: "",
  name: "",
  nim_number: 0,
  study_program_name: "",
  total_credit: 0,
  gpa: 0,
  subjects: []
})
async function getStudentTranscriptDetailData() {
  try {
    const { response: resp, error: error } = await getStudentTranscriptDetail()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentTranscriptDetails.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
</script>

<template>
  <div>
    <v-col cols="12">
      <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
    </v-col>
    <v-col cols="12">
      <v-alert type="info" variant="tonal">
        Keterangan :
        <br />
        Transkrip Nilai berisi informasi nilai hasil studi mahasiswa mulai dari semester awal sampai dengan semester
        terakhir mahasiswa. Transkrip ini dapat dicetak dalam bentuk transkrip satu halaman.
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
          <td>Nama</td>
          <td>{{ studentTranscriptDetails.name }}</td>
        </tr>
        <tr>
          <td>Nim</td>
          <td>223044</td>
        </tr>
        <tr>
          <td>Program Studi</td>
          <td>{{ studentTranscriptDetails.study_program_name }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold text-center">No</th>
          <th class="text-subtitle-1 font-weight-semibold ">Semester</th>
          <th class="text-subtitle-1 font-weight-semibold ">Kode</th>
          <th class="text-subtitle-1 font-weight-semibold ">Mata Kuliah</th>
          <th class="text-subtitle-1 font-weight-semibold text-center">SKS</th>
          <th class="text-subtitle-1 font-weight-semibold text-center">Nilai</th>
          <th class="text-subtitle-1 font-weight-semiboldc">Grade</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s, i in studentTranscriptDetails.subjects ">
          <td>{{ i + 1 }}</td>
          <td>Semester {{ s.semester_type }} {{ s.semester_start_year }}</td>
          <td>{{ s.subject_code }}</td>
          <td>{{ s.subject_name }}</td>
          <td>{{ s.subject_theory_credit + s.subject_practicum_credit }}</td>
          <td>{{ s.grade_code }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="2" class="text-subtitle-1 font-weight-semibold">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Jumlah SKS Diambil</td>
          <td>{{ studentTranscriptDetails.total_credit }}</td>
        </tr>
        <tr>
          <td>Jumlah Mata Kuliah Diambil</td>
          <td>{{ studentTranscriptDetails.subjects.length }}</td>
        </tr>
        <tr>
          <td>IP Kumulatif</td>
          <td>{{ studentTranscriptDetails.gpa }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-col cols="12">
      <v-alert type="info" variant="tonal">
        Keterangan Nilai :
        <br />
        <v-table>
          <thead>
            <tr>
              <th colspan="2"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A :</td>
              <td>4.00</td>
            </tr>
            <tr>
              <td>AB :</td>
              <td>3.50</td>
            </tr>
            <tr>
              <td>B :</td>
              <td>3.00</td>
            </tr>
            <tr>
              <td>BC :</td>
              <td>2.50</td>
            </tr>
            <tr>
              <td>C :</td>
              <td>2.00</td>
            </tr>
            <tr>
              <td>CD :</td>
              <td>1.50</td>
            </tr>
            <tr>
              <td>D :</td>
              <td>1.00</td>
            </tr>
            <tr>
              <td>E :</td>
              <td>0.00</td>
            </tr>
          </tbody>
        </v-table>
      </v-alert>
    </v-col>
  </div>
  <v-tooltip text="Cetak">
    <template #activator="{ props }">
      <VBtn title="Cetak" icon flat target="_blank"
        :to="'/academic-portal/academic/prints/transcripts/student'">
        <PrinterIcon stroke-width="1.5" size="20" class="text-primary" /> &nbsp; Print
      </VBtn>
    </template>
  </v-tooltip>
</template>

<style scoped></style>
