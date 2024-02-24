<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetLectureListData } from '~~/types/api/lecture/GetLectureList';
import { CreateScheduleRequest, CreateScheduleLecturePlanRequest, CreateScheduleExamSupervisorsRequest } from '~~/types/api/schedule/CreateScheduleRequest';
import { UpdateActualLecturePlanRequest } from '~~/types/api/lecture/UpdateActualLecturePlan';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { getLectureList } from '~~/composables/api/lecture/getLectureList';
import { createSchedule } from '~~/composables/api/schedule/createSchedule';
import { deleteLecture } from '~~/composables/api/lecture/deleteLecture';
import { updateActualLecturePlan } from '~~/composables/api/lecture/updateActualLecturePlan';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned, formatYearMonthDate, convertStringTimeToNumberTime } from '~~/utils/helpers/date-utils';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { convertNumberTime } from '~~/utils/helpers/convert-number-time';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Rencana Tatap Muka')
const lectures = ref(<GetLectureListData[]>[])
const actualLectures = ref(<GetLectureListData[]>[])
const bulkLecturePlans = ref(<CreateScheduleRequest>{})
const lecture_plan_length = ref(0)
const lecture_plan_dates = ref(<string[]>[])
const classId = ref('')
const meeting_start = ref(0)
const detail_classroom = ref(<GetClassroomDetail>{})
const editData = ref(<GetLectureListData>{})
const cancelData = ref(<GetLectureListData>{})
const delete_id = ref('')
const lecture_plan_start_time = ref('')
const lecture_plan_end_time = ref('')
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
async function addLecturePlan() {
  lecture_plan_length.value += 1
}
async function deleteLecturePlan() {
  lecture_plan_length.value -= 1
}
async function lecturerOnChange(item: string, index: number) {
  lecture_plan_dates.value[index] = item
}
async function save() {
  bulkLecturePlans.value = <CreateScheduleRequest>{
    class_id: classId.value,
    lecture_plans: <CreateScheduleLecturePlanRequest[]>[<CreateScheduleLecturePlanRequest>{
      lecture_plan_date: '',
      lecture_plan_start_time: 0,
      lecture_plan_end_time: 0,
      room_id: '',
      lecturer_id: '',
      is_exam: false,
      is_theory_exam: false,
      is_practicum_exam: false,
      is_field_practicum_exam: false,
      is_midterm_exam: false,
      is_endterm_exam: false,
      exam_supervisors: <CreateScheduleExamSupervisorsRequest[]>[]
    }],
  }
  try {
    const { response: createRoleResponse, error } = await createSchedule(bulkLecturePlans.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    } else {
      await getLecture(limit, page, classId.value)
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
async function update() {
  try {
    let req = <UpdateActualLecturePlanRequest>{
      id: editData.value.id,
      lecture_actual_date: editData.value.lecture_actual_date,
    }
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
function cancelStudyPlan(item: GetLectureListData){
  delete_id.value = item.id
  cancelData.value = <GetLectureListData>{
    id: item.id,
    lecture_plan_date: '',
    lecture_plan_day_of_week: item.lecture_plan_day_of_week,
    lecture_plan_start_time: 0,
    lecture_plan_end_time: 0,
    lecture_actual_date: item.lecture_actual_date,
    lecture_actual_day_of_week: item.lecture_actual_day_of_week,
    lecture_actual_start_time: item.lecture_actual_start_time,
    lecture_actual_end_time: item.lecture_actual_end_time,
    lecturer_id: item.lecturer_id,
    lecturer_name: item.lecturer_name,
    foreign_lecturer_name: item.foreign_lecturer_name,
    foreign_lecturer_source_instance: item.foreign_lecturer_source_instance,
    is_original_lecturer: item.is_original_lecturer,
    class_id: item.class_id,
    class_name: item.class_name,
    room_id: item.room_id,
    room_name: item.room_name,
    is_midterm_exam: item.is_midterm_exam,
    is_endterm_exam: item.is_endterm_exam,
    is_theory_exam: item.is_theory_exam,
    is_practicum_exam: item.is_practicum_exam,
    is_field_practicum_exam: item.is_field_practicum_exam,
    exam_supervisors: item.exam_supervisors,
    subject_name: item.subject_name,
    subject_code: item.subject_code,
    total_participant: item.total_participant,
  }
  mode.value = 'cancel'
  dialog.value = true
}
async function cancelLecturePlan(){
  try {
    // delete
    const { response: Response, error } = await deleteLecture(delete_id.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    } else {
      close()
    }
  } catch (error) {
    alert(error)
  }
  try {
    // save
    let exam_supervisors = <CreateScheduleExamSupervisorsRequest[]>[]
    if(cancelData.value.exam_supervisors.length > 0){
      for (let index = 0; index < cancelData.value.exam_supervisors.length; index++) {
        const element = cancelData.value.exam_supervisors[index];
        exam_supervisors.push(<CreateScheduleExamSupervisorsRequest>{
          exam_supervisor_id: element.id,
          exam_supervisor_name: element.name,
          exam_supervisor_role_id: element.exam_supervisor_role_id,
          exam_supervisor_role_name: element.exam_supervisor_role_name,
        })
      }
    }
    let req = <CreateScheduleRequest>{
      class_id: classId.value,
      lecture_plans: <CreateScheduleLecturePlanRequest[]>[<CreateScheduleLecturePlanRequest>{
      lecture_plan_date: cancelData.value.lecture_plan_date ? convertDateWithoutTimeToTimezoned(cancelData.value.lecture_plan_date) : '',
      lecture_plan_start_time: convertStringTimeToNumberTime(lecture_plan_start_time.value),
      lecture_plan_end_time: convertStringTimeToNumberTime(lecture_plan_end_time.value),
      room_id: cancelData.value.room_id,
      lecturer_id: cancelData.value.lecturer_id,
      is_exam: false,
      is_theory_exam: false,
      is_practicum_exam: false,
      is_field_practicum_exam: false,
      is_midterm_exam: false,
      is_endterm_exam: false,
      exam_supervisors: exam_supervisors,
    }],
    }
    const { response: Response, error } = await createSchedule(req)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    } else {
      close()
    }
  } catch (error) {
    alert(error)
  }
  await getLecture(limit, page, classId.value)
  await getLectureActual(limit, page, classId.value)
}

watch(lectures, async function (value) {
  meeting_start.value = value.length
})
onMounted(async () => {
  classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
  await getLecture(limit, page, classId.value)
  await getLectureActual(limit, page, classId.value)
  await detailClassroom(classId.value)
  meeting_start.value = lectures.value.length
})
</script>
<template>
  <div>
    <div v-if="mode == 'cancel'">
      <v-col cols="12" lg="12" md="12">
        <v-dialog v-model="dialog" max-width="800">
          <v-card>
            <v-card-title class="pa-4 bg-secondary">
              <span class="title text-white">Batalkan dan Ganti Tatap Muka</span>
            </v-card-title>
            <v-card-text>
              <Vspace space="3" />
              <v-form ref="form" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field type="date" variant="outlined" hide-details v-model="cancelData.lecture_plan_date" :label="'Rencana Tatap Muka'" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="time" variant="outlined" hide-details v-model="lecture_plan_start_time" :label="'Dari Jam'" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="time" variant="outlined" hide-details v-model="lecture_plan_end_time" :label="'Sampai Jam'" />
                  </v-col>
                  <v-col cols="12">
                    <v-card-actions class="pa-4">
                      <v-spacer />
                      <v-btn color="error" @click="close">
                        Batal
                      </v-btn>
                      <v-btn color="secondary" @click="cancelLecturePlan()" :disabled="typeof cancelData.lecture_plan_date == 'undefined' || cancelData.lecture_plan_date == '' || lecture_plan_start_time == '' || lecture_plan_end_time == ''">
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
    <!-- <div v-if="mode == 'edit'">
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
                  <v-col cols="12" sm="12">
                    <v-text-field type="date" variant="outlined" hide-details
                      :value="formatYearMonthDate(editData.lecture_plan_date)" :label="'Rencana Tatap Muka'" />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field type="date" v-model="editData.lecture_actual_date" variant="outlined" hide-details
                      :label="'Terlaksana Tatap Muka'" />
                  </v-col>
                  <v-col cols="12">
                    <v-card-actions class="pa-4">
                      <v-spacer />
                      <v-btn color="error" @click="close">
                        Batal
                      </v-btn>
                      <v-btn color="secondary" @click="update()">
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
    </div> -->
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
      <tr v-for="(item, index) in actualLectures">
        <td>{{ index + 1 }}</td>
        <td>{{ item.lecture_plan_date ? formatYearMonthDate(item.lecture_plan_date) : '' }} ( Jam : {{ convertTimeNumberToString(item.lecture_plan_start_time) }} - {{ convertTimeNumberToString(item.lecture_plan_end_time) }})</td>
        <td>{{ item.lecture_actual_date ? formatYearMonthDate(item.lecture_actual_date) : '' }}</td>
        <td>
          <!-- <v-tooltip text="Edit">
            <template #activator="{ props }">
              <v-btn icon flat v-bind="props" @click="edit(item)">
                <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
              </v-btn>
            </template>
          </v-tooltip> -->
          <v-tooltip text="Batal">
            <template #activator="{ props }">
              <v-btn flat v-bind="props" color="error" class="mt-2 ml-2" @click="cancelStudyPlan(item)">
                batal
                <!-- <TrashIcon stroke-width="1.5" size="20" class="text-primary" /> -->
              </v-btn>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </v-table>
    <!-- <v-table class="mt-10">
      <caption>Daftar Terlaksana Tatap Muka</caption>
      <thead>
        <tr>
          <th class="text-subtitle-1 font-weight-semibold">No</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal Rencana</th>
          <th class="text-subtitle-1 font-weight-semibold">Tanggal Terlaksana</th>
        </tr>
      </thead>
      <tr v-for="(item, index) in actualLectures">
        <td>{{ index + 1 }}</td>
        <td>{{ item.lecture_plan_date ? formatYearMonthDate(item.lecture_plan_date) : '' }}</td>
        <td>{{ item.lecture_actual_date ? formatYearMonthDate(item.lecture_actual_date) : '' }}</td>
        <td v-if="item.lecture_actual_date == ''">
          <v-tooltip text="Edit">
            <template #activator="{ props }">
              <v-btn icon flat v-bind="props" @click="edit(item)">
                <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Batal">
            <template #activator="{ props }">
              <v-btn icon flat v-bind="props">
                <TrashIcon stroke-width="1.5" size="20" class="text-primary" />
              </v-btn>
            </template>
          </v-tooltip>
        </td>
      </tr>
    </v-table> -->
    <!-- <v-card class="mt-10" solo flat>
      <v-card-title class="pa-4 bg-secondary">
        <v-col cols="12" lg="6" md="6" class="float-left">
          <span class="title text-white">Tambah Rencana Tatap Muka</span>
        </v-col>
        <v-col cols="12" lg="6" md="6" class="float-left text-right">
          <v-btn icon flat @click="addLecturePlan">
            <PlusIcon stroke-width="1.5" size="20" class="text-primary" />
          </v-btn>
        </v-col>
      </v-card-title>
      <v-card-text>
        <Vspace space="5" />
        <v-form ref="form" lazy-validation>
          <v-row v-for="item in lecture_plan_length">
            <v-col cols="12" sm="12">
              <v-col cols="6" sm="4" class="float-left">
                <label for="">Pertemuan {{ meeting_start + item }}</label>
              </v-col>
              <v-col cols="6" sm="6" class="float-left">
                <v-text-field type="date" variant="outlined" hide-details label="Tanggal Tatap Muka"
                  @update:model-value="(sl: string) => lecturerOnChange(sl, (item - 1))" />
              </v-col>
              <v-col cols="6" sm="2" class="float-left">
                <v-btn icon flat @click="deleteLecturePlan">
                  <TrashIcon stroke-width="1.5" size="20" class="text-primary" />
                </v-btn>
              </v-col>
            </v-col>
          </v-row>
          <v-col cols="12">
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn color="secondary" :disabled="lecture_plan_dates.length == 0" @click="save();">
                Tambah
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-form>
      </v-card-text>
    </v-card> -->
  </div>
</template>