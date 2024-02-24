<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { createFile } from '~~/composables/api/file/createFile';
import { getHomePageSemesterSummary } from '~~/composables/api/general-lecturer/getHomePageSemesterSummary';
import { updateLecturerClassEvent } from '~~/composables/api/lecturer-class-event/updateLecturerClassEvent';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-class/getLecturerAssignedClassList';
import { ErrorRoot } from '~~/types/api/error';
import { CreateFileData, CreateFileRequest } from '~~/types/api/file/CreateFile';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-lecturer/GetHomePageSemesterSummary';
import { GetLecturerClassEventListData } from '~~/types/api/lecturer-class-event/GetLecturerClassEventList';
import { UpdateLecturerClassEventRequest } from '~~/types/api/lecturer-class-event/UpdateLecturerClassEvent';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { GetLecturerSemesterListData } from '~~/types/api/lecturer-semester/GetLecturerSemesterList';
import { convertDateTimeToTimezoned } from '~~/utils/helpers/date-utils';


const props = defineProps({
    detail: Array as any,
    semester: Array as any,
});

onMounted(async () => {
    // await getHomePageSemesterSummaryData()
    selectedSemester = Object.assign({}, <GetLecturerSemesterListData>props.semester)
    detailEvent = <GetLecturerClassEventListData>props.detail
    updateLecturerClassEventRequest.value = Object.assign({}, <UpdateLecturerClassEventRequest>props.detail)

    startDate.value = detailEvent.event_time.substring(0, 10)
    startTime.value = detailEvent.event_time.substring(11, 16)
});
let selectedSemester: GetLecturerSemesterListData = <GetLecturerSemesterListData>{};
let detailEvent: GetLecturerClassEventListData = <GetLecturerClassEventListData>{};
let startDate = ref("");
let startTime = ref("");
const emit = defineEmits(['close', 'reload'])

const updateLecturerClassEventRequest = ref(<UpdateLecturerClassEventRequest>{});
async function update() {
    try {
        updateLecturerClassEventRequest.value.event_time = convertDateTimeToTimezoned(startDate.value, startTime.value);


        const { response: createRoleResponse, error } = await updateLecturerClassEvent(updateLecturerClassEventRequest.value)

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
                <span class="title text-white">Ubah Ujian</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>

                        <!-- <v-col cols="12" sm="12">
                            Semester: {{ selectedSemester.semester_type_year }}
                        </v-col>
                        <v-col cols="12" sm="12">
                            Kelas: {{ detailEvent. }}
                        </v-col> -->
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateLecturerClassEventRequest.title" variant="outlined" hide-details
                                label="Nama Agenda" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select
                                :items="[{ id: 'incidental', name: 'Insidental' }, { id: 'weekly', name: 'Mingguan' }, { id: 'monthly', name: 'Bulanan' },]"
                                item-value="id" item-title="name" v-model="updateLecturerClassEventRequest.frequency"
                                label="Frequensi"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="updateLecturerClassEventRequest.remarks" variant="outlined" hide-details
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
                            <v-switch v-model="updateLecturerClassEventRequest.is_active" label="Aktif" color="primary"></v-switch>
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