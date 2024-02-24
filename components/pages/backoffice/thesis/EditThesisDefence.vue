<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';
import { PaginationModel } from '~~/types/api/pagination';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';
import { convertNumberTimeToStringTimeBootstrap } from '~~/utils/helpers/date-utils';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { UpdateThesisDefenceRequest, UpdateThesisDefenceExaminerRequest } from '~~/types/api/thesis/UpdateThesisDefence';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetThesisData } from '~~/types/api/thesis/GetThesis';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetExaminerRoleData } from '~~/types/api/thesis/GetExaminerRole';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';
import { GetRegistrationThesisData } from '~~/types/api/thesis/GetRegistrationThesis';
import { GetGradeTypeListData } from '~~/types/api/grade-type/GetGradeTypeList';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { updateThesisDefence } from '~~/composables/api/admin-thesis/updateThesisDefence';
import { getThesis } from '~~/composables/api/admin-thesis/getThesis';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getExaminerRole } from '~~/composables/api/admin-thesis/getExaminerRole';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';
import { getRoomList } from '~~/composables/api/room/getRoomList';
import { getGradeTypeList } from '~~/composables/api/grade-type/getGradeTypeList';

const props = defineProps({
    data: <GetRegistrationThesisData>{} as any
});

const emit = defineEmits(['reload', 'close'])

const update = ref(<UpdateThesisDefenceRequest>{})
const study_program_name = ref('')
const thesis_title = ref('')
const plan_start_time = ref('')
const plan_end_time = ref('')
const actual_start_time = ref('')
const actual_end_time = ref('')

// const create = ref(<CreateThesisDefenceRequest>{
//     thesis_id: '',
//     plan_date: '',
//     plan_start_time: '',
//     plan_end_time: '',
//     room_id: '',
//     examiners: <CreateThesisDefenceLecturerRequest[]>[]
// })
// const study_programs = ref(<GetAdminStudyProgramListData[]>[])
const study_program_id = ref('')
// const semesters = ref(<GetSemesterListData[]>[])
// const semester_id = ref('')
// const thesis_list = ref(<GetThesisData[]>[])
const lecturers = ref(<GetLecturerListData[]>[])
const lecturer = ref(<GetLecturerListData>{})
const examiners = ref(<GetExaminerRoleData[]>[])
const examiner = ref(<GetExaminerRoleData>{})
const study_level_id = ref('')
const grade_types = ref(<GetGradeTypeListData[]>[])
// const buildings = ref(<GetBuildingListData[]>[])
// const building_id = ref('')
// const rooms = ref(<GetRoomListData[]>[])

// async function getThesisList(limit: number, page: number, search: string ) {
//     try {
//         const { response: resp, error: error } = await getThesis(limit, page, search, study_program_id.value, '', semester_id.value)
//         if (error) {
//             let dataError = <ErrorRoot>error;
//             alert(dataError.meta.message);
//             return;
//         }
//         if (resp != null) {
//             thesis_list.value = resp?.data
//         }
//     } catch (error) {
//         alert(error)
//     }
// }
// async function getAdminStudyProgram() {
//     try {
//         const { response: resp, error: error } = await getAdminStudyProgramList(10000, 1, '', '')
//         if (error) {
//             let dataError = <ErrorRoot>error;
//             alert(dataError.meta.message);
//             return;
//         }
//         if (resp != null) {
//             study_programs.value = resp?.data
//         }
//     } catch (error) {
//         console.log(error)
//         alert(error)
//     }
// }

// async function getSemester() {
//     try {
//         const { response: resp, error: error } = await getSemesterList(1000000, 1, study_program_id.value, "")
//         if (error) {
//             let dataError = <ErrorRoot>error;
//             alert(dataError.meta.message);
//             return;
//         }
//         if (resp != null) {
//             semesters.value = resp?.data
//             semesters.value.forEach((s) => {
//                 s.semester_type_year = s.semester_type + " " + s.school_year
//             })
//         }
//     } catch (error) {
//         alert(error)
//     }
// }

async function getLecturer() {
    try {
        const { response: resp, error: error } = await getLecturerList(10000, 1, '', study_program_id.value, '', '', '', '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturers.value = resp?.data
        }
    } catch (error) {
        console.log(error)
        alert(error)
    }
}

async function examinerRole() {
    try {
        const { response: resp, error: error } = await getExaminerRole(10000, 1, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            examiners.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

// async function getBuilding() {
//     try {
//         const { response: resp, error: error } = await getBuildingList(10000, 1, '')
//         if (error) {
//             let dataError = <ErrorRoot>error;
//             alert(dataError.meta.message);
//             return;
//         }
//         if (resp != null) {
//             buildings.value = resp?.data
//         }
//     } catch (error) {
//         alert(error)
//     }
// }

// async function getRoom() {
//     try {
//         const { response: resp, error: error } = await getRoomList(10000, 1, '', building_id.value, '', '', '', '', '', '')
//         if (error) {
//             let dataError = <ErrorRoot>error;
//             alert(dataError.meta.message);
//             return;
//         }
//         if (resp != null) {
//             rooms.value = resp?.data
//         }
//     } catch (error) {
//         alert(error)
//     }
// }

async function getGradeType() {
    try {
        const { response: resp, error: error } = await getGradeTypeList(10000, 1, '', study_level_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            grade_types.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function addExaminer(){
    if(lecturer.value.id != '' && examiner.value.id != ''){
        let index = update.value.examiners.findIndex(x => x.lecturer_id ===  lecturer.value.id && x.thesis_examiner_role_id === examiner.value.id);
        if(index < 0){
            let data = <UpdateThesisDefenceExaminerRequest>{
                lecturer_id: lecturer.value.id,
                lecturer_name: lecturer.value.name,
                thesis_examiner_role_id: examiner.value.id,
                thesis_examiner_role_name: examiner.value.name,
            }
            update.value.examiners.push(data)
        }
    }
    lecturer.value = <GetLecturerListData>{}
    examiner.value = <GetExaminerRoleData>{}
}

async function updateData(){
    if(plan_start_time.value){
        update.value.plan_start_time = plan_start_time.value
    }
    if(plan_end_time.value){
        update.value.plan_end_time = plan_end_time.value
    }
    if(actual_start_time.value){
        update.value.actual_start_time = actual_start_time.value
    }
    if(actual_end_time.value){
        update.value.actual_end_time = actual_end_time.value
    }
    try {
        const { response: createRoleResponse, error } = await updateThesisDefence(update.value)
        
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            console.log(dataError.meta.message);
            return;
        } else {
            emit('reload');
        }
        // return true;
    } catch (error) {
        alert(error)
        console.log(error)
        // return false;
    }
    emit('close');
}

async function deleteSupervisor(item: any){
    let index = update.value.examiners.findIndex(x => x.lecturer_id ===  item.lecturer_id && x.thesis_examiner_role_id === item.thesis_examiner_role_id);
    update.value.examiners.splice(index, 1)
}

// function MouseOver(ev: any){
//     ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
// }
// function MouseOut(ev: any){
//     ev.target.parentNode.parentNode.style.backgroundColor = 'white'
// }

// watch(building_id, async (value) => {
//     // await getAdminStudyProgram()
//     // await getSemester()
//     // await getThesisList(10000, 1, '')
//     // await getLecturer()
//     // await examinerRole()
//     // await getBuilding()
//     await getRoom()
// });

onMounted(async () => {
    study_program_id.value = props.data.study_program_id
    let result_examiners = props.data.examiners
    let examiners = <UpdateThesisDefenceExaminerRequest[]>[]
    // const update = ref(<UpdateThesisDefenceRequest>{})
    if(result_examiners){
        for (let index = 0; index < result_examiners.length; index++) {
            const element = result_examiners[index];
            examiners.push(<UpdateThesisDefenceExaminerRequest>{
                lecturer_id: result_examiners[index].lecturer_id,
                lecturer_name: result_examiners[index].lecturer_name,
                thesis_examiner_role_id: result_examiners[index].thesis_examiner_role_id,
                thesis_examiner_role_name: result_examiners[index].thesis_examiner_role_name,
            })
        }
    }

    update.value = <UpdateThesisDefenceRequest>{
        id: props.data.thesis_defense_id,
        plan_date: props.data.thesis_defense_plan_date ? formatYearMonthDate(props.data.thesis_defense_plan_date) : '',
        plan_start_time: props.data.thesis_defense_plan_start_time,
        plan_end_time: props.data.thesis_defense_plan_end_time,
        room_id: props.data.thesis_defense_room_id,
        actual_date: props.data.thesis_defense_actual_date ? formatYearMonthDate(props.data.thesis_defense_actual_date) : '',
        actual_start_time: props.data.thesis_defense_actual_start_time,
        actual_end_time: props.data.thesis_defense_actual_end_time,
        is_passed: props.data.thesis_defense_is_passed,
        revision: props.data.thesis_defense_revision,
        grade_code: props.data.thesis_grade_code,
        examiners: examiners,
    }
    study_program_name.value = props.data.study_program_name
    thesis_title.value = props.data.thesis_title + ` (${props.data.student_name})`
    plan_start_time.value = update.value.plan_start_time ? convertNumberTimeToStringTimeBootstrap(Number(update.value.plan_start_time)) : ''
    plan_end_time.value = update.value.plan_end_time ? convertNumberTimeToStringTimeBootstrap(Number(update.value.plan_end_time)) : ''
    actual_start_time.value = update.value.actual_start_time ? convertNumberTimeToStringTimeBootstrap(Number(update.value.actual_start_time)) : ''
    actual_end_time.value = update.value.actual_end_time ? convertNumberTimeToStringTimeBootstrap(Number(update.value.actual_end_time)) : ''
    study_level_id.value = props.data.study_level_id

    await getLecturer()
    await examinerRole()
    await getGradeType()
})
</script>

<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">Proses Ujian TA</v-card-title>
            <v-card-text>
                <v-col cols="12" sm="12">
                    <v-form ref="form" lazy-validation>
                        <v-row>
                            <v-col cols="12" sm="12">
                                <v-text-field v-model="study_program_name" variant="outlined" hide-details label="Program Studi"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field v-model="thesis_title" variant="outlined" hide-details label="Tugas Akhir Mahasiswa"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="date" v-model="update.plan_date" variant="outlined" hide-details label="Tanggal Rencana TA"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="time" v-model="plan_start_time" variant="outlined" hide-details label="Jam Mulai Rencana TA"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="time" v-model="plan_end_time" variant="outlined" hide-details label="Jam Selesai Rencana TA"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="date" v-model="update.actual_date" variant="outlined" hide-details label="Tanggal Rencana TA"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="time" v-model="actual_start_time" variant="outlined" hide-details label="Jam Mulai Rencana TA"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="time" v-model="actual_end_time" variant="outlined" hide-details label="Jam Selesai Rencana TA"></v-text-field>
                            </v-col>
                            <v-col cols=12 lg="12" md="12">
                                <v-col cols=12 lg="4" md="4" class="float-left mt-1 text-right">
                                    <v-select v-model="lecturer" variant="outlined" hide-details :items="lecturers" label="Dosen Pembimbing" return-object>
                                        <template v-slot:selection="{ item }">
                                            <span>{{ item.props.title.name }}</span>
                                        </template>
                                        <template v-slot:item="{ item, props: { onClick, title, value } }">
                                            <ul>
                                                <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                    <li style="padding: 10px; margin: 2px;" @click="onClick">
                                                        <span>{{ title.name }}</span>
                                                    </li>
                                                </a>
                                            </ul>
                                        </template>
                                    </v-select>
                                </v-col>
                                <v-col cols=12 lg="4" md="4" class="float-left mt-1 text-right">
                                    <v-select v-model="examiner" variant="outlined" hide-details :items="examiners" label="Peran Dosen Petugas" return-object>
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
                                <v-col cols=12 lg="4" md="4" class="float-right mt-1 text-right">
                                    <v-btn flat solo color="primary" @click="addExaminer">
                                        Tambah Petugas
                                    </v-btn>
                                </v-col>
                            </v-col>
                            <v-col cols=12 lg="12" md="12">
                                <v-table class="mt-5">
                                    <thead>
                                        <tr>
                                            <th class="text-subtitle-1 font-weight-semibold">No</th>
                                            <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                            <th class="text-subtitle-1 font-weight-semibold">Peran</th>
                                            <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in update.examiners">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ item.lecturer_name }}</td>
                                            <td>{{ item.thesis_examiner_role_name }}</td>
                                            <td>
                                                <v-tooltip text="Hapus">
                                                    <template #activator="{ props }">
                                                        <v-btn icon flat v-bind="props" @click="deleteSupervisor(item)">
                                                            <TrashIcon stroke-width="1.5" size="20" class="text-primary" />
                                                        </v-btn>
                                                    </template>
                                                </v-tooltip>
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-textarea v-model="update.revision" variant="outlined" hide-details label="Catatan Revisi"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-switch v-model="update.is_passed" color="primary" label="Selesai" hide-details
                                class="pl-2"></v-switch>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-select v-model="update.grade_code" :items="grade_types" item-title="code" item-value="code" label="Nilai"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="$emit('close')">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" :disabled="update.plan_date == '' || plan_start_time == '' || plan_end_time == '' || update.actual_date == '' || actual_start_time == '' || actual_end_time == ''"
                                        @click="updateData(); ">
                                        Tambah
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-card-text>
        </v-card>
    </div>
</template>