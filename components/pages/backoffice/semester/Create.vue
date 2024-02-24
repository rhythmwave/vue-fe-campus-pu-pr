<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetSemesterListData, GetSemesterListRoot } from '~~/types/api/semester/GetSemesterList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateSemesterRequest, Curriculum } from '~~/types/api/semester/CreateSemester';
import { createSemester } from '~~/composables/api/semester/createSemester';
import { AnyMap } from '@jridgewell/trace-mapping';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';


// const props = defineProps({
//     sample: Array as any,
// });

onMounted(async () => {
    await getAdminStudyProgram()
});

const valid = ref(true)
const createSemesterRequest = ref(<CreateSemesterRequest>{
    semester_start_year: 2024,
    semester_type: "",
    start_date: "",
    end_date: "",
    study_plan_input_start_date: "",
    study_plan_input_end_date: "",
    study_plan_approval_start_date: "",
    study_plan_approval_end_date: "",
    reference_semester_id: "",
    check_minimum_gpa: false,
    check_passed_credit: false,
    default_credit: 24,
    midterm_start_date: "",
    midterm_end_date: "",
    endterm_start_date: "",
    endterm_end_date: "",
    grading_start_date: "",
    grading_end_date: "",
    curriculums: []
});

const emitData = defineEmits(['close', 'reload'])
const selectedCuriculums = ref<GetCuriculumListData[]>([])
async function getCuriculum(studyProgram: GetAdminStudyProgramListData) {
    try {
        const { response: resp, error: error } = await getCuriculumList(1000000, 1, "", studyProgram.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            // curiculums.value = resp?.data
            selectedCuriculums.value.push(<GetCuriculumListData>{});
            adminStudyProgramCuriculums.value.push({ study_program: studyProgram, curriculums: resp?.data })
        }
    } catch (error) {
        alert(error)
    }
}

const adminStudyProgramCuriculums = ref(<any[]>[])
const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyPrograms.value = resp?.data
            adminStudyProgramCuriculums.value = []
            selectedCuriculums.value = []
            for (let i = 0; i < adminStudyPrograms.value.length; i++) {
                const sp = adminStudyPrograms.value[i];
                await getCuriculum(sp)

            }
        }
    } catch (error) {
        alert(error)
    }
}
async function save() {
    try {
        let req = Object.assign({}, createSemesterRequest.value)
        if (req.start_date) {
            req.start_date = convertDateWithoutTimeToTimezoned(req.start_date)
        }
        if (req.end_date) {
            req.end_date = convertDateWithoutTimeToTimezoned(req.end_date)
        }

        if (req.study_plan_input_start_date) {
            req.study_plan_input_start_date = convertDateWithoutTimeToTimezoned(req.study_plan_input_start_date)
        }
        if (req.study_plan_input_end_date) {
            req.study_plan_input_end_date = convertDateWithoutTimeToTimezoned(req.study_plan_input_end_date)
        }

        if (req.study_plan_approval_start_date) {
            req.study_plan_approval_start_date = convertDateWithoutTimeToTimezoned(req.study_plan_approval_start_date)
        }
        if (req.study_plan_approval_end_date) {
            req.study_plan_approval_end_date = convertDateWithoutTimeToTimezoned(req.study_plan_approval_end_date)
        }


        if (req.midterm_start_date) {
            req.midterm_start_date = convertDateWithoutTimeToTimezoned(req.midterm_start_date)
        }
        if (req.midterm_end_date) {
            req.midterm_end_date = convertDateWithoutTimeToTimezoned(req.midterm_end_date)
        }
        
        if (req.endterm_start_date) {
            req.endterm_start_date = convertDateWithoutTimeToTimezoned(req.endterm_start_date)
        }
        if (req.endterm_end_date) {
            req.endterm_end_date = convertDateWithoutTimeToTimezoned(req.endterm_end_date)
        }

        if (req.grading_end_date) {
            req.grading_end_date = convertDateWithoutTimeToTimezoned(req.grading_end_date)
        }
        if (req.grading_start_date) {
            req.grading_start_date = convertDateWithoutTimeToTimezoned(req.grading_start_date)
        }
        createSemesterRequest.value.curriculums = []
        selectedCuriculums.value.forEach((sc) => {
            createSemesterRequest.value.curriculums.push(<Curriculum>{
                curriculum_id: sc.id,
            })
        })

        const { response: createRoleResponse, error } = await createSemester(req)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            console.log(createRoleResponse?.meta.status)
            console.log(error)
            if (createRoleResponse?.meta.status == 500) {
                alert(createRoleResponse?.meta.message)
            }
            emitData('reload');
        }
        // return true;
        emitData('close');
    } catch (error) {
        alert(error)
        // return false;
    }

}

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Semester</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSemesterRequest.semester_start_year" type="number"
                                variant="outlined" hide-details="auto" label="Tahun Ajaran (*)" :readonly="false"
                                hint="0-9, 4 digit" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details="auto"
                                :items="[{ id: 'Genap', name: 'Genap' }, { id: 'Ganjil', name: 'Ganjil' },]"
                                item-value="id" item-title="name" label="Jenis Semester (*)"
                                v-model="createSemesterRequest.semester_type"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.start_date" type="date" variant="outlined"
                                hide-details="auto" label="Waktu Mulai" :readonly="false" hint="Waktu Mulai Semester"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.end_date" type="date" variant="outlined"
                                hide-details="auto" label="Waktu Selesai" :readonly="false" hint="Waktu Selesai Semester"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Kurikulum Program Studi</v-label>
                        </v-col>
                        <v-col cols="12" sm="12" v-for="spc in adminStudyProgramCuriculums">
                            <v-select variant="outlined" hide-details="auto" :items="spc.curriculums" item-value="id"
                                item-title="name" :label="spc.study_program.name"
                                v-model="selectedCuriculums[adminStudyProgramCuriculums.indexOf(spc)].id"></v-select>
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-label>Periode Waktu Persetujuan KRS :</v-label>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.study_plan_approval_start_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Mulai" :readonly="false"
                                hint="Persetujuan KRS Mulai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.study_plan_approval_end_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Selesai" :readonly="false"
                                hint="Persetujuan KRS Selesai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Periode Input Nilai Online : </v-label>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.study_plan_input_start_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Mulai" :readonly="false"
                                hint="Input Nilai Online Mulai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.study_plan_input_end_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Selesai" :readonly="false"
                                hint="Input Nilai Online Selesai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Periode UTS : </v-label>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.midterm_start_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Mulai" :readonly="false"
                                hint="UTS Mulai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.midterm_end_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Selesai" :readonly="false"
                                hint="UTS Selesai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Periode UAS : </v-label>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.endterm_start_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Mulai" :readonly="false"
                                hint="UAS Mulai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.endterm_end_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Selesai" :readonly="false"
                                hint="UAS Selesai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Grading : </v-label>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.grading_start_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Mulai" :readonly="false"
                                hint="Grading Mulai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="createSemesterRequest.grading_end_date" type="date"
                                variant="outlined" hide-details="auto" label="Waktu Selesai" :readonly="false"
                                hint="Grading Selesai"
                                :min="new Date(createSemesterRequest.semester_start_year, 1, 1).toISOString().slice(0, 10)" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-radio-group v-model="createSemesterRequest.check_minimum_gpa" inline
                                label="Cek Prasyarat IPK" hide-details="auto">
                                <v-radio label="Ya" :value="true" color="primary"></v-radio>
                                <v-radio label="Tidak" :value="false" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-radio-group v-model="createSemesterRequest.check_passed_credit" inline
                                label="Cek Prasyarat Jumlah sks Lulus" hide-details="auto">
                                <v-radio label="Ya" :value="true" color="primary"></v-radio>
                                <v-radio label="Tidak" :value="false" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSemesterRequest.default_credit" variant="outlined"
                                hide-details="auto" label="SKS Default (*)" :readonly="false" hint="maks. 24 sks" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createSemesterRequest.semester_start_year <= 1990"
                                    @click="save();">
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