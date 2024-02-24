<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateBuilding } from '~~/composables/api/building/updateBuilding';
import { getFacultyList } from '~~/composables/api/faculty/getFacultyList';
import { ErrorRoot } from '~~/types/api/error';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { GetFacultyListData } from '~~/types/api/faculty/GetFacultyList';
import { UpdateBuildingRequest } from '~~/types/api/building/UpdateBuilding';
import { getMajorList } from '~~/composables/api/major/getMajorList';
import { GetMajorListData } from '~~/types/api/major/GetMajorList';

const props = defineProps({
    getBuildingListData: Array as any,
});
let firstLoad = true;

onMounted(async () => {
    detailBuilding = <GetBuildingListData>props.getBuildingListData
    updateBuildingRequest.value = Object.assign({}, <UpdateBuildingRequest>props.getBuildingListData)
    level.value = detailBuilding.level
    await getFaculty()
    await getMajor(detailBuilding.faculty_id)
});


const valid = ref(true)
const updateBuildingRequest = ref(<UpdateBuildingRequest>{});
let detailBuilding: GetBuildingListData;

const emit = defineEmits(['close', 'reload'])

const faculty = ref<GetFacultyListData[]>([])
async function getFaculty() {
    try {
        const { response: resp, error: error } = await getFacultyList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            faculty.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const major = ref<GetMajorListData[]>([])
async function getMajor(facultyId: string) {
    try {
        if (firstLoad) {
            firstLoad = !firstLoad
        } else {
            updateBuildingRequest.value.major_id = ''
        }

        const { response: resp, error: error } = await getMajorList(1000000, 1, "", facultyId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            major.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

function facultyChanged(facultyId: string) {
    getMajor(facultyId)
}
function levelChanged(level: string) {
    updateBuildingRequest.value.major_id = ''
}

let level = ref('faculty')

async function update() {
    try {
        var req = <UpdateBuildingRequest>Object.assign({}, updateBuildingRequest.value)
        req.faculty_id = req.major_id ? '' : req.faculty_id
        const { response: updateRoleResponse, error } = await updateBuilding(req)

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

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Gedung</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateBuildingRequest.code" variant="outlined" hide-details="auto"
                                label="Kode (*)" :rules="[(v: string) => v.length > 0 || 'Kode harus di isi']" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateBuildingRequest.name" hide-details="auto" variant="outlined"
                                label="Nama" :rules="[(v: string) => v.length > 0 || 'Kode harus di isi']" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Tingkatan"></v-label>
                            <v-radio-group v-model="level" @update:model-value="(l) => levelChanged(l)" inline
                                hide-details="auto">
                                <v-radio label="Fakultas" value="faculty" color="primary"></v-radio>
                                <v-radio label="Jurusan" value="major" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" :items="faculty" item-value="id" item-title="name"
                                label="Fakultas (*)" v-model="updateBuildingRequest.faculty_id"
                                @update:model-value="(f) => facultyChanged(f)"
                                :rules="[(v: string) => v.length > 0 || 'Fakultas belum di pilih']"
                                hide-details="auto"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" v-if="level == 'major'">
                            <v-select variant="outlined" :items="major" item-value="id" item-title="name"
                                label="Jurusan (*)" v-model="updateBuildingRequest.major_id"
                                :rules="[(v: string) => v.length > 0 || 'Jurusan belum di pilih']"
                                hide-details="auto"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" @click="update(); "
                                    :disabled="updateBuildingRequest.code == ''
                                        || updateBuildingRequest.name == '' || updateBuildingRequest.faculty_id == ''
                                        || !((level == 'major' && updateBuildingRequest.major_id != '') || level == 'faculty')">
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