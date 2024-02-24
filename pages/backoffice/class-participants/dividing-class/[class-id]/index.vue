<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetStudentClassParticipantData } from '~~/types/api/student-class/GetStudentClassParticipantList';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { reshuffleStudentClass } from '~~/composables/api/student-class/reshuffleStudentClass';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const title = ref('Detail Pembagian Kelas')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Pembagian Kelas',
    disabled: false,
    href: '/backoffice/class-participants/dividing-class'
  },
  {
    text: title,
    disabled: true,
    href: '#'
  }
])
interface Request{
  destination_class_id: string
  students: StudentRequest[]
}
interface StudentRequest{
  source_class_id: string
  student_id: string
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
const requests = ref(<Request[]>[])
const prepareStudent = ref(<PrepareStudentRequest[]>[])
const studentClassParticipants = ref<GetStudentClassParticipantData[]>([])
const classroomDetail = ref(<GetClassroomDetail>{})
const methodTypeClass = ref(0)
const studentIds = ref(<string[]>[])
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
  
  if((typeof router.currentRoute.value.query['type'] !== 'undefined') && router.currentRoute.value.query['type']){
    let type = Number(router.currentRoute.value.query['type'])
    switch (type) {
      case 1:
          methodTypeClass.value = 1
          prepareStudent.value.sort(function(a, b) {return ((a.student_nim_number % 2) - (b.student_nim_number % 2))})
        break;
      case 2:
          methodTypeClass.value = 2
          prepareStudent.value.sort(function(a, b) {return ((a.student_nim_number % 2) - (b.student_nim_number % 2))})
        break;
      case 3:
          methodTypeClass.value = 3
        break;
    }
  }
  if(methodTypeClass.value == 1){
    for (let index = 0; index < prepareClass.value.length; index++) {
      if(index == 0){
        let arr = <PrepareStudentRequest[]>[]
        for (let i = 0; i < prepareStudent.value.length; i++) {
          if(prepareStudent.value[i].student_nim_number % 2 === 1){
            let obj = <PrepareStudentRequest>{
              source_class_id: prepareStudent.value[i].source_class_id,
              student_id: prepareStudent.value[i].student_id,
              student_name: prepareStudent.value[i].student_name,
              student_nim_number: prepareStudent.value[i].student_nim_number,
              study_program_name: prepareStudent.value[i].study_program_name,
            }
            arr.push(obj)
          }
        }
        prepareClass.value[index].data = arr
      }
      if(index == 1){
        let arr = <PrepareStudentRequest[]>[]
        for (let i = 0; i < prepareStudent.value.length; i++) {
          if(prepareStudent.value[i].student_nim_number % 2 === 0){
            let obj = <PrepareStudentRequest>{
              source_class_id: prepareStudent.value[i].source_class_id,
              student_id: prepareStudent.value[i].student_id,
              student_name: prepareStudent.value[i].student_name,
              student_nim_number: prepareStudent.value[i].student_nim_number,
              study_program_name: prepareStudent.value[i].study_program_name,
            }
            arr.push(obj)
          }
        }
        prepareClass.value[index].data = arr
      }
    }
  }
  if(methodTypeClass.value == 2){
    for (let index = 0; index < prepareClass.value.length; index++) {
      if(index == 0){
        let arr = <PrepareStudentRequest[]>[]
        for (let i = 0; i < prepareStudent.value.length; i++) {
          if(prepareStudent.value[i].student_nim_number % 2 === 0){
            let obj = <PrepareStudentRequest>{
              source_class_id: prepareStudent.value[i].source_class_id,
              student_id: prepareStudent.value[i].student_id,
              student_name: prepareStudent.value[i].student_name,
              student_nim_number: prepareStudent.value[i].student_nim_number,
              study_program_name: prepareStudent.value[i].study_program_name,
            }
            arr.push(obj)
          }
        }
        prepareClass.value[index].data = arr
      }
      if(index == 1){
        let arr = <PrepareStudentRequest[]>[]
        for (let i = 0; i < prepareStudent.value.length; i++) {
          if(prepareStudent.value[i].student_nim_number % 2 === 1){
            let obj = <PrepareStudentRequest>{
              source_class_id: prepareStudent.value[i].source_class_id,
              student_id: prepareStudent.value[i].student_id,
              student_name: prepareStudent.value[i].student_name,
              student_nim_number: prepareStudent.value[i].student_nim_number,
              study_program_name: prepareStudent.value[i].study_program_name,
            }
            arr.push(obj)
          }
        }
        prepareClass.value[index].data = arr
      }
    }
  }
  if(methodTypeClass.value == 3){
    const classLength = ref(<any>[])
    let currentStudent = 0
    for (let j = 0; j < prepareStudent.value.length; j++) {
      for (let i = 0; i < prepareClass.value.length; i++) {

        var clasObj = prepareClass.value[i].class_id

        if (currentStudent == prepareStudent.value.length) {
          break
        }
        if (classLength.value[clasObj]) {
          classLength.value[clasObj]++
        } else {
          classLength.value[clasObj] = 1
        }
        currentStudent++
      }
    }
    /**
     * kelas
     * A [1]
     * B [2]
     * C [3]
     */

    let currentIndex = 0
    Object.keys(classLength.value).forEach(function (key) {
      for (let index = 0; index < prepareClass.value.length; index++) {
        var val = classLength.value[key];
        if(prepareClass.value[index].class_id == key){
          prepareClass.value[index].data = prepareStudent.value.slice(currentIndex, currentIndex + val)
          currentIndex += val
        }
      }
    });
  }
})
async function process(){
  requests.value = <Request[]>[]
  prepareClass.value.forEach(function(item){
    let students = <StudentRequest[]>[]
    for (let index = 0; index < item.data.length; index++) {
      if(studentIds.value.indexOf(item.data[index].student_id) > -1){
        students.push(<StudentRequest>{
          source_class_id: item.data[index].source_class_id,
          student_id: item.data[index].student_id,
        })
      }
    }
    requests.value.push(<Request>{
      destination_class_id: item.class_id,
      students: students,
    })
  })
  try {
    const { response: resp, error: error } = await reshuffleStudentClass(requests.value)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      let router = useRouter()
      router.push({path: '/backoffice/class-participants/dividing-class'})
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
        <v-checkbox v-model="studentIds" :value="'all'" @click="selectedAll"></v-checkbox>
      </v-col>
      <v-col cols="12" lg="12" md="12" v-for="item in prepareClass">
        <v-card class="mt-10" flat>
          <v-card-title>
            <h4>{{item.class_name}}</h4>
          </v-card-title>
          <v-card-title>
            <v-table class="mt-2">
              <thead>
                <tr>
                  <th class="text-subtitle-1 font-weight-semibold"></th>
                  <th class="text-subtitle-1 font-weight-semibold">No</th>
                  <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                  <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                  <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(itm, indx) in item.data">
                  <td><v-checkbox v-model="studentIds" :value="itm.student_id"></v-checkbox></td>
                  <td>{{ indx + 1 }}</td>
                  <td>{{ itm.student_nim_number }}</td>
                  <td>{{ itm.student_name }}</td>
                  <td>{{ itm.study_program_name }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" lg="12" md="12" class="text-center">
        <VBtn color="primary" flat class="ml-auto" @click="process" :disabled="studentIds.length == 0">
          <v-icon class="mr-2">
            mdi-arrow-collapse-right
          </v-icon>Proses
        </VBtn>
      </v-col>
    </div>
</template>