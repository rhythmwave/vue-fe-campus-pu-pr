<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetStudentClassParticipantData } from '~~/types/api/student-class/GetStudentClassParticipantList';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { mergeStudentClass } from '~~/composables/api/student-class/mergeStudentClass';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const title = ref('Detail Gabung Kelas')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Pembagian Kelas',
    disabled: false,
    href: '/backoffice/class-participants/join-class'
  },
  {
    text: title,
    disabled: true,
    href: '#'
  }
])
interface Request{
  destination_class_id: string
  source_class_ids: string[]
}
interface PrepareStudentRequest{
  source_class_id: string
  student_id: string
  student_name: string
  student_nim_number: number
  study_program_name: string
}
interface PrepareClass{
  class_id: string
  class_name: string
  data: PrepareStudentRequest[]
}
const prepareClass = ref(<PrepareClass[]>[])
let router = useRouter()
const requests = ref(<Request>{})
const prepareStudent = ref(<PrepareStudentRequest[]>[])
const studentClassParticipants = ref<GetStudentClassParticipantData[]>([])
const classroomDetail = ref(<GetClassroomDetail>{})
const studentIds = ref(<string[]>[])
const destinationClassId = ref('')
async function getDetailClass(id: string) {
  try {
    const { response: resp, error: error } = await getClassroomDetail(id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      classroomDetail.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getStudentClassParticipant(limit: number, page: number, search: string, class_id: string) {
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
async function selectedAll(){
  if(!(studentIds.value.some(el => el === 'all'))){
    prepareClass.value?.forEach(function(item){
      item.data.forEach(function(itm){
        studentIds.value.push(itm.student_id)
      })
    })
  }else{
    studentIds.value = <string[]>[]
  }
}
onMounted(async () => {
  if((typeof router.currentRoute.value.query['class_id'] !== 'undefined') && router.currentRoute.value.query['class_id']){
    let params = router.currentRoute.value.query['class_id']
    for (let index = 0; index < params.length; index++) {
      await getDetailClass(<string>params[index]);
      let Object = <PrepareClass>{
        class_id: classroomDetail.value.id,
        class_name: classroomDetail.value.name,
      }
      prepareClass.value.push(Object)
    }
  }
  for (let index = 0; index < prepareClass.value.length; index++) {
    await getStudentClassParticipant(1000, 1, '', prepareClass.value[index].class_id)
    let classId = prepareClass.value[index].class_id
    for (let index = 0; index < studentClassParticipants.value.length; index++) {
      let studentRequest = <PrepareStudentRequest>{
        student_id: studentClassParticipants.value[index].student_id,
        student_name: studentClassParticipants.value[index].student_name,
        student_nim_number: studentClassParticipants.value[index].student_nim_number,
        study_program_name: studentClassParticipants.value[index].study_program_name,
        source_class_id: classId,
      }
      prepareStudent.value.push(studentRequest)
    }
  }
  prepareStudent.value.sort(
    function(a, b) {
      return a.student_nim_number - b.student_nim_number;
    }
  )
  prepareStudent.value.sort(
    function(a, b) {
      return ((a.student_nim_number % 2) - (b.student_nim_number % 2));
    }
  )
})
async function process(){
  let sourceIds = <string[]>[]
  prepareClass.value.forEach(function(item){
    sourceIds.push(item.class_id)
  })
  requests.value = <Request>{
    destination_class_id: destinationClassId.value,
    source_class_ids: sourceIds,
  }
  try {
    const { response: resp, error: error } = await mergeStudentClass(requests.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      let router = useRouter()
      router.push({path: '/backoffice/class-participants/join-class'})
    }
  } catch (error) {
    alert(error)
  }
}
</script>

<template>
    <div>
      <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
      <SharedUiParentCard :title="'Daftar '+title">
        <v-row>
          <v-col cols="12" lg="12" md="12" class="text-right">
            <v-col cols="12" lg="6" md="6">
                <v-autocomplete v-model="destinationClassId" :items="prepareClass" item-title="class_name" item-value="class_id" density="compact" :label="'Pilih Kelas Tujuan'" hide-details variant="outlined" />
            </v-col>
            <nuxt-link :to="'/backoffice/class-participants/dividing-class'">
              <v-btn color="error" flat class="ml-auto">
                <v-icon class="mr-2">
                  mdi-arrow-collapse-left
                </v-icon>Kembali
              </v-btn>
            </nuxt-link>
          </v-col>
        </v-row>
      </SharedUiParentCard>
      <v-col cols="12" lg="12" md="12">
        <v-card class="mt-10" flat>
          <v-card-title>
            <h4>Daftar Peserta Kelas</h4>
          </v-card-title>
          <v-card-title>
            <v-table class="mt-2">
              <thead>
                <tr>
                  <th class="text-subtitle-1 font-weight-semibold">No</th>
                  <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                  <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                  <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in prepareStudent">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.student_nim_number }}</td>
                  <td>{{ item.student_name }}</td>
                  <td>{{ item.study_program_name }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" lg="12" md="12" class="text-center">
        <VBtn color="primary" flat class="ml-auto" @click="process" :disabled="destinationClassId == ''">
          <v-icon class="mr-2">
            mdi-arrow-collapse-right
          </v-icon>Proses
        </VBtn>
      </v-col>
    </div>
</template>