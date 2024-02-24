<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetGradeTypeListData, GetGradeTypeListRoot } from '~~/types/api/grade-type/GetGradeTypeList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateGradeTypeRequest } from '~~/types/api/grade-type/CreateGradeType';
import { createGradeType } from '~~/composables/api/grade-type/createGradeType';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetStudyLevelListData } from '~~/types/api/study-level/GetStudyLevelList';


const props = defineProps({
    studyLevel: Array as any,
});

onMounted(async () => {
    studyLevel.value = <GetStudyLevelListData>props.studyLevel
    createGradeTypeRequest.value.study_level_id = studyLevel.value.id
});

const studyLevel= ref(<GetStudyLevelListData>{
    id: '',
    code: '',
    name: '',
    short_name: ''
})

const valid = ref(true)
const createGradeTypeRequest = ref(<CreateGradeTypeRequest>{
    code: '',
    grade_point: 0,
    minimum_grade: 0,
    maximum_grade: 0,
    grade_category: '',
    grade_point_category: 0,
    label: '',
    english_label: '',
    start_date: '',
    end_date: '',
    study_level_id: ''
});

const emit = defineEmits(['close', 'reload'])


async function save() {
    if (createGradeTypeRequest.value.start_date) {
        createGradeTypeRequest.value.start_date = convertDateWithoutTimeToTimezoned(createGradeTypeRequest.value.start_date)
    }
    if (createGradeTypeRequest.value.end_date) {
        createGradeTypeRequest.value.end_date = convertDateWithoutTimeToTimezoned(createGradeTypeRequest.value.end_date)
    }
    try {
        const { response: createRoleResponse, error } = await createGradeType(createGradeTypeRequest.value)

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
    if (createGradeTypeRequest.value.start_date) {
        createGradeTypeRequest.value.start_date = createGradeTypeRequest.value.start_date.substring(10)
    }
    if (createGradeTypeRequest.value.end_date) {
        createGradeTypeRequest.value.end_date = createGradeTypeRequest.value.end_date.substring(10)
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
                            <v-text-field v-model="studyLevel.short_name" variant="outlined" hide-details
                                label="Jenjang Study" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createGradeTypeRequest.code"
                                :rules="[(v: string) => v.length <= 2 || 'Maksimum 2 karakter',]" variant="outlined"
                                :hide-details="createGradeTypeRequest.code.length <= 2" label="Kode Nilai (*)"
                                placeholder="A" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createGradeTypeRequest.grade_point" type="number"
                                :rules="[(v: number) => (v >= 0 && v <= 4) || 'Masukan nilai antara 0.0 - 4.0',]"
                                variant="outlined"
                                :hide-details="createGradeTypeRequest.grade_point >= 0 && createGradeTypeRequest.grade_point <= 4"
                                label="Bobot" placeholder="0.0 - 4.0" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createGradeTypeRequest.grade_point_category" type="number"
                                :rules="[(v: number) => (v >= 0 && v <= 4) || 'Masukan nilai antara 0.0 - 4.0',]"
                                variant="outlined"
                                :hide-details="createGradeTypeRequest.grade_point_category >= 0 && createGradeTypeRequest.grade_point_category <= 4"
                                label="Bobot Kelompok" placeholder="0.0 - 4.0" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Rentang Nilai</v-label>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="createGradeTypeRequest.minimum_grade" type="number"
                                :rules="[(v: number) => (v >= 0 && v <= 100) || 'Masukan nilai antara 0.0 - 100.0',]"
                                variant="outlined"
                                :hide-details="createGradeTypeRequest.minimum_grade >= 0 && createGradeTypeRequest.minimum_grade <= 100"
                                label="Minumum" placeholder="0.0 - 100.0" />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="createGradeTypeRequest.maximum_grade" type="number"
                                :rules="[(v: number) => (v >= 0 && v <= 100) || 'Masukan nilai antara 0.0 - 100.0',]"
                                variant="outlined"
                                :hide-details="createGradeTypeRequest.maximum_grade >= 0 && createGradeTypeRequest.maximum_grade <= 100"
                                label="Maksimum" placeholder="0.0 - 100.0" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="createGradeTypeRequest.grade_category" label="Kelompok Nilai (*)"
                                placeholder="Kelompok Nilai (*)" item-title="name" item-value="id" :items="gradePoints" />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="createGradeTypeRequest.label" variant="outlined" hide-details
                                label="Label Indonesia" placeholder="Label " />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="createGradeTypeRequest.english_label" variant="outlined" hide-details
                                label="Label Asing" placeholder="Label " />
                        </v-col>

                        <v-col cols="6" sm="6">
                            <v-text-field v-model="createGradeTypeRequest.start_date" type="date" variant="outlined"
                                hide-details label="Tanggal Mulai Efektif (*)" />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field v-model="createGradeTypeRequest.end_date" type="date" variant="outlined"
                                hide-details label="Tanggal Akhir Efektif (*)" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createGradeTypeRequest.code == ''" @click="save(); ">
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