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
import { GetSubjectDetailData, PrerequisiteSubject } from '~~/types/api/subject/GetSubjectDetail';
import { getSubjectDetail } from '~~/composables/api/subject/getSubjectDetail';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { setPrerequisiteSubject } from '~~/composables/api/subject/setPrerequisiteSubject';
import { SetPrerequisitePrerequisiteSubject, SetPrerequisiteSubjectRequest } from '~~/types/api/subject/SetPrerequisiteSubject';
import { SetEquivalentSubjectRequest } from '~~/types/api/subject/SetEquivalentSubject';
import { setEquivalentSubject } from '~~/composables/api/subject/setEquivalentSubject';

const props = defineProps({
    getSubjectListData: Array as any,
});

onMounted(async () => {
    selectedData.value = <GetSubjectListData>props.getSubjectListData
    getSubjectDetailData.value = Object.assign(getSubjectDetailData.value, selectedData.value)

    await getDetail()
    await getCuriculumListData()
    await getSubjectListData()
});


const valid = ref(true)
const emitData = defineEmits(['close', 'reload'])

const updatedData = ref(<SetEquivalentSubjectRequest>{
    subject_id: "",
    equivalent_subject_id: "",
    is_vice_versa: false,
})

const dialogSet = ref(false);
const selectedData = ref<GetSubjectListData>({
    id: "",
    study_program_id: "",
    study_program_name: "",
    curriculum_id: "",
    curriculum_name: "",
    code: "",
    trait: "",
    name: "",
    is_mandatory: false,
    semester_package: 0,
    theory_credit: 0,
    practicum_credit: 0,
    field_practicum_credit: 0,
    subject_prerequisite_id: "",
    prerequisite_type: "",
    prerequisite_minimum_grade_point: 0,
    equivalent_study_program_id: "",
    equivalent_study_program_name: "",
    equivalent_curriculum_id: "",
    equivalent_curriculum_name: "",
    equivalent_subject_code: "",
    equivalent_subject_name: "",
    equivalent_subject_id: "",
    equivalent_is_vice_versa: false,
    classes: <GetSubjectClassesListData[]>[],
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
const CuriculumLists = ref(<GetCuriculumListData[]>[])
const selectedCuriculumLists = ref(<GetCuriculumListData>{
    id: "",
})
async function getCuriculumListData() {
    try {
        const { response: resp, error: error } = await getCuriculumList(1000000, 1, "", getSubjectDetailData.value.study_program_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            CuriculumLists.value = <GetCuriculumListData[]><unknown>resp?.data
            CuriculumLists.value.forEach((c) => {
                if (selectedData.value.equivalent_curriculum_id == c.id) {
                    selectedCuriculumLists.value = c
                }
            })

        }
    } catch (error) {
        alert(error)
    }
}
async function update() {
    try {
        // let selectedPrerequisite = <SetPrerequisitePrerequisiteSubject[]>[]
        // console.log(PrerequisitesSelections.value.length)
        // PrerequisitesSelections.value.forEach((ps) => {
        //     if (ps.isSelected) {
        //         selectedPrerequisite.push(<SetPrerequisitePrerequisiteSubject>{
        //             id: ps.id,
        //             minimum_grade_point: ps.psData.minimum_grade_point == '' ? Number(0) : Number(ps.psData.minimum_grade_point),
        //             prerequisite_type: ps.psData.prerequisite_type,
        //         })
        //     }
        // })
        const { response: resp, error: error } = await setEquivalentSubject(
            <SetEquivalentSubjectRequest>{
                subject_id: selectedData.value.id,
                equivalent_subject_id: selectedSubjectListData.value.id,
                is_vice_versa: selectedSubjectListData.value.equivalent_is_vice_versa,
            }
        )
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
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
const selectedSubjectListData = ref(<GetSubjectListData>{
    id: '',
    curriculum_name: '',
    name: '',
    equivalent_is_vice_versa: false,
})
async function getSubjectListData() {
    try {
        const { response: resp, error: error } = await getSubjectList(1000000, 1, "", [selectedCuriculumLists.value.id], '', '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            SubjectListData.value = <GetSubjectListData[]><unknown>resp?.data
            SubjectListData.value.forEach((s) => {
                if (s.id == selectedData.value.equivalent_subject_id) {
                    selectedSubjectListData.value = s
                }
            })
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

function actionChooseEquivalent() {
    SubjectListData.value.forEach((s) => {
        if (s.id == selectedSubjectListData.value.id) {
            selectedSubjectListData.value = s
        }
    })
}
function actionResetEquivalent() {
    CuriculumLists.value.forEach((c) => {
        if (selectedData.value.equivalent_curriculum_id == c.id) {
            selectedCuriculumLists.value = c
        }
    })
    SubjectListData.value.forEach((s) => {
        if (s.id == selectedData.value.equivalent_subject_id) {
            selectedSubjectListData.value = s
        }
    })
}

function CuriculumListsOnChange(id: string) {
    // selectedCuriculumLists.value = <GetCuriculumListData>CuriculumLists.value.find((x) => x.id == id)
    getSubjectListData()
}
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Mata Kuliah Setara</span>
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
                        <v-divider></v-divider>
                        <v-col cols="12">
                            <v-label :text="'Mata Kuliah Setara '"></v-label>
                            &nbsp;
                            <v-dialog v-model="dialogSet" scrollable>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="success" style="width: 20px;height: 20px;" v-bind="props" flat>
                                        <PencilIcon style="width: 20px;height: 20px;" />
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>Mata Kuliah Setara</v-card-title>
                                    <v-divider></v-divider>
                                    <v-card-text>

                                        <v-col cols="12" sm="12">
                                            <v-select variant="outlined" hide-details :items="CuriculumLists"
                                                item-title="name" item-value="id" v-model="selectedCuriculumLists.id"
                                                @update:model-value="(c: any) => CuriculumListsOnChange(c)"
                                                label="Kurikuklum"></v-select>
                                        </v-col>

                                        <v-col cols="12" sm="12" v-if="!selectedCuriculumLists.id">Pilih kurikulum terlebih
                                            dahulu</v-col>
                                        <v-col cols="12" sm="12"
                                            v-if="selectedCuriculumLists.id && SubjectListData.length == 0">Tidak ada data
                                            Mata Kuliah pada kurikulum ini</v-col>
                                        <v-radio-group v-model="selectedSubjectListData.id" hide-details="auto">
                                            <div v-for="itm in SubjectListData" style="margin-bottom: 5px;">
                                                <v-radio :label="itm.name" :value="itm.id" inline color="primary"
                                                    style="float:left"></v-radio>
                                                <!-- <v-checkbox label="Bolak balik" inline :value="itm.equivalent_is_vice_versa"  style="float:left"
                                                    color="primary"></v-checkbox> -->
                                                <v-select variant="outlined" style="float:left;margin-left: 5px;width:150px"
                                                    hide-details
                                                    :items="[{ id: true, name: 'Ya' }, { id: true, name: 'Tidak', }]"
                                                    item-title="name" item-value="id" v-model="itm.equivalent_is_vice_versa"
                                                    label="Bolak-Balik"></v-select>
                                            </div>

                                        </v-radio-group>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn color="error" text @click="dialogSet = false; actionResetEquivalent();">
                                            Tutup
                                        </v-btn>
                                        <v-btn color="success" text @click="dialogSet = false; actionChooseEquivalent();">
                                            Pilih
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>

                        <v-col cols="12"><v-label
                                :text="'Kurikulum: ' + selectedSubjectListData.curriculum_name"></v-label></v-col>
                        <v-col cols="12"><v-label :text="'Mata Kuliah: ' + selectedSubjectListData.name"></v-label></v-col>
                        <v-col cols="12"><v-label
                                :text="'Bulak Balik: ' + (selectedSubjectListData.id == '' ? '' : selectedSubjectListData.equivalent_is_vice_versa ? 'Ya' : 'Tidak')"></v-label></v-col>
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