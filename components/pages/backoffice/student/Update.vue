<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned, formatYearMonthDate } from '~~/utils/helpers/date-utils';

import { updateStudent } from '~~/composables/api/student/updateStudent';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';
import { UpdateStudentRequest } from '~~/types/api/student/UpdateStudent';
import { GetStudentListData } from '~~/types/api/student/GetStudentList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetRegencyListData } from '~~/types/api/location/GetRegencyList';
import { GetDistrictListData } from '~~/types/api/location/GetDistrictList';
import { GetVillageListData } from '~~/types/api/location/GetVillageList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getRegencyList } from '~~/composables/api/location/getRegencyList';
import { getDistrictList } from '~~/composables/api/location/getDistrictList';
import { getVillageList } from '~~/composables/api/location/getVillageList';
import { getYearBatch } from '~~/utils/helpers/graduation';


const props = defineProps({
    getStudentListData: Object,
});

const valid = ref(true)
const updateStudentRequest = ref(<UpdateStudentRequest>{});
let detailStudent = ref(<GetStudentListData>{});

const emitData = defineEmits(['close', 'reload'])

const studyPrograms = ref<GetAdminStudyProgramListData[]>([])
const study_program_id = ref('')
const curriculums = ref<GetCuriculumListData[]>([])
const regencies = ref<GetRegencyListData[]>([])
const districts = ref<GetDistrictListData[]>([])
const villages = ref<GetVillageListData[]>([])
const district_id = ref({
    id: '',
    name: '',
})
async function getStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getCuriculum() {
    try {
        const { response: resp, error: error } = await getCuriculumList(1000000, 1, "", updateStudentRequest.value.study_program_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            curriculums.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getRegency(search: string) {
    try {
        const { response: resp, error: error } = await getRegencyList(20, 1, search, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            regencies.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getDistrict(search: string) {
    try {
        const { response: resp, error: error } = await getDistrictList(20, 1, search, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            districts.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getVillage(search: string) {
    try {
        const { response: resp, error: error } = await getVillageList(20, 1, search, district_id.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            villages.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function update() {
    try {

        var req = Object.assign({}, updateStudentRequest.value)
        if (req.father_birth_date)
            updateStudentRequest.value.father_birth_date = convertDateWithoutTimeToTimezoned(req.father_birth_date)
        if (req.mother_birth_date)
            updateStudentRequest.value.mother_birth_date = convertDateWithoutTimeToTimezoned(req.mother_birth_date)
        if (req.guardian_birth_date)
            updateStudentRequest.value.guardian_birth_date = convertDateWithoutTimeToTimezoned(req.guardian_birth_date)

        if (req.birth_date)
        updateStudentRequest.value.birth_date = convertDateWithoutTimeToTimezoned(req.birth_date)
        if (req.admittance_date)
        updateStudentRequest.value.admittance_date = convertDateWithoutTimeToTimezoned(req.birth_date)


        const { response: updateRoleResponse, error } = await updateStudent(req)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emitData('reload');
        }
        // return true;
        emitData('close');
    } catch (error) {
        alert(error)
        // return false;
    }
}

// watch(district_id, async (value) => {
//     villages.value = []
//     if(value.id != ''){
//         await getVillage('')
//     }
//     await getCuriculum()
// });
watch(study_program_id, async (value) => {
    updateStudentRequest.value.study_program_id = value
    await getStudyProgram()
    await getCuriculum()
    await getRegency('')
});
onMounted(async () => {
    await getStudyProgram()
    detailStudent.value = <GetStudentListData>props.getStudentListData
    updateStudentRequest.value = Object.assign({}, detailStudent.value)
    study_program_id.value = <string>props.getStudentListData?.study_program_id
    if (detailStudent.value.birth_regency_id > 0) {
        updateStudentRequest.value.birth_regency_id = detailStudent.value.birth_regency_id
    } else {
        updateStudentRequest.value.birth_regency_id = ''
    }

    if (updateStudentRequest.value.mother_birth_date != '') {
        updateStudentRequest.value.mother_birth_date = formatYearMonthDate(updateStudentRequest.value.birth_date)
    }
    if (updateStudentRequest.value.father_birth_date != '') {
        updateStudentRequest.value.father_birth_date = formatYearMonthDate(updateStudentRequest.value.father_birth_date)
    }
    if (updateStudentRequest.value.guardian_birth_date != '') {
        updateStudentRequest.value.guardian_birth_date = formatYearMonthDate(updateStudentRequest.value.guardian_birth_date)
    }
    if (updateStudentRequest.value.birth_date != '') {
        updateStudentRequest.value.birth_date = formatYearMonthDate(updateStudentRequest.value.birth_date)
    }
    if (updateStudentRequest.value.admittance_date != '') {
        updateStudentRequest.value.admittance_date = formatYearMonthDate(updateStudentRequest.value.admittance_date)
    }
    await getCuriculum()
    await getRegency('')
});
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Mahasiswa</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="studyPrograms" item-value="id"
                                item-title="name" label="Pilih Program Studi" v-model="study_program_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="curriculums" item-value="id" item-title="name"
                                label="Pilih Kurikulum" v-model="updateStudentRequest.curriculum_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field variant="outlined" hide-details label="Nama"
                                v-model="updateStudentRequest.name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="number" variant="outlined" hide-details label="NIM"
                                v-model="updateStudentRequest.nim_number"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="getYearBatch()" variant="outlined" hide-details label="Angkatan"
                                v-model="updateStudentRequest.student_force"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="[{ id: 'M', name: 'Laki-laki' }, { id: 'F', name: 'Perempuan' }]"
                                item-value="id" item-title="name" variant="outlined" hide-details label="Jenis Kelamin"
                                v-model="updateStudentRequest.sex"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="['Kawin', 'Belum Kawin', 'Duda / Janda']" item-value="id" item-title="name"
                                variant="outlined" hide-details label="Status Pernikahan"
                                v-model="updateStudentRequest.marital_status"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-autocomplete :items="regencies" v-model="updateStudentRequest.birth_regency_id"
                                item-value="id" item-title="name" variant="outlined" hide-details label="Tempat Lahir"
                                @update:search="(d: any) => getRegency(d)"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" variant="outlined" hide-details label="Tanggal Lahir"
                                v-model="updateStudentRequest.birth_date"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="['Islam', 'Katolik', 'Protestan', 'Hindu', 'Budha', 'Konghucu']"
                                variant="outlined" hide-details label="Agama"
                                v-model="updateStudentRequest.religion"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea variant="outlined" hide-details label="Alamat"
                                v-model="updateStudentRequest.address"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="number" variant="outlined" hide-details label="RT"
                                    v-model="updateStudentRequest.rt"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="number" variant="outlined" hide-details label="RW"
                                    v-model="updateStudentRequest.rw"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select class="mt-2" solo flat :items="['AKTIF', 'CUTI', 'KELUAR', 'LULUS', 'NON-AKTIF']"
                                v-model="updateStudentRequest.status"></v-select>
                        </v-col>
                        <!-- <v-col cols="12" sm="12">
                            <v-autocomplete v-model="district_id" :items="districts" item-value="id" item-title="name" variant="outlined" hide-details label="Kecamatan" @update:search="(d: any) => getDistrict(d)" return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-autocomplete v-model="updateStudentRequest.village_id" :items="villages" item-value="id" item-title="name" variant="outlined" hide-details label="Kelurahan" @update:search="getVillage($event)" :disabled="villages.length == 0"></v-autocomplete>
                        </v-col> -->
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    :disabled="updateStudentRequest.name == '' || updateStudentRequest.nim_number == 0 || updateStudentRequest.student_force == 0 || updateStudentRequest.curriculum_id == '' || updateStudentRequest.birth_date == ''"
                                    @click="update();">
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