<script setup lang="ts">
import { defineComponent } from "vue";
import { GetSKPIRegistrationDataDetail } from '~/types/api/admin-skpi/GetSKPIRegistration'
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

const emit = defineEmits(['dataEdit', 'closeDialog'])
const props = defineProps({
    title: String,
    data: Object,
    dialog: Boolean,
})

const valid = ref(true)
const limit = 20
const pagination = ref({
  page: 1,
  limit: limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})

const skpi_registration_detail = ref<GetSKPIRegistrationDataDetail>()
await getDetail(props.data?.id);
const editObj = ref({
    id: skpi_registration_detail.value?.id,
    student_id: skpi_registration_detail.value?.student_id,
    achievement_path: skpi_registration_detail.value?.achievement_path,
    achievement_path_type: skpi_registration_detail.value?.achievement_path_type,
    organization_path: skpi_registration_detail.value?.organization_path,
    organization_path_type: skpi_registration_detail.value?.organization_path_type,
    certificate_path: skpi_registration_detail.value?.certificate_path,
    certificate_path_type: skpi_registration_detail.value?.certificate_path_type,
    language_path: skpi_registration_detail.value?.language_path,
    language_path_type: skpi_registration_detail.value?.language_path_type,
    achievements: [],
    organizations: [],
    certificates: [],
    character_buildings: [],
    internships: [],
    languages: [],
})
const achievements = ref([])
const achievement = ref({
    name: '',
    year: 0,
})
const organizations = ref([])
const organization = ref({
    name: '',
    position: '',
    service_length: 0,
})
const certificates = ref([])
const certificate = ref({
    name: ''
})
const internships = ref([])
const internship = ref({
    name: ''
})
const languages = ref([])
const language = ref({
    name: '',
    score: '',
    date: ''
})
const character_buildings = ref([])
const character_building = ref({
    name: ''
})

skpi_registration_detail.value?.achievements.forEach(element => {
    let obj = {
        name: element.name,
        year: Number(element.year),
    }
    achievements.value.push(obj)
});
skpi_registration_detail.value?.organizations.forEach(element => {
    let obj = {
        name: element.name,
        year: Number(element.year),
    }
    organizations.value.push(obj)
});
skpi_registration_detail.value?.certificates.forEach(element => {
    let obj = {
        name: element.name,
    }
    certificates.value.push(obj)
});
skpi_registration_detail.value?.internships.forEach(element => {
    let obj = {
        name: element.name,
    }
    internships.value.push(obj)
});
skpi_registration_detail.value?.languages.forEach(element => {
    let obj = {
        name: element.name,
        score: element.score,
        date: element.date,
    }
    languages.value.push(obj)
});
skpi_registration_detail.value?.character_buildings.forEach(element => {
    let obj = {
        name: element.name,
    }
    character_buildings.value.push(obj)
});

const labelFileAchievement = ref('Ubah File Prestasi dan Penghargaan')
const labelFileOrganizer = ref('Ubah File Pengalaman Organisasi')
const labelFileCertificate = ref('Ubah File Sertifikat Keahlian')
const labelFileLanguage = ref('Ubah File Bahasa Internasional')
const validFileAchievement = ref(true)
const validFileOrganizer = ref(true)
const validFileCertificate = ref(true)
const validFileLanguage = ref(true)
const fileAchievementBase64 = ref('')
const fileOrganizerBase64 = ref('')
const fileCertificateBase64 = ref('')
const fileLanguageBase64 = ref('')

async function getDetail(id: string) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_student_skpi.AdminStudentSkpiHandler/GetDetail?id=${id}`, <any>{
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
        skpi_registration_detail.value = {
            id: _resp.value.data.id,
            student_id: _resp.value.data.student_id,
            student_nim_number: _resp.value.data.student_nim_number,
            student_name: _resp.value.data.student_name,
            student_study_program_id: _resp.value.data.student_study_program_id,
            student_study_program_name: _resp.value.data.student_study_program_name,
            student_dikti_study_program_code: _resp.value.data.student_dikti_study_program_code,
            skpi_number: _resp.value.data.skpi_number,
            is_approved: _resp.value.data.is_approved,
            achievement_path: _resp.value.data.achievement_path,
            achievement_path_type: _resp.value.data.achievement_path_type,
            achievement_url: _resp.value.data.achievement_url,
            organization_path: _resp.value.data.organization_path,
            organization_path_type: _resp.value.data.organization_path_type,
            organization_url: _resp.value.data.organization_url,
            certificate_path: _resp.value.data.certificate_path,
            certificate_path_type: _resp.value.data.certificate_path_type,
            certificate_url: _resp.value.data.certificate_url,
            language_path: _resp.value.data.language_path,
            language_path_type: _resp.value.data.language_path_type,
            language_url: _resp.value.data.language_url,
            achievements: _resp.value.data.achievements,
            organizations: _resp.value.data.organizations,
            certificates: _resp.value.data.certificates,
            character_buildings: _resp.value.data.character_buildings,
            internships: _resp.value.data.internships,
            languages: _resp.value.data.languages,
        }
    } catch (error) {
        alert(error)
    }   
}
async function fileAchievementChange(event: any){
    const target = event.target as HTMLInputElement
    if(target.files?.length == 0){
        validFileAchievement.value = false
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function(){
        const base64 = reader.result!.toString().split(',')[1]
        fileAchievementBase64.value = base64
    }
}
async function fileOrganizerChange(event: any){
    const target = event.target as HTMLInputElement
    if(target.files?.length == 0){
        validFileOrganizer.value = false
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function(){
        const base64 = reader.result!.toString().split(',')[1]
        fileOrganizerBase64.value = base64
    }
}
async function fileCertificateChange(event: any){
    const target = event.target as HTMLInputElement
    if(target.files?.length == 0){
        validFileCertificate.value = false
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function(){
        const base64 = reader.result!.toString().split(',')[1]
        fileCertificateBase64.value = base64
    }
}
async function fileLanguageChange(event: any){
    const target = event.target as HTMLInputElement
    if(target.files?.length == 0){
        validFileLanguage.value = false
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function(){
        const base64 = reader.result!.toString().split(',')[1]
        fileLanguageBase64.value = base64
    }
}
function close(){
    editObj.value = {
        id: '',
        student_id: '',
        achievement_path: '',
        achievement_path_type: '',
        organization_path: '',
        organization_path_type: '',
        certificate_path: '',
        certificate_path_type: '',
        language_path: '',
        language_path_type: '',
        achievements: [],
        organizations: [],
        certificates: [],
        character_buildings: [],
        internships: [],
        languages: [],
    }
    emit('closeDialog', true)
}
function addAchievement(){
    let obj = {
        name: achievement.value.name,
        year: Number(achievement.value.year)
    }
    achievements.value.push(obj)
    achievement.value = {
        name: '',
        year: 0,
    }
}
function removeAchievement(item: string){
    let index = achievements.value.map(e => e.name).indexOf(item.name)
    if(index !== -1){
        achievements.value.splice(index, 1)
    }
}
function addOrganizer(){
    let obj = {
        name: organization.value.name,
        position: organization.value.position,
        service_length: Number(organization.value.service_length),
    }
    organizations.value.push(obj)
    organization.value = {
        name: '',
        position: '',
        service_length: 0,
    }
}
function removeOrganizer(item: string){
    let index = organizations.value.map(e => e.name).indexOf(item.name)
    if(index !== -1){
        organizations.value.splice(index, 1)
    }
}
function addCertificate(){
    let obj = {
        name: certificate.value.name,
    }
    certificates.value.push(obj)
    certificate.value = {
        name: ''
    }
}
function removeCertificate(item: string){
    let index = certificates.value.map(e => e.name).indexOf(item.name)
    if(index !== -1){
        certificates.value.splice(index, 1)
    }
}
function addInternship(){
    let obj = {
        name: internship.value.name,
    }
    internships.value.push(obj)
    internship.value = {
        name: ''
    }
}
function removeInternship(item: string){
    let index = internships.value.map(e => e.name).indexOf(item.name)
    if(index !== -1){
        internships.value.splice(index, 1)
    }
}
function addLanguage(){
    let obj = {
        name: language.value.name,
        score: language.value.score,
        date: convertDateWithoutTimeToTimezoned(language.value.date),
    }
    languages.value.push(obj)
    language.value = {
        name: '',
        score: '',
        date: '',
    }
}
function removeLanguage(item: string){
    let index = languages.value.map(e => e.name).indexOf(item.name)
    if(index !== -1){
        languages.value.splice(index, 1)
    }
}
function addCharacterBuilding(){
    let obj = {
        name: character_building.value.name,
    }
    character_buildings.value.push(obj)
    character_building.value = {
        name: ''
    }
}
function removeCharacterBuilding(item: string){
    let index = character_buildings.value.map(e => e.name).indexOf(item.name)
    if(index !== -1){
        character_buildings.value.splice(index, 1)
    }
}
async function update(){
    editObj.value.achievements = achievements.value
    editObj.value.organizations = organizations.value
    editObj.value.certificates = certificates.value
    editObj.value.internships = internships.value
    editObj.value.languages = languages.value
    editObj.value.character_buildings = character_buildings.value
    if(fileAchievementBase64.value != ''){
        try {
            // fileAchievementBase64
            const { data: _achievement, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_file.GeneralFileHandler/UploadBase64Temp`, <any>{
                method: 'POST',
                body: {
                    file: fileAchievementBase64,
                },
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
            editObj.value.achievement_path = _achievement.value?.data.path
            editObj.value.achievement_path_type = _achievement.value?.data.path_type
        } catch (error) {
            alert(error)
        }
    }

    if(fileOrganizerBase64.value != ''){
        try {
            // fileOrganizerBase64
            const { data: _organizer, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_file.GeneralFileHandler/UploadBase64Temp`, <any>{
                method: 'POST',
                body: {
                    file: fileOrganizerBase64,
                },
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
            editObj.value.organization_path = _organizer.value?.data.path
            editObj.value.organization_path_type = _organizer.value?.data.path_type
        } catch (error) {
            alert(error)
        }
    }

    if(fileCertificateBase64.value != ''){
        try {
            // fileCertificateBase64
            const { data: _certificate, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_file.GeneralFileHandler/UploadBase64Temp`, <any>{
                method: 'POST',
                body: {
                    file: fileCertificateBase64,
                },
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
            editObj.value.certificate_path = _certificate.value?.data.path
            editObj.value.certificate_path_type = _certificate.value?.data.path_type
        } catch (error) {
            alert(error)
        }
    }
    
    if(fileLanguageBase64.value != ''){
        try {
            // fileLanguageBase64
            const { data: _language, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_file.GeneralFileHandler/UploadBase64Temp`, <any>{
                method: 'POST',
                body: {
                    file: fileLanguageBase64,
                },
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
            editObj.value.language_path = _language.value?.data.path
            editObj.value.language_path_type = _language.value?.data.path_type
        } catch (error) {
            alert(error)
        }
    }
    emit('dataEdit', editObj.value)
}
</script>
<template>
    <v-card max-height="600" style="overflow: auto;">
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Ubah {{ props.title }} : {{ skpi_registration_detail?.student_name }}</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12" sm="12">
                        <v-text-field variant="outlined" hide-details label="Nama Mahasiswa" :value="skpi_registration_detail?.student_name" readonly />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6" sm="6">
                        <v-text-field @change="fileAchievementChange" type="file" variant="outlined" hide-details :label="labelFileAchievement"/>
                        <span style="color: red" v-if="!validFileAchievement"><small>File Tidak Terdeteksi</small></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-text-field @change="fileOrganizerChange" type="file" variant="outlined" hide-details :label="labelFileOrganizer"/>
                        <span style="color: red" v-if="!validFileOrganizer"><small>File Tidak Terdeteksi</small></span>
                    </v-col>
                    <!-- {{ skpi_registration_detail?.achievement_url }} -->
                </v-row>
                <v-row>
                    <v-col cols="6" sm="6" v-if="fileAchievementBase64 == '' && skpi_registration_detail?.achievement_url != ''">
                        <object :data="skpi_registration_detail?.achievement_url" alt="" style="width: 100%; height: 300px;" />
                    </v-col>
                    <v-col cols="6" sm="6" v-else-if="fileAchievementBase64 != ''">
                        <object :data="'data:application/pdf;base64, '+fileAchievementBase64" alt="" style="width: 100%; height: 300px;" />
                    </v-col>
                    <v-col cols="6" sm="6" v-if="fileOrganizerBase64 == '' && skpi_registration_detail?.organization_url != ''">
                        <object :data="skpi_registration_detail?.organization_url" alt="" style="width: 100%; height: 300px" />
                    </v-col>
                    <v-col cols="6" sm="6" v-else-if="fileOrganizerBase64 != ''">
                        <object :data="'data:application/pdf;base64, '+fileOrganizerBase64" alt="" style="width: 100%; height: 300px" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6" sm="6">
                        <v-text-field @change="fileCertificateChange" type="file" variant="outlined" hide-details :label="labelFileCertificate"/>
                        <span style="color: red" v-if="!validFileCertificate"><small>File Tidak Terdeteksi</small></span>
                    </v-col>
                    <v-col cols="6" sm="6">
                        <v-text-field @change="fileLanguageChange" type="file" variant="outlined" hide-details :label="labelFileLanguage"/>
                        <span style="color: red" v-if="!validFileLanguage"><small>File Tidak Terdeteksi</small></span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6" sm="6" v-if="fileCertificateBase64 == '' && skpi_registration_detail?.certificate_url != ''">
                        <object :data="skpi_registration_detail?.certificate_url" alt="" style="width: 100%; height: 300px;" />
                    </v-col>
                    <v-col cols="6" sm="6" v-else-if="fileCertificateBase64 != ''">
                        <object :data="'data:application/pdf;base64, '+fileCertificateBase64" alt="" style="width: 100%; height: 300px;" />
                    </v-col>
                    <v-col cols="6" sm="6" v-if="fileLanguageBase64 == '' && skpi_registration_detail?.language_url != ''">
                        <object :data="skpi_registration_detail?.language_url" alt="" style="width: 100%; height: 300px" />
                    </v-col>
                    <v-col cols="6" sm="6" v-else-if="fileLanguageBase64 != ''">
                        <object :data="'data:application/pdf;base64, '+fileLanguageBase64" alt="" style="width: 100%; height: 300px" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="5" sm="5">
                        <v-text-field v-model="achievement.name" variant="outlined" hide-details label="Prestasi dan Penghargaan (Nama)"/>
                    </v-col>
                    <v-col cols="5" sm="5">
                        <v-text-field type="number" v-model="achievement.year" variant="outlined" hide-details label="Prestasi dan Penghargaan (Tahun)"/>
                    </v-col>
                    <v-col cols="2" sm="2">
                        <VBtn color="secondary" @click="addAchievement()">
                            Tambah
                        </VBtn>
                    </v-col>
                    <v-col v-if="achievements.length != 0">
                        <div v-for="item in achievements" class="float-left">
                            <v-label style="margin:2px; padding:5px 5px 5px 10px; background: #4abeff; border-radius: 10px; color: white">
                                {{item.name}}
                                <NuxtLink to="#" :custom="true">
                                    <VIcon @click="removeAchievement(item)">
                                        mdi-close-circle
                                    </VIcon>
                                </NuxtLink>
                            </v-label>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4" sm="4">
                        <v-text-field v-model="organization.name" variant="outlined" hide-details label="Pengalaman Organisasi (Nama)"/>
                    </v-col>
                    <v-col cols="3" sm="3">
                        <v-text-field v-model="organization.position" variant="outlined" hide-details label="Pengalaman Organisasi (Jabatan)"/>
                    </v-col>
                    <v-col cols="3" sm="3">
                        <v-text-field type="number" v-model="organization.service_length" variant="outlined" hide-details label="Pengalaman Organisasi (Lama)"/>
                    </v-col>
                    <v-col cols="2" sm="2">
                        <VBtn color="secondary" @click="addOrganizer()">
                            Tambah
                        </VBtn>
                    </v-col>
                    <v-col v-if="organizations.length != 0">
                        <div v-for="item in organizations" class="float-left">
                            <v-label style="margin:2px; padding:5px 5px 5px 10px; background: #4abeff; border-radius: 10px; color: white">
                                {{item.name}}
                                <NuxtLink to="#" :custom="true">
                                    <VIcon @click="removeOrganizer(item)">
                                        mdi-close-circle
                                    </VIcon>
                                </NuxtLink>
                            </v-label>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="10" sm="10">
                        <v-text-field v-model="certificate.name" variant="outlined" hide-details label="Sertifikat Keahlian"/>
                    </v-col>
                    <v-col cols="2" sm="2">
                        <VBtn color="secondary" @click="addCertificate()">
                            Tambah
                        </VBtn>
                    </v-col>
                    <v-col v-if="certificates.length != 0">
                        <div v-for="item in certificates" class="float-left">
                            <v-label style="margin:2px; padding:5px 5px 5px 10px; background: #4abeff; border-radius: 10px; color: white">
                                {{item.name}}
                                <NuxtLink to="#" :custom="true">
                                    <VIcon @click="removeCertificate(item)">
                                        mdi-close-circle
                                    </VIcon>
                                </NuxtLink>
                            </v-label>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="10" sm="10">
                        <v-text-field v-model="internship.name" variant="outlined" hide-details label="Kerja Praktek/Magang"/>
                    </v-col>
                    <v-col cols="2" sm="2">
                        <VBtn color="secondary" @click="addInternship()">
                            Tambah
                        </VBtn>
                    </v-col>
                    <v-col v-if="internships.length != 0">
                        <div v-for="item in internships" class="float-left">
                            <v-label style="margin:2px; padding:5px 5px 5px 10px; background: #4abeff; border-radius: 10px; color: white">
                                {{item.name}}
                                <NuxtLink to="#" :custom="true">
                                    <VIcon @click="removeInternship(item)">
                                        mdi-close-circle
                                    </VIcon>
                                </NuxtLink>
                            </v-label>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4" sm="4">
                        <v-text-field v-model="language.name" variant="outlined" hide-details label="Bahasa Internasional (Nama)"/>
                    </v-col>
                    <v-col cols="3" sm="3">
                        <v-text-field v-model="language.score" variant="outlined" hide-details label="Bahasa Internasional (Skor)"/>
                    </v-col>
                    <v-col cols="3" sm="3">
                        <v-text-field type="date" v-model="language.date" variant="outlined" hide-details label="Bahasa Internasional (Tanggal)"/>
                    </v-col>
                    <v-col cols="2" sm="2">
                        <VBtn color="secondary" @click="addLanguage()">
                            Tambah
                        </VBtn>
                    </v-col>
                    <v-col v-if="languages.length != 0">
                        <div v-for="item in languages" class="float-left">
                            <v-label style="margin:2px; padding:5px 5px 5px 10px; background: #4abeff; border-radius: 10px; color: white">
                                {{item.name}}
                                <NuxtLink to="#" :custom="true">
                                    <VIcon @click="removeLanguage(item)">
                                        mdi-close-circle
                                    </VIcon>
                                </NuxtLink>
                            </v-label>
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="10" sm="10">
                        <v-text-field v-model="character_building.name" variant="outlined" hide-details label="Pendidikan karakter"/>
                    </v-col>
                    <v-col cols="2" sm="2">
                        <VBtn color="secondary" @click="addCharacterBuilding()">
                            Tambah
                        </VBtn>
                    </v-col>
                    <v-col v-if="character_buildings.length != 0">
                        <div v-for="item in character_buildings" class="float-left">
                            <v-label style="margin:2px; padding:5px 5px 5px 10px; background: #4abeff; border-radius: 10px; color: white">
                                {{item.name}}
                                <NuxtLink to="#" :custom="true">
                                    <VIcon @click="removeCharacterBuilding(item)">
                                        mdi-close-circle
                                    </VIcon>
                                </NuxtLink>
                            </v-label>
                        </div>
                    </v-col>
                </v-row>
                <VCardActions class="pa-4">
                    <VSpacer />
                    <VBtn color="error" @click="close">
                    Batal
                    </VBtn>
                    <VBtn color="secondary" :disabled="editObj.student_id == ''" @click="update()">
                    Ubah
                    </VBtn>
                </VCardActions>
            </v-form>
        </v-card-text>
    </v-card>
</template>