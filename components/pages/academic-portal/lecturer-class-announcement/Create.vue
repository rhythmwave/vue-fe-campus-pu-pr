<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import { CreateLecturerClassAnnouncementRequest } from '~~/types/api/lecturer-class-announcement/CreateLecturerClassAnnouncement';
import { CreateFileRequest } from '~~/types/api/file/CreateFile';
import { createFile } from '~~/composables/api/file/createFile';
import { createLecturerAnnouncement } from '~~/composables/api/lecturer-class-announcement/createLecturerAnnouncement';
import { ErrorRoot } from '~~/types/api/error';
import { toBase64 } from '~~/utils/helpers/to-base64'

const props = defineProps({
    title: String,
    classId: String,
});
const emit = defineEmits(['close', 'reload'])

const fileView = ref('')
const create = ref(<CreateLecturerClassAnnouncementRequest>{
    class_id: '',
    title: '',
    content: '',
    file_path: '',
    file_path_type: '',
    start_time: '',
    end_time: '',
})

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
                create.value.file_path = <string>createFileResponse?.data.path
                create.value.file_path_type = <string>createFileResponse?.data.path_type
            }
        } catch (error) {
            alert(error)
        }
    }
}

async function save(){
    let req = create.value
    try {
        const { response: createFileResponse, error } = await createLecturerAnnouncement(req)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            create.value = <CreateLecturerClassAnnouncementRequest>{}
            emit('reload')
            emit('close')
        }
    } catch (error) {
        alert(error)
    }
}

onMounted(async () => {
    create.value.class_id = <string>props.classId
})
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Pengumuman</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="create.title" variant="outlined" hide-details label="Judul" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="create.content" variant="outlined" hide-details label="Isi" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" v-model="create.start_time" variant="outlined" hide-details label="Tanggal Mulai" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" v-model="create.end_time" variant="outlined" hide-details label="Tanggal Berakhir" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" variant="outlined" hide-details label="Attachment" @change="getBase64($event)" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="fileView != ''" class="text-center">
                            <img :src="fileView" style="max-height: 300px;" alt="File Fiew" />
                        </v-col>
                    </v-row>
                    <v-col cols="12">
                        <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn color="error" @click="$emit('close')">
                                Batal
                            </v-btn>
                            <v-btn color="secondary" :disabled="create.title == '' || create.content == ''"
                                @click="save">
                                Tambah
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>