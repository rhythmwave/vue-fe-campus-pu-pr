<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateLecturerResignation } from '~~/composables/api/lecturer-resignation/updateLecturerResignation';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateLecturerResignationRequest } from '~~/types/api/lecturer-resignation/UpdateLecturerResignation';
import { GetLecturerResignationListData } from '~~/types/api/lecturer-resignation/GetLecturerResignationList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';

const props = defineProps({
    sample: Array as any,
    getLecturerResignationListData: Array as any,
});

onMounted(async () => {
    sample.value = Object.assign({}, <GetSampleListData>props.sample)
    detailLecturerResignation = <GetLecturerResignationListData>props.getLecturerResignationListData
    updateLecturerResignationRequest.value = Object.assign({}, <UpdateLecturerResignationRequest>props.getLecturerResignationListData)
    updateLecturerResignationRequest.value.study_program_id = sample.value.id
    await getSemester()
});

const sample = ref(<GetSampleListData>{})

const valid = ref(true)
const updateLecturerResignationRequest = ref(<UpdateLecturerResignationRequest>{});
let detailLecturerResignation: GetLecturerResignationListData;

const emit = defineEmits(['close', 'reload'])

const semester = ref<GetSemesterListData[]>([])
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semester.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateLecturerResignation(updateLecturerResignationRequest.value)

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
                            <v-text-field v-model="sample.name" variant="outlined" hide-details label="Nama"
                                :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="sample.ageg" variant="outlined" hide-details label="Umur"
                                :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <!-- <v-select variant="outlined" hide-details :items="semester" item-value="id" item-title="name"
                                label="Options" v-model="updateLecturerResignationRequest.name"></v-select> -->
                            <v-select v-model="updateLecturerResignationRequest.semester_id" item-value="id" variant="outlined" hide-details
                                :items="semesters" label="Pilih Semester">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <li style="padding: 10px; margin: 2px;">
                                            <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                                                }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </v-select>

                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details item-value="id" item-title="name" label="Status (*)"
                                v-model="updateLecturerResignationRequest.is_active" :items="[
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
                                <v-btn color="secondary" :disabled="updateLecturerResignationRequest.name == ''"
                                    @click="update();">
                                    Ubah
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
</div></template>