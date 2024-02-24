<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});

const topic_id = ref('')
const forum_id = ref('')
const thread_id = ref('')
const title = ref('Thread Topik')
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
function create(){
    mode.value = 'create'
    dialog.value = true
}
function close(){
    dialog.value = false
}
onMounted(async () => {
    thread_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    topic_id.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
    forum_id.value = window.location.href.split('/')[window.location.href.split('/').length - 3]
})
</script>
<template>
    <div v-if="mode == 'create'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="1200">
                <PagesAcademicPortalVirtualClassForumsCreate @close="close" />
            </v-dialog>
        </v-col>
    </div>
    <v-col cols="12">
      <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
    </v-col>
    <v-col cols="12">
      <v-alert type="info" variant="tonal">
        Sharing Kegiatan Perkuliahan : 
        <br />
        Kuliah terkait Gedung
      </v-alert>
    </v-col>
    <v-row>
      <v-col cols="12">
        <UiParentCard :title="'Pilih '+title">
          <v-row>
            <v-col cols="12" lg="6" md="6" class="text-right">
              <v-text-field density="compact" :label="'Pencarian '+title " hide-details variant="outlined" />
            </v-col>
            <v-col cols="12" lg="3" md="3" class="text-right">
                <v-btn color="primary" @click="create">
                    <VIcon class="mr-2">
                        mdi-plus
                    </VIcon>Tambah
                </v-btn>
            </v-col>
            <v-col cols="12" lg="3" md="3" class="text-right">
                <NuxtLink class="text-decoration-none color-inherits" :to="'/academic-portal/virtual-class/forums/' + forum_id +'/'+topic_id">
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
          <th class="text-subtitle-1 font-weight-semibold">Judul Postingan</th>
          <th class="text-subtitle-1 font-weight-semibold">Isi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 20">
          <td>{{ i }}</td>
          <td>
            Judul Postingan
          </td>
          <td>Isi Postingan</td>
        </tr>
      </tbody>
    </v-table>
    <v-table class="mt-5">
      <thead>
        <tr>
          <th colspan="2" class="text-subtitle-1 font-weight-semibold">Buat Thread Baru</th>
        </tr>
      </thead>
      <tbody>
        <tr>
            <td>Judul Thread Diskusi</td>
            <td>
                <v-col cols="12" sm="12">
                    <v-text-field variant="outlined" hide-details label="Thread Diskusi" />
                </v-col>
            </td>
        </tr>
      </tbody>
    </v-table>
    <v-col cols="12">
        <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn color="secondary">
                Tambah
            </v-btn>
        </v-card-actions>
    </v-col>
  </template>