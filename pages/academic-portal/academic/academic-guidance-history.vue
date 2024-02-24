<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Riwayat Bimbingan Akademik')
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
function show(){
  mode.value = 'show'
}
onMounted(async () => {

})
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
        Riwayat bimbingan akademik merupakan fitur untuk melihat riwayat bimbingan akademik mahasiswa bimbingan dengan dosen pembimbing akademik.
      </v-alert>
    </v-col>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="2" class="text-subtitle-1 font-weight-semibold">{{title}}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Nim</td>
          <td>223044</td>
        </tr>
        <tr>
          <td>Nama</td>
          <td>MERIAM SHEREENA DUAPADANG</td>
        </tr>
        <tr>
          <td>Program Studi</td>
          <td>TEKNOLOGI KONSTRUKSI BANGUNAN GEDUNG</td>
        </tr>
        <tr>
          <td>Angkatan</td>
          <td>2022</td>
        </tr>
        <tr>
          <td>Semester</td>
          <td>
            <v-autocomplete :items="['Semua', '-- Kosong --']" color="primary" variant="outlined" hide-details :label="'Pilih '+title"></v-autocomplete>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-col cols="12">
      <UiParentCard :title="'Pilih '+title">
        <v-row>
          <v-col cols="12" lg="12" md="12" class="text-center">
            <VBtn color="primary" title="Detil" @click="show()">
              Lihat
            </VBtn>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
    <v-table class="mt-5" v-if="mode == 'show'">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Semester</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
          <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
          <th class="text-subtitle-1 font-weight-semibold">Konsultasi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>2022</td>
          <td>2022</td>
          <td>Dosen</td>
          <td>Konsultasi</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
