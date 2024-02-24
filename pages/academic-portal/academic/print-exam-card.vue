<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Cetak Kartu Ujian')
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
        Pada Menu ini anda bisa mencetak Kartu Ujian anda untuk Test Tengah Semester ataupun Test Akhir Semester. Anda harus membawa kartu ini untuk bisa mengikuti Ujian.
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
          <td>Semester</td>
          <td>Genap 2022 / 2023</td>
        </tr>
      </tbody>
    </v-table>
    <v-col cols="12">
        <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn color="primary">
              <PrinterIcon stroke-width="1.5" size="20" class="text-primary" />
              Cetak Kartu Ujian Tengah Semester
            </v-btn>
            <v-btn color="primary">
              <PrinterIcon stroke-width="1.5" size="20" class="text-primary" />
              Cetak Kartu Ujian Akhir Semester
            </v-btn>
        </v-card-actions>
    </v-col>
  </div>
</template>
