<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Tagihan & Pembayaran')
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
function showDetail(){
  mode.value = 'detail'
  dialog.value = true
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
        Informasi Tagihan merupakan fasilitas yang dapat digunakan untuk melihat informasi tagihan mahasiswa.
      </v-alert>
    </v-col>
    <v-row>
      <v-col cols="12">
        <UiParentCard :title="'Pilih '+title">
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <v-autocomplete :items="['Genap 2022']" color="primary" variant="outlined" hide-details :label="'Pilih Semester'"></v-autocomplete>
            </v-col>
            <v-col cols="12" lg="6" md="6" class="mt-2 text-right">
              <VBtn color="primary" title="Detil" @click="show()">
                Lihat
              </VBtn>
            </v-col>
          </v-row>
        </UiParentCard>
      </v-col>
    </v-row>
    <v-table class="mt-5" v-if="mode == 'show'">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">No Tagihan</th>
          <th class="text-subtitle-1 font-weight-semibold">Jenis Pembayaran</th>
          <th class="text-subtitle-1 font-weight-semibold">Total Tagihan</th>
          <th class="text-subtitle-1 font-weight-semibold">Potongan</th>
          <th class="text-subtitle-1 font-weight-semibold">Sisa Tagihan</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal Awal Pembayaran</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal Akhir Pembayaran</th>
          <th class="text-subtitle-1 font-weight-semibold">Status</th>
          <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>22101223044</td>
          <td>Uang Kuliah Tunggal (UKT)</td>
          <td>6.000.000,00</td>
          <td>0,00</td>
          <td>0,00</td>
          <td>18 Juli 2022 00:00:00</td>
          <td>13 Agustus 2022 00:00:00</td>
          <td>Lunas</td>
          <td>
            <VBtn color="primary" title="Detil" @click="showDetail()">
              Detil
            </VBtn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
