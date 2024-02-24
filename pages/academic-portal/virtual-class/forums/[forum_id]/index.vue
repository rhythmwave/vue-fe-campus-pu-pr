<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});

const forum_id = ref('')
const title = ref('Topik Kategori')
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
    forum_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
})
</script>
<template>
    <v-col cols="12">
      <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
    </v-col>
    <v-col cols="12">
      <v-alert type="info" variant="tonal">
        Umum : 
        <br />
        Terbuka umum untuk Dosen dan Mahasiswa.
      </v-alert>
    </v-col>
    <v-row>
      <v-col cols="12">
        <UiParentCard :title="'Pilih '+title">
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <v-text-field density="compact" :label="'Pencarian '+title " hide-details variant="outlined" />
            </v-col>
            <v-col cols="12" lg="6" md="6" class="text-right">
                <NuxtLink class="text-decoration-none color-inherits" :to="'/academic-portal/virtual-class/forums'">
                    <VIcon class="mr-2">
                        mdi-keyboard-backspace
                    </VIcon>Kembali
                </NuxtLink>
            </v-col>
          </v-row>
        </UiParentCard>
      </v-col>
    </v-row>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Topik Diskusi</th>
          <th class="text-subtitle-1 font-weight-semibold">Informasi Topik</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 20">
          <td>{{ i }}</td>
          <td>
            <NuxtLink :to="'/academic-portal/virtual-class/forums/' + forum_id +'/'+ i" class="text-decoration-none">
              <v-btn color="primary" class="mt-2">Sharing Kegiatan Perkuliahan</v-btn>
            </NuxtLink>
            <br> Kuliah terkait Gedung.
          </td>
          <td>17 Oktober 2022 14:46:05 <br> Moderator : RIZKY CITRA ISLAMI</td>
        </tr>
      </tbody>
    </v-table>
  </template>