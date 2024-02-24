<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('User Manual')
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
onMounted(async () => {

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
      Informasi User Manual.
    </v-alert>
  </v-col>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">Daftar {{ title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <v-col cols="12">
            <v-expansion-panels>
              <v-expansion-panel title="1. Pendahuluan">
                <v-expansion-panel-text>
                  1.1. Tentang Portal Akademik 
                  <br>
                  Portal Akademik, merupakan sebuah sistem informasi yang berfungsi sebagai integrator informasi
                  akademik yang ada di berbagai unit akademik (program studi/fakultas) sekaligus sebagai sarana
                  komunikasi antar civitas akademika kampus. Sistem ini dibangun dari kondisi eksistensi informasi
                  akademik di kampus yang sangat beragam dan bervariasi bentuknya, sehingga membutuhkan sebuah
                  “portal” yang akan mengintegrasikan informasi-informasi tersebut sehingga mempermudah akses publik.
                  Pengguna Portal Akademika ini terdiri dari 3 jenis, yaitu.
                  <br>
                  1. Administrator.
                  2. Mahasiswa.
                  3. Dosen.
                  <br>
                  1.2. Tentang Dokumen
                  <br>
                  Software User Manual atau Panduan Penggunaan Portal Akademik bagi dosen merupakan suatu fasilitas
                  yang dapat digunakan oleh dosen sebagai panduan dalam menggunakan Portal Akademik
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
