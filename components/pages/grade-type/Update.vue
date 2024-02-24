<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { UpdateSubjectCategoryRequest } from '~~/types/api/subject-category/UpdateSubjectCategory';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { updateSubjectCategory } from '~~/composables/api/subject-category/updateSubjectCategory';
import { GetStudyLevelListData } from '~~/types/api/study-level/GetStudyLevelList';
import { UpdateGradeTypeRequest } from '~~/types/api/grade-type/UpdateGradeType';
import { updateGradeType } from '~~/composables/api/grade-type/updateGradeType';
import { GetGradeTypeListData } from '~~/types/api/grade-type/GetGradeTypeList';

const props = defineProps({
    grade_type: Array as any,
});

onMounted(async () => {
    getGradeTypeListData.value = Object.assign({}, <GetGradeTypeListData>props.grade_type);
    updateGradeTypeRequest.value = Object.assign({}, <GetGradeTypeListData>props.grade_type);
    updateGradeTypeRequest.value.start_date = updateGradeTypeRequest.value.start_date.substring(0, 10)
    updateGradeTypeRequest.value.end_date = updateGradeTypeRequest.value.end_date.substring(0, 10)
});

let getGradeTypeListData = ref(<GetGradeTypeListData>{})

const valid = ref(true)
const updateGradeTypeRequest = ref(<UpdateGradeTypeRequest>{
    id: '',
    code: '',
    grade_point: 0,
    minimum_grade: 0,
    maximum_grade: 0,
    grade_category: '',
    grade_point_category: 0,
    label: '',
    english_label: '',
    start_date: '',
    end_date: ''
});

const emit = defineEmits(['close', 'reload'])


async function update() {
    if (updateGradeTypeRequest.value.start_date) {
        updateGradeTypeRequest.value.start_date = convertDateWithoutTimeToTimezoned(updateGradeTypeRequest.value.start_date)
    }
    if (updateGradeTypeRequest.value.end_date) {
        updateGradeTypeRequest.value.end_date = convertDateWithoutTimeToTimezoned(updateGradeTypeRequest.value.end_date)
    }
    try {
        const { response: response, error } = await updateGradeType(updateGradeTypeRequest.value)

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
    if (updateGradeTypeRequest.value.start_date) {
        updateGradeTypeRequest.value.start_date = updateGradeTypeRequest.value.start_date.substring(10)
    }
    if (updateGradeTypeRequest.value.end_date) {
        updateGradeTypeRequest.value.end_date = updateGradeTypeRequest.value.end_date.substring(10)
    }
}


const gradePoints = ref([
    {
        id: "A",
        name: "A",
    },
    {
        id: "B",
        name: "B",
    },
    {
        id: "C",
        name: "C",
    },
    {
        id: "D",
        name: "D",
    },
    {
        id: "E",
        name: "E",
    },
    {
        id: "F",
        name: "F",
    },
])

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Jenis Nilai</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="getGradeTypeListData.study_level_short_name" variant="outlined"
                                hide-details label="Jenjang Study" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateGradeTypeRequest.code"
                                :rules="[(v: string) => v.length <= 2 || 'Maksimum 2 karakter',]" variant="outlined"
                                :hide-details="updateGradeTypeRequest.code.length <= 2" label="Kode Nilai (*)"
                                placeholder="A" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateGradeTypeRequest.grade_point" type="number"
                                :rules="[(v: number) => (v >= 0 && v <= 4) || 'Masukan nilai antara 0.0 - 4.0',]"
                                variant="outlined"
                                :hide-details="updateGradeTypeRequest.grade_point >= 0 && updateGradeTypeRequest.grade_point <= 4"
                                label="Bobot" placeholder="0.0 - 4.0" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateGradeTypeRequest.grade_point_category" type="number"
                                :rules="[(v: number) => (v >= 0 && v <= 4) || 'Masukan nilai antara 0.0 - 4.0',]"
                                variant="outlined"
                                :hide-details="updateGradeTypeRequest.grade_point_category >= 0 && updateGradeTypeRequest.grade_point_category <= 4"
                                label="Bobot Kelompok" placeholder="0.0 - 4.0" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Rentang Nilai</v-label>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="updateGradeTypeRequest.minimum_grade" type="number"
                                :rules="[(v: number) => (v >= 0 && v <= 100) || 'Masukan nilai antara 0.0 - 100.0',]"
                                variant="outlined"
                                :hide-details="updateGradeTypeRequest.minimum_grade >= 0 && updateGradeTypeRequest.minimum_grade <= 100"
                                label="Minumum" placeholder="0.0 - 100.0" />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="updateGradeTypeRequest.maximum_grade" type="number"
                                :rules="[(v: number) => (v >= 0 && v <= 100) || 'Masukan nilai antara 0.0 - 100.0',]"
                                variant="outlined"
                                :hide-details="updateGradeTypeRequest.maximum_grade >= 0 && updateGradeTypeRequest.maximum_grade <= 100"
                                label="Maksimum" placeholder="0.0 - 100.0" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="updateGradeTypeRequest.grade_category" label="Kelompok Nilai (*)"
                                placeholder="Kelompok Nilai (*)" item-title="name" item-value="id" :items="gradePoints" />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="updateGradeTypeRequest.label" variant="outlined" hide-details
                                label="Label Indonesia" placeholder="Label " />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="updateGradeTypeRequest.english_label" variant="outlined" hide-details
                                label="Label Asing" placeholder="Label " />
                        </v-col>

                        <v-col cols="6" sm="6">
                            <v-text-field v-model="updateGradeTypeRequest.start_date" type="date" variant="outlined"
                                hide-details label="Tanggal Mulai Efektif (*)" />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="updateGradeTypeRequest.end_date" type="date" variant="outlined"
                                hide-details label="Tanggal Akhir Efektif (*)" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateGradeTypeRequest.code == ''" @click="update(); ">
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