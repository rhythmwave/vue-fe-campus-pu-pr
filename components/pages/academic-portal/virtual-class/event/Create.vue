<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { getHomePageSemesterSummary } from '~~/composables/api/general-lecturer/getHomePageSemesterSummary';
import { createLecturerClassEvent } from '~~/composables/api/lecturer-class-event/createLecturerClassEvent';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { ErrorRoot } from '~~/types/api/error';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-lecturer/GetHomePageSemesterSummary';
import { CreateLecturerClassEventRequest } from '~~/types/api/lecturer-class-event/CreateLecturerClassEvent';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { convertDateTimeToTimezoned } from '~~/utils/helpers/date-utils';


const props = defineProps({
    semester: Array as any,
});

onMounted(async () => {
    // await getHomePageSemesterSummaryData()
    console.log("test")
    selectedSemester = <GetLecturerSemesterListData>props.semester

    await getLecturerAssignedClassData()
});
let selectedSemester: GetLecturerSemesterListData = <GetLecturerSemesterListData>{};
let startDate = ref("");
let startTime = ref("");
const emit = defineEmits(['close', 'reload'])

const createLecturerClassEventRequest = ref(<CreateLecturerClassEventRequest>{});
async function save() {
    try {
        createLecturerClassEventRequest.value.event_time = convertDateTimeToTimezoned(startDate.value, startTime.value);

        const { response: createRoleResponse, error } = await createLecturerClassEvent(createLecturerClassEventRequest.value)

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
    createLecturerClassEventRequest.value.class_id = id
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
                <span class="title text-white">Tambah Agenda</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            Semester: <strong>{{ selectedSemester.semester_type_year }}</strong>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="lecturerAssignedClasss" item-value="id" item-title="studyporgram_subject"
                                @update:model-value="(sl: any) => lecturerAssignedClassOnChange(sl)"
                                v-model="selectedLecturerAssignedClass.id" label="Pilih Matakuliah"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createLecturerClassEventRequest.title" variant="outlined" hide-details
                                label="Nama Agenda" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="[{id:'incidental', name:'Insidental'},{id:'weekly', name:'Mingguan'},{id:'monthly', name:'Bulanan'},]" item-value="id" item-title="name"
                               
                                v-model="createLecturerClassEventRequest.frequency" label="Frequensi"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="createLecturerClassEventRequest.remarks" variant="outlined" hide-details
                                label="Keterangan" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="startDate" type="date" variant="outlined" hide-details
                                label="Waktu Mulai" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="startTime" type="time" variant="outlined" hide-details
                                label="Jam Mulai" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-switch v-model="createLecturerClassEventRequest.is_active" label="Aktif" color="primary"></v-switch>
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
