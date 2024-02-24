<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import { GetLecturerProfileData } from '~~/types/api/lecturer/ProfileLecturer';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { getLecturerProfile } from '~~/composables/api/lecturer/getLecturerProfile';
import { getLecturerSemesterList } from '~~/composables/api/lecturer-semester/getLecturerSemesterList';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Pengelolaan Nilai')
const mode = ref('list')
const limit = 20
var page = 1
const dialog = ref(false)
const semesterName = ref('')
const studyProgramId = ref('')
const semesterId = ref('')
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
const semesters = ref<GetLecturerSemesterListData[]>([])
const classrooms = ref<GetLecturerAssignedClassListData[]>([])
const profile = ref(<GetLecturerProfileData>{})

async function getProfile() {
  try {
    const { response: resp, error: error } = await getLecturerProfile()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      profile.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getSemester(limit: number, page: number) {
  try {
    const { response: resp, error: error } = await getLecturerSemesterList(limit, page, studyProgramId.value)
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
        semesters.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getClassroom() {
    try {
        const { response: resp, error: error } = await getLecturerAssignedClassList(semesterId.value)
        if (error) {
          let dataError = <ErrorRoot>error;
          alert(dataError.meta.message);
          return;
        }
        if (resp != null) {
          classrooms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
function show(){
  mode.value = 'show'
}
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
watch(semesterId, async function(value){
  let index = semesters.value.findIndex(x => x.id == value)
  semesterName.value = semesters.value[index].school_year.toString() + ' - ' + semesters.value[index].semester_type.toString()
  if(value != ''){
    await getClassroom()
  }
})
onMounted(async () => {
  await getProfile()
  await getSemester(limit, page)
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
      Pengelolaan Nilai dapat digunakan untuk memasukkan nilai mahasiswa secara on-line. Dosen dapat memberikan nilai sesuai dengan Mata Kuliah yang diampunya. Untuk memasukkan nilai Mata Kuliah yang ditawarkan oleh program studi lain dapat dilakukan dengan memilih Sistem Informasi Akademik yang bersesuaian.
    </v-alert>
  </v-col>
  <v-row>
    <v-col cols="12">
      <UiParentCard :title="'Pilih '+title">
        <v-row>
          <v-col cols="12" lg="6" md="6">
            <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details :items="semesters" label="Pilih Semester">
              <template v-slot:selection="{ item }">
                <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
              </template>
              <template v-slot:item="{item, props: {onClick, title, value}}">
                <ul>
                  <li style="padding: 10px; margin: 2px;">
                    <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                        <span @click="onClick">{{ title.school_year }} - {{ title.semester_type }}</span>
                    </a>
                  </li>
                </ul>
              </template>
            </v-select>
          </v-col>
          <v-col cols="12" lg="6" md="6">
            <VBtn title="Detil" icon flat @click="show()">
              <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
            </VBtn>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
  <v-table class="mt-5" v-if="mode == 'show'">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Daftar {{ title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nama</td>
        <td>{{ profile.name }}</td>
      </tr>
      <tr>
        <td>NIDN</td>
        <td>{{ profile.id_national_lecturer }}</td>
      </tr>
      <tr>
        <td>Program Studi</td>
        <td>{{ profile.study_program_name }}</td>
      </tr>
      <tr>
        <td>Semester</td>
        <td>{{ semesterName }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5" v-if="mode == 'show'">
    <thead>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Mata Kuliah</th>
        <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
        <th class="text-subtitle-1 font-weight-semibold">Kuliah (SKS)</th>
        <th class="text-subtitle-1 font-weight-semibold">Praktik (SKS)</th>
        <th class="text-subtitle-1 font-weight-semibold">Praktik Lapangan (SKS)</th>
        <th class="text-subtitle-1 font-weight-semibold">Total (SKS)</th>
        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in classrooms">
        <td>{{ index + 1 }}</td>
        <td>{{ item.subject_name }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.theory_credit }}</td>
        <td>{{ item.practicum_credit }}</td>
        <td>{{ item.field_practicum_credit }}</td>
        <td>{{ item.theory_credit + item.practicum_credit + item.field_practicum_credit }}</td>
        <td>
          <v-tooltip text="Detil">
              <template #activator="{ props }">
                <NuxtLink class="text-decoration-none color-inherits" :to="'/academic-portal/academic/grade-management/'+item.id">
                  <VBtn title="Detil" icon flat>
                      <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                  </VBtn>
                </NuxtLink>
              </template>
          </v-tooltip>
          
          <v-tooltip text="Cetak">
            <template #activator="{ props }">
              <VBtn title="Cetak" icon flat target="_blank" :to="'/academic-portal/academic/prints/grade-management/lecturer/' + item.id" >
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
