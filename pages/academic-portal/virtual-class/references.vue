<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Referensi Silabus')
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
function show(){
  mode.value = 'show'
}
const classes = ref([
  {
    studyProgram: 'Teknologi Konstruksi Jalan dan Jembatan',
    class: 'A+B',
    subject: 'Pendidikan Pancasila',
    subject_id: '1',
  },
  {
    studyProgram: 'Teknologi Konstruksi Bangunan Air',
    class: 'A',
    subject: 'Pendidikan Pancasila',
    subject_id: '2',
  },
  {
    studyProgram: 'Teknologi Konstruksi Bangunan Air',
    class: 'C',
    subject: 'Pendidikan Pancasila',
    subject_id: '3',
  },
])
function upload(){
  mode.value = 'upload'
  dialog.value = true
}
function close(){
  dialog.value = false
}
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
      Referensi Silabus dapat anda gunakan sebagai fitur untuk melakukan pencarian Materi yang sudah terdaftar pada Sistem Informasi Akademik
    </v-alert>
  </v-col>
  <v-row>
    <v-col cols="12">
      <UiParentCard :title="'Pilih '+title">
        <v-row>
          <v-col cols="12" lg="12" md="12" class="text-right">
            <v-text-field density="compact" :label="'Pencarian '+title " hide-details variant="outlined" />
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
        <th class="text-subtitle-1 font-weight-semibold">Judul</th>
        <th class="text-subtitle-1 font-weight-semibold">File</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in 20">
        <td>{{ i }}</td>
        <td>B-Mekanika Tanah {{ i }}</td>
        <td>11. Kuat Geser Tanah Materi mengenai Kuat Geser Tanah</td>
        <td>-</td>
      </tr>
    </tbody>
  </v-table>
</template>
