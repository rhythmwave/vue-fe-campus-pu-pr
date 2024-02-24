<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateLecturerClassExam } from '~~/composables/api/lecturer-class-exam/updateLecturerClassExam';
import { getLecturerAssignedClassList } from '~~/composables/api/lecturer-assigned-class/getLecturerAssignedClassList';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateLecturerClassExamRequest } from '~~/types/api/lecturer-class-exam/UpdateLecturerClassExam';
import { GetLecturerClassExamListData } from '~~/types/api/lecturer-class-exam/GetLecturerClassExamList';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-assigned-class/GetLecturerAssignedClassList';

const props = defineProps({
    sample: Array as any,
    getLecturerClassExamListData: Array as any,
});

onMounted(async () => {
    sample.value = Object.assign({},<GetSampleListData>props.sample)
    detailLecturerClassExam = <GetLecturerClassExamListData>props.getLecturerClassExamListData
    updateLecturerClassExamRequest.value = Object.assign({},<UpdateLecturerClassExamRequest>props.getLecturerClassExamListData) 
    updateLecturerClassExamRequest.value.study_program_id = sample.value.id
    await getLecturerAssignedClass()
});

const sample = ref(<GetSampleListData>{})

const valid = ref(true)
const updateLecturerClassExamRequest = ref(<UpdateLecturerClassExamRequest>{});
let detailLecturerClassExam: GetLecturerClassExamListData;

const emit = defineEmits(['close', 'reload'])

const lecturerAssignedClass = ref<GetLecturerAssignedClassListData[]>([])
async function getLecturerAssignedClass() {
    try {
        const { response: resp, error: error } = await getLecturerAssignedClassList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturerAssignedClass.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateLecturerClassExam(updateLecturerClassExamRequest.value)

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
                            <v-text-field v-model="sample.name" variant="outlined" hide-details
                                label="Nama" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="sample.ageg" variant="outlined" hide-details
                                label="Umur" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="lecturerAssignedClass" item-value="id"
                                item-title="name" label="Options"
                                v-model="updateLecturerClassExamRequest.name"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details item-value="id" item-title="name" label="Status (*)"
                                v-model="updateLecturerClassExamRequest.is_active" :items="[
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
                                <v-btn color="secondary" :disabled="updateLecturerClassExamRequest.name == ''"
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