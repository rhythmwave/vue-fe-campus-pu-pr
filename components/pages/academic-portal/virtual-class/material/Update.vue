<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { createFile } from '~~/composables/api/file/createFile';
import { getHomePageSemesterSummary } from '~~/composables/api/general-lecturer/getHomePageSemesterSummary';
import { updateLecturerClassMaterial } from '~~/composables/api/lecturer-class-material/updateLecturerClassMaterial';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { ErrorRoot } from '~~/types/api/error';
import { CreateFileData, CreateFileRequest } from '~~/types/api/file/CreateFile';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-lecturer/GetHomePageSemesterSummary';
import { GetLecturerClassMaterialListData } from '~~/types/api/lecturer-class-material/GetLecturerClassMaterialList';
import { UpdateLecturerClassMaterialRequest } from '~~/types/api/lecturer-class-material/UpdateLecturerClassMaterial';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { convertDateTimeToTimezoned } from '~~/utils/helpers/date-utils';


const props = defineProps({
    detail: Array as any,
    semester: Array as any,
});

onMounted(async () => {
    // await getHomePageSemesterSummaryData()
    selectedSemester = <GetLecturerSemesterListData>props.semester
    detailMaterial = <GetLecturerClassMaterialListData>props.detail
    updateLecturerClassMaterialRequest.value = Object.assign({},<UpdateLecturerClassMaterialRequest>props.detail) 

});
let selectedSemester: GetLecturerSemesterListData = <GetLecturerSemesterListData>{};
let detailMaterial: GetLecturerClassMaterialListData = <GetLecturerClassMaterialListData>{};

const fileBase64 = ref('')
const emit = defineEmits(['close', 'reload'])

const updateLecturerClassMaterialRequest = ref(<UpdateLecturerClassMaterialRequest>{});
async function update() {
    try {
        // await createFileData()
        if (createFiles.value.url) {
            updateLecturerClassMaterialRequest.value.file_path = createFiles.value.path
            updateLecturerClassMaterialRequest.value.file_path_type = createFiles.value.path_type
        }

        const { response: createRoleResponse, error } = await updateLecturerClassMaterial(updateLecturerClassMaterialRequest.value)

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
                <span class="title text-white">Ubah Materi</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>

                        <!-- <v-col cols="12" sm="12">
                            Semester: {{ selectedSemester.semester_type_year }}
                        </v-col>
                        <v-col cols="12" sm="12">
                            Kelas: {{ detailMaterial. }}
                        </v-col> -->
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateLecturerClassMaterialRequest.title" variant="outlined" hide-details
                                label="Judul" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="detail.file_url">
                            File tugas sebelumnya <br />
                            <NuxtLink :href="detail.file_url" target="_blank" download>
                                {{ detail.file_url }}
                            </NuxtLink>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" @change="createFileData" v-model="file" variant="outlined"
                                hide-details label="Tugas" :suffix="createFiles.url ? 'uploaded' : ''" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="updateLecturerClassMaterialRequest.abstraction" variant="outlined" hide-details
                                label="Abstraksi" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-switch v-model="updateLecturerClassMaterialRequest.is_active" label="Aktif" color="primary"></v-switch>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" @click="update();">
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