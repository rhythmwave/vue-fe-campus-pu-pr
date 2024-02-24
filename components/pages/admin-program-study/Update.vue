<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetLecturerListData } from '~~/types/api/admin-lecturer/GetLecturerList';
import { GetAdminStudyProgramDetailData } from '~~/types/api/admin-study-program/GetAdminStudyProgramDetail';
import { UpdateAdminStudyProgramRequest } from '~~/types/api/admin-study-program/UpdateAdminStudyProgram';
import { GetDiktiStudyProgramListData } from '~~/types/api/dikti-study-program/GetDiktiStudyProgramList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { StudyProgramDikti } from '@/types/backoffice/backofficeTypes'

const props = defineProps({
    id: String,
});

onMounted(async () => {
    await getDetail(props.id as String)
    await getLecturer("")
    selectedDiktiStudyProgram.value = {
        id: adminStudyProgramDetail.value.dikti_study_program_id,
        code: adminStudyProgramDetail.value.dikti_study_program_code,
        name: adminStudyProgramDetail.value.dikti_study_program_name,
        study_level_short_name: adminStudyProgramDetail.value.study_level_short_name,
    }
})

function getAutocompleteStudyProgramDikti(data: any) {
    selectedDiktiStudyProgram.value = data;
    updateAdminStudyProgramRequest.value.dikti_study_program_id = data.id
    adminStudyProgramDetail.value.study_level_name = data.study_level_name
    adminStudyProgramDetail.value.study_level_short_name = data.study_level_short_name
}
const adminStudyProgramDetail = ref(<GetAdminStudyProgramDetailData>{});

async function getDetail(id: String) {
    try {
        try {
            const { data: resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/study_program/admin_study_program.AdminStudyProgramHandler/GetDetail?id=${id}`, <any>{
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
            adminStudyProgramDetail.value = resp.value?.data
            adminStudyProgramDetail.value.establishment_date = adminStudyProgramDetail.value.establishment_date?.substring(0, 10)
            adminStudyProgramDetail.value.operational_permit_date = adminStudyProgramDetail.value.operational_permit_date?.substring(0, 10)
            adminStudyProgramDetail.value.operational_permit_due_date = adminStudyProgramDetail.value.operational_permit_due_date?.substring(0, 10)

            updateAdminStudyProgramRequest.value = resp.value?.data
            is_active.value = adminStudyProgramDetail.value.is_active ? "Aktif" : "Hapus"

        } catch (error) {
            alert(error)
        }

    } catch (error) {
        alert(error);
    }
}

const diktiStudyProgram = ref(<GetDiktiStudyProgramListData[]>[]);
const selectedDiktiStudyProgram = ref(<GetDiktiStudyProgramListData>{});
async function getDiktiStudyProgram(search: string) {
    try {
        try {
            const { data: resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_dikti_study_program.AdminDiktiStudyProgramHandler/GetList?limit=20&page=1&search=${search}`, <any>{
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
            diktiStudyProgram.value = resp.value?.data
        } catch (error) {
            alert(error);
        }
    } catch (error) {
        alert(error);
    }
}

const lecturers = ref(<GetLecturerListData[]>[]);
const selectedLecturer = ref(<GetLecturerListData>{});
async function getLecturer(search: string) {
    try {
        const { data: resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_lecturer.AdminLecturerHandler/GetList?limit=20&page=1&search=${search}`, <any>{
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
        lecturers.value = resp.value?.data
        selectedLecturer.value = {
            id: <string>adminStudyProgramDetail.value.head_lecturer_id,
            name: <string>adminStudyProgramDetail.value.head_lecturer_name,
        }

    } catch (error) {
        alert(error);
    }
}

const valid = ref(true)
const updateAdminStudyProgramRequest = ref(<UpdateAdminStudyProgramRequest>{});
const curiculum_review_frequencies = [
    "Setiap 1 tahun",
    "Setiap 2 tahun",
    "Setiap 3 tahun",
    "Setiap 4 tahun",
    "Sesuai ketentuan pemerintah",
    "Sesuai kebutuhan",
];
const curiculum_review_methods = [
    "Oleh P.S. Sendiri",
    "Bersama Tim Dalam Perguruan Tinggi",
    "Orientasi Perguruan Tinggi Lain",
    "Orientasi Kebutuhan Pasar",
    "Bersama Stack Holder",
];
const is_active = ref('Aktif')
const is_actives = [
    "Aktif",
    "Hapus"
];



const emit = defineEmits(['close', 'reload'])
async function update() {
    try {
        // return true;
        updateAdminStudyProgramRequest.value.establishment_date = convertDateWithoutTimeToTimezoned(updateAdminStudyProgramRequest.value.establishment_date)
        updateAdminStudyProgramRequest.value.operational_permit_date = convertDateWithoutTimeToTimezoned(updateAdminStudyProgramRequest.value.operational_permit_date)
        updateAdminStudyProgramRequest.value.operational_permit_due_date = convertDateWithoutTimeToTimezoned(updateAdminStudyProgramRequest.value.operational_permit_due_date)
        console.log("selectedLecturer.value")
        console.log(selectedLecturer.value)
        if (selectedLecturer.value) {
            updateAdminStudyProgramRequest.value.head_lecturer_id = <string>selectedLecturer.value.id
        }
        try {
            const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/study_program/admin_study_program.AdminStudyProgramHandler/Update`, <any>{
                method: 'PATCH',
                body: updateAdminStudyProgramRequest.value,
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
            emit("reload");
        } catch (error) {
            alert(error)
        }
    } catch (error) {
        alert(error)
        // return false;
    }
    emit("close");
}
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Program Study</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <!-- <v-select variant="outlined" hide-details :items="diktiStudyProgram"
                                                            v-model="selectedDiktiStudyProgram" item-value="id" item-title="name"
                                                            label="Nama Program Study Dikti"></v-select> -->
                            <Autocomplete @reload="(data) => getDiktiStudyProgram(data.search)"
                                :label="'*Pilih Rumpun Keilmuan Dikti'" :initSelected="selectedDiktiStudyProgram"
                                @selected="(data) => getAutocompleteStudyProgramDikti(data)" :options="diktiStudyProgram" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="adminStudyProgramDetail.study_level_name" variant="outlined" hide-details
                                label="Jenjang" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.name" variant="outlined" hide-details
                                label="Nama" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.english_name" variant="outlined"
                                hide-details label="Nama Asing" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="adminStudyProgramDetail.dikti_study_program_code" variant="outlined"
                                hide-details label="Kode Program Studi" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="adminStudyProgramDetail.faculty_name" variant="outlined" hide-details
                                label="Fakultas" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="adminStudyProgramDetail.major_name" variant="outlined" hide-details
                                label="Jurusan" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="adminStudyProgramDetail.dikti_study_program_type" variant="outlined"
                                hide-details label="Model Perkuliahan" :readonly="true" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.minimum_graduation_credit"
                                variant="outlined" hide-details label="Jumlah SKS Lulus" :readonly="false" type="number" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.address" variant="outlined" hide-details
                                label="Alamat" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.phone_number" variant="outlined"
                                hide-details label="Telepon" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.fax" variant="outlined" hide-details
                                label="Fax" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.email" variant="outlined" hide-details
                                label="Email" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.website" variant="outlined" hide-details
                                label="Website" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.contact_person" variant="outlined"
                                hide-details label="Kontak Person" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="curiculum_review_frequencies"
                                v-model="updateAdminStudyProgramRequest.curiculum_review_frequency"
                                label="Frekuensi Peninjauan Kurikuklum"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="curiculum_review_methods"
                                v-model="updateAdminStudyProgramRequest.curiculum_review_method"
                                label="Plaksanaan Peninjauan Kurikuklum"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.establishment_date" type="date"
                                variant="outlined" hide-details label="Tanggal Berdiri" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="is_actives" v-model="is_active" label="Status"
                                @change="updateAdminStudyProgramRequest.is_active = $event.target.value == 'Aktif'"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <!-- <v-text-field v-model="updateAdminStudyProgramRequest.start_semester" type="date"
                                                            variant="outlined" hide-details label="Semester Mulai" /> -->
                            <v-select v-model="updateAdminStudyProgramRequest.start_semester" label="Semester Mulai"
                                placeholder="Semester Mulai" item-value="id" item-title="name" :items="[
                                    { id: '2020-1', name: '2020-1' },
                                    { id: '2020-2', name: '2020-2' },
                                    { id: '2021-1', name: '2021-1' },
                                    { id: '2021-2', name: '2021-2' },
                                    { id: '2022-1', name: '2022-1' },
                                    { id: '2022-2', name: '2022-2' },
                                    { id: '2023-1', name: '2023-1' },
                                    { id: '2023-2', name: '2023-2' },
                                    { id: '2024-1', name: '2024-1' },
                                    { id: '2024-2', name: '2024-2' },
                                    { id: '2025-1', name: '2025-1' },
                                    { id: '2025-2', name: '2025-2' },
                                ]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.operational_permit_number"
                                variant="outlined" hide-details
                                label="No. S.K. (Surat Keputusan) Izin operasional Dikti (terakhir)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.operational_permit_date" type="date"
                                variant="outlined" hide-details
                                label="Tanggal S.K. (Surat Keputusan) Izin operasional Dikti" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.operational_permit_due_date" type="date"
                                variant="outlined" hide-details
                                label="Tanggal batas akhir berlaku S.K. (Surat Keputusan) Izin operasional Dikti" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="lecturers" v-model="selectedLecturer.id"
                                item-value="id" item-title="name" label="Kepala Prodi"></v-select>
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.operator_name" variant="outlined"
                                hide-details label="Nama Operator" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateAdminStudyProgramRequest.operator_phone_number" variant="outlined"
                                hide-details label="No Telp Operator" :readonly="false" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateAdminStudyProgramRequest.name == ''"
                                    @click="update(); ">
                                    Simpan
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>