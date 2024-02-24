<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';
import { PaginationModel } from '~~/types/api/pagination';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { CreateThesisDefenceRequest, CreateThesisDefenceLecturerRequest } from '~~/types/api/thesis/CreateThesisDefence';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetThesisData } from '~~/types/api/thesis/GetThesis';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetExaminerRoleData } from '~~/types/api/thesis/GetExaminerRole';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { createThesisDefence } from '~~/composables/api/admin-thesis/createThesisDefence';
import { getThesis } from '~~/composables/api/admin-thesis/getThesis';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getExaminerRole } from '~~/composables/api/admin-thesis/getExaminerRole';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';
import { getRoomList } from '~~/composables/api/room/getRoomList';

const props = defineProps({
    semesterId: String,
    studyProgramId: String,
});

const emit = defineEmits(['reload', 'close'])

const create = ref(<CreateThesisDefenceRequest>{
    thesis_id: '',
    plan_date: '',
    plan_start_time: '',
    plan_end_time: '',
    room_id: '',
    examiners: <CreateThesisDefenceLecturerRequest[]>[]
})
const study_programs = ref(<GetAdminStudyProgramListData[]>[])
const study_program_id = ref('')
const semesters = ref(<GetSemesterListData[]>[])
const semester_id = ref('')
const thesis_list = ref(<GetThesisData[]>[])
const lecturers = ref(<GetLecturerListData[]>[])
const lecturer = ref(<GetLecturerListData>{})
const examiners = ref(<GetExaminerRoleData[]>[])
const examiner = ref(<GetExaminerRoleData>{})
const buildings = ref(<GetBuildingListData[]>[])
const building_id = ref('')
const rooms = ref(<GetRoomListData[]>[])

async function getThesisList(limit: number, page: number, search: string ) {
    try {
        const { response: resp, error: error } = await getThesis(limit, page, search, study_program_id.value, '', semester_id.value, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            thesis_list.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(10000, 1, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            study_programs.value = resp?.data
        }
    } catch (error) {
        console.log(error)
        alert(error)
    }
}

async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, study_program_id.value, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
            semesters.value.forEach((s) => {
                s.semester_type_year = s.semester_type + " " + s.school_year
            })
        }
    } catch (error) {
        alert(error)
    }
}

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

async function getBuilding() {
    try {
        const { response: resp, error: error } = await getBuildingList(10000, 1, '')
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
    try {
        const { response: resp, error: error } = await getRoomList(10000, 1, '', building_id.value, '', '', '', '', '', '')
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

async function addExaminer(){
    if(lecturer.value.id != '' && examiner.value.id != ''){
        let index = create.value.examiners.findIndex(x => x.lecturer_id ===  lecturer.value.id && x.thesis_examiner_role_id === examiner.value.id);
        if(index < 0){
            let data = <CreateThesisDefenceLecturerRequest>{
                lecturer_id: lecturer.value.id,
                lecturer_name: lecturer.value.name,
                thesis_examiner_role_id: examiner.value.id,
                thesis_examiner_role_name: examiner.value.name,
            }
            create.value.examiners.push(data)
        }
    }
    lecturer.value = <GetLecturerListData>{}
    examiner.value = <GetExaminerRoleData>{}
}

async function save(){
    try {
        const { response: createRoleResponse, error } = await createThesisDefence(create.value)
        
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
    let index = create.value.examiners.findIndex(x => x.lecturer_id ===  item.lecturer_id && x.thesis_examiner_role_id === item.thesis_examiner_role_id);
    create.value.examiners.splice(index, 1)
}

function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

watch(building_id, async (value) => {
    // await getAdminStudyProgram()
    // await getSemester()
    // await getThesisList(10000, 1, '')
    // await getLecturer()
    // await examinerRole()
    // await getBuilding()
    await getRoom()
});

onMounted(async () => {
    study_program_id.value = <string>props.studyProgramId
    semester_id.value = <string>props.semesterId
    await getAdminStudyProgram()
    await getSemester()
    await getThesisList(10000, 1, '')
    await getLecturer()
    await examinerRole()
    await getBuilding()
    // semester_id.value = <string>props.semesterId
})
</script>

<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">Buat Dosen Ujian TA</v-card-title>
            <v-card-text>
                <v-col cols="12" sm="12">
                    <v-form ref="form" lazy-validation>
                        <v-row>
                            <v-col cols="12" sm="12">
                                <v-select v-model="study_program_id" item-value="id" item-title="name" variant="outlined" hide-details :items="study_programs" label="Program Studi"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-select v-model="semester_id" item-value="id" variant="outlined" hide-details :items="semesters" label="Semester" :readonly="true">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                    }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                            <li style="padding: 10px; margin: 2px;" @click="onClick">
                                                <span>{{ title.school_year }} - {{ title.semester_type
                                                }}</span>
                                            </li>
                                        </a>
                                    </ul>
                                </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-select v-model="create.thesis_id" item-value="id" variant="outlined" hide-details :items="thesis_list" label="Tugas Akhir Mahasiswa">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.raw.title }} ({{ item.raw.student_name }})</span>
                                </template>
                                <template v-slot:item="{ item, props: {onClick} }">
                                    <ul>
                                        <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                            <li style="padding: 10px; margin: 2px;" @click="onClick">
                                                <span>{{ item.raw.title }} ({{ item.raw.student_name }})</span>
                                            </li>
                                        </a>
                                    </ul>
                                </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="date" v-model="create.plan_date" variant="outlined" hide-details label="Tanggal Rencana TA"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="time" v-model="create.plan_start_time" variant="outlined" hide-details label="Jam Mulai Rencana TA"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="time" v-model="create.plan_end_time" variant="outlined" hide-details label="Jam Selesai Rencana TA"></v-text-field>
                            </v-col>
                            <v-col cols=12 lg="12" md="12">
                                <v-select v-model="building_id" item-value="id" item-title="name" variant="outlined" hide-details :items="buildings" label="Gedung"></v-select>
                            </v-col>
                            <v-col cols=12 lg="12" md="12">
                                <v-select v-model="create.room_id" item-value="id" item-title="name" variant="outlined" hide-details :items="rooms" label="Ruangan"></v-select>
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
                                        <tr v-for="(item, index) in create.examiners">
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
                            <v-col cols="12">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="$emit('close')">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" :disabled="create.thesis_id == '' || create.plan_date == '' || create.plan_start_time == '' || create.plan_end_time == ''"
                                        @click="save(); ">
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