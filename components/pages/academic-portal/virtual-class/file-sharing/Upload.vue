<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';

import { CreateFileSharingRequest } from '~~/types/api/file-sharing/CreateFileSharing';
import { CreateFileRequest } from '~~/types/api/file/CreateFile';
import { ErrorRoot } from '~~/types/api/error';
import { toBase64 } from '~~/utils/helpers/to-base64'
import { createFile } from '~~/composables/api/file/createFile';
import { createFileSharing } from '~~/composables/api/file-sharing/createFileSharing';

const emit = defineEmits(['close', 'reload'])
const props = defineProps({
    title: String,
});

const create = ref(<CreateFileSharingRequest>{})
const fileView = ref('')

async function getBase64(file: any) {
    fileView.value = <string>await toBase64(file.target.files[0])
    if (fileView.value != '') {
        try {
            const { response: createFileResponse, error } = await createFile(<CreateFileRequest>{
                file: fileView.value.split(',')[1],
            })
            if (error) {
                let dataError = <ErrorRoot>error;
                alert(dataError.meta.message);
                return;
            } else {
                create.value.file_path = <string>createFileResponse?.data.path
                create.value.file_path_type = <string>createFileResponse?.data.path_type
            }
        } catch (error) {
            alert(error)
        }
    }
}
async function save() {
    let req = create.value
    try {
        const { response: createFileResponse, error } = await createFileSharing(req)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            create.value = <CreateFileSharingRequest>{}
            emit('reload')
            emit('close')
        }
    } catch (error) {
        alert(error)
    }
}

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Upload File</span>
            </v-card-title>
            <v-col cols="12">
                <v-alert type="info" variant="tonal">
                    Keterangan :
                    <br />
                    Fitur Upload File dapat anda gunakan untuk melakukan Upload File Baru untuk kemudian di share ke Civitas
                    Akademika pengguna Portal Akademik.
                </v-alert>
            </v-col>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="create.title" variant="outlined" hide-details label="Judul" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" variant="outlined" hide-details label="File"
                                @change="getBase64($event)" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="fileView != ''" class="text-center">
                            <img :src="fileView" style="max-height: 300px;" alt="File Fiew" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="create.remarks" variant="outlined" hide-details label="Keterangan" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" @click="save" :disabled="create.file_path == ''">
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