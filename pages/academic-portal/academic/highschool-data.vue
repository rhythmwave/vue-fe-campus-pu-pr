<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { getStudentSchoolProfileDetail } from '~~/composables/api/student-school-profile/getStudentSchoolProfileDetail';
import { GetStudentSchoolProfileDetailData } from '~~/types/api/student-school-profile/GetStudentSchoolProfileDetail';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Data SMA Asal Mahasiswa')
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
function update() {
  mode.value = 'update'
  dialog.value = true
}
function close() {
  dialog.value = false
}
async function reload() {
  dialog.value = false
  await getStudentSchoolProfileDetailData()
}
onMounted(async () => {
  await getStudentSchoolProfileDetailData()
})
const getStudentSchoolProfileDetails = ref(<GetStudentSchoolProfileDetailData>{
  school_enrollment_year: "",
  school_graduation_year: "",
  school_enrollment_class: "",
  school_major: "",
  school_type: "",
  school_name: "",
  school_province_id: 0,
  school_province_name: "",
  school_address: "",
  school_certificate_number: "",
  school_certificate_date: "",
  school_status: "",
  school_accreditation: "",
  school_final_exam_score: 0,
  school_mathematics_final_exam_score: 0,
  school_indonesian_final_exam_score: 0,
  school_english_final_exam_score: 0,
  school_mathematics_report_score: 0,
  school_indonesian_report_score: 0,
  school_english_report_score: 0,
  pre_high_school_histories: [],
})
async function getStudentSchoolProfileDetailData() {
  try {
    const { response: resp, error: error } = await getStudentSchoolProfileDetail()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      getStudentSchoolProfileDetails.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
</script>
<template>
  <div v-if="mode == 'update'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalAcademicHighschoolDataUpdate @close="close"
          :getStudentSchoolProfileDetails="getStudentSchoolProfileDetails" @reload="reload"/>
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
      Data SMA berisi data SMA asal Mahasiswa portal akademik. Apabila terdapat kesalahan data, anda dapat memperbaikinya.
    </v-alert>
  </v-col>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="4" class="text-subtitle-1 font-weight-semibold">Data Riwayat Pra SMTA</th>
      </tr>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Pendidikan</th>
        <th class="text-subtitle-1 font-weight-semibold">Nama Sekolah</th>
        <th class="text-subtitle-1 font-weight-semibold">Tahun Lulus</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="phs, i in getStudentSchoolProfileDetails.pre_high_school_histories">
        <td>{{ i + 1 }}</td>
        <td>{{ phs.level }}</td>
        <td>{{ phs.graduation_year }}</td>
        <td>{{ phs.name }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Data SMTA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Tahun Daftar SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_enrollment_year }}</td>
      </tr>
      <tr>
        <td>Tahun Lulus SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_graduation_year }}</td>
      </tr>
      <tr>
        <td>Kelas Masuk SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_enrollment_class }}</td>
      </tr>
      <tr>
        <td>Jurusan SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_major }}</td>
      </tr>
      <tr>
        <td>Jenis SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_type }}</td>
      </tr>
      <tr>
        <td>Nama SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_name }}</td>
      </tr>
      <tr>
        <td>Provinsi SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_province_name }}</td>
      </tr>
      <tr>
        <td>Alamat SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_address }}</td>
      </tr>
      <tr>
        <td>Lulus SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_graduation_year }}</td>
      </tr>
      <tr>
        <td>No Ijazah</td>
        <td>{{ getStudentSchoolProfileDetails.school_certificate_number }}</td>
      </tr>
      <tr>
        <td>Tanggal Ijazah</td>
        <td>{{ getStudentSchoolProfileDetails.school_certificate_date }}</td>
      </tr>
      <tr>
        <td>Status SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_status }}</td>
      </tr>
      <tr>
        <td>Akreditasi</td>
        <td>{{ getStudentSchoolProfileDetails.school_accreditation }}</td>
      </tr>
      <tr>
        <td>Nilai Ujian Akhir SMTA</td>
        <td>{{ getStudentSchoolProfileDetails.school_final_exam_score }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Nilai UAN</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nilai Matematika</td>
        <td>{{ getStudentSchoolProfileDetails.school_mathematics_final_exam_score }}</td>
      </tr>
      <tr>
        <td>Nilai Bahasa Indonesia</td>
        <td>{{ getStudentSchoolProfileDetails.school_indonesian_final_exam_score }}</td>
      </tr>
      <tr>
        <td>Nilai Bahasa Inggris</td>
        <td>{{ getStudentSchoolProfileDetails.school_english_final_exam_score }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Nilai Raport SMTA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nilai Matematika</td>
        <td>{{ getStudentSchoolProfileDetails.school_mathematics_report_score }}</td>
      </tr>
      <tr>
        <td>Nilai Bahasa Indonesia</td>
        <td>{{ getStudentSchoolProfileDetails.school_indonesian_report_score }}</td>
      </tr>
      <tr>
        <td>Nilai Bahasa Inggris</td>
        <td>{{ getStudentSchoolProfileDetails.school_english_report_score }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-col cols="12">
    <v-card-actions class="pa-4">
      <v-spacer />
      <v-btn color="secondary" @click="update()">
        Ubah
      </v-btn>
    </v-card-actions>
  </v-col>
</template>
