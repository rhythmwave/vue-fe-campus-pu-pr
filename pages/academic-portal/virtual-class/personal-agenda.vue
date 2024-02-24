<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Agenda Pribadi')
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
function create(){
  mode.value = 'create'
  dialog.value = true
}
function close(){
  dialog.value = false
}
onMounted(async () => {

})
</script>
<template>
  <div v-if="mode == 'create'">
      <v-col cols="12" lg="8" md="6" class="text-right">
          <v-dialog v-model="dialog" max-width="800">
              <PagesAcademicPortalVirtualClassPersonalAgendaCreate @close="close" />
          </v-dialog>
      </v-col>
  </div>
  <v-col cols="12">
    <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
  </v-col>
  <v-row>
    <v-col cols="12">
      <UiParentCard :title="'Daftar '+title">
        <v-row>
          <v-col cols="12" lg="4" md="4">
            <v-autocomplete :items="['Genap 2022']" color="primary" variant="outlined" hide-details :label="'Pilih Semester'"></v-autocomplete>
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <v-autocomplete :items="classes" :item-title="item => `${item.studyProgram} - ${item.class} - ${item.subject}`" item-value="subject_id" color="primary" variant="outlined" hide-details label="Pilih Materi" />
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <v-select :items="['Insidental', 'Mingguan', 'Bulanan']" color="primary" variant="outlined" hide-details label="Pilih Frekuensi" />
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <VBtn title="Detil" icon flat @click="show()">
              <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
            </VBtn>
          </v-col>
          <v-col cols="12" lg="8" md="8" class="text-right">
            <v-btn color="primary" flat class="ml-auto" @click="create">
              <v-icon class="mr-2">
                mdi-plus
              </v-icon>Tambah
            </v-btn>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-table class="mt-5" v-if="mode == 'show'">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Agenda</th>
        <th class="text-subtitle-1 font-weight-semibold">Waktu</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in 5">
        <td>{{ i }}</td>
        <td>Diskusi Tentang Pancasialis {{ i }}</td>
        <td>Jum'at, 12 Februari 2022</td>
      </tr>
    </tbody>
  </v-table>
</template>
