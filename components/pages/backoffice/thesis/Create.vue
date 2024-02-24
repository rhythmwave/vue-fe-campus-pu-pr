<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

import { GetStudentListRequest, GetStudentListData } from '~~/types/api/student/GetStudentList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { CreateThesisRequest, CreateThesisSupervisorRequest } from '~~/types/api/thesis/CreateThesis';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetSupervisorRoleData } from '~~/types/api/thesis/GetSupervisorRole';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';

import { getStudentList } from '~~/composables/api/student/getStudentList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { fileUpload } from '~~/utils/helpers/file-upload';
import { getSupervisorRole } from '~~/composables/api/admin-thesis/getSupervisorRole';
import { createThesis } from '~~/composables/api/admin-thesis/createThesis';

import moment from 'moment';
const props = defineProps({
    semesterId: String,
    studyProgramId: String,
});

const emit = defineEmits(['reload', 'close'])

const reqStudent = ref(<GetStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    address: '',
    regencyId: '',
    status: ['AKTIF'],
    getAcademicGuidance: '',
    hasAuthentication: '',
    studyPlanSemesterId: '',
    studyPlanIsApproved: '',
    studyPlanIsSubmitted: '',
    hasStudyPlan: '',
    statusSemesterId: '',
    isRegistered: '',
    hasPaid: '',
    isGraduateEligible: '',
    isThesisEligible: '',
    yudiciumSessionId: '',
})
const students = ref(<GetStudentListData[]>[])
const study_programs = ref(<GetAdminStudyProgramListData[]>[])
const lecturers = ref(<GetLecturerListData[]>[])
const lecturer = ref(<GetLecturerListData>{})
const study_program_id = ref('')
const create = ref(<CreateThesisRequest>{
    student_id: '',
    topic: '',
    status: '',
    title: '',
    english_title: '',
    start_semester_id: '',
    start_date: '',
    remarks: '',
    is_joint_thesis: false,
    file_path: '',
    file_path_type: '',
    file_description: '',
    proposal_seminar_date: '',
    proposal_certificate_number: '',
    proposal_certificate_date: '',
    thesis_supervisors: <CreateThesisSupervisorRequest[]>[]
})
const file = ref('')
const fileBase64 = ref('')
const supervisor_roles = ref(<GetSupervisorRoleData[]>[])
const supervisor_role = ref(<GetSupervisorRoleData>{})
const semesters = ref<GetSemesterListData[]>([])
const semester_id = ref('')

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
async function getStudent() {
    try {
        const { response: resp, error: error } = await getStudentList(10000, 1, reqStudent.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
        }
    } catch (error) {
        console.log(error)
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
async function supervisorRole() {
    try {
        const { response: resp, error: error } = await getSupervisorRole(10000, 1, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            supervisor_roles.value = resp?.data
        }
    } catch (error) {
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

async function fileChanged(event: any) {
    const target = event.target as HTMLInputElement
    if (target.files?.length == 0) {
        alert('pilih file')
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function () {
        const base64 = reader.result!.toString().split(',')[1]
        fileBase64.value = base64
    }
}
async function addSupervisor(){
    if(lecturer.value.id != '' && supervisor_role.value.id != ''){
        let index = create.value.thesis_supervisors.findIndex(x => x.lecturer_id ===  lecturer.value.id && x.thesis_supervisor_role_id === supervisor_role.value.id);
        if(index < 0){
            let data = <CreateThesisSupervisorRequest>{
                lecturer_id: lecturer.value.id,
                lecturer_name: lecturer.value.name,
                thesis_supervisor_role_id: supervisor_role.value.id,
                thesis_supervisor_role_name: supervisor_role.value.name,
            }
            create.value.thesis_supervisors.push(data)
        }
    }
    lecturer.value = <GetLecturerListData>{}
    supervisor_role.value = <GetSupervisorRoleData>{}
}

async function deleteSupervisor(item: any){
    let index = create.value.thesis_supervisors.findIndex(x => x.lecturer_id ===  item.lecturer_id && x.thesis_supervisor_role_id === item.thesis_supervisor_role_id);
    create.value.thesis_supervisors.splice(index, 1)
}

async function save(){
    let tempFile: any = {};
    if (fileBase64.value) {
        tempFile = await fileUpload(fileBase64.value)
        create.value.file_path = tempFile.path
        create.value.file_path_type = tempFile.path_type
    }
    try {
        const { response: createRoleResponse, error } = await createThesis(create.value)
        
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

function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

// watch(study_program_id, async (value) => {
//     reqStudent.value.studyProgramId = value
//     await getAdminStudyProgram()
//     await getSemester()
//     await getLecturer()
//     await supervisorRole()
//     await getStudent()
// });

onMounted(async () => {
    create.value.start_semester_id = <string>props.semesterId
    await getAdminStudyProgram()
    study_program_id.value = <string>props.studyProgramId
    reqStudent.value.studyProgramId = study_program_id.value
    await getSemester()
    semester_id.value = create.value.start_semester_id
    await getLecturer()
    await supervisorRole()
    await getStudent()
})
</script>

<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">Buat Tugas Akhir</v-card-title>
            <v-card-text>
                <v-col cols="12" sm="12">
                    <v-form ref="form" lazy-validation class="mt-5">
                        <v-row>
                            <v-col cols="12" sm="12">
                                <v-select v-model="study_program_id" item-value="id" item-title="name" variant="outlined" hide-details :items="study_programs" label="Program Studi" :readonly="true"></v-select>
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
                                <v-select v-model="create.student_id" item-value="id" item-title="name" variant="outlined" hide-details :items="students" label="Mahasiswa *"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-textarea v-model="create.topic" variant="outlined" hide-details label="Topik *"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-select v-model="create.status" :items="['DIAJUKAN', 'SEDANG DIKERJAKAN', 'DIBATALKAN', 'BERHASIL DISELESAIKAN', 'GAGAL DISELESAIKAN', 'REVISI']" hide-details variant="outlined" label="Status *"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field density="compact" v-model="create.title" label="Judul *" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field density="compact" v-model="create.english_title" label="Judul (English)" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="date" density="compact" v-model="create.start_date" label="Tanggal *" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-textarea v-model="create.remarks" variant="outlined" hide-details label="Catatan"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-switch v-model="create.is_joint_thesis" label="Kelompok"></v-switch>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="date" density="compact" v-model="create.proposal_seminar_date" label="Tanggal Pengajuan TA *" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field density="compact" v-model="create.proposal_certificate_number" label="Nomor SK Tugas *" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="date" density="compact" v-model="create.proposal_certificate_date" label="Tanggal SK Tugas *" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols=12 lg="12" md="12">
                                <v-text-field type="file" variant="outlined" hide-details="auto" label="File" @change="fileChanged" />
                            </v-col>
                            <v-col cols=12 lg="12" md="12">
                                <v-text-field v-model="create.file_description" variant="outlined" hide-details="auto" label="Keterangan File" />
                            </v-col>
                            <Vspace space="3" />
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
                                    <v-select v-model="supervisor_role" variant="outlined" hide-details :items="supervisor_roles" label="Peran Dosen Pembimbing" return-object>
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
                                    <v-btn flat solo color="primary" @click="addSupervisor">
                                        Tambah Pembimbing
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
                                        <tr v-for="(item, index) in create.thesis_supervisors">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ item.lecturer_name }}</td>
                                            <td>{{ item.thesis_supervisor_role_name }}</td>
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
                            <v-alert type="info" variant="tonal">
                                Keterangan :
                                <br />
                                - Tanda (*) Harus diisi <br> - Ukuran file maksimal 2Mb
                            </v-alert>
                            <v-col cols="12">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="$emit('close')">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" @click="save()" :disabled="create.status == '' || create.title == '' || create.thesis_supervisors.length == 0  || create.start_semester_id == '' || create.start_date == '' || create.proposal_seminar_date == '' || create.proposal_certificate_number == '' || create.proposal_certificate_date == '' || create.topic == ''">
                                        Simpan
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