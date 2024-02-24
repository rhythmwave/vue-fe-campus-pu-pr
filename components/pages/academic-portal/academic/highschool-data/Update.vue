<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { updateStudentSchoolProfile } from '~~/composables/api/student-school-profile/updateStudentSchoolProfile';
import { EducationUpdateHighSchoolRequest } from '~~/types/api/academic-portal-highschool-data/UpdateHighSchoolRequest';
import { ErrorRoot } from '~~/types/api/error';
import { GetLocationProvinceList } from '~~/types/api/general/LocationProvince';
import { GetStudentSchoolProfileDetailData } from '~~/types/api/student-school-profile/GetStudentSchoolProfileDetail';
import { UpdateStudentSchoolProfilePreHighSchoolHistory, UpdateStudentSchoolProfileRequest } from '~~/types/api/student-school-profile/UpdateStudentSchoolProfile';
import { getYearGraduation, getMajorSMTA, getTypeSMTA, getYearBatch } from '~~/utils/helpers/graduation';
const props = defineProps({
    getStudentSchoolProfileDetails: Object as any,
});

onMounted(async () => {
    detail.value = props.getStudentSchoolProfileDetails
    updateStudentSchoolProfileRequest.value = <UpdateStudentSchoolProfileRequest>detail.value
    let temp = <any>[]
    educations.value = []
    detail.value.pre_high_school_histories.forEach((phs) => {
        temp.push(Object.assign({}, phs))
        educations.value.push(Object.assign({}, <EducationUpdateHighSchoolRequest>{
            education: phs.level,
            graduation_year: phs.graduation_year,
            name_school: phs.name,
        }))
    })
    updateStudentSchoolProfileRequest.value.pre_high_school_histories = temp
    if (detail.value.school_certificate_date) {
        school_certificate_date.value = detail.value.school_certificate_date.substring(0, 10)
    }
    if (detail.value.school_province_name) {

        await getDataProvince(20, 1, detail.value.school_province_name)
        selectedProvince.value = provinces.value[0]
    }

})
const school_certificate_date = ref('')
const detail = ref(<GetStudentSchoolProfileDetailData>{
    school_enrollment_year: "",
    school_graduation_year: "",
    school_enrollment_class: "",
    school_major: "",
    school_type: "",
    school_name: "",
    school_province_id: 0,
    school_province_name: "",
    school_address: "",
    school_certificate_number: "",
    school_certificate_date: "",
    school_status: "",
    school_accreditation: "",
    school_final_exam_score: 0,
    school_mathematics_final_exam_score: 0,
    school_indonesian_final_exam_score: 0,
    school_english_final_exam_score: 0,
    school_mathematics_report_score: 0,
    school_indonesian_report_score: 0,
    school_english_report_score: 0,
    pre_high_school_histories: [],
})

const updateStudentSchoolProfileRequest = ref(<UpdateStudentSchoolProfileRequest>{
    school_enrollment_year: "",
    school_graduation_year: "",
    school_enrollment_class: "",
    school_major: "",
    school_type: "",
    school_name: "",
    school_province_id: 0,
    school_province_name: "",
    school_address: "",
    school_certificate_number: "",
    school_certificate_date: "",
    school_status: "",
    school_accreditation: "",
    school_final_exam_score: 0,
    school_mathematics_final_exam_score: 0,
    school_indonesian_final_exam_score: 0,
    school_english_final_exam_score: 0,
    school_mathematics_report_score: 0,
    school_indonesian_report_score: 0,
    school_english_report_score: 0,
    pre_high_school_histories: [],
})

const emitData = defineEmits(['close', 'reload'])
const years = ref(getYearBatch())
const majors = ref(getMajorSMTA())
const typeSMTA = ref(getTypeSMTA())
const educations = ref<EducationUpdateHighSchoolRequest[]>([])
const education = ref(<EducationUpdateHighSchoolRequest>{})
function addEducation() {
    if(!(educations.value.some(el => el.education === education.value.education) || educations.value.some(el => el.graduation_year === education.value.graduation_year) || educations.value.some(el => el.name_school === education.value.name_school))){
        educations.value.push(education.value)
    }
    education.value = <EducationUpdateHighSchoolRequest>{}
}
function deleteEducation(item: any) {
    educations.value.splice(item, 1)
}

async function updateStudentSchoolProfileData() {
    try {
        if (school_certificate_date) {
            updateStudentSchoolProfileRequest.value.school_certificate_date
        }
        var temp = <UpdateStudentSchoolProfilePreHighSchoolHistory[]>[]
        educations.value.forEach((e) => {
            temp.push(<UpdateStudentSchoolProfilePreHighSchoolHistory>{
                name: e.name_school,
                graduation_year: e.graduation_year,
                level: e.education,
            })
        })
        updateStudentSchoolProfileRequest.value.pre_high_school_histories = temp
        const { response: resp, error: error } = await updateStudentSchoolProfile(updateStudentSchoolProfileRequest.value)
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
const provinces = ref(<GetLocationProvinceList[] >[])
const selectedProvince = ref(<GetLocationProvinceList>{ id: "", name: "" })
async function getDataProvince(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_location.GeneralLocationHandler/GetListProvince?limit=${limit}&page=${page}&search=${search}`, <any>{
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
        provinces.value = _resp.value?.data
    } catch (error) {
        alert(error)
    }
}

function getAutocompleteProvince(data: any) {
    updateStudentSchoolProfileRequest.value.school_province_id = data.id
}
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Data SMTA</span>
            </v-card-title>
            <v-col cols="12">
                <v-alert type="info" variant="tonal">
                    Keterangan :
                    <br />
                    Isilah Data SMA Asal anda dengan lengkap.
                </v-alert>
            </v-col>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="3" md="3" class="float-left">
                                <v-text-field v-model="education.education" variant="outlined" hide-details="auto"
                                    label="Pendidikan" />
                            </v-col>
                            <v-col cols=12 lg="3" md="3" class="float-left">
                                <v-text-field v-model="education.name_school" variant="outlined" hide-details="auto"
                                    label="Nama Sekolah" />
                            </v-col>
                            <v-col cols=12 lg="3" md="3" class="float-left">
                                <v-text-field v-model="education.graduation_year" type="number" variant="outlined"
                                    hide-details="auto" label="Tahun Lulus" />
                            </v-col>
                            <v-col cols=12 lg="3" md="3" class="float-left mt-1 text-right">
                                <v-btn solo flat color="primary" @click="addEducation()" :disabled="typeof education.education == 'undefined' || education.education == '' || typeof education.name_school == 'undefined' || education.name_school == '' || typeof education.graduation_year == 'undefined' || education.graduation_year == ''">
                                    Tambah
                                </v-btn>
                            </v-col>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-table class="mt-5">
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Pendidikan</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Nama Sekolah</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Tahun Lulus</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in educations">
                                        <td>{{ index + 1 }}</td>
                                        <td>
                                            {{ item.education }}
                                        </td>
                                        <td>
                                            {{ item.name_school }}
                                        </td>
                                        <td>
                                            {{ item.graduation_year }}
                                        </td>
                                        <td>
                                            <v-btn color="error" @click="deleteEducation(item)">
                                                Batal
                                            </v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-select variant="outlined" hide-details :items="years"
                                    v-model="updateStudentSchoolProfileRequest.school_enrollment_year"
                                    label="Tahun Daftar SMTA"></v-select>
                            </v-col>
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-select variant="outlined" hide-details :items="years"
                                    v-model="updateStudentSchoolProfileRequest.school_graduation_year"
                                    label="Tahun Lulus SMTA"></v-select>
                            </v-col>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-select variant="outlined" hide-details :items="['1', '2', '3']"
                                    v-model="updateStudentSchoolProfileRequest.school_enrollment_class"
                                    label="Kelas Masuk SMTA"></v-select>
                            </v-col>
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-select variant="outlined" hide-details :items="majors"
                                    v-model="updateStudentSchoolProfileRequest.school_major"
                                    label="Jurusan SMTA"></v-select>
                            </v-col>
                        </v-col>
                        <!-- <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-select variant="outlined" hide-details :items="typeSMTA" label="Jenis SMTA"></v-select>
                            </v-col>
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-text-field variant="outlined" hide-details="auto" label="Pilih SMTA" />
                            </v-col>
                        </v-col> -->
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-text-field v-model="updateStudentSchoolProfileRequest.school_name" variant="outlined"
                                    hide-details="auto" label="Nama SMTA Lain" />
                            </v-col>
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <!-- <v-text-field v-model="updateStudentSchoolProfileRequest.school_province_id"
                                    variant="outlined" hide-details="auto" label="Povinsi SMTA" /> -->

                                <Autocomplete @reload="(data: any) => getDataProvince(20, 1, data.search)"
                                    :label="'Povinsi SMTA'" @selected="(data: any) => getAutocompleteProvince(data)"
                                    :options="provinces" :initSelected="selectedProvince" />

                            </v-col>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="12" md="12" class="float-left">
                                <v-text-field variant="outlined" hide-details="auto" label="Alamat SMTA" />
                            </v-col>
                            <!-- <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-switch label="Lulus SMTA" color="primary"></v-switch>
                            </v-col> -->
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-text-field v-model="updateStudentSchoolProfileRequest.school_certificate_number"
                                    variant="outlined" hide-details="auto" label="No Ijazah" />
                            </v-col>
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-text-field v-model="school_certificate_date" type="date" variant="outlined"
                                    hide-details="auto" label="Tanggal Ijazah" />
                            </v-col>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-select v-model="updateStudentSchoolProfileRequest.school_status" variant="outlined"
                                    hide-details :items="['Negeri', 'Swasta', 'Luar Negeri']"
                                    label="Status SMTA"></v-select>
                            </v-col>
                            <v-col cols=12 lg="6" md="6" class="float-left">
                                <v-select v-model="updateStudentSchoolProfileRequest.school_accreditation"
                                    variant="outlined" hide-details :items="['Diakui', 'Disamakan']"
                                    label="Akreditasi"></v-select>
                            </v-col>
                        </v-col>
                        <v-col cols=12 lg="12" md="12">
                            <v-text-field v-model="updateStudentSchoolProfileRequest.school_final_exam_score" type="number"
                                variant="outlined" hide-details="auto" label="Nilai Ujian Akhir SMTA" />
                        </v-col>
                        <Vspace space="3" />
                        <label>Nilai UAN</label>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="4" md="4" class="float-left">
                                <v-text-field
                                    v-model="updateStudentSchoolProfileRequest.school_mathematics_final_exam_score"
                                    type="number" variant="outlined" hide-details="auto" label="Nilai Matematika" />
                            </v-col>
                            <v-col cols=12 lg="4" md="4" class="float-left">
                                <v-text-field v-model="updateStudentSchoolProfileRequest.school_indonesian_final_exam_score"
                                    type="number" variant="outlined" hide-details="auto" label="Nilai Bahasa indonesia" />
                            </v-col>
                            <v-col cols=12 lg="4" md="4" class="float-left">
                                <v-text-field v-model="updateStudentSchoolProfileRequest.school_english_final_exam_score"
                                    type="number" variant="outlined" hide-details="auto" label="Nilai Bahasa Inggris" />
                            </v-col>
                        </v-col>
                        <Vspace space="3" />
                        <label>Nilai Raport SMTA</label>
                        <v-col cols=12 lg="12" md="12">
                            <v-col cols=12 lg="4" md="4" class="float-left">
                                <v-text-field v-model="updateStudentSchoolProfileRequest.school_mathematics_report_score"
                                    type="number" variant="outlined" hide-details="auto" label="Nilai Matematika" />
                            </v-col>
                            <v-col cols=12 lg="4" md="4" class="float-left">
                                <v-text-field v-model="updateStudentSchoolProfileRequest.school_indonesian_report_score"
                                    type="number" variant="outlined" hide-details="auto" label="Nilai Bahasa indonesia" />
                            </v-col>
                            <v-col cols=12 lg="4" md="4" class="float-left">
                                <v-text-field v-model="updateStudentSchoolProfileRequest.school_english_report_score"
                                    type="number" variant="outlined" hide-details="auto" label="Nilai Bahasa Inggris" />
                            </v-col>
                        </v-col>
                    </v-row>
                </v-form>
                <v-col cols="12">
                    <v-card-actions class="pa-4">
                        <v-spacer />
                        <v-btn color="error" @click="$emit('close')">
                            Batal
                        </v-btn>
                        <v-btn color="secondary" @click=updateStudentSchoolProfileData()>
                            Ubah
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-card-text>
        </v-card>
    </div>
</template>