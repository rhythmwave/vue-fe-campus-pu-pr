<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';

import { GetStudentListRequest, GetStudentListData } from "~~/types/api/student/GetStudentList";
import { UpdateStudentStatusRequest } from "~~/types/api/student/UpdateStudentStatus";
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { updateStudentStatus } from '~~/composables/api/student/updateStudentStatus';

import { ErrorRoot } from '~~/types/api/error';

const props = defineProps({
    status: String,
    studyProgramId: String,
    isMbkm: Boolean,
});
const emit = defineEmits(['close', 'reload'])

const isMbkm = ref(<boolean>{})
const search = ref('')
const limit = 20
const page = 1
const status = ref('')
const studyProgramId = ref('')
const students = ref(<GetStudentListData[]>[])
const studentIds = ref(<string[]>[])
const studentNames = ref(<string[]>[])
const create = ref(<UpdateStudentStatusRequest>{})

async function getStudent(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: studyProgramId.value,
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: search.value,
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
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function selectedStudent(item: any){
    if(!studentIds.value.some(x => x == item.id)){
        studentIds.value.push(item.id)
        studentNames.value.push(item.name)
    }
}
async function deleteItem(index: number){
    studentIds.value.splice(index, 1)
    studentNames.value.splice(index, 1)
}
async function save(){
    create.value.student_ids = studentIds.value
    create.value.status = status.value
    try {
        const { response: updateRoleResponse, error } = await updateStudentStatus(create.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emit('close');
            emit('reload');
        }
        // return true;
    } catch (error) {
        alert(error)
        // return false;
    }
}
onMounted(async () => {
    status.value = <string>props.status
    studyProgramId.value = <string>props.studyProgramId
    getStudent(limit, page)
    isMbkm.value = <boolean>props.isMbkm
})
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">{{ status }} Mahasiswa</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-col cols="12" sm="12">
                        <v-autocomplete :items="students" item-value="id" item-title="name" variant="outlined" hide-details @update:search="getStudent(limit, page)" @update:model-value="(sl: any) => selectedStudent(sl)" label="Cari Mahasiswa" return-object></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12">
                        <v-table class="mt-10">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="index in studentIds.length">
                                    <td>{{ index }}</td>
                                    <td>{{ studentNames[index-1] }}</td>
                                    <td>
                                        <v-btn title="Approve" icon flat class="float-left" @click="deleteItem(index - 1)">
                                            <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                    <v-col cols="12" sm="12" v-if="!isMbkm">
                        <v-text-field type="date" v-model="create.status_date" variant="outlined" hide-details label="Tanggal"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" v-if="!isMbkm">
                        <v-text-field v-model="create.status_reference_number" variant="outlined" hide-details label="Nomor"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" v-if="!isMbkm">
                        <v-textarea v-model="create.status_remarks" variant="outlined" hide-details label="catatan"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" v-if="!isMbkm">
                        <v-textarea v-model="create.status_purpose" variant="outlined" hide-details label="alasan"></v-textarea>
                    </v-col>
                    <v-col cols="12">
                        <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn color="error" @click="$emit('close')">
                                Batal
                            </v-btn>
                            <v-btn color="secondary" :disabled="create.status_reference_number == '' || create.status_date == '' || studentIds.length == 0"
                                @click="save(); ">
                                Tambah
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>