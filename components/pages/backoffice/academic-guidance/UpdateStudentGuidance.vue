<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateAcademicGuidance } from '~~/composables/api/academic-guidance/updateAcademicGuidance';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { ErrorRoot } from '~~/types/api/error';
import { GetAcademicGuidanceListData } from '~~/types/api/academic-guidance/GetAcademicGuidanceList';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { UpsertAcademicGuidanceRequest } from '~~/types/api/academic-guidance/UpsertAcademicGuidance';
import { GetStudentListData } from '~~/types/api/student/GetStudentList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { upsertAcademicGuidance } from '~~/composables/api/academic-guidance/upsertAcademicGuidance';

const props = defineProps({
    studyProgramId: String,
    getStudentListData: Array as any,
});
const valid = ref(true)
const updateAcademicGuidanceRequest = ref(<UpsertAcademicGuidanceRequest>{
    semester_id: '',
    lecturer_id: '',
    student_ids: [],
});
const detailStudentGuidance = ref(<GetStudentListData>{});

const emitData = defineEmits(['close', 'reload'])


async function update() {
    try {
        let request: any = Object.assign({}, updateAcademicGuidanceRequest.value)
        console.log("updateAcademicGuidanceRequest.value")
        console.log(updateAcademicGuidanceRequest.value)
        if (request.decision_date) {
            request.decision_date = convertDateWithoutTimeToTimezoned(request.decision_date)
        }
        const { response: updateRoleResponse, error } = await upsertAcademicGuidance(request)

        console.log("request")
        console.log(request)
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

const Lecturers = ref<GetLecturerListData[]>([])
async function getLecturer() {
    try {
        if (updateAcademicGuidanceRequest.value.semester_id) {
            updateAcademicGuidanceRequest.value.lecturer_id = ""
            return []
        }
        const { response: resp, error: error } = await getLecturerList(1000000, 1, '', '', '', '', '', '', '', '', '', '')
        console.log("response stury program")
        console.log(resp)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            Lecturers.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
const Semesters = ref<GetSemesterListData[]>([])
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, '', '')
        console.log("response stury program")
        console.log(resp)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            Semesters.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
onMounted(async () => {
    await getLecturer()
    await getSemester()
    detailStudentGuidance.value = <GetStudentListData>props.getStudentListData
        console.log("props.getStudentListData")
        console.log(detailStudentGuidance.value)
        console.log(props.getStudentListData)
        console.log("props.getStudentListData")
    // detailStudentGuidance = <GetStudentListData>props.getStudentListData
    // updateAcademicGuidanceRequest.value.student_ids = [detailStudentGuidance.id]
    // updateAcademicGuidanceRequest.value.lecturer_id = detailStudentGuidance.academic_guidance_lecturer_id
    // updateAcademicGuidanceRequest.value.semester_id = detailStudentGuidance.admittance_semester
});
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Pembimbing Akademik</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" lg="12" md="12">
                            <v-label style="margin-bottom: 5px;">Program Studi : {{
                                detailStudentGuidance.study_program_name }}</v-label>
                        </v-col>
                        <v-col cols="12" lg="12" md="12">
                            <v-label style="margin-bottom: 5px;">NIM : {{
                                detailStudentGuidance.nim_number }}</v-label>
                        </v-col>
                        <v-col cols="12" lg="12" md="12">
                            <v-label style="margin-bottom: 5px;">Nama Mahasiswa : {{
                                detailStudentGuidance.name }}</v-label>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" v-if="detailStudentGuidance.academic_guidance_semester_id != ''">
                            <v-label style="margin-bottom: 5px;">Semester {{
                                detailStudentGuidance.academic_guidance_semester_name }}</v-label>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" v-if="detailStudentGuidance.academic_guidance_semester_id == ''">
                            <v-label style="margin-bottom: 5px;">Semester</v-label>
                            <v-select v-model="updateAcademicGuidanceRequest.semester_id" item-value="id" variant="outlined" hide-details :items="Semesters" label="Pilih Semester">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
                                </template>
                                <template v-slot:item="{item, props: {onClick, title, value}}">
                                    <ul>
                                        <li style="padding: 10px; margin: 2px;">
                                            <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                <span @click="onClick">{{ title.school_year }} - {{ title.semester_type }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </v-select>
                            <!-- <v-select variant="outlined" hide-details :items="Semesters" item-value="id"
                                item-title="school_year" label="Semester"
                                v-model="updateAcademicGuidanceRequest.semester_id"></v-select> -->
                        </v-col>
                        <v-col cols="12" lg="12" md="12">
                            <v-label style="margin-bottom: 5px;">Dosen PA</v-label>
                            <v-select variant="outlined" hide-details :items="Lecturers" item-value="id" item-title="name"
                                label="Dosen PA" v-model="updateAcademicGuidanceRequest.lecturer_id"></v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateAcademicGuidanceRequest.lecturer_id == ''"
                                    @click="update();">
                                    Simpan
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>