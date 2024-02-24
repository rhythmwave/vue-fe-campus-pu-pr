<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetLectureListData } from '~~/types/api/lecture/GetLectureList';
import { BulkLecturePlanRequest } from '~~/types/api/lecture/BulkLecturePlan';
import { UpdateActualLecturePlanRequest, UpdateActualLecturePlanParticipant } from '~~/types/api/lecture/UpdateActualLecturePlan';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { GetStudentClassParticipantData } from '~~/types/api/student-class/GetStudentClassParticipantList';
import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { getLectureList } from '~~/composables/api/lecture/getLectureList';
import { bulkLecture } from '~~/composables/api/lecture/bulkLecture';
import { updateActualLecturePlan } from '~~/composables/api/lecture/updateActualLecturePlan';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned, formatYearMonthDate } from '~~/utils/helpers/date-utils';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Edit Presensi')
const lectures = ref(<GetLectureListData[]>[])
const actualLectures = ref(<GetLectureListData[]>[])
const bulkLecturePlans = ref(<BulkLecturePlanRequest>{})
const lecture_plan_length = ref(0)
const lecture_plan_dates = ref(<string[]>[])
const classId = ref('')
const detail_classroom = ref(<GetClassroomDetail>{})
const editData = ref(<GetLectureListData>{})
const studentClassParticipants = ref(<GetStudentClassParticipantData[]>[])
const studentIds = ref(<string[]>[])
const editPresences = ref(<UpdateActualLecturePlanParticipant[]>[])
const lecture_theme = ref('')
const lecture_subject = ref('')
const remarks = ref('')
const lecture_actual_date = ref('')
const presences = ref(<UpdateActualLecturePlanParticipant[]>[
  { student_id: '', name: 'Hadir', is_attend: true, is_sick: false, is_leave: false, is_awol: false },
  { student_id: '', name: 'Sakit', is_attend: false, is_sick: true, is_leave: false, is_awol: false },
  { student_id: '', name: 'Izin', is_attend: false, is_sick: false, is_leave: true, is_awol: false },
  { student_id: '', name: 'Alpa', is_attend: false, is_sick: false, is_leave: false, is_awol: true },
])
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
async function getLecture(limit: number, page: number, class_id: string) {
  try {
    const { response: resp, error: error } = await getLectureList(limit, page, class_id, false, false, "")
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      lectures.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getLectureActual(limit: number, page: number, class_id: string) {
  try {
    const { response: resp, error: error } = await getLectureList(limit, page, class_id, true, false, "")
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      actualLectures.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function detailClassroom(class_id: string) {
  try {
    const { response: resp, error: error } = await getClassroomDetail(class_id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      detail_classroom.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
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
async function edit(item: any) {
  mode.value = 'edit'
  dialog.value = true
  editData.value = item
}
async function close() {
  dialog.value = false
}
async function selectedAll() {
  if (!(studentIds.value.some(el => el === 'all'))) {
    studentClassParticipants.value?.forEach(function (item) {
      studentIds.value.push(item.student_id)
    })
  } else {
    studentIds.value = <string[]>[]
  }
}
async function save() {
  if (studentIds.value.some(el => el === 'all')) {
    studentIds.value.splice(studentIds.value.indexOf('all', 1))
  }

  if (editPresences.value.length != studentIds.value.length) {
    alert('Kehadiran Harap Semuanya Diisi')
    return false
  }
  let participants = <UpdateActualLecturePlanParticipant[]>[]
  for (let i = 0; i < studentIds.value.length; i++) {
    for (let j = 0; j < editPresences.value.length; j++) {
      if (i == j) {
        participants.push(<UpdateActualLecturePlanParticipant>{
          name: editPresences.value[j].name,
          student_id: studentIds.value[i],
          is_attend: editPresences.value[j].is_attend,
          is_sick: editPresences.value[j].is_sick,
          is_leave: editPresences.value[j].is_leave,
          is_awol: editPresences.value[j].is_awol,
        })
      }
    }
  }
  let req = <UpdateActualLecturePlanRequest>{
    id: editData.value.id,
    lecture_theme: lecture_theme.value,
    lecture_subject: lecture_subject.value,
    remarks: remarks.value,
    participants: participants,
    lecture_actual_date: lecture_actual_date.value,
  }
  try {
    const { response: createRoleResponse, error } = await updateActualLecturePlan(req)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    } else {
      await getLecture(limit, page, classId.value)
      await getLectureActual(limit, page, classId.value)
      close()
    }
  } catch (error) {
    alert(error)
  }
}
onMounted(async () => {
  classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
  await getLecture(limit, page, classId.value)
  await getLectureActual(limit, page, classId.value)
  await detailClassroom(classId.value)
  getStudentClassParticipants(limit, page, '', classId.value)
})
</script>
<template>
  <div>
    <div v-if="mode == 'edit'">
      <v-col cols="12" lg="12" md="12">
        <v-dialog v-model="dialog" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Ubah Rencana Tatap Muka</span>
            </v-card-title>
            <v-card-text>
              <Vspace space="3" />
              <v-form ref="form" lazy-validation>
                <v-row>
                  <v-checkbox v-model="studentIds" :value="'all'" @click="selectedAll"></v-checkbox>
                  <v-col cols="12" sm="12" v-for="(item, index) in studentClassParticipants">
                    <v-col cols="12" sm="6" class="float-left">
                      <v-checkbox v-model="studentIds" :value="item.student_id" :label="item.student_name" hide-details
                        variant="outlined"></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6" class="float-left">
                      <v-select :items="presences" v-model="editPresences[index]" item-title="name" hide-details
                        variant="outlined" return-object default></v-select>
                    </v-col>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-textarea v-model="lecture_theme" hide-details variant="outlined" label="Tema"></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-textarea v-model="lecture_subject" hide-details variant="outlined"
                      label="Pokok Bahasan"></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-textarea v-model="remarks" hide-details variant="outlined" label="Catatan"></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="date" v-model="lecture_actual_date" hide-details variant="outlined"
                      label="Tanggal Terlaksana"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-card-actions class="pa-4">
                      <v-spacer />
                      <v-btn color="error" @click="close">
                        Batal
                      </v-btn>
                      <v-btn color="secondary" @click="save()">
                        Ubah
                      </v-btn>
                    </v-card-actions>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </div>
    <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
    <SharedUiParentCard :title="'Daftar ' + title">
      <v-row>
        <v-col cols="12" lg="12" md="12">
          <v-table class="mt-10">
            <thead>
              <tr>
                <th colspan="2" class="text-subtitle-1 font-weight-semibold">Data Kelas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="300">Nama Kelas :</td>
                <td>{{ detail_classroom.name }}</td>
              </tr>
              <tr>
                <td width="300">Kurikulum :</td>
                <td>{{ detail_classroom.curriculum_name }}</td>
              </tr>
              <tr>
                <td width="300">Program Studi :</td>
                <td>{{ detail_classroom.study_program_name }}</td>
              </tr>
              <tr>
                <td width="300">Dosen :</td>
                <td>
                  <ul>
                    <li v-for="item in detail_classroom.lecturers">{{ item.front_title }} {{ item.name }} {{
                      item.back_degree }}</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
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
      <caption>Daftar Rencana Tatap Muka</caption>
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal Rencana</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal Terlaksana</th>
          <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
        </tr>
      </thead>
      <tr v-for="(item, index) in lectures">
        <td>{{ index + 1 }}</td>
        <td>{{ item.lecture_plan_date ? formatYearMonthDate(item.lecture_plan_date) : '' }}</td>
        <td>{{ item.lecture_actual_date ? formatYearMonthDate(item.lecture_actual_date) : '' }}</td>
        <td>
          <v-tooltip text="Edit">
            <template #activator="{ props }">
              <v-btn icon flat v-bind="props" @click="edit(item)">
                <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
              </v-btn>
            </template>
          </v-tooltip>
          <!-- <v-tooltip text="Delete">
              <template #activator="{ props }">
                <v-btn icon flat v-bind="props">
                  <TrashIcon stroke-width="1.5" size="20" class="text-primary" />
                </v-btn>
              </template>
            </v-tooltip> -->
        </td>
      </tr>
    </v-table>
    <v-table class="mt-10">
      <caption>Daftar Terlaksana Tatap Muka</caption>
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal Rencana</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal Terlaksana</th>
          <!-- <th class="text-subtitle-1 font-weight-semibold">Aksi</th> -->
        </tr>
      </thead>
      <tr v-for="(item, index) in actualLectures">
        <td>{{ index + 1 }}</td>
        <td>{{ item.lecture_plan_date ? formatYearMonthDate(item.lecture_plan_date) : '' }}</td>
        <td>{{ item.lecture_actual_date ? formatYearMonthDate(item.lecture_actual_date) : '' }}</td>
        <!-- <td>
            <v-tooltip text="Edit">
              <template #activator="{ props }">
                <v-btn icon flat v-bind="props" @click="edit(item)">
                  <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                </v-btn>
              </template>
            </v-tooltip>
          </td> -->
      </tr>
    </v-table>
  </div>
</template>