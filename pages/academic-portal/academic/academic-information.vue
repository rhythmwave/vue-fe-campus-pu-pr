<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Informasi Akademik')
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
  dialog.value = true
}
function close(){
  dialog.value = false
}
onMounted(async () => {

})
</script>
<template>
  <div v-if="mode == 'show'">
      <v-col cols="12" lg="8" md="6" class="text-right">
          <v-dialog v-model="dialog" max-width="800">
              <PagesAcademicPortalAcademicAcademicInformationDetail :title="'Detil '+title" @close="close" />
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
      Informasi Akademik berisi informasi-informasi yang berkaitan dengan hal akademis.
    </v-alert>
  </v-col>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Judul</th>
        <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
      </tr>
    </thead>
    <tr>
      <td>1</td>
      <td>
        <v-btn color="primary" class="mt-2 mb-2" @click="show">Informasi terkait KHS, KRS dan Perwalian</v-btn>
      </td>
      <td>02 Februari 2023</td>
    </tr>
  </v-table>
</template>
