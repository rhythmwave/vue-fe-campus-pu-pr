<script setup lang="ts">
import { GetStudentListRequest, GetStudentListData } from '~~/types/api/student/GetStudentList';
import { UpdateStudentLeaveRequest } from '~~/types/api/student-leave/UpdateStudentLeave';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { updateStudentLeave } from '~~/composables/api/student-leave/updateStudentLeave';
import { ErrorRoot } from '~~/types/api/error';
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';

const props = defineProps({
    studyProgramId: String,
    data: <GetStudentListData>{} as any,
});
const emit = defineEmits(['close', 'reload'])
const limit = 20
const page = 1
const studyProgramId = ref('')
const studentName = ref('')
const students = ref(<GetStudentListData[]>[])
const update = ref(<UpdateStudentLeaveRequest>{})
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
        const { response: resp, error: error } = await updateStudentLeave(update.value)
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
    studyProgramId.value = <string>props.studyProgramId
    await getStudent(limit, page, '', studyProgramId.value)
    update.value = <UpdateStudentLeaveRequest>{
        id: props.data.id,
        permit_number: props.data.permit_number,
        purpose: props.data.purpose,
        remarks: props.data.remarks,
    }
    studentName.value = props.data.name
})
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Pengajuan Cuti {{ studentName }}</span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <Vspace space="5" />
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="update.permit_number" variant="outlined" hide-details label="Nomor Cuti"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-textarea v-model="update.purpose" variant="outlined" hide-details label="Alasan Pengajuan"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-textarea v-model="update.remarks" variant="outlined" hide-details label="Catatan"></v-textarea>
                        </v-col>
                        <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn color="error" @click="$emit('close')">
                                Batal
                            </v-btn>
                            <v-btn color="secondary" @click="save">
                                Ubah
                            </v-btn>
                        </v-card-actions>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>