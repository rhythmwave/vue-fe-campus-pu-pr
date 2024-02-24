<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { getRegencyList } from '~~/composables/api/location/getRegencyList';
import { updateStudentParentProfile } from '~~/composables/api/student-parent-profile/updateStudentParentProfile';
import { ErrorRoot } from '~~/types/api/error';
import { GetRegencyListData } from '~~/types/api/location/GetRegencyList';
import { GetStudentParentProfileDetailData } from '~~/types/api/student-parent-profile/GetStudentParentProfileDetail';
import { UpdateStudentParentProfileRequest } from '~~/types/api/student-parent-profile/UpdateStudentParentProfile';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
const props = defineProps({
    getStudentParentProfileDetails: Object as any,
});

onMounted(async () => {
    await getRegency("")
    detail.value = props.getStudentParentProfileDetails
    updateStudentParentProfiles.value = Object.assign({}, detail.value)
    if (detail.value.father_birth_date)
        updateStudentParentProfiles.value.father_birth_date = detail.value.father_birth_date.substring(0, 10)
    if (detail.value.mother_birth_date)
        updateStudentParentProfiles.value.mother_birth_date = detail.value.mother_birth_date.substring(0, 10)
    if (detail.value.guardian_birth_date)
        updateStudentParentProfiles.value.guardian_birth_date = detail.value.guardian_birth_date.substring(0, 10)
    if (detail.value.father_death_date)
        updateStudentParentProfiles.value.father_death_date = detail.value.father_death_date.substring(0, 10)
    if (detail.value.mother_death_date)
        updateStudentParentProfiles.value.mother_death_date = detail.value.mother_death_date.substring(0, 10)
    if (detail.value.guardian_death_date)
        updateStudentParentProfiles.value.guardian_death_date = detail.value.guardian_death_date.substring(0, 10)
})
const detail = ref(<GetStudentParentProfileDetailData>{})

const emitData = defineEmits(['close', 'reload'])
const updateStudentParentProfiles = ref(<UpdateStudentParentProfileRequest>{

    father_id_number: "",
    father_name: "",
    father_birth_date: "",
    father_death_date: "",
    father_final_academic_background: "",
    father_occupation: "",
    mother_id_number: "",
    mother_name: "",
    mother_birth_date: "",
    mother_death_date: "",
    mother_final_academic_background: "",
    mother_occupation: "",
    parent_religion: "",
    parent_nationality: "",
    parent_address: "",
    father_work_address: "",
    parent_regency_id: 0,
    parent_postal_code: "",
    parent_phone_number: "",
    parent_email: "",
    is_financially_capable: false,
    parent_income: 0,
    total_dependent: 0,
    guardian_name: "",
    guardian_birth_date: "",
    guardian_death_date: "",
    guardian_address: "",
    guardian_regency_id: 0,
    guardian_postal_code: "",
    guardian_phone_number: "",
    guardian_email: "",
    guardian_final_academic_background: "",
    guardian_occupation: "",
})
async function updateStudentParentProfileData() {
    try {
        var req = Object.assign({}, updateStudentParentProfiles.value)
        if (req.father_birth_date)
            updateStudentParentProfiles.value.father_birth_date = convertDateWithoutTimeToTimezoned(req.father_birth_date)
        if (req.mother_birth_date)
            updateStudentParentProfiles.value.mother_birth_date = convertDateWithoutTimeToTimezoned(req.mother_birth_date)
        if (req.guardian_birth_date)
            updateStudentParentProfiles.value.guardian_birth_date = convertDateWithoutTimeToTimezoned(req.guardian_birth_date)
        if (req.father_death_date)
            updateStudentParentProfiles.value.father_death_date = convertDateWithoutTimeToTimezoned(req.father_death_date)
        if (req.mother_death_date)
            updateStudentParentProfiles.value.mother_death_date = convertDateWithoutTimeToTimezoned(req.mother_death_date)
        if (req.guardian_death_date)
            updateStudentParentProfiles.value.guardian_death_date = convertDateWithoutTimeToTimezoned(req.guardian_death_date)
        const { response: resp, error: error } = await updateStudentParentProfile(req)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            updateStudentParentProfiles.value = resp?.data
            emitData('reload');
        }
        // return true;
        emitData('close');
    } catch (error) {
        alert(error)
    }
}

const regencies = ref(<GetRegencyListData[]>[])
async function getRegency(search: string) {
    try {
        const { response: resp, error: error } = await getRegencyList(10000000, 1, search, '')
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
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Data Orang Tua</span>
            </v-card-title>
            <v-col cols="12">
                <v-alert type="info" variant="tonal">
                    Keterangan :
                    <br />
                    Isilah Data Orang Tua anda dengan lengkap
                </v-alert>
            </v-col>
            <v-card-text>
                <Vspace space="3" />
                <label>Data Ayah</label>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.father_id_number" variant="outlined"
                                hide-details="auto" label="Nik/No KTP Ayah" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.father_name" variant="outlined"
                                hide-details="auto" label="Nama Ayah" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.father_birth_date" variant="outlined"
                                type="date" hide-details="auto" label="Tanggal Lahir Ayah" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.father_death_date" variant="outlined"
                                type="date" hide-details="auto" label="Tanggal Meninggal Ayah" />
                        </v-col>
                        <!-- <v-col cols=12 lg="12" md="12">
                            <v-switch label="Ayah Meninggal" color="primary"></v-switch>
                        </v-col> -->
                        <!-- <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.father_final_academic_background"
                                variant="outlined" hide-details="auto" label="Pendidikan Ayah" />
                        </v-col> -->
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.father_final_academic_background"
                                variant="outlined" hide-details="auto" label="Pendidikan Terakhir Ayah" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.father_occupation" variant="outlined"
                                hide-details="auto" label="Pekerjaan Ayah" />
                        </v-col>
                    </v-row>
                </v-form>
                <Vspace space="3" />
                <label>Data Ibu</label>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.mother_id_number" variant="outlined"
                                hide-details="auto" label="Nik/No KTP Ibu" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.mother_name" variant="outlined"
                                hide-details="auto" label="Nama Ibu" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.mother_birth_date" variant="outlined"
                                type="date" hide-details="auto" label="Tanggal Lahir Ibu" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.mother_death_date" variant="outlined"
                                type="date" hide-details="auto" label="Tanggal Meninggal Ibu" />
                        </v-col>
                        <!-- <v-col cols=12 lg="12" md="12">
                            <v-switch label="Ibu Meninggal" color="primary"></v-switch>
                        </v-col> -->
                        <!-- <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.mother_final_academic_background"
                                variant="outlined" hide-details="auto" label="Pendidikan Ibu" />
                        </v-col> -->
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.mother_final_academic_background"
                                variant="outlined" hide-details="auto" label="Pendidikan Terakhir Ibu" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.mother_occupation" variant="outlined"
                                hide-details="auto" label="Pekerjaan Ibu" />
                        </v-col>
                    </v-row>
                </v-form>
                <Vspace space="3" />
                <label>Data Orang Tua</label>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        
                        <v-col cols="12" sm="12">
                            <v-select
                                :items="[{ id: 'Islam', name: 'Islam' }, { id: 'Kristen', name: 'Kristen' }, { id: 'Katolik', name: 'Katolik' }, { id: 'Hindu', name: 'Hindu' }, { id: 'Budha', name: 'Budha' }, { id: 'Konghucu', name: 'Konghucu' },]"
                                item-value="id" item-title="name" v-model="updateStudentParentProfiles.parent_religion"
                                label="Agama Orang Tua"></v-select>
                        </v-col>
                        
                        <v-col cols="12" sm="12">
                            <v-select :items="[{ id: 'WNI', name: 'WNI' }, { id: 'WNA', name: 'WNA' },]" item-value="id"
                                item-title="name" v-model="updateStudentParentProfiles.parent_nationality"
                                label="Warga Negara Orang Tua"></v-select>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.parent_address" variant="outlined"
                                hide-details="auto" label="Alamat Orang Tua" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.father_work_address" variant="outlined"
                                hide-details="auto" label="Alamat Kantor Ayah" />
                        </v-col>
                        <!-- <v-col cols=12 lg="12" md="12">
                            <v-text-field variant="outlined" hide-details="auto" label="Pilih Provinsi Orang Tua" />
                        </v-col> -->
                        <v-col cols=12 lg="12" md="12">
                            <!-- <v-text-field variant="outlined" hide-details="auto" label="Pilih Kota Orang Tua" /> -->
                            <v-autocomplete :items="regencies" item-value="id" item-title="name" variant="outlined"
                                hide-details label="Kota Orang Tua" v-model="updateStudentParentProfiles.parent_regency_id"
                                @update:search="(sl: any) => getRegency(sl)"></v-autocomplete>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.parent_postal_code" variant="outlined"
                                hide-details="auto" label="Kode Pos Orang Tua" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.parent_phone_number" variant="outlined"
                                hide-details="auto" label="No Telp / Hp Orang Tua" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.parent_email" variant="outlined"
                                hide-details="auto" label="Email Orang Tua" />
                        </v-col>
                        <!-- <v-col cols=12 lg="12" md="12">
                            <v-switch label="Orang Tua Mampu" color="primary"></v-switch>
                        </v-col> -->
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.parent_income" type="number"
                                variant="outlined" hide-details="auto" label="Penghasilan Orang Tua" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.total_dependent" variant="outlined"
                                hide-details="auto" label="Jumlah Tanggungan" />
                        </v-col>
                    </v-row>
                </v-form>
                <Vspace space="3" />
                <label>Data Wali</label>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_name" variant="outlined"
                                hide-details="auto" label="Nama Wali" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_birth_date" variant="outlined"
                                type="date" hide-details="auto" label="Tanggal Lahir Wali" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_death_date" variant="outlined"
                                type="date" hide-details="auto" label="Tanggal Meninggal Wali" />
                        </v-col>
                        <!-- <v-col cols=12 lg="12" md="12">
                            <v-switch label="Wali Meninggal ?" color="primary"></v-switch>
                        </v-col> -->
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_address" variant="outlined"
                                hide-details="auto" label="Alamat Wali" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field variant="outlined" hide-details="auto" label="Pilih Provinsi Wali" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <!-- <v-text-field variant="outlined" hide-details="auto" label="Pilih Kota Wali" /> -->
                            <v-autocomplete :items="regencies" item-value="id" item-title="name" variant="outlined"
                                hide-details label="Kota Wali" v-model="updateStudentParentProfiles.guardian_regency_id"
                                @update:search="(sl: any) => getRegency(sl)"></v-autocomplete>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_postal_code" variant="outlined"
                                hide-details="auto" label="Kode Pos Wali" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_phone_number" variant="outlined"
                                hide-details="auto" label="No Telepon / Hp Wali" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_email" variant="outlined"
                                hide-details="auto" label="Email Wali" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_occupation" variant="outlined"
                                hide-details="auto" label="Pekerjaan Wali" />
                        </v-col>
                        <!-- <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_final_academic_background" variant="outlined" hide-details="auto" label="Pendidikan Wali" />
                        </v-col> -->
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentParentProfiles.guardian_final_academic_background"
                                variant="outlined" hide-details="auto" label="Pendidikan Terakhir Wali" />
                        </v-col>
                    </v-row>
                </v-form>
                <v-col cols="12">
                    <v-card-actions class="pa-4">
                        <v-spacer />
                        <v-btn color="error" @click="$emit('close')">
                            Batal
                        </v-btn>
                        <v-btn color="secondary" @click="updateStudentParentProfileData()">
                            Tambah
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-card-text>
        </v-card>
    </div>
</template>