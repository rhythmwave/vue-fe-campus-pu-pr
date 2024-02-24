<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { GetLecturerClassDetailData } from '~~/types/api/lecturer-class/GetLecturerClassDetail';
import { BulkGradeStudentClassRequest, StudentRequest, GradeRequest } from '~~/types/api/lecturer-class/BulkGradeStudentClass';
import { getLecturerClassDetail } from '~~/composables/api/lecturer-class/getLecturerClassDetail';
import { bulkGradeStudentClass } from '~~/composables/api/lecturer-class/bulkGradeStudentClass';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Pengelolaan Nilai')
const mode = ref('list')
const dialog = ref(false)
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
const classId = ref('')
const detail = ref(<GetLecturerClassDetailData>{})
const detailGradeComponentsLength = ref(0)
const detailStudentLength = ref(0)
const inputSubjectGradeComponent = ref(<number[]>[])
const outputSubjectGradeComponent = ref(<number[]>[])
const absoluteValue = ref(<number[]>[])
const realtiveValue = ref(<string[]>[])
const sliceAbsolute = ref(<startEnd[]>[])
interface startEnd {
  start: number
  end: number
}

async function getDetail() {
    try {
        const { response: resp, error: error } = await getLecturerClassDetail(classId.value)
        if (error) {
          let dataError = <ErrorRoot>error;
          alert(dataError.meta.message);
          return;
        }
        if (resp != null) {
            detail.value = resp?.data
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
    detail.value.grade_components.forEach(function(itm, indx){
      outputSubjectGradeComponent.value[i] = (item[i]* Number(itm.percentage)) / 100
    })
  }
})
watch(outputSubjectGradeComponent.value, async function(item){
    let limit = detail.value.students.length * detail.value.grade_components.length
    let start = 0
    let end = 0
    let data = <startEnd[]>[]
    for (let i = 0; i < item.length; i++) {
        end += detail.value.grade_components.length
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
        detail.value.grade_types.sort(function(a, b){
            return a.maximum_grade + b.maximum_grade;
        })
        detail.value.grade_types.forEach(function(item){
            if(item.minimum_grade <= result && item.maximum_grade > result){
                realtiveValue.value[index] = item.grade_category
            }
        })
    }
})
const subjectGradeComponentId = ref(<string[]>[])
async function save(){
  let students = <StudentRequest[]>[]
  let grades = <GradeRequest[]>[]
  subjectGradeComponentId.value.forEach(function(itm, indx){
    grades.push(<GradeRequest>{
      subject_grade_component_id: itm,
      initial_grade: Number(inputSubjectGradeComponent.value[indx]),
    })
  })
  detail.value.students.forEach(function(item, index){
    students.push(<StudentRequest>{
      student_id: item.id,
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
      router.push('/academic-portal/academic/grade-management')
      // emit('reload');
    }
  } catch (error) {
    alert(error)
  }
}
onMounted(async () => {
    classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getDetail()
    detailGradeComponentsLength.value = detail.value.grade_components.length
    detailStudentLength.value = detail.value.students.length
    detail.value.students.forEach(function(item, index){
        if(item.grades.length > 0){
        item.grades.forEach(function(itm, indx){
            inputSubjectGradeComponent.value.push(itm.initial_grade)
            subjectGradeComponentId.value.push(itm.subject_grade_component_id)
        })
        }else{
        detail.value.grade_components.forEach(function(itm, indx){
            // if(!itm.name.match(/kehadiran/i)){
            //     inputSubjectGradeComponent.value.push(0)
            // }else{
            //     inputSubjectGradeComponent.value.push(item.attendance_percentage)
            // }
            inputSubjectGradeComponent.value.push(0)
            subjectGradeComponentId.value.push(itm.id)
        })
        }
    })
})
</script>
<template>
    <v-col cols="12">
        <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
    </v-col>
    <v-row>
        <v-col cols="12">
            <UiParentCard :title="'Pilih '+title">
                <v-row>
                    <v-col cols="12" lg="12" md="12" class="text-right">
                        <NuxtLink class="text-decoration-none color-inherits" :to="'/academic-portal/academic/grade-management'">
                            <VIcon class="mr-2">
                                mdi-keyboard-backspace
                            </VIcon>Kembali
                        </NuxtLink>
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
    <v-col cols="12">
        <v-alert type="info" variant="tonal">
        Keterangan : 
        <br />
        Pengelolaan Nilai dapat digunakan untuk memasukkan nilai mahasiswa secara on-line. Dosen dapat memberikan nilai sesuai dengan Mata Kuliah yang diampunya. Untuk memasukkan nilai Mata Kuliah yang ditawarkan oleh program studi lain dapat dilakukan dengan memilih Sistem Informasi Akademik yang bersesuaian.
        </v-alert>
    </v-col>
    <v-table class="mt-5">
        <thead>
            <tr>
                <th colspan="2" class="text-subtitle-1 font-weight-semibold">Data Kelas</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Mata Kuliah</td>
                <td>{{ detail.subject_name }}</td>
            </tr>
            <tr>
                <td>Kelas</td>
                <td>{{ detail.name }}</td>
            </tr>
            <tr>
                <td>Semester</td>
                <td>{{ detail.semester_school_year }} - {{ detail.semester_type }}</td>
            </tr>
        </tbody>
    </v-table>
    <v-table class="mt-5">
        <thead>
            <tr>
                <th colspan="2" class="text-subtitle-1 font-weight-semibold">Komponen Bobot Nilai</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in detail.grade_components">
                <td>{{ item.name }}</td>
                <td>{{ item.percentage }} %</td>
            </tr>
        </tbody>
    </v-table>
    <v-table class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">No</th>
                <th class="text-subtitle-1 font-weight-semibold">Nim</th>
                <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                <th :colspan="detailGradeComponentsLength" class="text-subtitle-1 font-weight-semibold text-center">Nilai Awal</th>
                <th :colspan="detailGradeComponentsLength" class="text-subtitle-1 font-weight-semibold text-center">Nilai Akhir</th>
                <th class="text-subtitle-1 font-weight-semibold text-center">Nilai Absolut</th>
                <th class="text-subtitle-1 font-weight-semibold text-center">Nilai Relatif</th>
            </tr>
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th style="min-width: 150px;" v-for="item in detail.grade_components" class="text-subtitle-1 font-weight-semibold text-center">{{ item.name }}</th>
                <th style="min-width: 150px;" v-for="item in detail.grade_components" class="text-subtitle-1 font-weight-semibold text-center">{{ item.name }}</th>
                <th style="min-width: 150px;"></th>
                <th style="min-width: 150px;"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in detail.students">
                <td>{{ index + 1 }}</td>
                <td>{{ item.nim_number }}</td>
                <td>{{ item.name }}</td>
                <td v-for="(itm, indx) in detail.grade_components">
                    <v-text-field type="number" v-model="inputSubjectGradeComponent[(detailGradeComponentsLength * index) + indx]" class="mt-1" variant="outlined" hide-details></v-text-field>
                </td>
                <td class="text-center" v-for="(itm, indx) in detail.grade_components">
                    <v-text-field :value="(outputSubjectGradeComponent[(detailGradeComponentsLength * index) + indx])" class="mt-1 mb-1" variant="outlined" hide-details :readonly="true"></v-text-field>
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
                    <v-btn color="primary" flat class="ml-auto" @click="save" :disabled="realtiveValue.length != detailStudentLength">
                        <v-Icon class="mr-2">
                        mdi-content-save
                        </v-Icon>Simpan
                    </v-btn>
                </td>
            </tr>
        </tfoot>
    </v-table>
</template>