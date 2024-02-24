<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetLaboratoryListData, GetLaboratoryListRoot } from '~~/types/api/laboratory/GetLaboratoryList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateLaboratoryRequest } from '~~/types/api/laboratory/CreateLaboratory';
import { createLaboratory } from '~~/composables/api/laboratory/createLaboratory';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetBuildingDetaiData } from '~~/types/api/building/GetBuildingDetail';
import { GetAdminStudyProgramDetailData } from '~~/types/api/admin-study-program/GetAdminStudyProgramDetail';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';


const props = defineProps({
    getBuildingDetaiData: Array as any
});

onMounted(async () => {

    getBuildingDetaiData.value = <GetBuildingDetaiData>props.getBuildingDetaiData
    createLaboratoryRequest.value.building_id = getBuildingDetaiData.value.id
    createLaboratoryRequest.value.purpose = "Laboratorium"
    await getAdminProgramStudy()
    let temp = <any[]>[];
    adminStudyProgramData.value.forEach((val) => {
        temp.push({ id: val.id, name: val.name })
    });
    studyPrograms.value = temp;
});

const getBuildingDetaiData = ref(<GetBuildingDetaiData>{})

const adminStudyProgramData = ref(<GetAdminStudyProgramListData[]>[]);

async function getAdminProgramStudy() {

    try {
        const { data: resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_study_program.AdminStudyProgramHandler/GetList?limit=1000000&page=1&search=`, <any>{
            method: 'GET',
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
        adminStudyProgramData.value = resp.value?.data
        // pagination.value = resp.value?.pagination


    } catch (error) {
        alert(error)

    }

}

const valid = ref(true)
const createLaboratoryRequest = ref(<CreateLaboratoryRequest>{});

const emit = defineEmits(['close', 'reload'])



async function save() {
    try {
        const { response: createRoleResponse, error } = await createLaboratory(createLaboratoryRequest.value)

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

const functions = ref([
    {
        id: "Laboratorium",
        name: "Laboratorium",
    },
])

const studyPrograms = ref(<any>[])
const owners = ref([
    {
        id: "Kerjasama Dengan PT Lain",
        name: "Kerjasama Dengan PT Lain",
    },
    {
        id: "Kerjasama Dengan Inst Lain",
        name: "Kerjasama Dengan Inst Lain",
    },
    {
        id: "Milik Institusi Sendiri",
        name: "Milik Institusi Sendiri",
    },
])

const locations = ref([
    {
        id: "Di Kampus Sendiri",
        name: "Di Kampus Sendiri",
    },
    {
        id: "Di Luar Inst Dlm Kota",
        name: "Di Luar Inst Dlm Kota",
    },
    {
        id: "Di Luar Inst Luar Kota",
        name: "Di Luar Inst Luar Kota",
    },
])
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Laboratorium</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-label text="Kode Gedung : "></v-label> {{ getBuildingDetaiData.code }}
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createLaboratoryRequest.code" variant="outlined" hide-details
                                label="Kode Laboratorium(*)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createLaboratoryRequest.name" variant="outlined" hide-details
                                label="Nama Laboratorium" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createLaboratoryRequest.capacity" type="number" variant="outlined"
                                hide-details label="Kapasitas" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createLaboratoryRequest.exam_capacity" type="number"
                                variant="outlined" hide-details label="Kapasitas Ujian" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Status Kelayakan"></v-label>
                            <v-radio-group v-model="createLaboratoryRequest.is_usable" inline hide-details="auto">
                                <v-radio label="Layak Pakai" :value="true" color="primary"></v-radio>
                                <v-radio label="Tidak Layak Pakai" :value="false" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createLaboratoryRequest.area" type="number" variant="outlined"
                                hide-details label="Luas(m2)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createLaboratoryRequest.phone_number" variant="outlined" hide-details
                                label="Telepon" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea outlined v-model="createLaboratoryRequest.facility" label="Fasilitas"
                                variant="outlined" hide-details></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea outlined v-model="createLaboratoryRequest.remarks" label="Catatan"
                                variant="outlined" hide-details></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="owners" item-value="id" item-title="name"
                                label="Kepemilikan" v-model="createLaboratoryRequest.owner"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="locations" item-value="id" item-title="name"
                                label="Lokasi" v-model="createLaboratoryRequest.location"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="functions" item-value="id" item-title="name"
                                label="Fungsi" v-model="createLaboratoryRequest.purpose"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="studyPrograms" item-value="id" item-title="name"
                                label="Program Studi(*)" v-model="createLaboratoryRequest.study_program_id"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createLaboratoryRequest.name == ''" @click="save(); ">
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