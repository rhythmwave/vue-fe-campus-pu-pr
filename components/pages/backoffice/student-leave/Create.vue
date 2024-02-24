<script setup lang="ts">
import { GetStudentListRequest, GetStudentListData } from '~~/types/api/student/GetStudentList';
import { CreateStudentLeaveRequest } from '~~/types/api/student-leave/CreateStudentLeave';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { createStudentLeave } from '~~/composables/api/student-leave/createStudentLeave';
import { ErrorRoot } from '~~/types/api/error';
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';

const props = defineProps({
    studyProgramId: Array as any,
});
const emit = defineEmits(['close', 'reload'])
const limit = 20
const page = 1
const studyProgramId = ref('')
const students = ref(<GetStudentListData[]>[])
const create = ref(<CreateStudentLeaveRequest>{})
async function getStudent(limit: number, page: number, name: string, study_program_id: string) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, <GetStudentListRequest>{
            studyProgramId: study_program_id,
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: '',
            address: '',
            regencyId: '',
            status: [],
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
async function save() {
    try {
        const { response: resp, error: error } = await createStudentLeave(create.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
            emit('reload')
            emit('close')
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    studyProgramId.value = props.studyProgramId
    await getStudent(limit, page, '', studyProgramId.value)
})
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Pengajuan Cuti</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <Vspace space="5" />
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-autocomplete v-model="create.student_id" :items="students" item-value="id" item-title="name" variant="outlined" hide-details label="Cari Mahasiswa" @update:search="(sl: any) => getStudent(limit, page, sl, studyProgramId)"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-select v-model="create.total_leave_duration_semester" :items="[1, 2, 3, 4, 5, 6, 7, 8]" variant="outlined" hide-details label="Jumlah Semester"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field type="date" v-model="create.start_date" variant="outlined" hide-details label="Tanggal Mulai Cuti"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="create.permit_number" variant="outlined" hide-details label="Nomor Cuti"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-textarea v-model="create.purpose" variant="outlined" hide-details label="Alasan Pengajuan"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-textarea v-model="create.remarks" variant="outlined" hide-details label="Catatan"></v-textarea>
                        </v-col>
                        <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn color="error" @click="$emit('close')">
                                Batal
                            </v-btn>
                            <v-btn color="secondary" @click="save" :disabled="create.start_date == '' || create.total_leave_duration_semester == 0 || create.student_id == '' || create.permit_number == '' || create.purpose == ''">
                                Simpan
                            </v-btn>
                        </v-card-actions>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>