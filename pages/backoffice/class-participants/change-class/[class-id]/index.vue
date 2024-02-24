<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetStudentClassParticipantData } from "~~/types/api/student-class/GetStudentClassParticipantList";
import { TransferStudentClassRequest, TransferStudentClassDataRequest } from "~~/types/api/student-class/TransferStudentClassRequest";
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { transferStudentClass } from '~~/composables/api/student-class/transferStudentClass';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
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
const title = ref('Pindah Kelas')
const classId = ref('')
const destinationClassId = ref('')
const subjectId = ref('')
const classDetail = ref(<GetClassroomDetail>{})
const studyProgramId = ref('')
const semesterId = ref('')
const classBySubjects = ref<GetClassroomListData[]>([])
const studentClassParticipants = ref<GetStudentClassParticipantData[]>([])
const studentIds = ref(<string[]>[])
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
async function getDetail(id: string) {
    try {
        const { response: resp, error: error } = await getClassroomDetail(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
          classDetail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getClassroom(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getClassroomList(limit, page, search, studyProgramId.value, semesterId.value, true, subjectId.value, false)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
          classBySubjects.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getStudentClassParticipant(limit: number, page: number, search: string) {
  try {
    const { response: resp, error: error } = await getStudentClassParticipantList(limit, page, search, classId.value)
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

async function selectedAll(){
  if(!(studentIds.value.some(el => el === 'all'))){
    studentClassParticipants.value?.forEach(function(item){
      studentIds.value.push(item.student_id)
    })
  }else{
    studentIds.value = <string[]>[]
  }
}
async function process(){
  let index = studentIds.value.indexOf('all')
  if(index > 0){
    studentIds.value.splice(index)
  }
  let arr = ref(<TransferStudentClassDataRequest[]>[])
  for (let index = 0; index < studentIds.value.length; index++) {
    let obj = <TransferStudentClassDataRequest>{
      student_id: studentIds.value[index],
      destination_class_id: destinationClassId.value,
    }
    arr.value.push(obj)
  }
  let req = ref(<TransferStudentClassRequest>{
    source_class_id: classId.value,
    data: arr.value,
  })
  try {
    const { response: resp, error: error } = await transferStudentClass(req.value)
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
  await getDetail(classId.value)
  studyProgramId.value = classDetail.value.study_program_id
  semesterId.value = classDetail.value.semester_id
  subjectId.value = classDetail.value.subject_id
  await getClassroom(limit, page, '')
  await getStudentClassParticipant(limit, page, '')
})
</script>
<template>
    <div>
      <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
      <SharedUiParentCard :title="'Daftar '+title">
        <v-row>
          <v-col cols="12" lg="6" md="6">
            Dari : <span>{{ classDetail.name }}</span>
          </v-col>
          <v-col cols="12" lg="6" md="6">
            <v-autocomplete v-model="destinationClassId" :items="classBySubjects" item-title="name" item-value="id" density="compact" :label="'Pilih Kelas Tujuan'" hide-details variant="outlined" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="12" md="12" class="text-right">
            <nuxt-link :to="'/backoffice/class-participants/change-class'">
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
        <caption>Daftar Mahasiswa</caption>
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-semibold">
              <v-checkbox v-model="studentIds" :value="'all'" @click="selectedAll"></v-checkbox>
            </th>
            <th class="text-subtitle-1 font-weight-semibold">No</th>
            <th class="text-subtitle-1 font-weight-semibold">NIM</th>
            <th class="text-subtitle-1 font-weight-semibold">Nama</th>
            <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in studentClassParticipants">
            <td>
              <v-checkbox v-model="studentIds" :value="item.student_id"></v-checkbox>
            </td>
            <td>{{ index + 1 }}</td>
            <td>{{ item.student_nim_number }}</td>
            <td>{{ item.student_name }}</td>
            <td>{{ item.study_program_name }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="text-center">
              <VBtn color="primary" flat class="ml-auto" @click="process" :disabled="destinationClassId == '' || studentIds.length == 0">
                <v-icon class="mr-2">
                    mdi-arrow-collapse-right
                </v-icon>Proses
              </VBtn>
            </td>
          </tr>
        </tfoot>
      </v-table>
    </div>
</template>