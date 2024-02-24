<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentAcademicGuidanceSessionListData } from '~~/types/api/student-academic-guidance/GetStudentAcademicGuidanceSessionList';
import { getStudentAcademicGuidanceSessionList } from '~~/composables/api/student-academic-guidance/getStudentAcademicGuidanceSessionList';
import page from 'nuxt/dist/pages/runtime/page';
import { getStudentSemesterList } from '~~/composables/api/student-semester/getStudentSemesterList';
import { GetStudentSemesterListData } from '~~/types/api/student-semester/GetStudentSemesterList';

import moment from 'moment';
import { GetStudentAcademicGuidanceDetailData } from '~~/types/api/student-academic-guidance/GetStudentAcademicGuidanceDetail';
import { getStudentAcademicGuidanceDetail } from '~~/composables/api/student-academic-guidance/getStudentAcademicGuidanceDetail';
definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Bimbingan Akademik')
const mode = ref('list')
const showMode = ref(true)
const valid = ref(true)
const dialog = ref(false)
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const dialogShow = ref(false)
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
function show() {
  showMode.value = true
}

onMounted(async () => {
  await getStudentSemesterData()
})

const studentAcademicGuidanceDetails = ref(<GetStudentAcademicGuidanceDetailData>{})
async function getStudentAcademicGuidanceDetailData() {
  try {
    const { response: resp, error: error } = await getStudentAcademicGuidanceDetail(selectedStudentSemester.value.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentAcademicGuidanceDetails.value = resp?.data
      await getStudentAcademicGuidanceSessionData()
    }
  } catch (error) {
    alert(error)
  }
}

const studentAcademicGuidanceSessions = ref<GetStudentAcademicGuidanceSessionListData[]>([])
async function getStudentAcademicGuidanceSessionData() {
  try {
    const { response: resp, error: error } = await getStudentAcademicGuidanceSessionList(studentAcademicGuidanceDetails.value.id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentAcademicGuidanceSessions.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

const studentSemesters = ref<GetStudentSemesterListData[]>([])
const selectedStudentSemester = ref(<GetStudentSemesterListData>{});
async function getStudentSemesterData() {
  try {
    const { response: resp, error: error } = await getStudentSemesterList(100000, 1, '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentSemesters.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function studentSemesterOnChange(id: any) {
  selectedStudentSemester.value = studentSemesters.value.filter((x) => { return x.id == id })[0]
  await getStudentAcademicGuidanceDetailData()
}


const detailData = ref(<GetStudentAcademicGuidanceSessionListData>{
})
function showSummary(data: GetStudentAcademicGuidanceSessionListData) {
  mode.value = 'showSummary'
  detailData.value = data
  dialogShow.value = true
}
function showStudents(data: GetStudentAcademicGuidanceSessionListData) {
  mode.value = 'showStudents'
  detailData.value = data
  dialogShow.value = true
}
function showFiles(data: GetStudentAcademicGuidanceSessionListData) {
  mode.value = 'showFiles'
  detailData.value = data
  dialogShow.value = true
}

function MouseOver(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

function print(){
    window.open('/academic-portal/academic/prints/student-academic-guidance/student', '_blank');
}
</script>
<template>
  <v-col cols="12">
    <div v-if="mode == 'showStudents'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogShow" max-width="800">
          <PagesAcademicPortalStudentAcademicGuidanceMhs :getStudentAcademicGuidanceSessionListData="detailData" />
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'showSummary'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogShow" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Ringkasan</span>
            </v-card-title>
            <v-row style="min-height: 400px;">
              <v-col :cols="12">
                <div class="pa-3">
                  {{ detailData.summary }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <div v-if="mode == 'showFiles'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialogShow" max-width="800">
          <PagesAcademicPortalStudentAcademicGuidanceFile :getStudentAcademicGuidanceSessionListData="detailData" />
        </v-dialog>
      </v-col>
    </div>
    <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
  </v-col>
  <v-col cols="12">
    <v-alert type="info" variant="tonal">
      Keterangan :
      <br />
      Bimbingan Akademik berisi daftar mahasiswa yang merupakan mahasiswa bimbingan dari dosen pengguna. Dari menu ini
      dosen dapat melihat kartu rencana studi (KRS), kartu hasil studi (KHS), riwayat nilai, serta profil mahasiswa.
    </v-alert>
  </v-col>
  <v-row>
    <v-col cols="12">
      <UiParentCard :title="'Pilih ' + title">
        <v-row>
          <v-col cols="12" lg="6" md="6">
            <v-select item-value="id" variant="outlined" hide-details :items="studentSemesters" label="Pilih Semester"
              @update:model-value="(sl: any) => studentSemesterOnChange(sl)">
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
          <v-col cols="12" lg="12" md="6" class="text-right">\
            <v-btn color="success float-right" flat class="ml-2 mb-2" @click="print()">
              <PrinterIcon />Cetak
            </v-btn>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-table class="mt-5" v-if="showMode">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
        <th class="text-subtitle-1 font-weight-semibold">Sesi</th>
        <th class="text-subtitle-1 font-weight-semibold" width="250">Ringkasan</th>
        <th class="text-subtitle-1 font-weight-semibold">Files</th>
        <th class="text-subtitle-1 font-weight-semibold">Jumlah</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="ag, index in studentAcademicGuidanceSessions">
        <td>{{ index + 1 }}</td>
        <td>{{ ag.subject }}</td>
        <td>{{ moment(new Date(ag.session_date)).format("DD MMM YYYY") }}</td>
        <td><a href="#" v-on:click.prevent="showSummary(ag)">{{ ag.summary.length > 20 ? ag.summary.substring(0, 20) +
          '...' : ag.summary }}</a></td>
        <td><a href="#" v-on:click.prevent="showFiles(ag)">{{ ag.files.length }} file</a></td>
        <td><a href="#" v-on:click.prevent="showStudents(ag)">{{ ag.students.length }} orang</a></td>
      </tr>
    </tbody>
  </v-table>
</template>
