<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetStudentClassParticipantData } from '~~/types/api/student-class/GetStudentClassParticipantList';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { GetSubjectGradeComponentListData } from '~~/types/api/grade-component/GetSubjectGradeComponentList';
import { GetGradeTypeListData } from '~~/types/api/grade-type/GetGradeTypeList';
import { BulkGradeStudentClassRequest, StudentRequest, GradeRequest } from '~~/types/api/student-class/BulkGradeStudentClass';
import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { getGradeTypeList } from '~~/composables/api/grade-type/getGradeTypeList';
import { bulkGradeStudentClass } from '~~/composables/api/student-class/bulkGradeStudentClass';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { getSubjectGradeComponentList } from '~~/composables/api/grade-component/getSubjectGradeComponentList';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';
import moment from 'moment';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Proses Input Nilai Per Kelas')
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
const classId = ref('')
const subjectId = ref('')
const studyLevelId = ref('')
const classDetail = ref(<GetClassroomDetail>{})
const subjectGradeComponents = ref(<GetSubjectGradeComponentListData[]>[])
const classParticipants = ref<GetStudentClassParticipantData[]>([])
const inputSubjectGradeComponent = ref(<number[]>[])
const outputSubjectGradeComponent = ref(<number[]>[])
const absoluteValue = ref(<number[]>[])
const realtiveValue = ref(<string[]>[])
const subjectGradeComponentId = ref(<string[]>[])
const gradeTypes = ref(<GetGradeTypeListData[]>[])
const sliceAbsolute = ref(<startEnd[]>[])
interface startEnd {
  start: number
  end: number
}
async function classroomDetail(id: string) {
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
async function getSubjectGradeComponent(id: string) {
  try {
    const { response: resp, error: error } = await getSubjectGradeComponentList(id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      subjectGradeComponents.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function getClassParticipant(limit: number, page: number, search: string, class_id: string) {
    try {
        const { response: resp, error: error } = await getStudentClassParticipantList(limit, page, search, class_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classParticipants.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getGradeType(limit: number, page: number, search: string, study_level_id: string) {
    try {
        const { response: resp, error: error } = await getGradeTypeList(limit, page, search, study_level_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
          gradeTypes.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function save(){
  let students = <StudentRequest[]>[]
  let grades = <GradeRequest[]>[]
  subjectGradeComponentId.value.forEach(function(itm, indx){
    grades.push(<GradeRequest>{
      subject_grade_component_id: itm,
      initial_grade: Number(inputSubjectGradeComponent.value[indx]),
    })
  })
  classParticipants.value.forEach(function(item, index){
    students.push(<StudentRequest>{
      student_id: item.student_id,
      grades: grades.slice(sliceAbsolute.value[index].start, sliceAbsolute.value[index].end)
    })
  })
  let req = <BulkGradeStudentClassRequest>{
    class_id: classId.value,
    students: students,
  }
  try {
    const { response: createRoleResponse, error } = await bulkGradeStudentClass(req)
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    } else {
      let router = useRouter()
      router.push('/backoffice/input-value/input-value-per-class/'+classId.value)
      // emit('reload');
    }
  } catch (error) {
    alert(error)
  }
}
watch(inputSubjectGradeComponent.value, async function(item){
  for (let i = 0; i < item.length; i++) {
    if(item[i] >= 100){
      item[i] = 100
    }
    subjectGradeComponents.value.forEach(function(itm, indx){
      outputSubjectGradeComponent.value[i] = (item[i]* Number(itm.percentage)) / 100
    })
  }
})
watch(outputSubjectGradeComponent.value, async function(item){
  let limit = classParticipants.value.length * subjectGradeComponents.value.length
  let start = 0
  let end = 0
  let data = <startEnd[]>[]
  for (let i = 0; i < item.length; i++) {
    end += subjectGradeComponents.value.length
    data.push(<startEnd>{
      start: start,
      end: end
    })
    start = end
    if(end >= limit){
      break;
    }
  }
  sliceAbsolute.value = data
  for (let index = 0; index < data.length; index++) {
    let result = item.slice(data[index].start, data[index].end).reduce((partialSum, a) => partialSum + a, 0)
    absoluteValue.value[index] = result
    gradeTypes.value.sort(function(a, b){
      return a.maximum_grade + b.maximum_grade;
    })
    gradeTypes.value.forEach(function(item){
      if(item.minimum_grade <= result && item.maximum_grade > result){
        realtiveValue.value[index] = item.grade_category
      }
    })
  }
})

onMounted(async () => {
  classId.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
  let params = window.location.href.split('/')[window.location.href.split('/').length - 1].replace('input?', '')
  subjectId.value = params.split('&')[0].replace('subject_id=', '')
  studyLevelId.value = params.split('&')[1].replace('study_level_id=', '')
  await classroomDetail(classId.value)
  await getSubjectGradeComponent(subjectId.value)
  await getClassParticipant(limit, page, '', classId.value)
  await getGradeType(limit, page, '', studyLevelId.value)
  classParticipants.value.forEach(function(item, index){
    if(item.grades.length > 0){
      item.grades.forEach(function(itm, indx){
        inputSubjectGradeComponent.value.push(itm.initial_grade)
        subjectGradeComponentId.value.push(itm.subject_grade_component_id)
      })
    }else{
      subjectGradeComponents.value.forEach(function(itm, indx){
        if(!itm.name.match(/kehadiran/i)){
          inputSubjectGradeComponent.value.push(0)
        }else{
          inputSubjectGradeComponent.value.push(item.attendance_percentage)
        }
        subjectGradeComponentId.value.push(itm.id)
      })
    }
  })
})
</script>
<template>
    <div>
      <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
      <v-row>
        <v-col cols="12">
          <UiParentCard :title="title">
            <v-row>
              <v-col cols="12" lg="12" md="12" class="text-left">
                <v-table>
                  <thead>
                    <tr>
                      <th colspan="2" class="text-subtitle-1 font-weight-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Program Studi</td>
                      <td>{{ classDetail.study_program_name }}</td>
                    </tr>
                    <tr>
                      <td>Semester</td>
                      <td>{{ classDetail.semester_start_year }} - {{ classDetail.semester_type }}</td>
                    </tr>
                    <tr>
                      <td>Kode</td>
                      <td>{{ classDetail.subject_code }}</td>
                    </tr>
                    <tr>
                      <td>Nama</td>
                      <td>{{ classDetail.subject_name }}</td>
                    </tr>
                    <tr>
                      <td>Kelas</td>
                      <td>{{ classDetail.name }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
              <v-col cols="12" lg="12" md="12" class="text-right">
                <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/input-value/input-value-per-class/'+classDetail.id">
                  <v-btn color="warning" flat class="ml-auto">
                    <v-Icon class="mr-2">
                      mdi-keyboard-backspace
                    </v-Icon>Kembali
                  </v-btn>
                </nuxt-Link>
              </v-col>
            </v-row>
          </UiParentCard>
        </v-col>
      </v-row>
      <v-table class="mt-5">
        <caption>Keterangan Komponen Bobot Nilai Akhir</caption>
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-semibold">No</th>
            <th class="text-subtitle-1 font-weight-semibold">Nama</th>
            <th class="text-subtitle-1 font-weight-semibold">Persentase</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in subjectGradeComponents">
            <td>{{ index +  1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.percentage }} %</td>
          </tr>
        </tbody>
      </v-table>
      <v-table class="mt-5">
        <caption>Peserta Kelas</caption>
        <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-semibold">No</th>
            <th class="text-subtitle-1 font-weight-semibold">NIM</th>
            <th class="text-subtitle-1 font-weight-semibold">Nama</th>
            <th :colspan="subjectGradeComponents.length" class="text-subtitle-1 font-weight-semibold text-center">Nilai Awal</th>
            <th :colspan="subjectGradeComponents.length" class="text-subtitle-1 font-weight-semibold text-center">Nilai Akhir</th>
            <th class="text-subtitle-1 font-weight-semibold text-center">Nilai Absolut</th>
            <th class="text-subtitle-1 font-weight-semibold text-center">Nilai Relatif</th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th style="min-width: 150px;" v-for="(item, index) in subjectGradeComponents">{{ item.name }}</th>
            <th style="min-width: 150px;" v-for="(item, index) in subjectGradeComponents">{{ item.name }}</th>
            <th style="min-width: 150px;"></th>
            <th style="min-width: 150px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in classParticipants">
            <td>{{ index +  1 }}</td>
            <td>{{ item.student_nim_number }}</td>
            <td>{{ item.student_name }}</td>
            <td v-for="(itm, indx) in subjectGradeComponents">
              <v-text-field type="number" v-model="inputSubjectGradeComponent[(subjectGradeComponents.length * index) + indx]" class="mt-1" variant="outlined" hide-details></v-text-field>
            </td>
            <td class="text-center" v-for="(itm, indx) in subjectGradeComponents">
              <v-text-field :value="(outputSubjectGradeComponent[(subjectGradeComponents.length * index) + indx])" class="mt-1 mb-1" variant="outlined" hide-details :readonly="true"></v-text-field>
            </td>
            <td class="text-center">
              <v-text-field :value="absoluteValue[index]" class="mt-1 mb-1" variant="outlined" hide-details :readonly="true"></v-text-field>
            </td>
            <td class="text-center">
              <v-text-field :value="realtiveValue[index]" class="mt-1 mb-1" variant="outlined" hide-details :readonly="true"></v-text-field>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="text-right">
            <td colspan="15">
              <v-btn color="primary" flat class="ml-auto" @click="save" :disabled="realtiveValue.length != classParticipants.length">
                <v-Icon class="mr-2">
                  mdi-content-save
                </v-Icon>Simpan
              </v-btn>
            </td>
          </tr>
        </tfoot>
      </v-table>
    </div>
</template>