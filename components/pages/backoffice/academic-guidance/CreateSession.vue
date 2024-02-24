<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { ErrorRoot } from '~~/types/api/error';
import { toBase64 } from '~~/utils/helpers/to-base64'

import { GetAcademicGuidanceStudentListData } from '~~/types/api/academic-guidance/GetAcademicGuidanceStudentList';
import { CreateAcademicGuidanceSessionRequest, CreateAcademicGuidanceSessionFileRequest } from '~~/types/api/academic-guidance/CreateAcademicGuidanceSession';
import { CreateFileRequest } from '~~/types/api/file/CreateFile';

import { getAcademicGuidanceStudentList } from '~~/composables/api/academic-guidance/getAcademicGuidanceStudentList';
import { createAcademicGuidanceSession } from '~~/composables/api/academic-guidance/createAcademicGuidanceSession';
import { createFile } from '~~/composables/api/file/createFile';

const props = defineProps({
    semesterId: String,
    academicGuidanceId: String,
    lecturerId: String,
})
const emit = defineEmits(['close', 'reload'])
const search = ref('')
const semester_id = ref('')
const academic_guidance_id = ref('')
const lecturer_id = ref('')
const pagination = ref({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const students = ref(<GetAcademicGuidanceStudentListData[]>[])
const studentIds = ref(<string[]>[])
const create = ref(<CreateAcademicGuidanceSessionRequest>{
    academic_guidance_id: '',
    subject: '',
    session_date: '',
    summary: '',
    files: <CreateAcademicGuidanceSessionFileRequest[]>[],
    student_ids: <string[]>[],
})
const fileView = ref('')
const fileViews = ref(<string[]>[])
const files = ref(<CreateAcademicGuidanceSessionFileRequest[]>[])

async function getStudent(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getAcademicGuidanceStudentList(limit, page, search.value, lecturer_id.value, semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
async function getBase64(file: any) {
    fileView.value = <string>await toBase64(file.target.files[0])
    fileViews.value.push(fileView.value)
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
                files.value.push(<CreateAcademicGuidanceSessionFileRequest>{
                    file_path: createFileResponse?.data.path,
                    file_path_type: createFileResponse?.data.path_type,
                })
            }
        } catch (error) {
            alert(error)
        }
    }
}
async function save(){
    if(files.value.length > 0){
        for (let index = 0; index < files.value.length; index++) {
            create.value.files.push(<CreateAcademicGuidanceSessionFileRequest>{
                file_path: files.value[index].file_path,
                file_path_type: files.value[index].file_path_type,
            })
        }
    }
    if(studentIds.value.length > 0){
        for (let index = 0; index < studentIds.value.length; index++) {
            create.value.student_ids.push(studentIds.value[index])
        }
    }
    try {
        const { response: createRoleResponse, error } = await createAcademicGuidanceSession(create.value)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emit('reload');
        }
        emit('close');
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    semester_id.value = <string>props.semesterId
    academic_guidance_id.value = <string>props.academicGuidanceId
    lecturer_id.value = <string>props.lecturerId
    await getStudent(pagination.value.limit, pagination.value.page)
    create.value.academic_guidance_id = academic_guidance_id.value
})
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Sesi Bimbingan Akademik</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="create.subject" variant="outlined" hide-details label="Subyek" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" v-model="create.session_date" variant="outlined" hide-details label="Tanggal" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="create.summary" variant="outlined" hide-details label="Kesimpulan" :readonly="false"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" variant="outlined" hide-details label="File" @change="getBase64($event)" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="fileViews.length > 0" class="text-center">
                            <div v-for="item in fileViews">
                                <img :src="item" style="max-height: 300px;" alt="File Fiew" />
                            </div>
                        </v-col>
                    </v-row>
                    <v-table class="mt-5">
                        <thead>
                            <tr>
                                <th colspan="2" class="text-subtitle-1 font-weight-semibold">Mahasiswa</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in students">
                                <td>
                                    <v-checkbox v-model="studentIds" :value="item.id" hide-details variant="outlined"></v-checkbox>
                                </td>
                                <td>{{ item.name }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3">
                                    <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages"
                                        :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                                        @prevPage="getStudent(pagination.limit, pagination.prev)" @jumpPage="(page: any) => getStudent(pagination.limit, page)"
                                        @nextPage="getStudent(pagination.limit, pagination.next)" />
                                </td>
                            </tr>
                        </tfoot>
                    </v-table>
                    <v-col cols="12">
                        <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn color="error" @click="$emit('close')">
                                Batal
                            </v-btn>
                            <v-btn color="secondary" :disabled="create.subject == '' || create.summary == '' || studentIds.length == 0"
                                @click="save(); ">
                                Tambah
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>