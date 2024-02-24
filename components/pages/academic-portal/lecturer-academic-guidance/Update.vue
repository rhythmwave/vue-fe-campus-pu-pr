<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateTimeToTimezoned, convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { getSampleList } from '~~/composables/api/sample/getSampleList';
import { GetLecturerAcademicGuidanceStudentListData } from '~~/types/api/lecturer-academic-guidance/GetLecturerAcademicGuidanceStudentList';
import { getLecturerAcademicGuidanceStudentList } from '~~/composables/api/lecturer-academic-guidance/getLecturerAcademicGuidanceStudentList';
import { toBase64 } from '~~/utils/helpers/to-base64';
import { createFile } from '~~/composables/api/file/createFile';
import { CreateFileRequest } from '~~/types/api/file/CreateFile';
import { UpdateLecturerAcademicGuidanceFile, UpdateLecturerAcademicGuidanceRequest } from '~~/types/api/lecturer-academic-guidance/UpdateLecturerAcademicGuidance';
import { updateLecturerAcademicGuidance } from '~~/composables/api/lecturer-academic-guidance/updateLecturerAcademicGuidance';
import { GetLecturerAcademicGuidanceListData } from '~~/types/api/lecturer-academic-guidance/GetLecturerAcademicGuidanceList';


const props = defineProps({
    getLecturerAcademicGuidanceListData: Array as any,
    semesterId: String,
});

const pagination = ref({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
onMounted(async () => {
    getLecturerAcademicGuidanceListData.value = <GetLecturerAcademicGuidanceListData>props.getLecturerAcademicGuidanceListData

    await getLecturerAcademicGuidanceStudentData(pagination.value.limit, pagination.value.page)
    updateLecturerAcademicGuidanceRequest.value = Object.assign({}, <UpdateLecturerAcademicGuidanceRequest>props.getLecturerAcademicGuidanceListData)
    // await getSample()
    sessionDate.value = updateLecturerAcademicGuidanceRequest.value.session_date.substring(0, 10)
    getLecturerAcademicGuidanceListData.value.students.forEach(s => {
        studentIds.value.push(s.id)
    });
});

const getLecturerAcademicGuidanceListData = ref(<GetLecturerAcademicGuidanceListData>{

    id: "",
    academic_guidance_id: "",
    subject: "",
    session_date: "",
    summary: "",
    files: [],
    students: [],
})

const valid = ref(true)
const updateLecturerAcademicGuidanceRequest = ref(<UpdateLecturerAcademicGuidanceRequest>{
    id: "",
    subject: "",
    session_date: "",
    summary: "",
    files: [],
    student_ids: [],
});
const sessionDate = ref("")

const emitData = defineEmits(['close', 'reload'])

const Sample = ref<GetSampleListData[]>([])
async function getSample() {
    try {
        const { response: resp, error: error } = await getSampleList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            Sample.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function update() {
    try {
        if (sessionDate.value) {

            let session_date = convertDateWithoutTimeToTimezoned(sessionDate.value)
            updateLecturerAcademicGuidanceRequest.value.session_date = session_date
        }
        if (files.value.length > 0) {
            for (let index = 0; index < files.value.length; index++) {
                updateLecturerAcademicGuidanceRequest.value.files.push(<UpdateLecturerAcademicGuidanceFile>{
                    title: files.value[index].title,
                    file_path: files.value[index].file_path,
                    file_path_type: files.value[index].file_path_type,
                })
            }
        }
        
        updateLecturerAcademicGuidanceRequest.value.student_ids = studentIds.value
        const { response: createRoleResponse, error } = await updateLecturerAcademicGuidance(updateLecturerAcademicGuidanceRequest.value)

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

const lecturerAcademicGuidanceStudents = ref<GetLecturerAcademicGuidanceStudentListData[]>([])
const studentIds = ref(<string[]>[])
// const selectedLecturerAcademicGuidanceStudent = ref(<GetLecturerAcademicGuidanceStudentListData>{});
async function getLecturerAcademicGuidanceStudentData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getLecturerAcademicGuidanceStudentList(limit, page, '', <string>props.semesterId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturerAcademicGuidanceStudents.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
// async function lecturerAcademicGuidanceStudentOnChange(id: any) {
//     selectedLecturerAcademicGuidanceStudent.value = lecturerAcademicGuidanceStudents.value.filter((x) => { return x.id == id })[0]
// }

async function getBase64(file: any) {
    fileView.value = <string>await toBase64(file.target.files[0])
    fileViews.value.push(fileView.value)
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
                files.value.push(<UpdateLecturerAcademicGuidanceFile>{
                    title: createFileResponse?.data.url,
                    file_path: createFileResponse?.data.path,
                    file_path_type: createFileResponse?.data.path_type,
                })
            }
        } catch (error) {
            alert(error)
        }
    }
}
const fileView = ref('')
const fileViews = ref(<string[]>[])
const files = ref(<UpdateLecturerAcademicGuidanceFile[]>[])
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Sesi Bimbingan Akademik</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateLecturerAcademicGuidanceRequest.subject" variant="outlined"
                                hide-details label="Subyek" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" v-model="sessionDate" variant="outlined" hide-details label="Tanggal"
                                :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="updateLecturerAcademicGuidanceRequest.summary" variant="outlined"
                                hide-details label="Kesimpulan" :readonly="false"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12" v-if="getLecturerAcademicGuidanceListData.files.length > 0"
                            class="text-center">
                            <v-label>File Sebelumnya</v-label>
                            <div v-for="item in getLecturerAcademicGuidanceListData.files">
                                <a :href="item.file_url" target="_blank"><img :src="item.file_url"
                                        style="max-height: 300px;" :alt="item.file_url" /></a>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" variant="outlined" hide-details label="File"
                                @change="getBase64($event)" />
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
                            <tr v-for="(item, index) in lecturerAcademicGuidanceStudents">
                                <td>
                                    <v-checkbox v-model="studentIds" :value="item.id" hide-details
                                        variant="outlined"></v-checkbox>
                                </td>
                                <td>{{ item.name }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3">
                                    <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                                        :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                                        :prev="pagination.prev" :next="pagination.next"
                                        @prevPage="getLecturerAcademicGuidanceStudentData(pagination.limit, pagination.prev)"
                                        @jumpPage="(page: any) => getLecturerAcademicGuidanceStudentData(pagination.limit, page)"
                                        @nextPage="getLecturerAcademicGuidanceStudentData(pagination.limit, pagination.next)" />
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
                            <v-btn color="secondary"
                                :disabled="updateLecturerAcademicGuidanceRequest.subject == '' || updateLecturerAcademicGuidanceRequest.summary == '' || studentIds.length == 0"
                                @click="update();">
                                Ubah
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>