<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { createFile } from '~~/composables/api/file/createFile';
import { getHomePageSemesterSummary } from '~~/composables/api/general-lecturer/getHomePageSemesterSummary';
import { updateLecturerClassDiscussion } from '~~/composables/api/lecturer-class-discussion/updateLecturerClassDiscussion';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { ErrorRoot } from '~~/types/api/error';
import { CreateFileData, CreateFileRequest } from '~~/types/api/file/CreateFile';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-lecturer/GetHomePageSemesterSummary';
import { GetLecturerClassDiscussionListData } from '~~/types/api/lecturer-class-discussion/GetLecturerClassDiscussionList';
import { UpdateLecturerClassDiscussionRequest } from '~~/types/api/lecturer-class-discussion/UpdateLecturerClassDiscussion';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { convertDateTimeToTimezoned } from '~~/utils/helpers/date-utils';


const props = defineProps({
    detail: Array as any,
    semester: Array as any,
});

onMounted(async () => {
    // await getHomePageSemesterSummaryData()
    updateLecturerClassDiscussionRequest.value = <UpdateLecturerClassDiscussionRequest>props.detail
});
const emit = defineEmits(['close', 'reload'])

const updateLecturerClassDiscussionRequest = ref(<UpdateLecturerClassDiscussionRequest>{});
async function update() {
    try {
        
        const { response: createRoleResponse, error } = await updateLecturerClassDiscussion(updateLecturerClassDiscussionRequest.value)

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
</script>
<template>
    <div>
        <v-card max-height="550" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Diskusi</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>

                        <!-- <v-col cols="12" sm="12">
                            Semester: {{ selectedSemester.semester_type_year }}
                        </v-col>
                        <v-col cols="12" sm="12">
                            Kelas: {{ detailDiscussion. }}
                        </v-col> -->
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateLecturerClassDiscussionRequest.title" variant="outlined" hide-details
                                label="Judul Topik" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="updateLecturerClassDiscussionRequest.abstraction" variant="outlined" hide-details
                                label="Pesan" />
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