<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { getAcademicPortalStudentGeneralProfile } from '~~/composables/api/academic-portal-student-general/getAcademicPortalStudentGeneralProfile';
import { updateAcademicPortalStudentGeneralProfile } from '~~/composables/api/academic-portal-student-general/updateAcademicPortalStudentGeneralProfile';
import { createFile } from '~~/composables/api/file/createFile';
import { getRegencyList } from '~~/composables/api/location/getRegencyList';
import { GetAcademicPortalStudentGeneralProfileData } from '~~/types/api/academic-portal-student-general/GetAcademicPortalStudentGeneralProfile';
import { UpdateAcademicPortalStudentGeneralProfileRequest } from '~~/types/api/academic-portal-student-general/UpdateAcademicPortalStudentGeneralProfile';
import { ErrorRoot } from '~~/types/api/error';
import { CreateFileRequest } from '~~/types/api/file/CreateFile';
import { GetRegencyListData } from '~~/types/api/location/GetRegencyList';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { toBase64 } from '~~/utils/helpers/to-base64';
import { StorageSerializers, useStorage } from '@vueuse/core'

const props = defineProps({
    getAcademicPortalStudentGeneralProfiles: Object as any,
});

const router = useRouter()
onMounted(async () => {
    await getRegency("")
    detail.value = props.getAcademicPortalStudentGeneralProfiles
    updateStudentProfiles.value = Object.assign({}, props.getAcademicPortalStudentGeneralProfiles)
    // if (detail.value.father_birth_date)
    //     updateStudentProfiles.value.father_birth_date = detail.value.father_birth_date.substring(0, 10)
    // if (detail.value.mother_birth_date)
    //     updateStudentProfiles.value.mother_birth_date = detail.value.mother_birth_date.substring(0, 10)
    // if (detail.value.guardian_birth_date)
    //     updateStudentProfiles.value.guardian_birth_date = detail.value.guardian_birth_date.substring(0, 10)
    // if (detail.value.father_death_date)
    //     updateStudentProfiles.value.father_death_date = detail.value.father_death_date.substring(0, 10)
    // if (detail.value.mother_death_date)
    //     updateStudentProfiles.value.mother_death_date = detail.value.mother_death_date.substring(0, 10)
    // if (detail.value.guardian_death_date)
    //     updateStudentProfiles.value.guardian_death_date = detail.value.guardian_death_date.substring(0, 10)
})

const fileView = ref('')
const detail = ref(<GetAcademicPortalStudentGeneralProfileData>{})

const emitData = defineEmits(['close', 'reload'])
const updateStudentProfiles = ref(<UpdateAcademicPortalStudentGeneralProfileRequest>{
    profile_photo_path: "",
    profile_photo_path_type: "",
    sex: "",
    birth_regency_id: 0,
    blood_type: "",
    height: 0,
    weight: 0,
    is_color_blind: false,
    use_glasses: false,
    has_complete_teeth: false,
    id_number: "",
    npwp_number: "",
    nisn_number: "",
    religion: "",
    marital_status: "",
    nationality: "",
    village_id: 0,
    rt: "",
    rw: "",
    postal_code: "",
    address: "",
    phone_number: "",
    mobile_phone_number: "",
    email: "",
    transportation_mean: "",
    is_kps_recipient: false,
    fund_source: "",
    is_scholarship_grantee: false,
    total_brother: 0,
    total_sister: 0,
    work_type: "",
    work_place: "",
    work_address: "",
    assurance_number: "",
    hobby: "",
})
async function updateStudentProfileData() {
    try {
        var req = Object.assign({}, updateStudentProfiles.value)
        // if (req.father_birth_date)
        //     updateStudentProfiles.value.father_birth_date = convertDateWithoutTimeToTimezoned(req.father_birth_date)
        // if (req.mother_birth_date)
        //     updateStudentProfiles.value.mother_birth_date = convertDateWithoutTimeToTimezoned(req.mother_birth_date)
        // if (req.guardian_birth_date)
        //     updateStudentProfiles.value.guardian_birth_date = convertDateWithoutTimeToTimezoned(req.guardian_birth_date)
        // if (req.father_death_date)
        //     updateStudentProfiles.value.father_death_date = convertDateWithoutTimeToTimezoned(req.father_death_date)
        // if (req.mother_death_date)
        //     updateStudentProfiles.value.mother_death_date = convertDateWithoutTimeToTimezoned(req.mother_death_date)
        // if (req.guardian_death_date)
        //     updateStudentProfiles.value.guardian_death_date = convertDateWithoutTimeToTimezoned(req.guardian_death_date)
        const { response: resp, error: error } = await updateAcademicPortalStudentGeneralProfile(req)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            updateStudentProfiles.value = resp?.data
            await getProfileStudent()
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

async function getBase64(file: any) {
    fileView.value = <string>await toBase64(file.target.files[0])
    if (fileView.value != '') {
        try {
            const { response: createFileResponse, error } = await createFile(<CreateFileRequest>{
                file: fileView.value.split(',')[1],
            })
            if (error) {
                let dataError = <ErrorRoot>error;
                alert(dataError.meta.message);
                return;
            } else {
                updateStudentProfiles.value.profile_photo_path = <string>createFileResponse?.data.path
                updateStudentProfiles.value.profile_photo_path_type = <string>createFileResponse?.data.path_type
              
            }
        } catch (error) {
            alert(error)
        }
    }
}

async function getProfileStudent() {
    try {
        const { response: resp, error: error } = await getAcademicPortalStudentGeneralProfile()
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            useStorage('studentProfile', null, undefined, { serializer: StorageSerializers.object }).value = resp?.data
          
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
                <span class="title text-white">Ubah Data</span>
            </v-card-title>
            <v-col cols="12">
                <v-alert type="info" variant="tonal">
                    Keterangan :
                    <br />
                    Isilah Data anda dengan lengkap
                </v-alert>
            </v-col>
            <v-card-text>
                <Vspace space="3" />
                <label>Data Mahasiswa</label>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" variant="outlined" hide-details label="File"
                                @change="getBase64($event)" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="fileView != ''" class="text-center">
                            <img :src="fileView" style="max-height: 300px;" alt="File Fiew" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.email" variant="outlined" hide-details
                                label="Email" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="[{ id: false, name: 'Ya' }, { id: false, name: 'Tidak' },]" item-value="id"
                                item-title="name" v-model="updateStudentProfiles.is_kps_recipient"
                                label="Penerima KPS"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.rt" variant="outlined" hide-details label="Alamat"
                                :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.rw" variant="outlined" hide-details label="Alamat"
                                :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.postal_code" variant="outlined" hide-details
                                label="Alamat" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.postal_code" variant="outlined" hide-details
                                label="Alamat" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.address" variant="outlined" hide-details
                                label="Alamat" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.phone_number" variant="outlined" hide-details
                                label="Nomor Telepon" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.mobile_phone_number" variant="outlined"
                                hide-details label="Nomor HP" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="[{ id: 'F', name: 'Perempuan' }, { id: 'M', name: 'Laki Laki' },]"
                                item-value="id" item-title="name" v-model="updateStudentProfiles.sex"
                                label="Jenis Kelamin"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.height" type="number" variant="outlined"
                                hide-details label="Tinggi Badan" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.weight" type="number" variant="outlined"
                                hide-details label="Berat Badan" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="[{ id: true, name: 'Ya' }, { id: false, name: 'Tidak' },]" item-value="id"
                                item-title="name" v-model="updateStudentProfiles.is_color_blind"
                                label="Konsdisi Buta Warna"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="[{ id: true, name: 'Lengkap' }, { id: false, name: 'Tidak Lengkap' },]"
                                item-value="id" item-title="name" v-model="updateStudentProfiles.has_complete_teeth"
                                label="Konsdisi Gigi"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.blood_type" variant="outlined" hide-details
                                label="Golongan Darah" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.id_number" variant="outlined" hide-details
                                label="Nomor KTP" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.npwp_number" variant="outlined" hide-details
                                label="NPWP" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.nisn_number" variant="outlined" hide-details
                                label="NISN" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select
                                :items="[{ id: 'Islam', name: 'Islam' }, { id: 'Kristen', name: 'Kristen' }, { id: 'Katolik', name: 'Katolik' }, { id: 'Hindu', name: 'Hindu' }, { id: 'Budha', name: 'Budha' }, { id: 'Konghucu', name: 'Konghucu' },]"
                                item-value="id" item-title="name" v-model="updateStudentProfiles.religion"
                                label="Agama"></v-select>
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-select
                                :items="[{ id: 'Belum Menikah', name: 'Belum Menikah' }, { id: 'Menikah', name: 'Menikah' }, { id: 'Pernah Menikah', name: 'Pernah Menikah' }, { id: 'Janda', name: 'Janda' },]"
                                item-value="id" item-title="name" v-model="updateStudentProfiles.marital_status"
                                label="Status Nikah"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="[{ id: 'WNI', name: 'WNI' }, { id: 'WNA', name: 'WNA' },]" item-value="id"
                                item-title="name" v-model="updateStudentProfiles.nationality"
                                label="Warga Negara"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentProfiles.transportation_mean" variant="outlined"
                                hide-details label="Alat Transportasi" :readonly="false" />
                        </v-col>
                    </v-row>
                </v-form>
                <Vspace space="3" />

                <v-col cols="12">
                    <v-card-actions class="pa-4">
                        <v-spacer />
                        <v-btn color="error" @click="$emit('close')">
                            Batal
                        </v-btn>
                        <v-btn color="secondary" @click="updateStudentProfileData()">
                            Simpan
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-card-text>
        </v-card>
    </div>
</template>