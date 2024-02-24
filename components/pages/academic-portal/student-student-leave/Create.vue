<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetStudentStudentLeaveListData, GetStudentStudentLeaveListRoot } from '~~/types/api/student-student-leave/GetStudentStudentLeaveList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateStudentStudentLeaveRequest } from '~~/types/api/student-student-leave/CreateStudentStudentLeave';
import { createStudentStudentLeave } from '~~/composables/api/student-student-leave/createStudentStudentLeave';
import { AnyMap } from '@jridgewell/trace-mapping';


const props = defineProps({
    sample: Array as any,
});

onMounted(async () => {

});


const valid = ref(true)
const createStudentStudentLeaveRequest = ref(<CreateStudentStudentLeaveRequest>{
    total_leave_duration_semester: 0,
    start_date: "",
    purpose: "",
    remarks: "",
});

const emitData = defineEmits(['close', 'reload'])

async function save() {
    try {
        var req = Object.assign({}, createStudentStudentLeaveRequest.value)
        if (createStudentStudentLeaveRequest.value.start_date) {
            req.start_date = convertDateWithoutTimeToTimezoned(createStudentStudentLeaveRequest.value.start_date)
        }
        const { response: createRoleResponse, error } = await createStudentStudentLeave(req)

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

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Pengajuan Cuti</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createStudentStudentLeaveRequest.start_date" variant="outlined"
                                hide-details label="Tanggal Cuti" :readonly="false" type="date" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createStudentStudentLeaveRequest.total_leave_duration_semester"
                                variant="outlined" hide-details label="Durasi Cuti(per semester)" :readonly="false"
                                type="number" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createStudentStudentLeaveRequest.purpose" variant="outlined" hide-details
                                label="Sebab Cuti" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createStudentStudentLeaveRequest.remarks" variant="outlined" hide-details
                                label="Catatan" :readonly="false" />
                        </v-col>

                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    :disabled="createStudentStudentLeaveRequest.purpose == '' || createStudentStudentLeaveRequest.start_date == ''|| createStudentStudentLeaveRequest.total_leave_duration_semester == 0 ||createStudentStudentLeaveRequest.remarks==''"
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