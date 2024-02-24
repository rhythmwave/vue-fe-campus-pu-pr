<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { getHomePageSemesterSummary } from '~~/composables/api/general-lecturer/getHomePageSemesterSummary';
import { createLecturerClassDiscussion } from '~~/composables/api/lecturer-class-discussion/createLecturerClassDiscussion';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { ErrorRoot } from '~~/types/api/error';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-lecturer/GetHomePageSemesterSummary';
import { CreateLecturerClassDiscussionRequest } from '~~/types/api/lecturer-class-discussion/CreateLecturerClassDiscussion';
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
const emit = defineEmits(['close', 'reload'])

const createLecturerClassDiscussionRequest = ref(<CreateLecturerClassDiscussionRequest>{});
async function save() {
    try {
        const { response: createRoleResponse, error } = await createLecturerClassDiscussion(createLecturerClassDiscussionRequest.value)

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
    createLecturerClassDiscussionRequest.value.class_id = id
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
                            <v-text-field v-model="createLecturerClassDiscussionRequest.title" variant="outlined" hide-details
                                label="Judul Topik" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="createLecturerClassDiscussionRequest.abstraction" variant="outlined" hide-details
                                label="Pesan" />
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