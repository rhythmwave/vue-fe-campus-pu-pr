<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PencilIcon, PlusIcon } from 'vue-tabler-icons';
import { updateSubject } from '~~/composables/api/subject/updateSubject';
import { getSampleList } from '~~/composables/api/sample/getSampleList';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { ErrorRoot } from '~~/types/api/error';
import { GetSubjectListData, GetSubjectClassesListData } from '~~/types/api/subject/GetSubjectList';
import { GetSubjectDetailData, PrerequisiteSubject} from '~~/types/api/subject/GetSubjectDetail';
import { getSubjectDetail } from '~~/composables/api/subject/getSubjectDetail';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { setPrerequisiteSubject } from '~~/composables/api/subject/setPrerequisiteSubject';
import { SetPrerequisitePrerequisiteSubject, SetPrerequisiteSubjectRequest } from '~~/types/api/subject/SetPrerequisiteSubject';

const props = defineProps({
    getSubjectListData: Array as any,
});

onMounted(async () => {
    selectedData.value = <GetSubjectListData>props.getSubjectListData
    getSubjectDetailData.value = Object.assign(getSubjectDetailData.value, selectedData.value)

    await getDetail()
    await getSubjectListData()
});


const valid = ref(true)
const emitData = defineEmits(['close', 'reload'])

const dialogSet = ref(false);
const classes = ref(<GetSubjectClassesListData[]>[])
const selectedData = ref<GetSubjectListData>({
    id: 'string',
    study_program_id: 'string',
    study_program_name: 'string',
    curriculum_id: 'string',
    curriculum_name: 'string',
    code: 'string',
    trait: 'string',
    name: 'string',
    is_mandatory: false,
    semester_package: 0,
    theory_credit: 0,
    practicum_credit: 0,
    field_practicum_credit: 0,
    subject_prerequisite_id: 'string',
    prerequisite_type: 'string',
    prerequisite_minimum_grade_point: 0,
    equivalent_study_program_id: 'string',
    equivalent_study_program_name: 'string',
    equivalent_curriculum_id: 'string',
    equivalent_curriculum_name: 'string',
    equivalent_subject_code: 'string',
    equivalent_subject_name: 'string',
    equivalent_subject_id: 'string',
    equivalent_is_vice_versa: false,
    classes: classes.value,
})

const getSubjectDetailData = ref<GetSubjectDetailData>({
    id: "",
    study_program_id: "",
    study_program_name: "",
    curriculum_id: "",
    curriculum_name: "",
    code: "",
    name: "",
    short_name: "",
    english_name: "",
    english_short_name: "",
    is_mandatory: false,
    trait: "",
    type: "",
    subject_category_id: "",
    subject_category_name: "",
    curriculum_type: "",
    theory_credit: 0,
    practicum_credit: 0,
    field_practicum_credit: 0,
    semester_package: 0,
    repeat_course_limit: 0,
    is_active: false,
    has_lecture_unit: false,
    has_teaching_material: false,
    has_lecture_summary: false,
    supporting_lecturer_id: "",
    supporting_lecturer_name: "",
    start_date: "",
    end_date: "",
    minimum_passing_grade_point: 0,
    minimum_mandatory_credit_taken: 0,
    minimum_optional_credit_taken: 0,
    minimum_total_credit_taken: 0,
    minimum_mandatory_credit_passed: 0,
    minimum_optional_credit_passed: 0,
    minimum_total_credit_passed: 0,
    minimum_gpa: 0,
    abstraction: "",
    syllabus_path: "",
    syllabus_path_type: "",
    syllabus_url: "",
    prerequisite_subjects: [],
    is_thesis: false,
})

async function getDetail() {
    try {
        const { response: resp, error: error } = await getSubjectDetail(selectedData.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getSubjectDetailData.value = <GetSubjectDetailData><unknown>resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function update() {
    try {
        let selectedPrerequisite = <SetPrerequisitePrerequisiteSubject[]>[]
        PrerequisitesSelections.value.forEach((ps) => {
            if (ps.isSelected) {
                selectedPrerequisite.push(<SetPrerequisitePrerequisiteSubject>{
                    id: ps.id,
                    minimum_grade_point: ps.psData.minimum_grade_point == '' ? Number(0) : Number(ps.psData.minimum_grade_point),
                    prerequisite_type: ps.psData.prerequisite_type,
                })
            }
        })
        const { response: resp, error: error } = await setPrerequisiteSubject(
            <SetPrerequisiteSubjectRequest>{
                id: getSubjectDetailData.value.id,
                prerequisites: selectedPrerequisite,
            }
        )
        if (error) {
            let dataError = <ErrorRoot>error;
            if(error.meta.message == 'pq: you cannot have circular dependent subjects') {
                alert('Anda tidak boleh memiliki mata pelajaran yang saling ketergantungan');    
            }else{
                alert(dataError.meta.message);
            }
            return;
        }
        if (resp != null) {
            SubjectListData.value = <GetSubjectListData[]><unknown>resp?.data
        }
        emitData('close')
    } catch (error) {
        alert(error)
    }
}

const SubjectListData = ref(<GetSubjectListData[]>[])
async function getSubjectListData() {
    try {
        const { response: resp, error: error } = await getSubjectList(1000000, 1, "", [selectedData.value.curriculum_id], '', '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            SubjectListData.value = <GetSubjectListData[]><unknown>resp?.data
            actionResetPrerequiste()
        }
    } catch (error) {
        alert(error)
    }
}


const prerequisiteTypes = ref([
    {
        id: "lulus",
        name: "Lulus",
    },
    {
        id: "ambil",
        name: "Ambil",
    },
])

const PrerequisitesSelections = ref(<any[]>[])
function actionChoosePrerequiste() {
    console.log(PrerequisitesSelections.value)
}
function actionResetPrerequiste() {
    console.log(PrerequisitesSelections.value)
    PrerequisitesSelections.value = []
    SubjectListData.value.forEach((s) => {
        let isSelected = false
        let psData: PrerequisiteSubject = <PrerequisiteSubject>{
            id: '',
            minimum_grade_point: 0,
            prerequisite_type: '',
        }
        getSubjectDetailData.value.prerequisite_subjects.forEach((ps) => {
            if (ps.id == s.id) {
                isSelected = true
                psData = Object.assign({}, ps)
            }
        })
        if (s.id != getSubjectDetailData.value.id) {
            PrerequisitesSelections.value.push({ id: s.id, dataSubject: s, isSelected: isSelected, psData: psData })
        }
    })
}

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Mata Kuliah Prasyarat</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12"><v-label
                                :text="'Program Studi: ' + getSubjectDetailData.study_program_name"></v-label></v-col>
                        <v-col cols="12"><v-label
                                :text="'Kurikulum: ' + getSubjectDetailData.curriculum_name"></v-label></v-col>
                        <v-col cols="12"><v-label :text="'Mata Kuliah: ' + getSubjectDetailData.name"></v-label></v-col>
                        <v-col cols="12">
                            <v-label
                                :text="'Prasyarat(' + PrerequisitesSelections.filter((x) => x.isSelected).length + ')'"></v-label>
                            &nbsp;
                            <v-dialog v-model="dialogSet" scrollable>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="success" style="width: 20px;height: 20px;" v-bind="props" flat>
                                        <PencilIcon style="width: 20px;height: 20px;" />
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>Mata Kuliah Prasyarat</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <v-row v-for="itm in PrerequisitesSelections">
                                            <v-col cols="12" sm="12" md="4" lg="4">
                                                <v-checkbox-btn color="primary" hide-details v-model="itm.isSelected"
                                                    :label="itm.dataSubject.name"></v-checkbox-btn>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="2" lg="1">
                                                <v-select label="Syarat" placeholder="Syarat" item-title="name"
                                                    item-value="id" :items="prerequisiteTypes"
                                                    v-model="itm.psData.prerequisite_type" />
                                            </v-col>
                                            <v-col cols="6" sm="6" md="2" lg="1"
                                                v-if="itm.psData.prerequisite_type == 'ambil'">
                                                <v-text-field variant="outlined" type="number" hide-details
                                                    label="Bobot Minimal" placeholder="Bobot Minimal"
                                                    v-model="itm.psData.minimum_grade_point" />
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn color="error" text @click="dialogSet = false; actionResetPrerequiste();">
                                            Tutup
                                        </v-btn>
                                        <v-btn color="success" text @click="dialogSet = false; actionChoosePrerequiste()">
                                            Pilih
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>

                        <!-- <v-col cols="6" sm="12" md="6" lg="6" v-for="itm in SubjectListData">
                            <v-checkbox-btn color="primary" hide-details 
                                :label="itm.name"></v-checkbox-btn>
                        </v-col> -->
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