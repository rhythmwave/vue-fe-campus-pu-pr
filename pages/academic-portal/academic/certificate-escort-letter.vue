<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentSkpiDetailData } from '~~/types/api/student-skpi/GetStudentSkpiDetail';
import { getStudentSkpiDetail } from '~~/composables/api/student-skpi/getStudentSkpiDetail';
import moment from 'moment';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Surat Keterangan Pendamping Ijazah')
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
  dialog.value = true
  mode.value = 'update'
}
function close() {
  dialog.value = false
}
function reload() {
  dialog.value = false
  getStudentSkpiDetailData()
}

onMounted(async () => {
  getStudentSkpiDetailData()
})
const studentSkpiDetails = ref(<GetStudentSkpiDetailData>{})
async function getStudentSkpiDetailData() {
  try {
    const { response: resp, error: error } = await getStudentSkpiDetail()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentSkpiDetails.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
</script>

<template>
  <div>
    <div v-if="mode == 'update'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="1200">
          <PagesAcademicPortalAcademicCertificateEscortLetterUpdate :title="'Ubah ' + title" @close="close"
            :studentSkpiDetails="studentSkpiDetails" @reload="reload()"/>
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
        Merupakan fasilitas untuk informasi Surat Keterangan Pendamping Ijazah secara online.
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
          <td>{{ studentSkpiDetails.student_name }}</td>
        </tr>
        <tr>
          <td>Nim</td>
          <td>{{ studentSkpiDetails.student_nim_number }}</td>
        </tr>
        <tr>
          <td>Program Studi</td>
          <td>{{ studentSkpiDetails.student_study_program_name }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="3" class="text-subtitle-1 font-weight-semibold">Prestasi dan Penghargaan / ACHIEVEMENT AND AWARDS
          </th>
        </tr>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Prestasi</th>
          <th class="text-subtitle-1 font-weight-semibold">Tahun</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a, i in studentSkpiDetails.achievements">
          <td>{{ i + 1 }}</td>
          <td>{{ a.name }}</td>
          <td>{{ a.year }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="4" class="text-subtitle-1 font-weight-semibold">Pengalaman Organisasi / ORGANIZATIONAL EXPERIENCES
          </th>
        </tr>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Organisasi</th>
          <th class="text-subtitle-1 font-weight-semibold">Posisi</th>
          <th class="text-subtitle-1 font-weight-semibold">Masa Jabatan (Tahun)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o, i in studentSkpiDetails.organizations">
          <td>{{ i + 1 }}</td>
          <td>{{ o.name }}</td>
          <td>{{ o.position }}</td>
          <td>{{ o.service_length }} Tahun</td>
        </tr>
      </tbody>
    </v-table>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="2" class="text-subtitle-1 font-weight-semibold">Sertifikat Keahlian / CERTIFICATE OF EXPERTISE</th>
        </tr>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Nama</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c, i in studentSkpiDetails.certificates">
          <td>{{ i + 1 }}</td>
          <td>{{ c.name }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="2" class="text-subtitle-1 font-weight-semibold">Pendidikan Karakter / CERTIFICATE OF EXPERTISE</th>
        </tr>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Nama</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c, i in studentSkpiDetails.character_buildings">
          <td>{{ i + 1 }}</td>
          <td>{{ c.name }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="2" class="text-subtitle-1 font-weight-semibold">Kerja Prakter / Magang / INTERNSHIP</th>
        </tr>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Nama</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c, i in studentSkpiDetails.internships">
          <td>{{ i + 1 }}</td>
          <td>{{ c.name }}</td>
        </tr>
      </tbody>
    </v-table>
    <!-- <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="2" class="text-subtitle-1 font-weight-semibold">Tugas Akhir / FINAL PROJECT</th>
        </tr>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Nama</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c, i in studentSkpiDetails.">
          <td>{{ i + 1 }}</td>
          <td>{{ c.name }}</td>
        </tr>
      </tbody>
    </v-table> -->
    <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="4" class="text-subtitle-1 font-weight-semibold">Bahasa Internasional / INTERNATIONAL LANGUAGE(S)
          </th>
        </tr>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Bahasa</th>
          <th class="text-subtitle-1 font-weight-semibold">Skor</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c, i in studentSkpiDetails.languages">
          <td>{{ i + 1 }}</td>
          <td>{{ c.name }}</td>
          <td>{{ c.score }}</td>
          <td>{{ moment(c.date).format("D MMMM YYYY") }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-col cols="12" lg="12" md="12" class="text-right">
      <v-btn color="primary" class="mt-2" @click="update">
        Ubah
      </v-btn>
    </v-col>
  </div>
</template>

<style scoped></style>
