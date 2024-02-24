<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetStudentClassParticipantData } from '~~/types/api/student-class/GetStudentClassParticipantList';
import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Detail Absensi')
const studentClassParticipants = ref(<GetStudentClassParticipantData[]>[])
const classId = ref('')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: title,
    disabled: true,
    href: '#'
  }
])
async function getStudentClassParticipants(limit: number, page: number, search: string, class_id: string) {
  try {
    const { response: resp, error: error } = await getStudentClassParticipantList(limit, page, search, class_id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentClassParticipants.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
onMounted(async () => {
  classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
  getStudentClassParticipants(limit, page, '', classId.value)
})
</script>
<template>
    <div>
      <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
      <SharedUiParentCard :title="'Daftar '+title">
        <!-- <v-row>
          <v-col cols="12" lg="6" md="6">
            Dari : <span>{{ classDetail.name }}</span>
          </v-col>
          <v-col cols="12" lg="6" md="6">
            <v-autocomplete v-model="destinationClassId" :items="classBySubjects" item-title="name" item-value="id" density="compact" :label="'Pilih Kelas Tujuan'" hide-details variant="outlined" />
          </v-col>
        </v-row> -->
        <v-row>
          <v-col cols="12" lg="12" md="12" class="text-right">
            <nuxt-link :to="'/backoffice/class-participants/attendance'">
              <v-btn color="error" flat class="ml-auto">
                <v-icon class="mr-2">
                  mdi-arrow-collapse-left
                </v-icon>Kembali
              </v-btn>
            </nuxt-link>
          </v-col>
        </v-row>
      </SharedUiParentCard>
      <v-table class="mt-10">
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-semibold">No</th>
            <th class="text-subtitle-1 font-weight-semibold">NIM</th>
            <th class="text-subtitle-1 font-weight-semibold">Nama</th>
            <th class="text-subtitle-1 font-weight-semibold">Prodi</th>
            <th class="text-subtitle-1 font-weight-semibold">Jumlah Kehadiran</th>
            <th class="text-subtitle-1 font-weight-semibold">% Kehadiran</th>
            <th class="text-subtitle-1 font-weight-semibold">Sakit</th>
            <th class="text-subtitle-1 font-weight-semibold">Izin</th>
            <th class="text-subtitle-1 font-weight-semibold">Alpa</th>
          </tr>
        </thead>
        <tr v-for="(item, index) in studentClassParticipants">
          <td>{{ index + 1 }}</td>
          <td>{{ item.student_nim_number }}</td>
          <td>{{ item.student_name }}</td>
          <td>{{ item.study_program_name }}</td>
          <td>{{ item.total_attendance }}</td>
          <td>{{ item.attendance_percentage }}</td>
          <td>{{ item.total_sick }}</td>
          <td>{{ item.total_leave }}</td>
          <td>{{ item.total_awol }}</td>
        </tr>
      </v-table>
    </div>
</template>