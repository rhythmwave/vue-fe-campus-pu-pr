<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { CreateExamSupervisor } from '~~/types/api/class-participant/CreateExamSupervisor';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetRegencyListData } from '~~/types/api/location/GetRegencyList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getRegencyList } from '~~/composables/api/location/getRegencyList';
import { createExamSupervisorRole } from '~~/composables/api/class-participant/exam-supervisor/createExamSupervisor';

const limit = 20
const page = 1
const emit = defineEmits(['close', 'reload'])
const valid = ref(true)
const createObj = ref(<CreateExamSupervisor>{})
const studyPrograms = ref(<GetAdminStudyProgramListData[]>[])
const regencies = ref(<GetRegencyListData[]>[])
const regency_id = ref(0)
const birth_regency_id = ref(0)

async function getStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, '', '')
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
async function getRegency(search: string) {
    try {
        const { response: resp, error: error } = await getRegencyList(limit, page, search, '')
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
async function save() {
    try {
        const { response: createRoleResponse, error } = await createExamSupervisorRole(createObj.value)

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

watch(birth_regency_id, (value) => {
    if(value != 0){
        createObj.value.birth_regency_id = value
    }
})
watch(regency_id, (value) => {
    if(value != 0){
        createObj.value.regency_id = value
    }
})

onMounted(async () => {
    await getStudyProgram()
    await getRegency('')
});

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Peran Pengawas</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="12" class="float-left">
                                <v-autocomplete :items="studyPrograms" item-value="id" item-title="name" variant="outlined" hide-details label="Pillih Program Studi" v-model="createObj.study_program_id"></v-autocomplete>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="*Nama" v-model="createObj.name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor KTP" v-model="createObj.id_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Gelar (Depan)" v-model="createObj.front_title"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Gelar (Belakang)" v-model="createObj.back_degree"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="NIDN (*)" v-model="createObj.id_national_lecturer"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-autocomplete :items="regencies" item-value="id" item-title="name" variant="outlined" hide-details label="Tempat Lahir" v-model="birth_regency_id" @update:search="(sl:any) => getRegency(sl)"></v-autocomplete>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Tanggal Lahir" v-model="createObj.birth_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="[{id: 'm', name: 'Laki-laki'}, {id: 'f', name: 'Perempuan'}]" item-value="id" item-title="name" variant="outlined" hide-details label="Jenis Kelamin" v-model="createObj.sex"></v-select>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['-', 'A', 'B', 'O', 'AB']" variant="outlined" hide-details label="Golongan Darah" v-model="createObj.blood_type"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['Islam', 'Katolik', 'Protestan', 'Hindu', 'Budha', 'Konghucu']" variant="outlined" hide-details label="Agama" v-model="createObj.religion"></v-select>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['Menikah', 'Belum Menikah', 'Janda/Duda']" variant="outlined" hide-details label="Status Pernikahan" v-model="createObj.marital_status"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-autocomplete :items="regencies" item-value="id" item-title="name" variant="outlined" hide-details label="Kota/Kabupaten" v-model="regency_id"></v-autocomplete>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Kode Pos" v-model="createObj.postal_code"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Telepon" v-model="createObj.phone_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Fax" v-model="createObj.fax"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor Hp" v-model="createObj.mobile_phone_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor Kantor" v-model="createObj.office_phone_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Tipe Karyawan" v-model="createObj.employee_type"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['GTT/PTT Kab/Kota', 'GTT/PTT Provinsi', 'GTY/PTY', 'Guru Bantu Pusat', 'Guru Honor Sekolah', 'Lainnya', 'NON PNS', 'PNS', 'PNS Depag', 'PNS Diperbantukan', 'POLRI', 'Tenaga Honor Sekolah', 'TNI']" variant="outlined" hide-details label="Status Karyawan" v-model="createObj.employee_status"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor SK CPNS" v-model="createObj.sk_cpns_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Tanggal SK CPNS" v-model="createObj.sk_cpns_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Terhitung Mulai Tanggal (TMT) CPNS" v-model="createObj.tmt_cpns_date"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['1/a - Juru Muda', '1/b - Juru Muda Tingkat I', '1/c - Juru', '1/d - Juru Tingkat I', '2/a - Pengatur Muda', '2/b - Pengatur Muda Tingkat I', '2/c - Pengatur', '2/d - Pengatur Tingkat I', '3/a - Penata Muda', '3/b - Penata Muda Tingkat I', '3/c - Penata', '3/d - Penata Tingkat I', '4/a - Pembina', '4/b - Pembina Tingkat I', '4/c - Pembina Utama Muda', '4/d - Pembina Utama Madya', '4/e - Pembina Utama', 'E2 - ', 'F2 - ']" variant="outlined" hide-details label="Golongan CPNS" v-model="createObj.cpns_category"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="number" variant="outlined" hide-details label="Masa Kerja CPNS" v-model="createObj.cpns_duration_month"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Pra Jabatan" v-model="createObj.pre_position_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor SK PNS" v-model="createObj.sk_pns_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Tanggal SK PNS" v-model="createObj.sk_pns_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Terhitung Mulai Tanggal (TMT) PNS" v-model="createObj.tmt_pns_date"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['1/a - Juru Muda', '1/b - Juru Muda Tingkat I', '1/c - Juru', '1/d - Juru Tingkat I', '2/a - Pengatur Muda', '2/b - Pengatur Muda Tingkat I', '2/c - Pengatur', '2/d - Pengatur Tingkat I', '3/a - Penata Muda', '3/b - Penata Muda Tingkat I', '3/c - Penata', '3/d - Penata Tingkat I', '4/a - Pembina', '4/b - Pembina Tingkat I', '4/c - Pembina Utama Muda', '4/d - Pembina Utama Madya', '4/e - Pembina Utama', 'E2 - ', 'F2 - ']" variant="outlined" hide-details label="Golongan PNS" v-model="createObj.pns_category"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Sumpah PNS" v-model="createObj.pns_oath_date"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Tanggal Masuk PT" v-model="createObj.join_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor Taspen" v-model="createObj.taspen_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-textarea variant="outlined" hide-details label="Instansi Asal" v-model="createObj.former_instance"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-textarea variant="outlined" hide-details label="Catatan" v-model="createObj.remarks"></v-textarea>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="12">
                                <v-textarea variant="outlined" hide-details label="Alamat" v-model="createObj.address"></v-textarea>
                            </v-col>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="createObj.name == ''"
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