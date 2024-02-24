<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Forum Diskusi')
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
      Forum Diskusi diharapkan dapat dipakai untuk berdiskusi antara para civitas akademika POLITEKNIK PEKERJAAN UMUM dan saling membangun mengembangkan wacana untuk kemajuan . Untuk itu dilarang keras memaki dan menghujat dalam forum ini.
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
        <th class="text-subtitle-1 font-weight-semibold">Kategori Diskusi</th>
        <th class="text-subtitle-1 font-weight-semibold">Informasi Kategori</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in 20">
        <td>{{ i }}</td>
        <td>
          <NuxtLink :to="'/academic-portal/virtual-class/forums/' + i" class="text-decoration-none">
            <v-btn color="primary" class="mt-2">Umum</v-btn>
          </NuxtLink>
          <br> Terbuka umum untuk Dosen dan Mahasiswa.
        </td>
        <td>1 topik terdaftar</td>
      </tr>
    </tbody>
  </v-table>
</template>