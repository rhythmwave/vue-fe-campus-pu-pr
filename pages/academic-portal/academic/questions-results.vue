<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Hasil Kuisioner')
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
          <v-col cols="12" lg="4" md="4">
            <v-autocomplete :items="['Genap 2022']" color="primary" variant="outlined" hide-details :label="'Pilih Semester'"></v-autocomplete>
          </v-col>
          <v-col cols="12" lg="4" md="4">
            <v-autocomplete :items="['Semua']" color="primary" variant="outlined" hide-details :label="'Pilih Sesi'" />
          </v-col>
          <v-col cols="12" lg="4" md="4" class="text-right">
            <VBtn title="Detil" color="primary" @click="show()">
              Lihat
            </VBtn>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  </div>
</template>

<style scoped></style>
