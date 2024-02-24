<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateGradeComponent } from '~~/composables/api/grade-component/updateGradeComponent';
import { getSubjectCategoryList } from '~~/composables/api/subject-category/getSubjectCategoryList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { ErrorRoot } from '~~/types/api/error';
import { CreateGradeComponentRequest } from '~~/types/api/grade-component/CreateGradeComponent';
import { GetGradeComponentListData } from '~~/types/api/grade-component/GetGradeComponentList';
import { UpdateGradeComponentRequest } from '~~/types/api/grade-component/UpdateGradeComponent';
import { GetSubjectCategoryListData } from '~~/types/api/subject-category/GetSubjectCategoryList';

const props = defineProps({
    adminStudyProgram: Array as any,
    getGradeComponentListData: Array as any,
});

onMounted(async () => {
    adminStudyProgram.value = <GetAdminStudyProgramListData>props.adminStudyProgram
    detailGradeComponent = <GetGradeComponentListData>props.getGradeComponentListData
    updateGradeComponentRequest.value = <CreateGradeComponentRequest>props.getGradeComponentListData
    updateGradeComponentRequest.value.study_program_id = adminStudyProgram.value.id
    await getSubjectCategories()
});

const adminStudyProgram = ref(<GetAdminStudyProgramListData>{})

const valid = ref(true)
const updateGradeComponentRequest = ref(<CreateGradeComponentRequest>{});
let detailGradeComponent: GetGradeComponentListData;

const emit = defineEmits(['close', 'reload'])

const subjectCategories = ref<GetSubjectCategoryListData[]>([])
async function getSubjectCategories() {
    try {
        const { response: resp, error: error } = await getSubjectCategoryList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            subjectCategories.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateGradeComponent(<UpdateGradeComponentRequest>updateGradeComponentRequest.value)

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
                <span class="title text-white">Ubah Jenis Nilai</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="adminStudyProgram.name" variant="outlined" hide-details
                                label="Program Studi" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="subjectCategories" item-value="id"
                                item-title="name" label="Kategori Mata Kuliah (*)"
                                v-model="updateGradeComponentRequest.subject_category_id"></v-select>

                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateGradeComponentRequest.name" variant="outlined" hide-details
                                label="Nama Komponen Nilai Jenis (*)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details item-value="id" item-title="name" label="Status (*)"
                                v-model="updateGradeComponentRequest.is_active" :items="[
                                    {
                                        id: true,
                                        name: 'Aktif',
                                    },
                                    {
                                        id: false,
                                        name: 'Tidak Aktif',
                                    },
                                ]">
                            </v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateGradeComponentRequest.name == ''"
                                    @click="update(); ">
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