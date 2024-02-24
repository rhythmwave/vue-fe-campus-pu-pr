<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetLecturerLeaveListData, GetLecturerLeaveListRoot } from '~~/types/api/lecturer-leave/GetLecturerLeaveList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateLecturerLeaveRequest } from '~~/types/api/lecturer-leave/CreateLecturerLeave';
import { createLecturerLeave } from '~~/composables/api/lecturer-leave/createLecturerLeave';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { CreateFileRequest } from '~~/types/api/file/CreateFile';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { toBase64 } from '~~/utils/helpers/to-base64'
import { createFile } from '~~/composables/api/file/createFile';

const props = defineProps({
    adminStudyProgram: Array as any,
    semester: Array as any,
});

const adminStudyProgram = ref(<GetAdminStudyProgramListData>{})
const semester = ref(<GetSemesterListData>{})
const fileView = ref('')
const valid = ref(true)
const createLecturerLeaveRequest = ref(<CreateLecturerLeaveRequest>{
    lecturer_id: "",
    semester_id: "",
    start_date: "",
    permit_number: "",
    purpose: "",
    remarks: "",
});

const emitData = defineEmits(['close', 'reload'])

// const Sample = ref<GetSampleListData[]>([])
// async function getSample() {
//     try {
//         const { response: resp, error: error } = await getSampleList(1000000, 1, "")
//         if (error) {
//             let dataError = <ErrorRoot>error;
//             alert(dataError.meta.message);
//             return;
//         }
//         if (resp != null) {
//             Sample.value = resp?.data
//         }
//     } catch (error) {
//         alert(error)
//     }
// }

async function save() {
    try {
        let req: CreateLecturerLeaveRequest = Object.assign({}, createLecturerLeaveRequest.value)
        if (req.start_date) {
            req.start_date = convertDateWithoutTimeToTimezoned(req.start_date)
        }
        const { response: createRoleResponse, error } = await createLecturerLeave(req)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emitData('reload');
        }
        // return true;
        emitData('close');
    } catch (error) {
        alert(error)
        // return false;
    }

}

const dialog = ref(false)

const lecturers = ref(<GetLecturerListData[]>[]);
const lecturersRadio = ref(<GetLecturerListData>{ id: "", name: "" });
const lecturersSelected = ref(<GetLecturerListData>{ id: "", name: "" });
async function getLecturers() {
    try {
        const { response: resp, error: error } = await getLecturerList(1000000, 1, "", adminStudyProgram.value.id, "", "", semester.value.id, '', '', '', '', '')
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

function saveLecturer() {

    lecturersSelected.value = lecturersRadio.value;
    let tempIds = <string[]>[];

    createLecturerLeaveRequest.value.lecturer_id = lecturersSelected.value.id;
}

function clearLecturers() {
    lecturersRadio.value = <GetLecturerListData>{ id: "", name: "" };
    lecturersSelected.value = <GetLecturerListData>{ id: "", name: "" };
}
async function getBase64(file: any) {
    fileView.value = <string>await toBase64(file.target.files[0])
    if(fileView.value != ''){
        try {
            const { response: createFileResponse, error } = await createFile(<CreateFileRequest>{
                file: fileView.value.split(',')[1],
            })
            if (error) {
                let dataError = <ErrorRoot>error;
                alert(dataError.meta.message);
                return;
            } else {
                createLecturerLeaveRequest.value.file_path = <string>createFileResponse?.data.path
                createLecturerLeaveRequest.value.file_path_type = <string>createFileResponse?.data.path_type
            }
        } catch (error) {
            alert(error)
        }
    }
}
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
onMounted(async () => {
    adminStudyProgram.value = <GetAdminStudyProgramListData>props.adminStudyProgram
    semester.value = <GetSemesterListData>props.semester
    createLecturerLeaveRequest.value.semester_id = semester.value.id
    await getLecturers()
});
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Cuti Dosen</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-dialog v-model="dialog" scrollable>
                                <template v-slot:activator="{ props }">
                                    Pilih Dosen &nbsp;
                                    <v-btn color="success" style="width: 20px;height: 20px;" v-bind="props" flat>
                                        <PlusIcon style="width: 20px;height: 20px;" />
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>Pilih Dosen</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <v-radio-group hide-details v-model="lecturersRadio" inline
                                            class="d-flex gap-3 justify-center">
                                            <v-radio :label="itm.name" color="primary" :value="itm"
                                                v-for="itm in lecturers"></v-radio>
                                        </v-radio-group>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn color="error" text @click="dialog = false; clearLecturers();">
                                            Tutup
                                        </v-btn>
                                        <v-btn color="success" text @click="dialog = false; saveLecturer();">
                                            Pilih
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>
                        <v-col cols="12" sm="12" v-if="lecturersSelected.id">
                            <v-text-field v-model="lecturersSelected.name" variant="outlined" hide-details label="Nama"
                                :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="lecturersSelected.id">
                            <v-text-field v-model="lecturersSelected.id_national_lecturer" variant="outlined" hide-details
                                label="NIDN" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="adminStudyProgram.name" variant="outlined" hide-details
                                label="Program Studi" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field variant="outlined" hide-details :value="'Semester '+semester.school_year+' '+semester.semester_type" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createLecturerLeaveRequest.start_date" type="date" variant="outlined"
                                hide-details label="Tanggal" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createLecturerLeaveRequest.permit_number" variant="outlined" hide-details
                                label="Nomor Surat Izin Cuti" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details
                                :items="[{ id: 'Sakit', name: 'Sakit' }, { id: 'Bekerja', name: 'Bekerja' }, { id: 'Hamil', name: 'Hamil' }, { id: 'lainnya', name: 'lainnya' },]"
                                item-value="id" item-title="name" label="Alasan Cuti"
                                v-model="createLecturerLeaveRequest.purpose"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea outlined v-model="createLecturerLeaveRequest.remarks" label="Catatan"
                                variant="outlined" hide-details="auto" :readonly="false"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" variant="outlined" hide-details label="Attachment" @change="getBase64($event)" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="fileView != ''" class="text-center">
                            <img :src="fileView" style="max-height: 300px;" alt="File Fiew" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createLecturerLeaveRequest.lecturer_id == ''"
                                    @click="save();">
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