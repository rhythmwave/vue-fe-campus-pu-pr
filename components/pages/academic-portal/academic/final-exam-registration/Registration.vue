<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { createStudentThesis } from '~~/composables/api/student-thesis/createStudentThesis';
import { ErrorRoot } from '~~/types/api/error';
import { CreateStudentThesisRequest } from '~~/types/api/student-thesis/CreateStudentThesis';
import { fileUpload } from '~~/utils/helpers/file-upload';
const props = defineProps({
    title: String,
});
const emitData = defineEmits(['close', 'reload'])

const fileThesis = ref('')

const validFileThesis = ref(true)

const fileThesisBase64 = ref('')

const createStudentThesisRequests = ref(<CreateStudentThesisRequest>{
    topic: "",
    title: "",
    english_title: "",
    remarks: "",
    is_joint_thesis: false,
    file_path: "",
    file_path_type: "",
    file_description: "",
})
async function createStudentThesisData() {
    try {
        let tempThesisFile: any = {};
        if (fileThesisBase64.value) {
            tempThesisFile = await fileUpload(fileThesisBase64.value)
            createStudentThesisRequests.value.file_path = tempThesisFile.file_path
            createStudentThesisRequests.value.file_path_type = tempThesisFile.file_path_type
        }

        const { response: resp, error: error } = await createStudentThesis(createStudentThesisRequests.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            // createStudentThesiss.value = resp?.data
            emitData('reload')
        }
        emitData('close');
    } catch (error) {
        alert(error)
    }
}

async function fileThesisChange(event: any) {
    const target = event.target as HTMLInputElement
    if (target.files?.length == 0) {
        validFileThesis.value = false
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function () {
        const base64 = reader.result!.toString().split(',')[1]
        fileThesisBase64.value = base64
    }
}
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">{{ title }}</span>
        </v-card-title>
        <Vspace space="3" />
        <v-card-text>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <!-- <v-col cols=12 lg="12" md="12">
                        <v-text-field variant="outlined" hide-details="auto" label="Nim" />
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-text-field variant="outlined" hide-details="auto" label="Nama" />
                    </v-col> -->
                    <v-col cols=12 lg="12" md="12">
                        <v-text-field v-model="createStudentThesisRequests.topic" variant="outlined" hide-details="auto"
                            label="Topik" />
                    </v-col>
                    <!-- <v-col cols=12 lg="12" md="12">
                        <v-text-field variant="outlined" hide-details="auto" label="Status" />
                    </v-col> -->
                    <v-col cols=12 lg="12" md="12">
                        <v-text-field v-model="createStudentThesisRequests.title" variant="outlined" hide-details="auto"
                            label="Judul" />
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-text-field v-model="createStudentThesisRequests.english_title" variant="outlined"
                            hide-details="auto" label="Judul Asing" />
                    </v-col>
                    <!-- <v-col cols=12 lg="12" md="12">
                        <v-text-field variant="outlined" hide-details="auto" label="Semester Mulai" />
                    </v-col> -->
                    <v-col cols=12 lg="12" md="12">
                        <v-textarea v-model="createStudentThesisRequests.remarks" variant="outlined" hide-details="auto"
                            label="Catatan"></v-textarea>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <!-- <v-select :items="['Sendiri', 'Kelompok']" variant="outlined" hide-details="auto"
                            label="Pengerjaan"></v-select> -->
                        <v-select :items="[{ id: false, name: 'Sendiri' }, { id: false, name: 'Kelompok' },]"
                            item-value="id" item-title="name" v-model="createStudentThesisRequests.is_joint_thesis"
                            label="Pengerjaan"></v-select>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <!-- <v-text-field type="file" variant="outlined" hide-details="auto" label="File Dokumen Tugas Akhir" /> -->
                        <v-text-field type="file" v-model="fileThesis" variant="outlined" hide-details="auto"
                            label="File Dokumen Tugas Akhir" @change="fileThesisChange" />
                    </v-col>
                    <!-- <v-col cols=12 lg="12" md="12">
                        <v-textarea variant="outlined" hide-details="auto" label="Deskripsi"></v-textarea>
                    </v-col> -->
                </v-row>
                <v-col cols="12">
                    <v-card-actions class="pa-4">
                        <v-spacer />
                        <v-btn color="error" @click="$emit('close')">
                            Batal
                        </v-btn>
                        <v-btn color="secondary" @click="createStudentThesisData()">
                            Daftar
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-form>
        </v-card-text>
    </v-card>
</template>