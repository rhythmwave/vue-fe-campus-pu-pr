<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentThesisDetailData, GetStudentThesisDetailFile, GetStudentThesisDetailThesisSupervisors } from '~~/types/api/student-thesis/GetStudentThesisDetail';
import { getStudentThesisDetail } from '~~/composables/api/student-thesis/getStudentThesisDetail';
import moment from 'moment';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Pendaftaran Tugas Akhir')
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
function registration() {
  dialog.value = true
  mode.value = 'registration'
}
function update() {
  dialog.value = true
  mode.value = 'update'
}
function close() {
  dialog.value = false
}
onMounted(async () => {
  await getStudentThesisDetailData()
})
const studentThesisDetails = ref(<GetStudentThesisDetailData>{
  id: "",
  student_id: "",
  student_name: "",
  student_nim_number: 0,
  start_semester_id: "",
  start_semester_type: "",
  start_semester_school_year: "",
  finish_semester_id: "",
  finish_semester_type: "",
  finish_semester_school_year: "",
  topic: "",
  title: "",
  english_title: "",
  start_date: "",
  finish_date: "",
  remarks: "",
  is_joint_thesis: false,
  status: "",
  proposal_seminar_date: "",
  proposal_certificate_number: "",
  proposal_certificate_date: "",
  thesis_defense_count: 0,
  grade_point: 0,
  grade_code: "",
  files: <GetStudentThesisDetailFile[]>[],
  thesis_supervisors: <GetStudentThesisDetailThesisSupervisors>{
    id: "",
    lecturer_id: "",
    lecturer_name: "",
    lecturer_front_title: "",
    lecturer_back_degree: "",
    thesis_supervisor_role_id: "",
    thesis_supervisor_role_name: "",
    thesis_supervisor_role_sort: 0,
  },
})

async function getStudentThesisDetailData() {
  try {
    const { response: resp, error: error } = await getStudentThesisDetail()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentThesisDetails.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
</script>

<template>
  <div>
    <div v-if="mode == 'registration'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="1200">
          <PagesAcademicPortalAcademicFinalExamRegistration :title="title" @close="close"
            @reload="getStudentThesisDetailData()" />
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'update'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="1200">
          <PagesAcademicPortalAcademicFinalExamRegistrationUpdate :thesisDetail="studentThesisDetails" :title="title"
            @close="close" @reload="getStudentThesisDetailData()" />
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
        Menu Pendaftaran Tugas Akhir dapat anda gunakan untuk pengisian Pengajuan Pendaftaran Tugas Akhir.
      </v-alert>
    </v-col>
    <v-row v-if="!studentThesisDetails.id">
      <v-col cols="12">
        <UiParentCard :title="''">
          <v-row>
            <v-col cols="12" lg="12" md="12" class="text-right">
              <v-btn color="primary" class="mt-2" @click="registration">
                Daftar
              </v-btn>
            </v-col>
          </v-row>
        </UiParentCard>
      </v-col>
    </v-row>
    <v-row v-if="studentThesisDetails.id">
      <v-col cols="12">
        <UiParentCard :title="''">
          <v-row>
            <v-col cols="12" lg="12" md="12" class="text-right">
              <v-btn color="primary" class="mt-2" @click="update">
                Update
              </v-btn>
            </v-col>
          </v-row>
        </UiParentCard>
      </v-col>
    </v-row>
    <v-table class="mt-5" v-if="studentThesisDetails.id">
      <thead>
        <tr>
          <th colspan="2" class="text-subtitle-1 font-weight-semibold">Biodata Mahasiswa</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr>
          <td width="200">Foto</td>
          <td class="text-left">
            <img v-if="studentThesisDetails.profile_photo_url" style="width: 20%; padding: 5px"
              :src="studentThesisDetails.profile_photo_url" alt="Foto">
          </td>
        </tr> -->
        <tr>
          <td>Topik</td>
          <td>{{ studentThesisDetails.topic }}</td>
        </tr>
        <tr>
          <td>Judul</td>
          <td>{{ studentThesisDetails.title }}</td>
        </tr>
        <tr>
          <td>Judul Asing</td>
          <td>{{ studentThesisDetails.english_title }}</td>
        </tr>
        <tr>
          <td>Catatan</td>
          <td>{{ studentThesisDetails.remarks }}</td>
        </tr>
        <tr>
          <td>Pengerjaan</td>
          <td>{{ studentThesisDetails.is_joint_thesis ? "Sendiri" : "Kelompok" }}</td>
        </tr>
        <tr>
          <td>Status</td>
          <td><strong>{{ studentThesisDetails.status }}</strong></td>
        </tr>
        <tr>
          <td>Tanggal Mulai</td>
          <td>
            <span v-if="studentThesisDetails.start_date">
              {{ moment(studentThesisDetails.start_date).format("D MMMM YYYY") }}
            </span>
          </td>
        </tr>
        <tr>
          <td>Tanggal Selesai</td>
          <td>
            <span v-if="studentThesisDetails.finish_date">
              {{ moment(studentThesisDetails.finish_date).format("D MMMM YYYY") }}
            </span>
          </td>
        </tr>
        <tr>
          <td>Tanggal Proposal Seminar</td>
          <td>
            <span v-if="studentThesisDetails.proposal_seminar_date">{{
              moment(studentThesisDetails.proposal_seminar_date).format("D MMMM YYYY") }}
            </span>
          </td>
        </tr>
        <tr>
          <td>Nomor Sertifikat Proposal</td>
          <td>
            <span v-if="studentThesisDetails.proposal_certificate_number">
              {{ studentThesisDetails.proposal_certificate_number }}
            </span>
          </td>
        </tr>
        <tr>
          <td>Tanggal Sertifikat Proposal</td>
          <td>
            <span v-if="studentThesisDetails.proposal_certificate_date">
              {{ moment(studentThesisDetails.proposal_certificate_date).format("D MMMM YYYY") }}
            </span>
          </td>
        </tr>
        <tr>
          <td>Ujian TA</td>
          <td>{{ studentThesisDetails.thesis_defense_count }}</td>
        </tr>
        <tr>
          <td>Nilai TA</td>
          <td>{{ studentThesisDetails.grade_code }}</td>
        </tr>
        <tr>
          <td>Files</td>
          <td>
            <ul>
              <li v-for="f, index in studentThesisDetails.files"><a :href="f.file_url" target="_blank">File {{ index + 1
              }}</a></li>
            </ul>
          </td>
        </tr>

      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
