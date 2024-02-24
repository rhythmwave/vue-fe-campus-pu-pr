<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetOfficerListData, GetOfficerListRoot } from '~~/types/api/officer/GetOfficerList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateOfficerRequest } from '~~/types/api/officer/CreateOfficer';
import { createOfficer } from '~~/composables/api/officer/createOfficer';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { CreateFileData, CreateFileRequest } from '~~/types/api/file/CreateFile';
import { createFile } from '~~/composables/api/file/createFile';
import { useBase64 } from '@vueuse/core';


// const props = defineProps({
// });

onMounted(async () => {
 await getDataStudyProgram(1000, 1, '')
});

const valid = ref(true)
const createOfficerRequest = ref(<CreateOfficerRequest>{
    id_national_lecturer: '',
    name: '',
    employee_no: '',
    title: '',
    english_title: '',
    study_program_id: '',
    signature_path: '',
    signature_path_type: '',
    show_signature: true,
});

const emit = defineEmits(['close', 'reload'])
const adminStudyProgram = ref<GetAdminStudyProgramListData[]>([])
async function getDataStudyProgram(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(limit, page, search, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyProgram.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const signatureData = ref<CreateFileData>(<CreateFileData>{
    mime_type: '',
    path: '',
    path_type: '',
    size: 0,
    url: '',
})
async function onSignatureUpdate(files: File[]) {
    try {

        if (!files) {
            signatureData.value = <CreateFileData>{
                mime_type: '',
                path: '',
                path_type: '',
                size: 0,
                url: '',
            }
            createOfficerRequest.value.signature_path = ''
            createOfficerRequest.value.signature_path_type = ''
            return;
        }
        if (files.length == 0) {
            signatureData.value = <CreateFileData>{
                mime_type: '',
                path: '',
                path_type: '',
                size: 0,
                url: '',
            }
            createOfficerRequest.value.signature_path = ''
            createOfficerRequest.value.signature_path_type = ''
            return;
        }
        let selectedFile: File = files[0]
        var reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = async () => {
            var fileBase64 = (<string>reader.result).replace('data:image/jpeg;base64,', '')
            const { response: resp, error: error } = await createFile(
                <CreateFileRequest>{
                    file: fileBase64
                }
            )
            if (error) {
                let dataError = <ErrorRoot>error;
                alert(dataError.meta.message);
                return;
            }
            if (resp != null) {
                signatureData.value = resp?.data
                
                createOfficerRequest.value.signature_path = signatureData.value.path
                createOfficerRequest.value.signature_path_type = signatureData.value.path_type
            }
        };
    } catch (error) {
        alert(error)
    }
}


async function save() {
    try {
        const { response: createRoleResponse, error } = await createOfficer(createOfficerRequest.value)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emit('reload');
        }
        // return true;
        emit('close');
    } catch (error) {
        alert(error)
        // return false;
    }

}

function getAutocompleteStudyProgram(data: any) {
    createOfficerRequest.value.study_program_id = data.id
}

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Pejabat Pengesah Dokumen</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createOfficerRequest.id_national_lecturer" variant="outlined"
                                hide-details label="NIDN" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createOfficerRequest.name" variant="outlined" hide-details
                                label="Nama(*)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createOfficerRequest.employee_no" variant="outlined" hide-details
                                label="NIP(*)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createOfficerRequest.title" variant="outlined" hide-details
                                label="Jabatan" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createOfficerRequest.english_title" variant="outlined" hide-details
                                label="Jabatan Asing" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="createOfficerRequest.study_program_id" variant="outlined" hide-details :items="adminStudyProgram" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-file-input accept="image/*" label="Upload File Scan TTD" variant="outlined" hide-details
                                :onUpdate:modelValue="(files: File[]) => onSignatureUpdate(files)"></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-img :src="signatureData.url" :width="100"></v-img>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Tampilkan File Scan TTD"></v-label>
                            <!-- <v-radio-group v-model="createOfficerRequest.show_signature" inline hide-details="auto" @update:model-value="(l) => levelChanged(l)"> -->
                            <v-radio-group v-model="createOfficerRequest.show_signature" inline hide-details="auto">
                                <v-radio label="Ya" :value="true" color="primary"></v-radio>
                                <v-radio label="Tidak" :value="false" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createOfficerRequest.name == ''" @click="save(); ">
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