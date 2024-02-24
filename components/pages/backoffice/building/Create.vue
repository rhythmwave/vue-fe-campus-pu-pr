<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetBuildingListData, GetBuildingListRoot } from '~~/types/api/building/GetBuildingList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateBuildingRequest } from '~~/types/api/building/CreateBuilding';
import { createBuilding } from '~~/composables/api/building/createBuilding';
import { AnyMap } from '@jridgewell/trace-mapping';
import { getFacultyList } from '~~/composables/api/faculty/getFacultyList';
import { GetFacultyListData } from '~~/types/api/faculty/GetFacultyList';
import { getMajorList } from '~~/composables/api/major/getMajorList';
import { GetMajorListData } from '~~/types/api/major/GetMajorList';

onMounted(async () => {
    await getFaculty()

});


const valid = ref(true)
const createBuildingRequest = ref(<CreateBuildingRequest>{
    code: '',
    faculty_id: '',
    major_id: '',
    name: ''
});

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
        createBuildingRequest.value.major_id = ''
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

async function save() {
    try {
        var req = <CreateBuildingRequest>Object.assign({}, createBuildingRequest.value)
        req.faculty_id = req.major_id ? '' : req.faculty_id
        const { response: createRoleResponse, error } = await createBuilding(req)

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
function facultyChanged(facultyId: string) {
    getMajor(facultyId)
}

function levelChanged(level: string) {
    createBuildingRequest.value.major_id = ''
}

let level = ref('faculty')
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Gedung</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createBuildingRequest.code" variant="outlined" hide-details="auto"
                                label="Kode (*)" :rules="[(v: string) => v.length > 0 || 'Kode harus di isi']" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createBuildingRequest.name" hide-details="auto" variant="outlined"
                                label="Nama" :rules="[(v: string) => v.length > 0 || 'Kode harus di isi']" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Tingkatan"></v-label>
                            <v-radio-group v-model="level" inline hide-details="auto" @update:model-value="(l) => levelChanged(l)">
                                <v-radio label="Fakultas" value="faculty" color="primary"></v-radio>
                                <v-radio label="Jurusan" value="major" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" :items="faculty" item-value="id" item-title="name"
                                label="Fakultas (*)" v-model="createBuildingRequest.faculty_id"
                                @update:model-value="(f) => facultyChanged(f)"
                                :rules="[(v: string) => v.length > 0 || 'Fakultas belum di pilih']"
                                hide-details="auto"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" v-if="level == 'major'">
                            <v-select variant="outlined" :items="major" item-value="id" item-title="name"
                                label="Jurusan (*)" v-model="createBuildingRequest.major_id"
                                :rules="[(v: string) => v.length > 0 || 'Jurusan belum di pilih']"
                                hide-details="auto"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" @click="save(); "
                                    :disabled="createBuildingRequest.code == ''
                                        || createBuildingRequest.name == '' || createBuildingRequest.faculty_id == ''
                                        || !((level == 'major' && createBuildingRequest.major_id != '') || level == 'faculty')">
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