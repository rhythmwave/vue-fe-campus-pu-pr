<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';
import { GetRoomDetaiData } from '~~/types/api/room/GetRoomDetail';
import { UpdateScheduleRequest } from '~~/types/api/schedule/UpdateScheduleRequest';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';
import { getRoomList } from '~~/composables/api/room/getRoomList';
import { getRoomDetail } from '~~/composables/api/room/getRoomDetail';
import { ErrorRoot } from '~~/types/api/error';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { updateSchedule } from '~~/composables/api/schedule/updateSchedule';
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
const single_day_lecturer_id = ref('')
const single_day_date = ref('')
const is_theory_exam = ref(false)
const is_practicum_exam = ref(false)
const is_field_practicum_exam = ref(false)
const is_midterm_exam = ref(false)
const is_endterm_exam = ref(false)

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
async function getLecturer() {
    try {
        const { response: resp, error: error } = await getLecturerList(1000, 1, '', study_program_id.value, '', '', '', '', '', '', '', '')
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
async function getRoom() {
    // try {
    //     const { response: resp, error: error } = await getRoomList(1000, 1, '', building_id.value)
    //     if (error) {
    //         let dataError = <ErrorRoot>error;
    //         alert(dataError.meta.message);
    //         return;
    //     }
    //     if (resp != null) {
    //         rooms.value = resp?.data
    //     }
    // } catch (error) {
    //     alert(error)
    // }
}
async function getRoomDetailObj() {
    try {
        var roomId = room_id.value
        const { response: resp, error: error } = await getRoomDetail(roomId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            room_detail.value = resp?.data

            console.log("room_detail.value")
            console.log(room_detail.value)
        }
    } catch (error) {
        alert(error)
    }
}
async function adminStudyProgramsOnChange(item: any) {
    if (item != '') {
        study_program_id.value = item
    }
    await getSemester()
    await getLecturer()
}
async function semesterOnChange(item: any) {
    if (item != '') {
        semester_id.value = item
    }
    await getClassroom(1000, 1, '', true)
}
async function classroomOnChange(item: string) {
    if (item != '') {
        edit.value.class_id = item
    }
}
async function buildingOnChange(item: any) {
    if (item != '') {
        building_id.value = item
    }
    await getRoom()
}
async function roomOnChange(item: any) {
    if (item != '') {
        edit.value.room_id = item
    }
}
async function dayOfWeekOnChange(item: any) {
    if (item != '') {
        edit.value.day_of_week = item
    }
}
async function startHourOnChange(item: string) {
    if (item != '') {
        start_hour.value = item
    }
}
async function startMinuteOnChange(item: string) {
    if (item != '') {
        start_minute.value = item
    }
}
async function endHourOnChange(item: string) {
    if (item != '') {
        end_hour.value = item
    }
}
async function endMinuteOnChange(item: string) {
    if (item != '') {
        end_minute.value = item
    }
}
async function lecturerOnChange(item: any) {
    if (item != '') {
        single_day_lecturer_id.value = item
    }
}
async function update() {
    let start_time = start_hour.value + start_minute.value
    let end_time = end_hour.value + end_minute.value

    edit.value.start_time = Number(start_time)
    edit.value.end_time = Number(end_time)

    if (edit.value.start_time > edit.value.end_time) {
        alert('Waktu Masuk dan Waktu Keluar Tidak Cocok')
        return false
    }

    edit.value.single_day_date = convertDateWithoutTimeToTimezoned(single_day_date.value)
    edit.value.single_day_lecturer_id = single_day_lecturer_id.value
    const req = ref(<UpdateScheduleRequest>{
        id: edit.value.id,
        class_id: edit.value.class_id,
        room_id: edit.value.room_id,
        single_day_lecturer_id: edit.value.single_day_lecturer_id,
        single_day_date: edit.value.single_day_date,
        day_of_week: 0,
        start_time: edit.value.start_time,
        end_time: edit.value.end_time,
        theory_credit: edit.value.theory_credit,
        practicum_credit: edit.value.practicum_credit,
        field_practicum_credit: edit.value.field_practicum_credit,
        is_exam: true,
        is_midterm_exam: is_midterm_exam.value,
        is_endterm_exam: is_endterm_exam.value,
    })
    try {
        if (edit.value.theory_credit > 0) {
            req.value.is_theory_exam = true
        }
        if (edit.value.practicum_credit > 0) {
            req.value.is_practicum_exam = true
        }
        if (edit.value.field_practicum_credit > 0) {
            req.value.is_field_practicum_exam = true
        }

        const { response: createRoleResponse, error } = await updateSchedule(req.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
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
watch(is_theory_exam, (value) => {
    if (value) {
        is_practicum_exam.value = false
        is_field_practicum_exam.value = false
        edit.value.practicum_credit = 0
        edit.value.field_practicum_credit = 0
    }
})
watch(is_practicum_exam, (value) => {
    if (value) {
        is_theory_exam.value = false
        is_field_practicum_exam.value = false
        edit.value.theory_credit = 0
        edit.value.field_practicum_credit = 0
    }
})
watch(is_field_practicum_exam, (value) => {
    if (value) {
        is_theory_exam.value = false
        is_practicum_exam.value = false
        edit.value.theory_credit = 0
        edit.value.practicum_credit = 0
    }
})
watch(is_midterm_exam, (value) => {
    if (value) {
        is_endterm_exam.value = false
    }
})
watch(is_endterm_exam, (value) => {
    if (value) {
        is_midterm_exam.value = false
    }
})
onMounted(async () => {
    // edit.value = <GetScheduleListData>props.dataDetail
    // is_midterm_exam.value = edit.value.is_midterm_exam
    // is_endterm_exam.value = edit.value.is_endterm_exam

    // study_program_id.value = <string>props.dataStudyProgramId
    // semester_id.value = <string>props.dataSemesterId
    // room_id.value = edit.value.room_id
    // await getRoomDetailObj()
    // building_id.value = room_detail.value.building_id
    // class_id.value = edit.value.class_id

    // single_day_lecturer_id.value = edit.value.single_day_lecturer_id
    // single_day_date.value = moment(edit.value.single_day_date).format('YYYY-MM-DD')

    // let start_time = convertTimeNumberToString(edit.value.start_time)
    // let end_time = convertTimeNumberToString(edit.value.end_time)
    // let splitStartTime = start_time.split('.')
    // let splitEndTime = end_time.split('.')

    // start_hour.value = splitStartTime[0].length > 1 ? splitStartTime[0] : `0${splitStartTime[0]}`
    // start_minute.value = splitStartTime[1]

    // end_hour.value = splitEndTime[0].length > 1 ? splitEndTime[0] : `0${splitEndTime[0]}`
    // end_minute.value = splitEndTime[1]

    // if (edit.value.theory_credit > 0) {
    //     is_theory_exam.value = true
    // }
    // if (edit.value.practicum_credit > 0) {
    //     is_practicum_exam.value = true
    // }
    // if (edit.value.field_practicum_credit > 0) {
    //     is_field_practicum_exam.value = true
    // }
    // is_practicum_exam
    // is_field_practicum_exam
    // await getAdminStudyProgram()
    // await getSemester()
    // await getLecturer()
    // await getClassroom(1000, 1, '', true)
    // await getBuilding()
    // await getRoom()
    // isMbkm.value = <boolean>props.isMbkm
})

function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
// watch(semester_id, async (value) => {
//     if (value != '') {
//         semester_id.value = value
//     }
//     await getClassroom(1000, 1, '', true)
// })
</script>
<template>
    <div>
        <!-- <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">{{ title }}</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=4 lg="4" md="4" class="float-left">
                                <v-select v-model="study_program_id" variant="outlined" hide-details
                                    :items="adminStudyPrograms" item-value="id" item-title="name"
                                    label="Pilih Program Studi"
                                    @update:model-value="(sl: any) => adminStudyProgramsOnChange(sl)"></v-select>
                            </v-col>
                            <v-col cols=4 lg="4" md="4" class="float-left">
                                <v-select v-model="semester_id" item-value="id" variant="outlined" hide-details
                                    :items="semesters" label="Pilih Semester"
                                    @update:model-value="(sl: any) => semesterOnChange(sl)">
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
                            </v-col>
                            <v-col cols=4 lg="4" md="4" class="float-left">
                                <v-select v-model="class_id" item-value="id" variant="outlined" hide-details
                                    :items="classrooms" label="Pilih Kelas"
                                    @update:model-value="(sl: any) => classroomOnChange(sl)">
                                    <template v-slot:selection="{ item }">
                                        <span>{{ item.props.title.subject_code }} - {{ item.props.title.subject_name }} - {{
                                            item.props.title.name }}</span>
                                    </template>
                                    <template v-slot:item="{ item, props: { onClick, title, value } }">
                                        <ul>
                                            <li style="padding: 10px; margin: 2px;">
                                                <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                    @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                    <span @click="onClick">{{ title.subject_code }} - {{ title.subject_name
                                                    }} - {{ title.name }}</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </template>
                                </v-select>
                            </v-col>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=6 lg="6" md="6" class="float-left">
                                <v-select v-model="building_id" variant="outlined" hide-details :items="buildings"
                                    item-value="id" item-title="name" label="Pilih Gedung"
                                    @update:model-value="(sl: any) => buildingOnChange(sl)"></v-select>
                            </v-col>
                            <v-col cols=6 lg="6" md="6" class="float-left">
                                <v-select v-model="room_id" variant="outlined" hide-details :items="rooms" item-value="id"
                                    item-title="name" label="Pilih Ruangan"
                                    @update:model-value="(sl: any) => roomOnChange(sl)"></v-select>
                            </v-col>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols="4" lg="4" class="float-left">
                                <v-text-field v-model="single_day_date" type="date" variant="outlined" hide-details="auto"
                                    label="Pilih Tanggal" :readonly="false" />
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="start_hour" :items="hours" item-value="id" item-title="name"
                                    @update:model-value="(sl: any) => startHourOnChange(sl)" label="Dari Jam"></v-select>
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="start_minute" :items="minutes" item-value="id" item-title="name"
                                    @update:model-value="(sl: any) => startMinuteOnChange(sl)"
                                    label="Dari Menit"></v-select>
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="end_hour" :items="hours" item-value="id" item-title="name"
                                    @update:model-value="(sl: any) => endHourOnChange(sl)" label="Sampai Jam"></v-select>
                            </v-col>
                            <v-col cols="2" lg="2" class="float-left">
                                <v-select v-model="end_minute" :items="minutes" item-value="id" item-title="name"
                                    @update:model-value="(sl: any) => endMinuteOnChange(sl)"
                                    label="Sampai Menit"></v-select>
                            </v-col>

                            <v-col cols=12 lg="12" md="12">
                                <v-col cols="4" lg="4" class="float-left">
                                    <v-switch v-model="is_midterm_exam" label="UTS" color="primary"></v-switch>
                                </v-col>
                                <v-col cols="4" lg="4" class="float-left">
                                    <v-switch v-model="is_endterm_exam" label="UAS" color="primary"></v-switch>
                                </v-col>
                            </v-col>
                            <v-col cols="12" lg="12" class="float-left">
                                <v-select v-model="single_day_lecturer_id" variant="outlined" hide-details
                                    :items="lecturers" item-value="id" item-title="name" label="Pilih Dosen"
                                    @update:model-value="(sl: any) => lecturerOnChange(sl)"></v-select>
                            </v-col>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols="4" lg="4" class="float-left">
                                <v-switch v-model="is_theory_exam" label="Teori" color="primary"></v-switch>
                            </v-col>
                            <v-col cols="4" lg="4" class="float-left">
                                <v-switch v-model="is_practicum_exam" label="Praktek" color="primary"></v-switch>
                            </v-col>
                            <v-col cols="4" lg="4" class="float-left">
                                <v-switch v-model="is_field_practicum_exam" label="Praktek Lapangan"
                                    color="primary"></v-switch>
                            </v-col>
                        </v-col>
                        <v-col cols="12" lg="12" class="float-left" v-if="is_theory_exam">
                            <v-text-field v-model.number="edit.theory_credit" type="number" variant="outlined"
                                hide-details="auto" label="SKS (Teori)" />
                        </v-col>
                        <v-col cols="12" lg="12" class="float-left" v-if="is_practicum_exam">
                            <v-text-field v-model.number="edit.practicum_credit" type="number" variant="outlined"
                                hide-details="auto" label="SKS (Praktikum)" />
                        </v-col>
                        <v-col cols="12" lg="12" class="float-left" v-if="is_field_practicum_exam">
                            <v-text-field v-model.number="edit.field_practicum_credit" type="number" variant="outlined"
                                hide-details="auto" label="SKS (Lapangan)" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    :disabled="edit.class_id == '' || edit.room_id == '' || edit.single_day_lecturer_id == '' || single_day_date == '' || (is_theory_exam && edit.theory_credit == 0) || (is_practicum_exam && edit.practicum_credit == 0) || (is_field_practicum_exam && edit.field_practicum_credit == 0)"
                                    @click="update()">
                                    Tambah
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card> -->
</div></template>