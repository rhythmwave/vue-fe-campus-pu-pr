<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { GetStudentListRequest, GetStudentListData } from "~~/types/api/student/GetStudentList";
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { ApproveStudyPlanRequest } from "~~/types/api/study-plan/ApproveStudyPlanRequest";
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { approveStudyPlan } from '~~/composables/api/study-plan/approveStudyPlan';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search: String = ''
const mode = ref('list')
const dialog = ref(true)
const title = ref('Manajemen Persetujuan KRS')
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
const studyPrograms = ref<GetAdminStudyProgramListData[] | undefined>()
const semesters = ref<GetSemesterListData[] | undefined>()
const semesterId = ref('')
const students = ref<GetStudentListData[] | undefined>()
const studyProgramId = ref('')
const data = ref(<ApproveStudyPlanRequest>{})
const requestStudent = ref(<GetStudentListRequest>{
  studyProgramId: '',
  studentForceFrom: '',
  studentForceTo: '',
  nimNumberFrom: '',
  nimNumberTo: '',
  name: '',
  address: '',
  regencyId: '',
  status: [],
  getAcademicGuidance: '',
  hasAuthentication: '',
  studyPlanSemesterId: '',
  studyPlanIsApproved: false,
  studyPlanIsSubmitted: true,
  hasStudyPlan: true,
  statusSemesterId: '',
  isRegistered: '',
  hasPaid: '',
  isGraduateEligible: '',
  isThesisEligible: '',
  yudiciumSessionId: '',
})
interface StudyPlanId {
  student_id: string
  semester_package: number
}
const study_plan_ids = ref(<string[]>[])
async function getAdminStudyProgram() {
  try {
    const { response: resp, error: error } = await getAdminStudyProgramList(limit, page, '', '')
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studyPrograms.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getSemester() {
  try {
    const { response: resp, error: error } = await getSemesterList(limit, page, studyProgramId.value, '')
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
async function getStudent() {
  requestStudent.value.studyPlanSemesterId = semesterId.value
  try {
    const { response: resp, error: error } = await getStudentList(limit, page, requestStudent.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      students.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function selectedProgramStudy() {
  await getSemester()
}
async function selectedAll(ev: any) {
  if (typeof study_plan_ids.value[0] == 'undefined') {
    students.value?.forEach(function (item) {
      let data = <string>item.id
      study_plan_ids.value.push(data)
    })
  } else {
    study_plan_ids.value = []
  }
}
const study_plan_id = ref('')
async function show(id: string) {
  mode.value = 'show'
  dialog.value = true
  study_plan_id.value = id
}
async function approve() {
  if (study_plan_ids.value.indexOf('all') > -1) {
    study_plan_ids.value.splice(study_plan_ids.value.indexOf('all'))
  }
  let ids = <string[]>[]
  for (let index = 0; index < study_plan_ids.value.length; index++) {
    ids.push(study_plan_ids.value[index])
  }
  data.value = <ApproveStudyPlanRequest>{
    study_plan_ids: ids,
    is_approved: true
  }
  try {
    const { response: responseAppove, error } = await approveStudyPlan(data.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (responseAppove != null) {
      if (responseAppove.meta.status == 200) {
        study_plan_ids.value = []
        data.value = <ApproveStudyPlanRequest>{}
        await getStudent()
      }
    }
  } catch (error) {
    alert(error)
    return false;
  }
}
watch(semesterId, async function (value) {
  if (value != '') {
    await getStudent()
  }
})
function MouseOver(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
  ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
onMounted(async () => {
  await getAdminStudyProgram()
})
</script>

<template>
  <div>
    <div v-if="mode == 'show'">
      <v-col cols="12" lg="8" md="6" class="text-right">
        <v-dialog v-model="dialog" max-width="1200">
          <PagesBackofficeStudyPlanDetail :studyPlanId="study_plan_id" />
        </v-dialog>
      </v-col>
    </div>
    <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
    <SharedUiParentCard :title="'Daftar ' + title">
      <v-row>
        <v-col cols="12" lg="6" md="6">
          <v-autocomplete v-model="studyProgramId" :items="studyPrograms" item-title="name" item-value="id"
            density="compact" :label="'Pilih Program Studi'" hide-details variant="outlined"
            @update:model-value="selectedProgramStudy" />
        </v-col>
        <v-col cols="12" lg="6" md="6">
          <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details :items="semesters"
            label="Pilih Semester">
            <template v-slot:selection="{ item }">
              <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
              }}</span>
            </template>
            <template v-slot:item="{ item, props: { onClick, title, value } }">
              <ul>
                <li style="padding: 10px; margin: 2px;">
                  <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)"
                    @mouseout="MouseOut($event)">
                    <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                    }}</span>
                  </a>
                </li>
              </ul>
            </template>
          </v-select>
          <!-- <v-autocomplete v-model="semesterId" :items="semesters" item-title="school_year" item-value="id" density="compact" :label="'Pilih Semester'" hide-details variant="outlined" @update:model-value="selectedSemester" /> -->
        </v-col>
      </v-row>
    </SharedUiParentCard>
    <v-table class="mt-10">
      <caption>Mahasiswa Yang Sudah Masuk Rencana Studi Sudah Submit</caption>
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">
            <v-checkbox v-model="study_plan_ids" :value="'all'" @click="selectedAll"></v-checkbox>
          </th>
          <th class="text-subtitle-1 font-weight-semibold">Nim</th>
          <th class="text-subtitle-1 font-weight-semibold">Angkatan</th>
          <th class="text-subtitle-1 font-weight-semibold">Nama</th>
          <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
          <th class="text-subtitle-1 font-weight-semibold">Jatah SKS</th>
          <th class="text-subtitle-1 font-weight-semibold">SKS Diambil</th>
          <th class="text-subtitle-1 font-weight-semibold">Status</th>
          <th class="text-subtitle-1 font-weight-semibold">KRS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in students">
          <td>
            <v-checkbox v-model="study_plan_ids" :value="item.study_plan_id"></v-checkbox>
          </td>
          <td>{{ item.nim_number }}</td>
          <td>{{ item.student_force }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.study_program_name }}</td>
          <td>{{ item.study_plan_maximum_credit }}</td>
          <td>{{ item.study_plan_total_mandatory_credit + item.study_plan_total_optional_credit }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.study_plan_is_approved ? 'Disetujui' : 'Belum' }}</td>
          <td>
            <v-btn color="primary" flat class="ml-auto" @click="show(item.study_plan_id)">
              <v-icon class="mr-2">
                mdi-eye
              </v-icon>Lihat
            </v-btn>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="students">
        <tr>
          <td colspan="10" class="text-center">
            <VBtn color="primary" flat class="ml-auto" @click="approve" :disabled="study_plan_ids.length == 0">
              <v-icon class="mr-2">
                mdi-arrow-collapse-right
              </v-icon>Setujui
            </VBtn>
          </td>
        </tr>
      </tfoot>
    </v-table>
</div></template>