<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { ErrorRoot } from '~~/types/api/error';
import { toBase64 } from '~~/utils/helpers/to-base64'
import { formatYearMonthDate } from '~~/utils/helpers/date-utils'
import Editor from '@tinymce/tinymce-vue'

import { UpdateAcademicInformationRequest } from '~~/types/api/academic-information/UpdateAcademicInformation';
import { GetAcademicInformationListData, GetAcademicInformationStudyPogramData } from '~~/types/api/academic-information/GetAcademicInformation';
import { CreateFileRequest } from '~~/types/api/file/CreateFile';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';

import { createFile } from '~~/composables/api/file/createFile';
import { updateAcademicInformation } from '~~/composables/api/academic-information/updateAcademicInformation';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';


const props = defineProps({
    title: String,
    data: <GetAcademicInformationListData>{} as any
})
const emit = defineEmits(['close', 'reload'])

const content = ref('')
const fileView = ref('')
const update = ref(<UpdateAcademicInformationRequest>{
    id: '',
    type: '',
    title: '',
    announcement_date: '',
    file_path: '',
    file_path_type: '',
    file_url: '',
    file_title: '',
    content: '',
    for_lecturer: false,
    for_student: false,
    study_program_ids: [],
})
const studyPrograms = ref<GetAdminStudyProgramListData[]>([])

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
                update.value.file_path = <string>createFileResponse?.data.path
                update.value.file_path_type = <string>createFileResponse?.data.path_type
            }
        } catch (error) {
            alert(error)
        }
    }
}
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function save(){
    try {
        const { response: createRoleResponse, error } = await updateAcademicInformation(update.value)

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
watch(content, async (value) => {
    update.value.content = value
})
onMounted(async () => {
    let study_program_ids = <string[]>[]
    if(props.data.study_programs.length > 0){
        props.data.study_programs.forEach(function(item: GetAcademicInformationStudyPogramData){
            study_program_ids.push(item.study_program_id)
        })
    }
    update.value = <UpdateAcademicInformationRequest>{
        id: props.data.id,
        type: props.data.type,
        title: props.data.title,
        announcement_date: formatYearMonthDate(props.data.announcement_date),
        file_path: props.data.file_path,
        file_path_type: props.data.file_path_type,
        file_url: props.data.file_url,
        file_title: props.data.file_title,
        content: props.data.content,
        for_lecturer: props.data.for_lecturer,
        for_student: props.data.for_student,
        study_program_ids: study_program_ids,
    }
    console.log(update.value)
    content.value = props.data.content
    await getAdminStudyProgram()
})
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah {{ title }}</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-select v-model="update.type" :items="[
                                {title: 'Informasi Akademik',value: 'academic_information'},
                                {title: 'Aktifitas Mahasiswa',value: 'student_activity'},
                                {title: 'Registrasi',value: 'registration'},
                                {title: 'Acara',value: 'event'},
                                ]" variant="outlined" hide-details label="Tipe"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="update.study_program_ids" :items="studyPrograms" item-title="name" item-value="id" variant="outlined" hide-details label="Program Studi" multiple></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="update.title" variant="outlined" hide-details label="Judul" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" v-model="update.announcement_date" variant="outlined" hide-details label="Tanggal" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="6" sm="6" style="float: left">
                                <v-switch color="primary" v-model="update.for_lecturer" label="Untuk Dosen"></v-switch>
                            </v-col>
                            <v-col cols="6" sm="6" style="float: left">
                                <v-switch color="primary" v-model="update.for_student" label="Untuk Mahasiswa"></v-switch>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="update.file_title" variant="outlined" hide-details label="Nama File" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" variant="outlined" hide-details label="File" @change="getBase64($event)" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="fileView != '' || update.file_url != ''" class="text-center">
                            <img :src="update.file_url ? update.file_url : fileView" style="max-height: 300px;" alt="File Fiew" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <editor
                                v-model="content"
                                output-format="text"
                                api-key="no-api-key"
                                :init="{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar:
                                    'undo redo | formatselect | bold italic backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help'
                                }"
                                />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="update.title == '' || update.content == '' || update.file_title == '' || update.file_path == ''"
                                    @click="save(); ">
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