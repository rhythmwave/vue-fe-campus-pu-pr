<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { UpdateActualLecturePlanRequest, UpdateActualLecturePlanParticipant } from '~~/types/api/lecture/UpdateActualLecturePlan';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';
import { GetRoomDetaiData } from '~~/types/api/room/GetRoomDetail';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { UpdateScheduleRequest } from '~~/types/api/schedule/UpdateScheduleRequest';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';
import { getRoomList } from '~~/composables/api/room/getRoomList';
import { getRoomDetail } from '~~/composables/api/room/getRoomDetail';
import { updateActualLecturePlan } from '~~/composables/api/lecture/updateActualLecturePlan';
import { ErrorRoot } from '~~/types/api/error';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { convertDateWithoutTimeToTimezoned, formatYearMonthDate } from '~~/utils/helpers/date-utils';
import { updateSchedule } from '~~/composables/api/schedule/updateSchedule';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';
import moment from 'moment';

const props = defineProps({
    title: String,
    dataDetail: Object,
    dataStudyProgramId: String,
    dataSemesterId: String,
    isMbkm: Boolean,
});
const emit = defineEmits(['close', 'reload'])
const isMbkm = ref(false)
const edit = ref(<GetScheduleListData>{})
const study_program_id = ref('')
const semester_id = ref('')
const building_id = ref('')
const class_id = ref('')
const room_id = ref('')
const is_regular = ref(true)
const date = ref('')
const start_hour = ref('')
const start_minute = ref('')
const end_hour = ref('')
const end_minute = ref('')
const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const semesters = ref<GetSemesterListData[]>([])
const lecturers = ref<GetLecturerListData[]>([])
const classrooms = ref<GetClassroomListData[]>([])
const buildings = ref<GetBuildingListData[]>([])
const rooms = ref<GetRoomListData[]>([])
const room_detail = ref(<GetRoomDetaiData>{})
const semesterDetail = ref(<GetSemesterDetailData>{})
const maximum_participant = ref(0)
const classroomDetail = ref(<GetClassroomDetail>{})

const hours = ref(['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'])
const minutes = ref(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '59', '60'])
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
async function getRoom(limit: number, page: number, searchText: string, buildingId:string, isLaboratory: boolean, excludeLectureDate: any, excludeStartTime: any, excludeEndTime: any) {
    try {
        const { response: resp, error: error } = await getRoomList(limit, page, searchText, buildingId, isLaboratory, excludeLectureDate, excludeStartTime, excludeEndTime, maximum_participant.value, '')
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
async function getRoomDetailObj() {
    try {
        const { response: resp, error: error } = await getRoomDetail(room_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            room_detail.value = resp?.data
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
async function update() {
    await detailSemester()
    let target = date.value
    if(!((moment(target).isBetween(semesterDetail.value.start_date, semesterDetail.value.end_date, 'days', '()') && (!moment(target).isBetween(semesterDetail.value.midterm_start_date, semesterDetail.value.midterm_end_date, 'days', '()')) && (!moment(target).isBetween(semesterDetail.value.endterm_start_date, semesterDetail.value.endterm_start_date, 'days', '()'))))){
        alert(' jadwal tidak dalam periode perkuliahan !!! \n masa perkuliahan : '+formatYearMonthDate(semesterDetail.value.start_date)+' s/d '+formatYearMonthDate(semesterDetail.value.end_date)+' \n masa UTS : ' +formatYearMonthDate(semesterDetail.value.midterm_start_date)+' s/d '+formatYearMonthDate(semesterDetail.value.midterm_end_date)+' \n masa UAS : '+formatYearMonthDate(semesterDetail.value.endterm_start_date)+' s/d '+formatYearMonthDate(semesterDetail.value.endterm_end_date))
        return false
    }
    
    edit.value.lecture_plan_date = date.value
    edit.value.lecture_plan_start_time = (Number(start_hour.value) * 100) + Number(start_minute.value)
    edit.value.lecture_plan_end_time = (Number(end_hour.value) * 100) + Number(end_minute.value)
    
    try {
        const req = ref(<UpdateActualLecturePlanRequest>{
            id: edit.value.id,
            room_id: edit.value.room_id,
            lecturer_id: edit.value.lecturer_id,
            foreign_lecturer_name: '',
            foreign_lecturer_source_instance: '',
            lecture_plan_date: edit.value.lecture_plan_date,
            lecture_plan_start_time: edit.value.lecture_plan_start_time,
            lecture_plan_end_time: edit.value.lecture_plan_end_time,
            lecture_actual_date: '',
            lecture_actual_start_time: 0,
            lecture_actual_end_time: 0,
            lecture_theme: '',
            lecture_subject: '',
            remarks: '',
            participants: <UpdateActualLecturePlanParticipant[]>[],
        })
        const { response: createRoleResponse, error } = await updateActualLecturePlan(req.value)
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
watch(() => start_hour, (resp) => {
        let start = (Number(start_hour.value) * 100) + (Number(start_minute.value))
        let end = (Number(end_hour.value) * 100) + (Number(end_minute.value))
        if(start >= end){
            alert('waktu mulai harus lebih awal dari waktu selesai')
            return false
        }
    }
);
watch(() => end_hour, (resp) => {
        let start = (Number(start_hour.value) * 100) + (Number(start_minute.value))
        let end = (Number(end_hour.value) * 100) + (Number(end_minute.value))
        if(start >= end){
            alert('waktu mulai harus lebih awal dari waktu selesai')
            return false
        }
    }
);
watch(() => start_minute, (resp) => {
        let start = (Number(start_hour.value) * 100) + (Number(start_minute.value))
        let end = (Number(end_hour.value) * 100) + (Number(end_minute.value))
        if(start >= end){
            alert('waktu mulai harus lebih awal dari waktu selesai')
            return false
        }
    }
);
watch(() => end_minute, (resp) => {
        let start = (Number(start_hour.value) * 100) + (Number(start_minute.value))
        let end = (Number(end_hour.value) * 100) + (Number(end_minute.value))
        if(start >= end){
            alert('waktu mulai harus lebih awal dari waktu selesai')
            return false
        }
    }
);
onMounted(async () => {
    edit.value = <GetScheduleListData>props.dataDetail
    await detailClassroom(edit.value.class_id)
    maximum_participant.value = classroomDetail.value.maximum_participant

    date.value = formatYearMonthDate(edit.value.lecture_plan_date)
    study_program_id.value = <string>props.dataStudyProgramId
    semester_id.value = <string>props.dataSemesterId
    room_id.value = edit.value.room_id
    await getRoomDetailObj()
    building_id.value = room_detail.value.building_id
    class_id.value = edit.value.class_id
    isMbkm.value = <boolean>props.isMbkm

    let start_time = convertTimeNumberToString(edit.value.lecture_plan_start_time)
    let end_time = convertTimeNumberToString(edit.value.lecture_plan_end_time)
    let splitStartTime = start_time.split('.')
    let splitEndTime = end_time.split('.')

    start_hour.value = splitStartTime[0].length > 1 ? splitStartTime[0] : `0${splitStartTime[0]}`
    start_minute.value = splitStartTime[1]

    end_hour.value = splitEndTime[0].length > 1 ? splitEndTime[0] : `0${splitEndTime[0]}`
    end_minute.value = splitEndTime[1]

    await getBuilding()
    await getClassroom(1000, 1, '', true)
    await getRoom(1000, 1, '', building_id.value, false, '', '', '')
    await getLecturer(1000, 1, '', study_program_id.value, '', '', '', '', class_id.value, '', '', '')
})
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

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
                            <!-- <v-col cols=4 lg="4" md="4" class="float-left">
                                <v-select v-model="study_program_id" variant="outlined" hide-details :items="adminStudyPrograms" item-value="id"
                                    item-title="name" label="Pilih Program Studi"></v-select>
                            </v-col> -->
                            <!-- <v-col cols=4 lg="4" md="4" class="float-left">
                                <v-select v-model="semester_id" item-value="id" variant="outlined" hide-details
                                    :items="semesters" label="Pilih Semester">
                                    <template v-slot:selection="{ item }">
                                        <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                        }}</span>
                                    </template>
                                    <template v-slot:item="{ item, props: { onClick, title, value } }">
                                        <ul>
                                            <li style="padding: 10px; margin: 2px;">
                                                <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                    @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                    <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                                                    }}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </template>
                                </v-select>
                            </v-col> -->
                            <!-- <v-col cols=4 lg="4" md="4" class="float-left">
                                <v-select v-model="edit.class_id" item-value="id" variant="outlined" hide-details :items="classrooms"
                                    label="Pilih Kelas">
                                    <template v-slot:selection="{ item }">
                                        <span>{{ item.props.title.subject_code }} - {{ item.props.title.subject_name }} - {{ item.props.title.name }}</span>
                                    </template>
                                    <template v-slot:item="{ item, props: { onClick, title, value } }">
                                        <ul>
                                            <li style="padding: 10px; margin: 2px;">
                                                <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                    @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                    <span @click="onClick">{{ title.subject_code }} - {{ title.subject_name }} - {{ title.name }}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </template>
                                </v-select>
                            </v-col> -->
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols="4" lg="4" class="float-left">
                                <v-text-field v-model="date" type="date" variant="outlined" hide-details="auto"
                                    label="Pilih Tanggal" :readonly="false" />
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="start_hour" :items="hours" item-value="id" item-title="name" label="Dari Jam"></v-select>
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="start_minute" :items="minutes" item-value="id" item-title="name" label="Dari Menit"></v-select>
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="end_hour" :items="hours" item-value="id" item-title="name" label="Sampai Jam"></v-select>
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="end_minute" :items="minutes" item-value="id" item-title="name" label="Sampai Menit"></v-select>
                            </v-col>
                            <v-col cols=6 lg="6" md="6" class="float-left">
                                <v-select v-model="building_id" variant="outlined" hide-details :items="buildings" item-value="id"
                                    item-title="name" label="Pilih Gedung"></v-select>
                            </v-col>
                            <v-col cols=6 lg="6" md="6" class="float-left">
                                <v-select v-model="edit.room_id" variant="outlined" hide-details :items="rooms" item-value="id" item-title="name" label="Pilih Ruangan"></v-select>
                            </v-col>
                            <v-col cols=12 lg="12" md="12" class="float-left">
                                <v-select v-model="edit.lecturer_id" variant="outlined" hide-details :items="lecturers" item-value="id" item-title="name" label="Pilih Dosen"></v-select>
                            </v-col>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    @click="update()">
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