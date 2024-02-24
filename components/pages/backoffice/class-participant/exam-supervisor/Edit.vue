<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateExamSupervisor } from '~~/types/api/class-participant/UpdateExamSupervisor';
import { DetailExamSupervisorData } from '~~/types/api/class-participant/DetailExamSupervisor';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetRegencyListData } from '~~/types/api/location/GetRegencyList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getRegencyList } from '~~/composables/api/location/getRegencyList';
import { updateExamSupervisor } from '~~/composables/api/class-participant/exam-supervisor/updateExamSupervisor';
import { getDetailExamSupervisor } from '~~/composables/api/class-participant/exam-supervisor/getDetailExamSupervisor';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';

const limit = 20
const page = 1
const emit = defineEmits(['close', 'reload'])
const valid = ref(true)
const studyPrograms = ref(<GetAdminStudyProgramListData[]>[])
const regencies = ref(<GetRegencyListData[]>[])
const regency_id = ref(0)
const birth_regency_id = ref(0)
const props = defineProps({
    data: String,
});
const detail = ref(<DetailExamSupervisorData>{})
const editObj = ref(<UpdateExamSupervisor>{})
const id = ref('')

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
async function getDetail(id: string) {
  try {
    const { response: resp, error: error } = await getDetailExamSupervisor(id)
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
        detail.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function save() {
    try {
        const { response: updateRoleResponse, error } = await updateExamSupervisor(editObj.value)

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
        editObj.value.birth_regency_id = value
    }
})
watch(regency_id, (value) => {
    if(value != 0){
        editObj.value.regency_id = value
    }
})

onMounted(async () => {
    id.value = <string>props.data
    await getDetail(id.value)
    editObj.value = <UpdateExamSupervisor>{
        id: detail.value.id,
        id_national_lecturer: detail.value.id_national_lecturer,
        name: detail.value.name,
        front_title: detail.value.front_title,
        back_degree: detail.value.back_degree,
        study_program_id: detail.value.study_program_id,
        id_number: detail.value.id_number,
        birth_date: detail.value.birth_date ? formatYearMonthDate(detail.value.birth_date) : '',
        birth_regency_id: detail.value.birth_regency_id,
        sex: detail.value.sex,
        blood_type: detail.value.blood_type,
        religion: detail.value.religion,
        marital_status: detail.value.marital_status,
        address: detail.value.address,
        regency_id: detail.value.regency_id,
        postal_code: detail.value.postal_code,
        phone_number: detail.value.phone_number,
        fax: detail.value.fax,
        mobile_phone_number: detail.value.mobile_phone_number,
        office_phone_number: detail.value.office_phone_number,
        employee_type: detail.value.employee_type,
        employee_status: detail.value.employee_status,
        sk_cpns_number: detail.value.sk_cpns_number,
        sk_cpns_date: detail.value.sk_cpns_date ? formatYearMonthDate(detail.value.sk_cpns_date) : '',
        tmt_cpns_date: detail.value.tmt_cpns_date ? formatYearMonthDate(detail.value.tmt_cpns_date) : '',
        cpns_category: detail.value.cpns_category,
        cpns_duration_month: detail.value.cpns_duration_month,
        pre_position_date: detail.value.pre_position_date ? formatYearMonthDate(detail.value.pre_position_date) : '',
        sk_pns_number: detail.value.sk_pns_number,
        sk_pns_date: detail.value.sk_pns_date ? formatYearMonthDate(detail.value.sk_pns_date) : '',
        tmt_pns_date: detail.value.tmt_pns_date ? formatYearMonthDate(detail.value.tmt_pns_date) : '',
        pns_category: detail.value.pns_category,
        pns_oath_date: detail.value.pns_oath_date ? formatYearMonthDate(detail.value.pns_oath_date) : '',
        join_date: detail.value.join_date ? formatYearMonthDate(detail.value.join_date) : '',
        end_date: detail.value.end_date ? formatYearMonthDate(detail.value.end_date) : '',
        taspen_number: detail.value.taspen_number,
        former_instance: detail.value.former_instance,
        remarks: detail.value.remarks,
    }
    await getStudyProgram()
    await getRegency('')
});

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Peran Pengawas</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="12" class="float-left">
                                <v-autocomplete :items="studyPrograms" item-value="id" item-title="name" variant="outlined" hide-details label="Pillih Program Studi" v-model="editObj.study_program_id"></v-autocomplete>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="*Nama" v-model="editObj.name"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor KTP" v-model="editObj.id_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Gelar (Depan)" v-model="editObj.front_title"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Gelar (Belakang)" v-model="editObj.back_degree"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="NIDN (*)" v-model="editObj.id_national_lecturer"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-autocomplete :items="regencies" item-value="id" item-title="name" variant="outlined" hide-details label="Tempat Lahir" v-model="birth_regency_id" @update:search="(sl:any) => getRegency(sl)"></v-autocomplete>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Tanggal Lahir" v-model="editObj.birth_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="[{id: 'm', name: 'Laki-laki'}, {id: 'f', name: 'Perempuan'}]" item-value="id" item-title="name" variant="outlined" hide-details label="Jenis Kelamin" v-model="editObj.sex"></v-select>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['-', 'A', 'B', 'O', 'AB']" variant="outlined" hide-details label="Golongan Darah" v-model="editObj.blood_type"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['Islam', 'Katolik', 'Protestan', 'Hindu', 'Budha', 'Konghucu']" variant="outlined" hide-details label="Agama" v-model="editObj.religion"></v-select>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['Menikah', 'Belum Menikah', 'Janda/Duda']" variant="outlined" hide-details label="Status Pernikahan" v-model="editObj.marital_status"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-autocomplete :items="regencies" item-value="id" item-title="name" variant="outlined" hide-details label="Kota/Kabupaten" v-model="regency_id"></v-autocomplete>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Kode Pos" v-model="editObj.postal_code"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Telepon" v-model="editObj.phone_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Fax" v-model="editObj.fax"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor Hp" v-model="editObj.mobile_phone_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor Kantor" v-model="editObj.office_phone_number"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Tipe Karyawan" v-model="editObj.employee_type"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['GTT/PTT Kab/Kota', 'GTT/PTT Provinsi', 'GTY/PTY', 'Guru Bantu Pusat', 'Guru Honor Sekolah', 'Lainnya', 'NON PNS', 'PNS', 'PNS Depag', 'PNS Diperbantukan', 'POLRI', 'Tenaga Honor Sekolah', 'TNI']" variant="outlined" hide-details label="Status Karyawan" v-model="editObj.employee_status"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor SK CPNS" v-model="editObj.sk_cpns_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Tanggal SK CPNS" v-model="editObj.sk_cpns_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Terhitung Mulai Tanggal (TMT) CPNS" v-model="editObj.tmt_cpns_date"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['1/a - Juru Muda', '1/b - Juru Muda Tingkat I', '1/c - Juru', '1/d - Juru Tingkat I', '2/a - Pengatur Muda', '2/b - Pengatur Muda Tingkat I', '2/c - Pengatur', '2/d - Pengatur Tingkat I', '3/a - Penata Muda', '3/b - Penata Muda Tingkat I', '3/c - Penata', '3/d - Penata Tingkat I', '4/a - Pembina', '4/b - Pembina Tingkat I', '4/c - Pembina Utama Muda', '4/d - Pembina Utama Madya', '4/e - Pembina Utama', 'E2 - ', 'F2 - ']" variant="outlined" hide-details label="Golongan CPNS" v-model="editObj.cpns_category"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="number" variant="outlined" hide-details label="Masa Kerja CPNS" v-model="editObj.cpns_duration_month"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Pra Jabatan" v-model="editObj.pre_position_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor SK PNS" v-model="editObj.sk_pns_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Tanggal SK PNS" v-model="editObj.sk_pns_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Terhitung Mulai Tanggal (TMT) PNS" v-model="editObj.tmt_pns_date"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-select :items="['1/a - Juru Muda', '1/b - Juru Muda Tingkat I', '1/c - Juru', '1/d - Juru Tingkat I', '2/a - Pengatur Muda', '2/b - Pengatur Muda Tingkat I', '2/c - Pengatur', '2/d - Pengatur Tingkat I', '3/a - Penata Muda', '3/b - Penata Muda Tingkat I', '3/c - Penata', '3/d - Penata Tingkat I', '4/a - Pembina', '4/b - Pembina Tingkat I', '4/c - Pembina Utama Muda', '4/d - Pembina Utama Madya', '4/e - Pembina Utama', 'E2 - ', 'F2 - ']" variant="outlined" hide-details label="Golongan PNS" v-model="editObj.pns_category"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Sumpah PNS" v-model="editObj.pns_oath_date"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field type="date" variant="outlined" hide-details label="Tanggal Masuk PT" v-model="editObj.join_date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-text-field variant="outlined" hide-details label="Nomor Taspen" v-model="editObj.taspen_number"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="6" class="float-left">
                                <v-textarea variant="outlined" hide-details label="Instansi Asal" v-model="editObj.former_instance"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" class="float-left">
                                <v-textarea variant="outlined" hide-details label="Catatan" v-model="editObj.remarks"></v-textarea>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-col cols="12" sm="12">
                                <v-textarea variant="outlined" hide-details label="Alamat" v-model="editObj.address"></v-textarea>
                            </v-col>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="editObj.name == ''"
                                    @click="save(); ">
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