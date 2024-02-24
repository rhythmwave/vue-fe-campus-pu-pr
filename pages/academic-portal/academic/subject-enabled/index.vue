<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { getLecturerSemesterList } from '~~/composables/api/lecturer-semester/getLecturerSemesterList';
import { GetLecturerProfileData } from '~~/types/api/lecturer/ProfileLecturer';
import { getLecturerProfile } from '~~/composables/api/lecturer/getLecturerProfile';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Mata Kuliah Diampu')
const mode = ref('list')
const showMode = ref(false)
const dialog = ref(false)
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Daftar ' + title.value,
    disabled: true,
    href: '#'
  }
]);
const studyPrograms = ref([
  'Teknologi Konstruksi Bangunan Air',
  'Teknologi Konstruksi Bangunan Gedung',
  'Teknologi Konstruksi Jalan dan Jembatan',
])
function show() {
  showMode.value = true;
}

function rejectShow() {
  alert('Silahkan pilih semester terlebih dahulu');
}

let detailData = <GetLecturerAssignedClassListData>{}
function showDetail(data: GetLecturerAssignedClassListData) {
  detailData = data;
  mode.value = 'detail'
  dialog.value = true
  detailData = data;
}
onMounted(async () => {
  await getLecturerProfileData()
  await getLecturerSemesterData()
})

const idSemester = ref('');
const lecturerSemesters = ref<GetLecturerSemesterListData[]>([]);
const lecturerProfile = ref(<GetLecturerProfileData>{});
const lecturerAssignedClasses = ref(<GetLecturerAssignedClassListData[]>([]));
const selectedLecturerSemester = ref(<GetLecturerSemesterListData>{});

async function getLecturerProfileData() {
  try {
    const { response: resp, error: error } = await getLecturerProfile()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerProfile.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

async function getLecturerSemesterData() {
  try {
    const { response: resp, error: error } = await getLecturerSemesterList(100, 1, lecturerProfile.value.study_program_id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerSemesters.value = resp?.data
      lecturerSemesters.value.forEach((s) => {
        s.semester_type_year = s.semester_start_year + " " + s.semester_type
      });
    }
  } catch (error) {
    alert(error)
  }
}

async function getLecturerAssignedClassData(semesterId: string) {
  try {
    const { response: resp, error: error } = await getLecturerAssignedClassList(semesterId)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lecturerAssignedClasses.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

async function lecturerSemesterOnChange(id: any) {
  idSemester.value = id
  selectedLecturerSemester.value = lecturerSemesters.value.filter((x) => { return x.id == id })[0]
  await getLecturerAssignedClassData(selectedLecturerSemester.value.id)
}

function MouseOver(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>

<template>
  <div v-if="mode == 'detail'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalAcademicSubjectEnabledDetail :title="'Detil ' + title" :classId="detailData.id" />
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
      Mata Kuliah Diampu berisi daftar Mata Kuliah yang diampu oleh dosen pengguna. Dosen dapat melihat Mata Kuliah yang
      ditawarkan oleh program studi lain dengan memilih Sistem Informasi Akademik yang bersesuaian.
    </v-alert>
  </v-col>
  <v-row>
    <v-col cols="12">
      <UiParentCard :title="'Pilih ' + title">
        <v-row>
          <v-col cols="12" lg="6" md="6">
            <!-- <v-select variant="outlined" hide-details :items="lecturerSemesters" item-value="id" item-title="semester_type_year"
              label="Pilih Semester" @update:model-value="(sl: any) => lecturerSemesterOnChange(sl)"></v-select> -->
            <v-select v-model="idSemester" item-value="id" variant="outlined" hide-details :items="lecturerSemesters"
              label="Pilih Semester" @update:model-value="(sl: any) => lecturerSemesterOnChange(sl)">
              <template v-slot:selection="{ item }">
                <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                }}</span>
              </template>
              <template v-slot:item="{ item, props: { onClick, title, value } }">
                <ul>
                  <li style="padding: 10px; margin: 2px;">
                    <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                      @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                      <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                      }}</span>
                    </a>
                  </li>
                </ul>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" lg="6" md="6">
            <VBtn title="Detil" icon flat @click="idSemester != '' ? show() : rejectShow()">
              <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
            </VBtn>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-table class="mt-5" v-if="showMode">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Daftar {{ title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nama</td>
        <td>{{ lecturerProfile.name }}</td>
      </tr>
      <tr>
        <td>NIDN</td>
        <td>{{ lecturerProfile.id_national_lecturer }}</td>
      </tr>
      <tr>
        <td>Program Studi</td>
        <td>{{ lecturerProfile.study_program_name }}</td>
      </tr>
      <tr>
        <td>Semester</td>
        <td>{{ selectedLecturerSemester.school_year + " " + selectedLecturerSemester.semester_type }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5" v-if="showMode">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Prodi</th>
        <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
        <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
        <th class="text-subtitle-1 font-weight-semibold">Kuliah (SKS)</th>
        <th class="text-subtitle-1 font-weight-semibold">Praktik (SKS)</th>
        <th class="text-subtitle-1 font-weight-semibold">Praktik Lapangan (SKS)</th>
        <th class="text-subtitle-1 font-weight-semibold">Total (SKS)</th>
        <th class="text-subtitle-1 font-weight-semibold">Komponen Penilaian</th>
        <th class="text-subtitle-1 font-weight-semibold" width="130">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="assignedclass, index in lecturerAssignedClasses">
        <td>{{ index + 1 }}</td>
        <td>{{ assignedclass.study_program_name }}</td>
        <td>{{ assignedclass.subject_code + " - " + assignedclass.subject_name }}</td>
        <td>{{ assignedclass.name }}</td>
        <td>{{ assignedclass.theory_credit }}</td>
        <td>{{ assignedclass.practicum_credit }}</td>
        <td>{{ assignedclass.field_practicum_credit }}</td>
        <td>{{ assignedclass.theory_credit + assignedclass.practicum_credit + assignedclass.field_practicum_credit }}</td>
        <td><a :href="'/academic-portal/academic/subject-enabled/' + assignedclass.id">Lihat Detail</a></td>
        <td>
          <v-tooltip text="Detil">
            <template #activator="{ props }">
              <VBtn title="Detil" icon flat @click="showDetail(assignedclass)">
                <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
              </VBtn>
            </template>
          </v-tooltip>
          <v-tooltip text="Cetak">
            <template #activator="{ props }">
              <VBtn title="Cetak" icon flat target="_blank"
                :to="'/academic-portal/academic/prints/subject-enabled/lecturer/' + assignedclass.id">
                <PrinterIcon stroke-width="1.5" size="20" class="text-primary" />
              </VBtn>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped></style>
