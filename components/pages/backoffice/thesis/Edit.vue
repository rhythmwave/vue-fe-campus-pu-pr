<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';

import { GetStudentListRequest, GetStudentListData } from '~~/types/api/student/GetStudentList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { EditThesisRequest, EditThesisFileRequest, EditThesisSupervisorRequest } from '~~/types/api/thesis/EditThesis';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetSupervisorRoleData } from '~~/types/api/thesis/GetSupervisorRole';
import { GetThesisDetailData } from '~~/types/api/thesis/GetThesisDetail';

import { getStudentList } from '~~/composables/api/student/getStudentList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { fileUpload } from '~~/utils/helpers/file-upload';
import { getSupervisorRole } from '~~/composables/api/admin-thesis/getSupervisorRole';
import { updateThesis } from '~~/composables/api/admin-thesis/updateThesis';
import { getThesisDetail } from '~~/composables/api/admin-thesis/getThesisDetail';

import moment from 'moment';
const props = defineProps({
    thesisId: String,
});

const emit = defineEmits(['reload', 'close'])
const lecturers = ref(<GetLecturerListData[]>[])
const lecturer = ref(<GetLecturerListData>{})
const study_program_id = ref('')
const edit = ref(<EditThesisRequest>{
    id: '',
    student_id: '',
    start_semester_id: '',
    finish_semester_id: '',
    topic: '',
    title: '',
    english_title: '',
    start_date: '',
    finish_date: '',
    remarks: '',
    is_joint_thesis: false,
    status: '',
    proposal_seminar_date: '',
    proposal_certificate_number: '',
    proposal_certificate_date: '',
    files: <EditThesisFileRequest[]>[],
    thesis_supervisors: <EditThesisSupervisorRequest[]>[],
})
const fileBase64s = ref(<string[]>[])
const file_description = ref(<string[]>[])
const supervisor_roles = ref(<GetSupervisorRoleData[]>[])
const supervisor_role = ref(<GetSupervisorRoleData>{})
const thesis_detail = ref(<GetThesisDetailData>{})
const thesis_id = ref('')


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

async function fileChanged(event: any) {
    fileBase64s.value = []
    file_description.value = []
    const target = event.target as HTMLInputElement
    if (target.files?.length == 0) {
        alert('pilih file')
        return false
    }
    for (let index = 0; index < target.files!.length; index++) {
        let reader = new FileReader();
        reader.readAsDataURL(target.files![index])
        reader.onload = function () {
            const base64 = reader.result!.toString().split(',')[1]
            fileBase64s.value.push(base64)
            file_description.value.push('')
        }
    }
}
async function addSupervisor(){
    if(lecturer.value.id != '' && supervisor_role.value.id != ''){
        let index = edit.value.thesis_supervisors.findIndex(x => x.lecturer_id ===  lecturer.value.id && x.thesis_supervisor_role_id === supervisor_role.value.id);
        if(index < 0){
            let data = <EditThesisSupervisorRequest>{
                lecturer_id: lecturer.value.id,
                lecturer_name: lecturer.value.name,
                thesis_supervisor_role_id: supervisor_role.value.id,
                thesis_supervisor_role_name: supervisor_role.value.name,
            }
            edit.value.thesis_supervisors.push(data)
        }
    }
    lecturer.value = <GetLecturerListData>{}
    supervisor_role.value = <GetSupervisorRoleData>{}
}
async function getDetail() {
    try {
        const { response: resp, error: error } = await getThesisDetail(thesis_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            thesis_detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function deleteSupervisor(item: any){
    let index = edit.value.thesis_supervisors.findIndex(x => x.lecturer_id ===  item.lecturer_id && x.thesis_supervisor_role_id === item.thesis_supervisor_role_id);
    edit.value.thesis_supervisors.splice(index, 1)
}

async function save(){
    let tempFile: any = {};
    if (fileBase64s.value.length > 0) {
        for (let index = 0; index < fileBase64s.value.length; index++) {
            tempFile = await fileUpload(fileBase64s.value[index])
            edit.value.files.push(<EditThesisFileRequest>{
                file_path: tempFile.path,
                file_path_type: tempFile.path_type,
                file_description: file_description.value[index],
            })
        }
    }
    try {
        const { response: createRoleResponse, error } = await updateThesis(edit.value)
        
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

onMounted(async () => {
    thesis_id.value = <string>props.thesisId
    await getDetail()
    study_program_id.value = <string>thesis_detail.value.study_program_id
        edit.value = <EditThesisRequest>{
            id: thesis_detail.value.id,
            student_id: thesis_detail.value.student_id,
            start_semester_id: thesis_detail.value.start_semester_id,
            finish_semester_id: thesis_detail.value.finish_semester_id,
            topic: thesis_detail.value.topic,
            title: thesis_detail.value.title,
            english_title: thesis_detail.value.english_title,
            start_date: thesis_detail.value.start_date ? formatYearMonthDate(thesis_detail.value.start_date) : '',
            finish_date: thesis_detail.value.finish_date ? formatYearMonthDate(thesis_detail.value.finish_date) : '',
            remarks: thesis_detail.value.remarks,
            is_joint_thesis: thesis_detail.value.is_joint_thesis,
            status: thesis_detail.value.status,
            proposal_seminar_date: thesis_detail.value.proposal_seminar_date ? formatYearMonthDate(thesis_detail.value.proposal_seminar_date) : '',
            proposal_certificate_number: thesis_detail.value.proposal_certificate_number,
            proposal_certificate_date: thesis_detail.value.proposal_certificate_date ? formatYearMonthDate(thesis_detail.value.proposal_certificate_date) : '',
            files: <EditThesisFileRequest[]>[],
            thesis_supervisors: <EditThesisSupervisorRequest[]>[],
    }
    if(thesis_detail.value.files){
        for (let index = 0; index < thesis_detail.value.files.length; index++) {
            edit.value.files.push(thesis_detail.value.files[index])
        }
    }
    if(thesis_detail.value.thesis_supervisors){
        for (let index = 0; index < thesis_detail.value.thesis_supervisors.length; index++) {
            edit.value.thesis_supervisors.push(thesis_detail.value.thesis_supervisors[index])
        }
    }
    await getLecturer()
    await supervisorRole()
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
                                <v-textarea v-model="edit.topic" variant="outlined" hide-details label="Topik *"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-select v-model="edit.status" :items="['DIAJUKAN', 'SEDANG DIKERJAKAN', 'DIBATALKAN', 'BERHASIL DISELESAIKAN', 'GAGAL DISELESAIKAN', 'REVISI']" hide-details variant="outlined" label="Status *"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field density="compact" v-model="edit.title" label="Judul *" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field density="compact" v-model="edit.english_title" label="Judul (English)" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="date" density="compact" v-model="edit.start_date" label="Tanggal *" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-textarea v-model="edit.remarks" variant="outlined" hide-details label="Catatan"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-switch v-model="edit.is_joint_thesis" label="Kelompok"></v-switch>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="date" density="compact" v-model="edit.proposal_seminar_date" label="Tanggal Pengajuan TA *" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field density="compact" v-model="edit.proposal_certificate_number" label="Nomor SK Tugas *" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12">
                                <v-text-field type="date" density="compact" v-model="edit.proposal_certificate_date" label="Tanggal SK Tugas *" hide-details variant="outlined"></v-text-field>
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
                                        <tr v-for="(item, index) in edit.thesis_supervisors">
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
                            <v-col cols=12 lg="12" md="12">
                                <label for="">Kumpulan File</label>
                                <ul>
                                    <li v-for="itm in thesis_detail.files">
                                        <a :href="itm.file_url" target="_blank" rel="noopener noreferrer">
                                            <h6 class="text-h6 font-weight-medium text-medium-emphasis">
                                                {{ itm.file_description }}
                                            </h6>
                                        </a>
                                    </li>
                                </ul>
                            </v-col>
                            <v-col cols=12 lg="12" md="12">
                                <v-text-field type="file" variant="outlined" hide-details="auto" label="File" @change="fileChanged" multiple />
                            </v-col>
                            <v-col cols=12 lg="12" md="12" v-if="file_description.length > 0" v-for="(item, index) in file_description">
                                <v-text-field density="compact" v-model="file_description[index]" :label="'File Deskripsi Ke : '+(index+1)" hide-details variant="outlined"></v-text-field>
                            </v-col>
                            <v-alert type="info" variant="tonal">
                                Keterangan : File Pada Halaman ini bisaa Multiple
                                <br />
                                - Tanda (*) Harus diisi <br> - Ukuran file maksimal 2Mb setiap file-nya
                            </v-alert>
                            <v-col cols="12">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="$emit('close')">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" @click="save()" :disabled="edit.status == '' || edit.title == '' || edit.start_semester_id == '' || edit.start_date == '' || edit.proposal_seminar_date == '' || edit.proposal_certificate_number == '' || edit.proposal_certificate_date == '' || edit.topic == ''">
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