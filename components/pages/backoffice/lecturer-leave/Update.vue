<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateLecturerLeave } from '~~/composables/api/lecturer-leave/updateLecturerLeave';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateLecturerLeaveRequest } from '~~/types/api/lecturer-leave/UpdateLecturerLeave';
import { GetLecturerLeaveListData } from '~~/types/api/lecturer-leave/GetLecturerLeaveList';

const props = defineProps({
    getLecturerLeaveListData: Array as any,
});

onMounted(async () => {
    detailLecturerLeave.value = <GetLecturerLeaveListData>props.getLecturerLeaveListData
    updateLecturerLeaveRequest.value = Object.assign({}, <UpdateLecturerLeaveRequest>props.getLecturerLeaveListData)
  
});

const fileView = ref('')
const valid = ref(true)
const updateLecturerLeaveRequest = ref(<UpdateLecturerLeaveRequest>{
    id: "",
    lecturer_id: "",
    semester_id: "",
    start_date: "",
    permit_number: "",
    purpose: "",
    remarks: "",
    file_url: "",
    file_path: "",
    file_path_type: ""
});
let detailLecturerLeave = ref(<GetLecturerLeaveListData>{
    id: "",
    name: "",
    id_national_lecturer: "",
    start_date: "",
});

const emitData = defineEmits(['close', 'reload'])

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateLecturerLeave(updateLecturerLeaveRequest.value)

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
                <span class="title text-white">Ubah Cuti Dosen</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="detailLecturerLeave.name" variant="outlined" hide-details label="Nama"
                                :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="detailLecturerLeave.id_national_lecturer" variant="outlined" hide-details
                                label="NIDN" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="detailLecturerLeave.study_program_name" variant="outlined" hide-details
                                label="Program Studi" :readonly="true" />
                        </v-col>
                        <!-- <v-col cols="12" sm="12">
                            <v-text-field v-model="detailLecturerLeave.semester_school_year" variant="outlined" hide-details label="Semester"
                                :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="detailLecturerLeave.start_date" type="date" variant="outlined"
                                hide-details label="Tanggal" :readonly="false" />
                        </v-col> -->
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateLecturerLeaveRequest.permit_number" variant="outlined" hide-details
                                label="Nomor Surat Izin Cuti" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details
                                :items="[{ id: 'Sakit', name: 'Sakit' }, { id: 'Bekerja', name: 'Bekerja' }, { id: 'Hamil', name: 'Hamil' }, { id: 'lainnya', name: 'lainnya' },]"
                                item-value="id" item-title="name" label="Alasan Cuti"
                                v-model="updateLecturerLeaveRequest.purpose"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea outlined v-model="updateLecturerLeaveRequest.remarks" label="Catatan"
                                variant="outlined" hide-details="auto" :readonly="false"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" variant="outlined" hide-details label="Attachment" @change="getBase64($event)" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="fileView != '' || updateLecturerLeaveRequest.file_url != ''" class="text-center">
                            <img :src="fileView ? fileView : updateLecturerLeaveRequest.file_url ? updateLecturerLeaveRequest.file_url : ''  " style="max-height: 300px;" alt="File Fiew" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateLecturerLeaveRequest.id == ''"
                                    @click="update();">
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