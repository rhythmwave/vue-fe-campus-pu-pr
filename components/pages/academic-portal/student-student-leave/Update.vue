<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateStudentStudentLeave } from '~~/composables/api/student-student-leave/updateStudentStudentLeave';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateStudentStudentLeaveRequest } from '~~/types/api/student-student-leave/UpdateStudentStudentLeave';
import { GetStudentStudentLeaveListData } from '~~/types/api/student-student-leave/GetStudentStudentLeaveList';

const props = defineProps({
    getStudentStudentLeaveListData: Array as any,
});

onMounted(async () => {
    detailStudentStudentLeave = <GetStudentStudentLeaveListData>props.getStudentStudentLeaveListData
    updateStudentStudentLeaveRequest.value = Object.assign({},<UpdateStudentStudentLeaveRequest>props.getStudentStudentLeaveListData) 
   
});


const valid = ref(true)
const updateStudentStudentLeaveRequest = ref(<UpdateStudentStudentLeaveRequest>{});
let detailStudentStudentLeave: GetStudentStudentLeaveListData;

const emitData = defineEmits(['close', 'reload'])

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateStudentStudentLeave(updateStudentStudentLeaveRequest.value)

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
                <span class="title text-white">Ubah Pengajuan Cuti</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentStudentLeaveRequest.purpose" variant="outlined" hide-details
                                label="Sebab Cuti" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentStudentLeaveRequest.remarks" variant="outlined" hide-details
                                label="Catatan" :readonly="false" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateStudentStudentLeaveRequest.purpose == ''"
                                    @click="update(); ">
                                    Ubah
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>