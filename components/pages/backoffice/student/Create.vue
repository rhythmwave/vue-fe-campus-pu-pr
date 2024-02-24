<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetStudentListData, GetStudentListRoot } from '~~/types/api/student/GetStudentList';
import { ErrorRoot } from '~~/types/api/error';
import { getYearBatch } from '~~/utils/helpers/graduation';
import { CreateStudentRequest } from '~~/types/api/student/CreateStudent';
import { GetRegencyListData } from '~~/types/api/location/GetRegencyList';
import { GetDistrictListData } from '~~/types/api/location/GetDistrictList';
import { GetVillageListData } from '~~/types/api/location/GetVillageList';
import { createStudent } from '~~/composables/api/student/createStudent';
import { getRegencyList } from '~~/composables/api/location/getRegencyList';
import { getDistrictList } from '~~/composables/api/location/getDistrictList';
import { getVillageList } from '~~/composables/api/location/getVillageList';
import { AnyMap } from '@jridgewell/trace-mapping';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';


// const props = defineProps({
//     sample: Array as any,
// });

onMounted(async () => {
    await getStudyProgram()
    await getCuriculum()
    await getRegency('')
    await getDistrict('')
});

const valid = ref(true)
const createStudentRequest = ref(<CreateStudentRequest>{
    name: '',
    sex: '',
    marital_status: '',
    birth_regency_id: 0,
    birth_date: '',
    religion: '',
    address: '',
    rt: '',
    rw: '',
    village_id: '',
    postal_code: '',
    previous_address: '',
    id_number: '',
    npwp_number: '',
    nisn_number: '',
    residence_type: '',
    transportation_mean: '',
    kps_receiver: '',
    phone_number: '',
    mobile_phone_number: '',
    email: '',
    homepage: '',
    work_type: '',
    work_place: '',
    nationality: '',
    askes_number: '',
    total_brother: 0,
    total_sister: 0,
    hobby: '',
    experience: '',
    total_dependent: 0,
    nim_number: 0,
    student_force: 0,
    admittance_semester: '',
    study_program_id: '',
    curriculum_id: '',
    admittance_test_number: '',
    admittance_date: '',
    admittance_status: '',
    total_transfer_credit: 0,
    previous_college: '',
    previous_study_program: '',
    previous_nim_number: '',
    previous_nim_admittance_year: '',
    status: '',
    is_foreign_student: false,
    college_entrance_type: '',
    class_time: '',
    fund_source: '',
    is_scholarship_grantee: false,
    has_complete_requirement: false,
    school_certificate_type: '',
    school_graduation_year: '',
    school_name: '',
    school_accreditation: '',
    school_address: '',
    school_major: '',
    school_certificate_number: '',
    school_certificate_date: '',
    total_school_final_exam_subject: 0,
    school_final_exam_score: 0,
    guardian_name: '',
    guardian_birth_date: '',
    guardian_death_date: '',
    guardian_address: '',
    guardian_regency_id: 0,
    guardian_postal_code: '',
    guardian_phone_number: '',
    guardian_email: '',
    guardian_final_academic_background: '',
    guardian_occupation: '',
    father_id_number: '',
    father_name: '',
    father_birth_date: '',
    father_death_date: '',
    mother_id_number: '',
    mother_name: '',
    mother_birth_date: '',
    mother_death_date: '',
    parent_address: '',
    parent_regency_id: 0,
    parent_postal_code: '',
    parent_phone_number: '',
    parent_email: '',
    father_final_academic_background: '',
    father_occupation: '',
    mother_final_academic_background: '',
    mother_occupation: '',
    parent_income: 0,
    is_financially_capable: false,
});

const emit = defineEmits(['close', 'reload'])

const studyPrograms = ref<GetAdminStudyProgramListData[]>([])
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
        const { response: resp, error: error } = await getCuriculumList(1000000, 1, "", createStudentRequest.value.study_program_id)
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

async function save() {
    try {
        const { response: createRoleResponse, error } = await createStudent(createStudentRequest.value)

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

watch(district_id, async (value) => {
    villages.value = []
    if(value.id != ''){
        await getVillage('')
    }
});

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Mahasiswa</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="studyPrograms" item-value="id" item-title="name" label="Pilih Program Studi" v-model="createStudentRequest.study_program_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="curriculums" item-value="id" item-title="name" label="Pilih Kurikulum" v-model="createStudentRequest.curriculum_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field variant="outlined" hide-details label="Nama" v-model="createStudentRequest.name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="number" variant="outlined" hide-details label="NIM" v-model="createStudentRequest.nim_number"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="getYearBatch()" variant="outlined" hide-details label="Angkatan" v-model="createStudentRequest.student_force"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="[{id: 'M', name: 'Laki-laki'}, {id: 'F', name: 'Perempuan'}]" item-value="id" item-title="name" variant="outlined" hide-details label="Jenis Kelamin" v-model="createStudentRequest.sex"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="['Kawin', 'Belum Kawin', 'Duda / Janda']" item-value="id" item-title="name" variant="outlined" hide-details label="Status Pernikahan" v-model="createStudentRequest.marital_status"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-autocomplete :items="regencies" v-model="createStudentRequest.birth_regency_id" item-value="id" item-title="name" variant="outlined" hide-details label="Tempat Lahir" @update:search="(d:any) => getRegency(d)"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="date" variant="outlined" hide-details label="Tanggal Lahir" v-model="createStudentRequest.birth_date"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="['Islam', 'Katolik', 'Protestan', 'Hindu', 'Budha', 'Konghucu']" variant="outlined" hide-details label="Agama" v-model="createStudentRequest.religion"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea variant="outlined" hide-details label="Alamat" v-model="createStudentRequest.address"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="number" variant="outlined" hide-details label="RT" v-model="createStudentRequest.rt"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="number" variant="outlined" hide-details label="RW" v-model="createStudentRequest.rw"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select class="mt-2" solo flat :items="['AKTIF','CUTI', 'KELUAR', 'LULUS', 'NON-AKTIF']" v-model="createStudentRequest.status"></v-select>
                        </v-col>
                        <!-- <v-col cols="12" sm="12">
                            <v-autocomplete v-model="district_id" :items="districts" item-value="id" item-title="name" variant="outlined" hide-details label="Kecamatan" @update:search="(d: any) => getDistrict(d)" return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-autocomplete v-model="createStudentRequest.village_id" :items="villages" item-value="id" item-title="name" variant="outlined" hide-details label="Kelurahan" @update:search="getVillage($event)" :disabled="villages.length == 0"></v-autocomplete>
                        </v-col> -->
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createStudentRequest.name == '' || createStudentRequest.nim_number == 0 || createStudentRequest.student_force == 0 || createStudentRequest.curriculum_id == ''"
                                    @click="save(); ">
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