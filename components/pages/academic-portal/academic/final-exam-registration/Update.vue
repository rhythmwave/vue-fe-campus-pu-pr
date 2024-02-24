<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { updateStudentThesis } from '~~/composables/api/student-thesis/updateStudentThesis';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentThesisDetailData } from '~~/types/api/student-thesis/GetStudentThesisDetail';
import { UpdateStudentThesisFile, UpdateStudentThesisRequest } from '~~/types/api/student-thesis/UpdateStudentThesis';
import { fileUpload } from '~~/utils/helpers/file-upload';
const props = defineProps({
    thesisDetail: Object as any,
    title: String,
});

onMounted(async () => {
    console.log("props.getStudentThesisDetails")
    console.log(props)
    detail.value = Object.assign(props.thesisDetail)
    updateStudentThesisRequests.value = Object.assign({}, detail.value)
    updateStudentThesisRequests.value.files = []
    detail.value.files.forEach(f => {
        if (f.file_path) {
            updateStudentThesisRequests.value.files.push(Object.assign({}, f))
        }
    });
})
const detail = ref(<GetStudentThesisDetailData>{})
const emitData = defineEmits(['close', 'reload'])

const fileThesis = ref('')

const validFileThesis = ref(true)

const fileThesisBase64 = ref('')

const updateStudentThesisRequests = ref(<UpdateStudentThesisRequest>{
    topic: "",
    title: "",
    english_title: "",
    remarks: "",
    is_joint_thesis: false,
    status: "",
    files: [],
})
async function updateStudentThesisData() {
    try {

        let tempThesisFile: any = {};
        if (fileThesisBase64.value) {
            tempThesisFile = await fileUpload(fileThesisBase64.value)
            updateStudentThesisRequests.value.files.push(<UpdateStudentThesisFile>{
                file_path: tempThesisFile.path,
                file_path_type: tempThesisFile.path_type,
                file_description: tempThesisFile.url,
            })
        }

        const { response: resp, error: error } = await updateStudentThesis(updateStudentThesisRequests.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            // updateStudentThesiss.value = resp?.data
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
            <span class="title text-white">Update Tugas Akhir</span>
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
                        <v-text-field v-model="updateStudentThesisRequests.topic" variant="outlined" hide-details="auto"
                            label="Topik" />
                    </v-col>
                    <!-- <v-col cols=12 lg="12" md="12">
                        <v-text-field variant="outlined" hide-details="auto" label="Status" />
                    </v-col> -->
                    <v-col cols=12 lg="12" md="12">
                        <v-text-field v-model="updateStudentThesisRequests.title" variant="outlined" hide-details="auto"
                            label="Judul" />
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-text-field v-model="updateStudentThesisRequests.english_title" variant="outlined"
                            hide-details="auto" label="Judul Asing" />
                    </v-col>
                    <!-- <v-col cols=12 lg="12" md="12">
                        <v-text-field variant="outlined" hide-details="auto" label="Semester Mulai" />
                    </v-col> -->
                    <v-col cols=12 lg="12" md="12">
                        <v-textarea v-model="updateStudentThesisRequests.remarks" variant="outlined" hide-details="auto"
                            label="Catatan"></v-textarea>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <!-- <v-select :items="['Sendiri', 'Kelompok']" variant="outlined" hide-details="auto"
                            label="Pengerjaan"></v-select> -->
                        <v-select :items="[{ id: false, name: 'Sendiri' }, { id: false, name: 'Kelompok' },]"
                            item-value="id" item-title="name" v-model="updateStudentThesisRequests.is_joint_thesis"
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
                        <v-btn color="secondary" @click="updateStudentThesisData()">
                            Update
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-form>
        </v-card-text>
    </v-card>
</template>