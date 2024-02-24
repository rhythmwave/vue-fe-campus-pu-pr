<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';
import { CreateScheduleRequest, CreateScheduleLecturePlanRequest, CreateScheduleExamSupervisorsRequest } from '~~/types/api/schedule/CreateScheduleRequest';
import { GetRoomScheduleData } from '~~/types/api/room/GetRoomSchedule';
import { GetExamSupervisorListData } from '~~/types/api/class-participant/GetExamSupervisor';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';
import { getRoomList } from '~~/composables/api/room/getRoomList';
import { createSchedule } from '~~/composables/api/schedule/createSchedule';
import { getRoomSchedule } from '~~/composables/api/room/getRoomSchedule';
import { getExamSupervisorList } from '~~/composables/api/class-participant/exam-supervisor/getExamSupervisorList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned, formatYearMonthDate } from '~~/utils/helpers/date-utils';
import { GetExamSupervisorRoleListData } from '~~/types/api/class-participant/GetExamSupervisorRole';
import { getExamSupervisorRoleList } from '~~/composables/api/class-participant/exam-supervisor-role/getExamSupervisorRoleList';
import { isDuplicate, DateStartEnd } from '~~/utils/helpers/duplicate';
import { number } from 'yup';
import moment from 'moment';

const props = defineProps({
    title: String,
    isMbkm: Boolean,
    studyProgramId: String,
    studyProgramName: String,
    semesterId: String,
    semesterName: String,
    classroomId: String,
    classroomName: String,
});
const emit = defineEmits(['close', 'reload'])
const isMbkm = ref(<boolean>{})
const study_program_id = ref('')
const study_program_name = ref('')
const semester_id = ref('')
const semester_name = ref('')
const classroom_name = ref('')
const building_ids = ref(<string[]>[])
const room_ids = ref(<string[]>[])
const lecturer_ids = ref(<string[]>[])
const exam_supervisors = ref(<CreateScheduleExamSupervisorsRequest[][]>[])
const exam_supervisor_ids = ref(<string[]>[])
const exam_supervisor_role_ids = ref(<string[]>[])
const is_theory_exams = ref(<boolean[]>[])
const is_practicum_exams = ref(<boolean[]>[])
const is_field_practicum_exams = ref(<boolean[]>[])
const dates = ref(<string[]>[])
const start_hours = ref(<number[]>[])
const start_minutes = ref(<number[]>[])
const end_hours = ref(<number[]>[])
const end_minutes = ref(<number[]>[])
const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const semesters = ref<GetSemesterListData[]>([])
const semesterDetail = ref(<GetSemesterDetailData>{})
const lecturers = ref<GetLecturerListData[]>([])
const classrooms = ref<GetClassroomListData[]>([])
const buildings = ref<GetBuildingListData[]>([])
const rooms = ref<GetRoomListData[]>([])
const countClassMeeting = ref<number[]>([0, 1])
const roomchedules = ref<GetRoomScheduleData[]>([])
const examSupervisorList = ref(<GetExamSupervisorListData[]>[])
const roles = ref(<GetExamSupervisorRoleListData[]>[])
const classroomDetail = ref(<GetClassroomDetail>{})
const maximum_participant = ref(0)

const hours = ref(['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'])
const minutes = ref(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '59', '60'])
const create = ref<CreateScheduleRequest>({
    class_id: '',
    lecture_plans: <CreateScheduleLecturePlanRequest[]>[]
})
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000, 1, study_program_id.value, '')
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
async function detailSemester() {
    try {
        const { response: resp, error: error } = await getSemesterDetail(semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesterDetail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getLecturer(limit: number, page: number, searchText: string, studyProgramId: any, idNationalLecturer: any, employmentStatus: any, academicGuidanceSemesterId:any, hasAuthentication: any, classId: any, excludeLectureDate: any, excludeStartTIme: any, excludeEndTime: any) {
    try {
        const { response: resp, error: error } = await getLecturerList(limit, page, searchText, studyProgramId, idNationalLecturer, employmentStatus, academicGuidanceSemesterId, hasAuthentication, classId, excludeLectureDate, excludeStartTIme, excludeEndTime)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturers.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getClassroom(limit: number, page: number, search: string, is_active: boolean) {
    try {
        const { response: resp, error: error } = await getClassroomList(limit, page, search, study_program_id.value, semester_id.value, is_active, '', isMbkm.value)
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
async function detailClassroom(id: string) {
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
async function getBuilding() {
    try {
        const { response: resp, error: error } = await getBuildingList(1000, 1, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            buildings.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getRole(limit: number, page: number, search: string) {
  try {
    const { response: resp, error: error } = await getExamSupervisorRoleList(1000, 1, '')
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
      roles.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
watch(() => dates, (resp) => {
        let start = (Number(start_hours.value[resp.value.length -1]) * 100) + (Number(start_minutes.value[resp.value.length-1]))
        let end = (Number(end_hours.value[resp.value.length -1]) * 100) + (Number(end_minutes.value[resp.value.length-1]))
        if(start >= end){
            alert('waktu mulai harus lebih awal dari waktu selesai')
            return false
        }
    },{ deep: true }
);
watch(() => start_hours, (resp) => {
        let start = (Number(start_hours.value[resp.value.length -1]) * 100) + (Number(start_minutes.value[resp.value.length-1]))
        let end = (Number(end_hours.value[resp.value.length -1]) * 100) + (Number(end_minutes.value[resp.value.length-1]))
        if(start >= end){
            alert('waktu mulai harus lebih awal dari waktu selesai')
            return false
        }
    },{ deep: true }
);
watch(() => end_hours, (resp) => {
        let start = (Number(start_hours.value[resp.value.length -1]) * 100) + (Number(start_minutes.value[resp.value.length-1]))
        let end = (Number(end_hours.value[resp.value.length -1]) * 100) + (Number(end_minutes.value[resp.value.length-1]))
        if(start >= end){
            alert('waktu mulai harus lebih awal dari waktu selesai')
            return false
        }
    },{ deep: true }
);
watch(() => start_minutes, (resp) => {
        let start = (Number(start_hours.value[resp.value.length -1]) * 100) + (Number(start_minutes.value[resp.value.length-1]))
        let end = (Number(end_hours.value[resp.value.length -1]) * 100) + (Number(end_minutes.value[resp.value.length-1]))
        if(start >= end){
            alert('waktu mulai harus lebih awal dari waktu selesai')
            return false
        }
    },{ deep: true }
);
watch(() => end_minutes, (resp) => {
        let start = (Number(start_hours.value[resp.value.length -1]) * 100) + (Number(start_minutes.value[resp.value.length-1]))
        let end = (Number(end_hours.value[resp.value.length -1]) * 100) + (Number(end_minutes.value[resp.value.length-1]))
        if(start >= end){
            alert('waktu mulai harus lebih awal dari waktu selesai')
            return false
        }
    },{ deep: true }
);
watch(() => building_ids,async (resp) => {
        let index = resp.value.length-1
        let start = (Number(start_hours.value[index]) * 100) + (Number(start_minutes.value[index]))
        let end = (Number(end_hours.value[index]) * 100) + (Number(end_minutes.value[index]))
        await getRoom(1000, 1, '', building_ids.value[index], false, dates.value[index], start, end)
        await getLecturer(1000, 1, '', study_program_id.value, '', '', '', '', create.value.class_id, dates.value[index], start, end)
    },{ deep: true }
);
watch(() => is_theory_exams, (resp) => {
    if(is_theory_exams.value[0]){
        is_practicum_exams.value[0] = false
        is_field_practicum_exams.value[0] = false
    }
    if(is_theory_exams.value[1]){
        is_practicum_exams.value[1] = false
        is_field_practicum_exams.value[1] = false
    }
},{ deep: true })
watch(() => is_practicum_exams, (resp) => {
    if(is_practicum_exams.value[0]){
        is_theory_exams.value[0] = false
        is_field_practicum_exams.value[0] = false
    }
    if(is_practicum_exams.value[1]){
        is_theory_exams.value[1] = false
        is_field_practicum_exams.value[1] = false
    }
},{ deep: true })
watch(() => is_field_practicum_exams, (resp) => {
    if(is_field_practicum_exams.value[0]){
        is_theory_exams.value[0] = false
        is_practicum_exams.value[0] = false
    }
    if(is_field_practicum_exams.value[1]){
        is_theory_exams.value[1] = false
        is_practicum_exams.value[1] = false
    }
},{ deep: true })

async function getRoom(limit: number, page: number, search: string, buildingId:string, isLaboratory: boolean, excludeLectureDate: string, excludeStartTime: number, excludeEndTime: number) {
    try {
        const { response: resp, error: error } = await getRoomList(limit, page, search, buildingId, isLaboratory, excludeLectureDate, excludeStartTime, excludeEndTime, maximum_participant.value, true)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            rooms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getExamSupervisor(limit: number, page: number, search: string) {
  try {
    const { response: resp, error: error } = await getExamSupervisorList(limit, page, search, study_program_id.value)
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
      examSupervisorList.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function save() {
    create.value.lecture_plans = <CreateScheduleLecturePlanRequest[]>[]
    await detailSemester()
    if(dates.value.length != 2 || room_ids.value.length != 2 || building_ids.value.length != 2){
        alert('jadwal harus diisi semuanya')
        return false
    }
    for (let index = 0; index < dates.value.length; index++) {
        if(dates.value.indexOf(dates.value[index]) !== index){
            let first_start_time = (Number(start_hours.value[index-1]) * 100) + Number(start_minutes.value[index-1])
            let first_end_time = (Number(end_hours.value[index-1]) * 100) + Number(end_minutes.value[index-1])
            let second_start_time = (Number(start_hours.value[index]) * 100) + Number(start_minutes.value[index])
            let second_end_time = (Number(end_hours.value[index]) * 100) + Number(end_minutes.value[index])
            if(first_start_time < second_end_time && first_end_time > second_start_time){
                alert('Harap Revisi Jadwal Pertemuan ke '+(index+1))
                return false
            }
        }
    }
    for (let index = 0; index < dates.value.length; index++) {
        if(index == 0){
            create.value.lecture_plans.push(<CreateScheduleLecturePlanRequest>{
                lecture_plan_date: convertDateWithoutTimeToTimezoned(dates.value[index]),
                lecture_plan_start_time: (Number(start_hours.value[index]) * 100) + Number(start_minutes.value[index]),
                lecture_plan_end_time: (Number(end_hours.value[index]) * 100) + Number(end_minutes.value[index]),
                room_id: room_ids.value[index],
                // lecturer_id: lecturer_ids.value[index],
                is_exam: true,
                is_theory_exam: is_theory_exams.value[index],
                is_practicum_exam: is_practicum_exams.value[index],
                is_field_practicum_exam: is_field_practicum_exams.value[index],
                is_midterm_exam: true,
                is_endterm_exam: false,
                exam_supervisors: exam_supervisors.value[index],
            })
        }else{
            create.value.lecture_plans.push(<CreateScheduleLecturePlanRequest>{
                lecture_plan_date: convertDateWithoutTimeToTimezoned(dates.value[index]),
                lecture_plan_start_time: (Number(start_hours.value[index]) * 100) + Number(start_minutes.value[index]),
                lecture_plan_end_time: (Number(end_hours.value[index]) * 100) + Number(end_minutes.value[index]),
                room_id: room_ids.value[index],
                // lecturer_id: lecturer_ids.value[index],
                is_exam: true,
                is_theory_exam: is_theory_exams.value[index],
                is_practicum_exam: is_practicum_exams.value[index],
                is_field_practicum_exam: is_field_practicum_exams.value[index],
                is_midterm_exam: false,
                is_endterm_exam: true,
                exam_supervisors: exam_supervisors.value[index]
            })
        }
        
    }
    
    for (let index = 0; index < create.value.lecture_plans.length; index++) {
        let target = create.value.lecture_plans[index].lecture_plan_date
        if(index == 0 && !moment(target).isBetween(semesterDetail.value.midterm_start_date, semesterDetail.value.midterm_end_date, 'days', '[]')){
            alert('pertemuan UTS , jadwal tidak dalam periode perkuliahan !!! \n masa perkuliahan : '+formatYearMonthDate(semesterDetail.value.start_date)+' s/d '+formatYearMonthDate(semesterDetail.value.end_date)+' \n masa UTS : ' +formatYearMonthDate(semesterDetail.value.midterm_start_date)+' s/d '+formatYearMonthDate(semesterDetail.value.midterm_end_date)+' \n masa UAS : '+formatYearMonthDate(semesterDetail.value.endterm_start_date)+' s/d '+formatYearMonthDate(semesterDetail.value.endterm_end_date))
            return false
        }
        if(index > 0 && !moment(target).isBetween(semesterDetail.value.endterm_start_date, semesterDetail.value.endterm_end_date, 'days', '[]')){
            alert('pertemuan UAS , jadwal tidak dalam periode perkuliahan !!! \n masa perkuliahan : '+formatYearMonthDate(semesterDetail.value.start_date)+' s/d '+formatYearMonthDate(semesterDetail.value.end_date)+' \n masa UTS : ' +formatYearMonthDate(semesterDetail.value.midterm_start_date)+' s/d '+formatYearMonthDate(semesterDetail.value.midterm_end_date)+' \n masa UAS : '+formatYearMonthDate(semesterDetail.value.endterm_start_date)+' s/d '+formatYearMonthDate(semesterDetail.value.endterm_end_date))
            return false
        }
    }
    try {
        const { response: createRoleResponse, error } = await createSchedule(create.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            console.log(createRoleResponse?.meta.status)
            console.log(error)
            if (createRoleResponse?.meta.status == 500) {
                alert(createRoleResponse?.meta.message)
            }
            emit('reload');
        }
        // return true;
        emit('close');
    } catch (error) {
        alert(error)
        // return false;
    }
}
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
// watch(study_program_id, async (value) => {
//     if (value != '') {
//         await getSemester()
//         await getBuilding()
//         await getExamSupervisor(1000, 1, '')
//         await getRole(1000, 1, '')
//         await getClassroom(1000, 1, '', true)
//     }
// })
// watch(semester_id, async (value) => {
//     if (value != '') {
//         await getSemester()
//         await getBuilding()
//         await getExamSupervisor(1000, 1, '')
//         await getRole(1000, 1, '')
//         await getClassroom(1000, 1, '', true)
//     }
// })
function addSupervisor(index: number, exam_supervisor_id: string, exam_supervisor_role_id: string){
    console.log(exam_supervisor_id)
    let data = <CreateScheduleExamSupervisorsRequest>{
        exam_supervisor_id: exam_supervisor_id?.id,
        exam_supervisor_name: exam_supervisor_id?.name,
        exam_supervisor_role_id: exam_supervisor_role_id.id,
        exam_supervisor_role_name: exam_supervisor_role_id.name,
    }
    if(typeof exam_supervisors.value[index] == 'undefined'){
        exam_supervisors.value[index] = [data]
    }else{
        if(exam_supervisors.value[index][exam_supervisors.value[index].length-1].exam_supervisor_id != data.exam_supervisor_id){
            exam_supervisors.value[index].push(data)
        }
    }
}
function deleteSupervisor(first: number, second: number){
    exam_supervisors.value[first].splice(second, 1)
}
onMounted(async () => {
    study_program_id.value = <string>props.studyProgramId
    study_program_name.value = <string>props.studyProgramName
    semester_id.value = <string>props.semesterId
    semester_name.value = <string>props.semesterName
    create.value.class_id = <string>props.classroomId
    classroom_name.value = <string>props.classroomName
    isMbkm.value = <boolean>props.isMbkm

    await getExamSupervisor(1000, 1, '')
    await getRole(1000, 1, '')
    await getBuilding()
    dates.value[0] = formatYearMonthDate(new Date().toString())
    start_hours.value[0] = 6
    end_hours.value[0] = 7
    start_minutes.value[0] = 0
    end_minutes.value[0] = 0
    is_theory_exams.value[0] = true
    is_practicum_exams.value[0] = false
    is_field_practicum_exams.value[0] = false
    
    dates.value[1] = formatYearMonthDate(new Date().toString())
    start_hours.value[1] = 7
    end_hours.value[1] = 8
    start_minutes.value[1] = 0
    end_minutes.value[1] = 0
    is_theory_exams.value[1] = true
    is_practicum_exams.value[1] = false
    is_field_practicum_exams.value[1] = false
    
})
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">{{ title }}</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="12" md="12" class="float-left">
                                <v-text-field v-model="study_program_name" variant="outlined" hide-details="auto" label="Program Studi" :readonly="true" />
                            </v-col>
                            <v-col cols=6 lg="6" md="6" class="float-left">
                                <v-text-field v-model="semester_name" variant="outlined" hide-details="auto" label="Semester" :readonly="true" />
                            </v-col>
                            <v-col cols=6 lg="6" md="6" class="float-left">
                                <v-text-field v-model="classroom_name" variant="outlined" hide-details="auto" label="Kelas" :readonly="true" />
                            </v-col>
                        </v-col>
                        <v-col cols=12 lg="12" md="12" v-for="item in countClassMeeting">
                            <v-col cols="12" lg="12" class="float-left">
                                <label>Pertemuan {{ item +1 }} {{ item == 0 ? 'UTS' : 'UAS' }}</label>
                            </v-col>
                            <v-col cols="4" lg="4" class="float-left">
                                <v-text-field v-model="dates[item]" type="date" variant="outlined" hide-details="auto"
                                    label="Pilih Tanggal" :readonly="false" />
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="start_hours[item]" :items="hours" item-value="id" item-title="name" label="Dari Jam"></v-select>
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="start_minutes[item]" :items="minutes" item-value="id" item-title="name" label="Dari Menit"></v-select>
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="end_hours[item]" :items="hours" item-value="id" item-title="name" label="Sampai Jam"></v-select>
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="end_minutes[item]" :items="minutes" item-value="id" item-title="name" label="Sampai Menit"></v-select>
                            </v-col>
                            <v-col cols=6 lg="6" md="6" class="float-left">
                                <v-select v-model="building_ids[item]" variant="outlined" hide-details :items="buildings" item-value="id"
                                    item-title="name" label="Pilih Gedung"></v-select>
                            </v-col>
                            <v-col cols=6 lg="6" md="6" class="float-left">
                                <v-select v-model="room_ids[item]" variant="outlined" hide-details :items="rooms" item-value="id" item-title="name" label="Pilih Ruangan"></v-select>
                            </v-col>
                            <!-- <v-col cols=12 lg="12" md="12" class="float-left">
                                <v-select v-model="lecturer_ids[item]" variant="outlined" hide-details :items="lecturers" item-value="id" item-title="name" label="Pilih Dosen"></v-select>
                            </v-col> -->
                            <v-col cols=12 lg="5" md="5" class="float-left">
                                <v-select v-model="exam_supervisor_ids[item]" variant="outlined" hide-details :items="examSupervisorList" label="Pilih Pengawas" return-object>
                                    <template v-slot:selection="{ item }">
                                        <span>{{ item.props.title.name }}</span>
                                    </template>
                                    <template v-slot:item="{ item, props: { onClick, title, value } }">
                                        <ul>
                                            <li style="padding: 10px; margin: 2px;">
                                                <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                    @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                    <span @click="onClick">{{ title.name }}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols=12 lg="5" md="5" class="float-left">
                                <v-select v-model="exam_supervisor_role_ids[item]" variant="outlined" hide-details :items="roles" label="Pilih Peran Pengawas" return-object>
                                    <template v-slot:selection="{ item }">
                                        <span>{{ item.props.title.name }}</span>
                                    </template>
                                    <template v-slot:item="{ item, props: { onClick, title, value } }">
                                        <ul>
                                            <li style="padding: 10px; margin: 2px;">
                                                <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                    @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                    <span @click="onClick">{{ title.name }}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols=12 lg="2" md="2" class="float-left">
                                <v-btn color="secondary"
                                    @click="addSupervisor(item, exam_supervisor_ids[item], exam_supervisor_role_ids[item])">
                                    Tambah
                                </v-btn>
                            </v-col>
                            <v-col cols=12 lg="12" md="12" class="float-left">
                                <v-table>
                                    <thead>
                                        <tr>
                                            <th class="text-subtitle-1 font-weight-semibold">No</th>
                                            <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                            <th class="text-subtitle-1 font-weight-semibold">Peran</th>
                                            <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(itm, indx) in exam_supervisors[item]">
                                            <td>{{ indx + 1 }}</td>
                                            <td>{{ itm.exam_supervisor_name }}</td>
                                            <td>{{ itm.exam_supervisor_role_name }}</td>
                                            <td>
                                                <v-btn color="error"
                                                    @click="deleteSupervisor(item, indx)">
                                                    Hapus
                                                </v-btn>    
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-col>
                            <v-col cols=12 lg="12" md="12">
                                <v-col cols="4" lg="4" class="float-left">
                                    <v-switch v-model="is_theory_exams[item]" label="Teori" color="primary"></v-switch>
                                </v-col>
                                <v-col cols="4" lg="4" class="float-left">
                                    <v-switch v-model="is_practicum_exams[item]" label="Praktek" color="primary"></v-switch>
                                </v-col>
                                <v-col cols="4" lg="4" class="float-left">
                                    <v-switch v-model="is_field_practicum_exams[item]" label="Praktek Lapangan"
                                        color="primary"></v-switch>
                                </v-col>
                            </v-col>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    @click="save()">
                                    Tambah
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>
<style lang="scss">

</style>