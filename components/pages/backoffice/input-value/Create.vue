<script setup lang="ts">
import { GetClassGradeComponentListData } from '~~/types/api/class-grade-component/GetClassGradeComponentList';
import { GetStudentClassParticipantData } from '~~/types/api/student-class/GetStudentClassParticipantList';
import { GetGradeTypeListData } from '~~/types/api/grade-type/GetGradeTypeList';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { BulkGradeStudentClassRequest, StudentRequest, GradeRequest, ClassGradeRequest, ClassGradeDataRequest } from '~~/types/api/student-class/BulkGradeStudentClass';
import { getClassGradeComponentList } from '~~/composables/api/class-grade-component/getClassGradeComponentList';
import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { getGradeTypeList } from '~~/composables/api/grade-type/getGradeTypeList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { bulkGradeStudentClass } from '~~/composables/api/student-class/bulkGradeStudentClass';
import { ErrorRoot } from '~~/types/api/error';

const props = defineProps({
    subjectId: String,
    classId: String,
    studentId: String,
})
const emit = defineEmits(['close', 'reload'])

const limit = 20
const page = 1
const classGradeComponents = ref(<GetClassGradeComponentListData[]>[])
const classParticipants = ref<GetStudentClassParticipantData[]>([])
const classParticipantforUpdate = ref<GetStudentClassParticipantData[]>([])
const subjectId = ref('')
const classId = ref('')
const studentId = ref('')
const inputSubjectGradeComponent = ref(<number[]>[])
const outputSubjectGradeComponent = ref(<number[]>[])
const classGradeComponentId = ref(<string[]>[])
const absoluteValue = ref(0)
const realtiveValue = ref('')
const gradeTypes = ref(<GetGradeTypeListData[]>[])
const classDetail = ref(<GetClassroomDetail>{})

async function getClassGradeComponent(id: string) {
  try {
    const { response: resp, error: error } = await getClassGradeComponentList(id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      classGradeComponents.value = resp?.data
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
    classGradeComponentId.value.forEach(function(itm, indx){
        grades.push(<GradeRequest>{
            class_grade_component_id: itm,
            initial_grade: Number(inputSubjectGradeComponent.value[indx]),
        })
    })
    classParticipantforUpdate.value.forEach(function(item, index){
        students.push(<StudentRequest>{
            student_id: item.student_id,
            grades: grades
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
        router.push('/backoffice/input-value/input-value-per-student/'+studentId.value)
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
    classGradeComponents.value.forEach(function(itm, indx){
        outputSubjectGradeComponent.value[i] = (item[i]* Number(itm.percentage)) / 100
    })
  }
})
watch(outputSubjectGradeComponent.value, async function(item){
    let data = 0 
    item.forEach(function(itm){
        data += itm
    })
    absoluteValue.value = data
    gradeTypes.value.sort(function(a, b){
      return a.maximum_grade + b.maximum_grade;
    })
    gradeTypes.value.forEach(function(item){
      if(item.minimum_grade <= absoluteValue.value && item.maximum_grade > absoluteValue.value){
        realtiveValue.value = item.grade_category
      }
    })
})
onMounted(async () => {
    subjectId.value = <string>props.subjectId
    classId.value = <string>props.classId
    studentId.value = <string>props.studentId
    await getClassGradeComponent(classId.value)
    await getClassParticipant(limit, page, '', classId.value)
    await classroomDetail(classId.value)
    await getGradeType(limit, page, '', classDetail.value.study_level_id)
    let index = classParticipants.value.findIndex(x => x.student_id === studentId.value)
    let data = classParticipants.value.slice(index, index+1)
    for (let index = 0; index < data.length; index++) {
        classParticipantforUpdate.value.push(<GetStudentClassParticipantData>{
            student_id: data[index].student_id,
            student_nim_number: data[index].student_nim_number,
            student_name: data[index].student_name,
            study_program_id: data[index].study_program_id,
            study_program_name: data[index].study_program_name,
            dikti_study_program_code: data[index].dikti_study_program_code,
            dikti_study_program_type: data[index].dikti_study_program_type,
            study_level_short_name: data[index].study_level_short_name,
            total_attendance: data[index].total_attendance,
            attendance_percentage: data[index].attendance_percentage,
            total_sick: data[index].total_sick,
            total_leave: data[index].total_leave,
            total_awol: data[index].total_awol,
            is_attend: data[index].is_attend,
            is_sick: data[index].is_sick,
            is_leave: data[index].is_leave,
            is_awol: data[index].is_awol,
            grade_point: data[index].grade_point,
            grade_code: data[index].grade_code,
            graded_by_admin_id: data[index].graded_by_admin_id,
            graded_by_admin_name: data[index].graded_by_admin_name,
            graded_by_lecturer_id: data[index].graded_by_lecturer_id,
            graded_by_lecturer_name: data[index].graded_by_lecturer_name,
            graded_at: data[index].graded_at,
            subject_repetition: data[index].subject_repetition,
            grades: data[index].grades,
        }) 
    }
    if(classParticipantforUpdate.value[0].grades.length > 0){
        classParticipantforUpdate.value[0].grades.forEach(function(itm, indx){
            inputSubjectGradeComponent.value.push(itm.initial_grade)
            classGradeComponentId.value.push(itm.subject_grade_component_id)
        })
    }else{
        classGradeComponents.value.forEach(function(itm, indx){
        if(!itm.name.match(/kehadiran/i)){
            inputSubjectGradeComponent.value.push(0)
        }else{
            inputSubjectGradeComponent.value.push(classParticipantforUpdate.value[0].attendance_percentage)
        }
        classGradeComponentId.value.push(itm.id)
        })
    }
});
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Input Per Mahasiswa</span>
        </v-card-title>
        <v-card-text>
            <v-table class="mt-5">
                <caption>Keterangan Komponen Bobot Nilai</caption>
                <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Persentase</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in classGradeComponents">
                    <td>{{ index +  1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.percentage }} %</td>
                </tr>
                </tbody>
            </v-table>
            <v-table class="mt-5 mb-5">
                <caption>Peserta Kelas</caption>
                <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th :colspan="classGradeComponents.length" class="text-subtitle-1 font-weight-semibold text-center">Nilai Awal</th>
                    <th :colspan="classGradeComponents.length" class="text-subtitle-1 font-weight-semibold text-center">Nilai Akhir</th>
                    <th class="text-subtitle-1 font-weight-semibold text-center">Nilai Absolut</th>
                    <th class="text-subtitle-1 font-weight-semibold text-center">Nilai Relatif</th>
                </tr>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th style="min-width: 150px;" v-for="(item, index) in classGradeComponents">{{ item.name }}</th>
                    <th style="min-width: 150px;" v-for="(item, index) in classGradeComponents">{{ item.name }}</th>
                    <th style="min-width: 150px;"></th>
                    <th style="min-width: 150px;"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in classParticipantforUpdate">
                    <td>{{ index +  1 }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td v-for="(itm, indx) in classGradeComponents">
                        <v-text-field v-model="inputSubjectGradeComponent[(classGradeComponents.length * index) + indx]" type="number" class="mt-1" variant="outlined" hide-details></v-text-field>
                    </td>
                    <td class="text-center" v-for="(itm, indx) in classGradeComponents">
                        <v-text-field :value="(outputSubjectGradeComponent[(classGradeComponents.length * index) + indx])" class="mt-1 mb-1" variant="outlined" hide-details :readonly="true"></v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field :value="absoluteValue" class="mt-1 mb-1" variant="outlined" hide-details :readonly="true"></v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field :value="realtiveValue" class="mt-1 mb-1" variant="outlined" hide-details :readonly="true"></v-text-field>
                    </td>
                </tr>
                </tbody>
            </v-table>
            <v-col cols="12">
                <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="error" @click="$emit('close')">
                        Batal
                    </v-btn>
                    <v-btn color="secondary"
                        @click="save(); ">
                        Tambah
                    </v-btn>
                </v-card-actions>
            </v-col>
        </v-card-text>
    </v-card>
</template>