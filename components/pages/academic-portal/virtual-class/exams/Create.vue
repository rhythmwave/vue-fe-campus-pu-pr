<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { createFile } from '~~/composables/api/file/createFile';
import { getHomePageSemesterSummary } from '~~/composables/api/general-lecturer/getHomePageSemesterSummary';
import { createLecturerClassExam } from '~~/composables/api/lecturer-class-exam/createLecturerClassExam';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { ErrorRoot } from '~~/types/api/error';
import { CreateFileData, CreateFileRequest } from '~~/types/api/file/CreateFile';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-lecturer/GetHomePageSemesterSummary';
import { CreateLecturerClassExamRequest } from '~~/types/api/lecturer-class-exam/CreateLecturerClassExam';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { convertDateTimeToTimezoned } from '~~/utils/helpers/date-utils';


const props = defineProps({
    semester: Array as any,
});

onMounted(async () => {
    // await getHomePageSemesterSummaryData()
    selectedSemester = <GetLecturerSemesterListData>props.semester
    await getLecturerAssignedClassData()
});
let selectedSemester: GetLecturerSemesterListData = <GetLecturerSemesterListData>{};
let startDate = ref("");
let endDate = ref("");
let startTime = ref("");
let endTime = ref("");
const fileBase64 = ref('')
const emit = defineEmits(['close', 'reload'])

const createLecturerClassExamRequest = ref(<CreateLecturerClassExamRequest>{});
async function save() {
    try {
        createLecturerClassExamRequest.value.start_time = convertDateTimeToTimezoned(startDate.value, startTime.value);
        createLecturerClassExamRequest.value.end_time = convertDateTimeToTimezoned(endDate.value, endTime.value);
        // await createFileData()
        createLecturerClassExamRequest.value.file_path = createFiles.value.path
        createLecturerClassExamRequest.value.file_path_type = createFiles.value.path_type
        const { response: createRoleResponse, error } = await createLecturerClassExam(createLecturerClassExamRequest.value)

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
const lecturerAssignedClasss = ref<GetLecturerAssignedClassListData[]>([])
const selectedLecturerAssignedClass = ref(<GetLecturerAssignedClassListData>{});
async function getLecturerAssignedClassData() {
    try {
        const { response: resp, error: error } = await getLecturerAssignedClassList(selectedSemester.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturerAssignedClasss.value = resp?.data
            lecturerAssignedClasss.value.forEach((s) => {
                s.studyporgram_subject = s.study_program_name + " - " + s.subject_name + " - " + s.name
            });
        }
    } catch (error) {
        alert(error)
    }
}
async function lecturerAssignedClassOnChange(id: any) {
    selectedLecturerAssignedClass.value = lecturerAssignedClasss.value.filter((x) => { return x.id == id })[0]
    createLecturerClassExamRequest.value.class_id = id
}

const homePageSemesterSummary = ref(<GetHomePageSemesterSummaryData>{})
async function getHomePageSemesterSummaryData() {
    try {
        const { response: resp, error: error } = await getHomePageSemesterSummary()
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            homePageSemesterSummary.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
const createFiles = ref(<CreateFileData>{})
async function createFileData(event: any) {
    try {
        const target = event.target as HTMLInputElement
        if (target.files?.length == 0) {
            return false
        }
        const reader = new FileReader();
        reader.readAsDataURL(target.files![0])
        reader.onload = async function () {
            const base64 = reader.result!.toString().split(',')[1]
            fileBase64.value = base64
            try {
                createFiles.value = <CreateFileData>{}
                const { response: resp, error: error } = await createFile(<CreateFileRequest>{
                    file: fileBase64.value
                })
                if (error) {
                    let dataError = <ErrorRoot>error;
                    alert(dataError.meta.message);
                    return;
                } else {
                    emit('reload');
                }
                if (resp != null) {
                    createFiles.value = resp?.data
                }
            } catch (error) {
                alert(error)
                emit('close');
            }
        }


    } catch (error) {
        alert(error)
    }
}
</script>
<template>
    <div>
        <v-card max-height="550" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Ujian</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>

                        <v-col cols="12" sm="12">
                            Semester: <strong>{{ selectedSemester.semester_type_year }}</strong>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <!-- <v-autocomplete :items="classes"
                                :item-title="(item: any) => `${item.studyProgram} - ${item.class} - ${item.subject}`"
                                item-value="subject_id" color="primary" variant="outlined" hide-details
                                label="Pilih Materi" /> -->
                            <v-select :items="lecturerAssignedClasss" item-value="id" item-title="studyporgram_subject"
                                @update:model-value="(sl: any) => lecturerAssignedClassOnChange(sl)"
                                v-model="selectedLecturerAssignedClass.id" label="Pilih Matakuliah"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createLecturerClassExamRequest.title" variant="outlined" hide-details
                                label="Judul" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" @change="createFileData" v-model="file" variant="outlined"
                                hide-details label="Tugas" :suffix="createFiles.url ? 'uploaded' : ''" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="createLecturerClassExamRequest.abstraction" variant="outlined" hide-details
                                label="Abstraksi" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="startDate" type="date" variant="outlined" hide-details
                                label="Waktu Mulai" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="startTime" type="time" variant="outlined" hide-details
                                label="Jam Mulai" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="endDate" type="date" variant="outlined" hide-details
                                label="Waktu Selesai" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="endTime" type="time" variant="outlined" hide-details
                                label="Jam Selesai" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" @click="save();">
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