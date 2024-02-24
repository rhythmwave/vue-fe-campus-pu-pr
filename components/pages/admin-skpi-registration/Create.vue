<script setup lang="ts">
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentData } from '~~/types/api/admin-student/GetAdminStudent';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

const emit = defineEmits(['dataCreate', 'closeDialog'])

const props = defineProps({
    title: String,
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

const students = ref<GetStudentData[]>([])
const createObj = ref({
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

async function getDataStudent(limit: number, page: number, search: String){
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_student.AdminStudentHandler/GetList?limit=${limit}&page=${page}&studyProgramId=&studentForceFrom=&studentForceTo=&nimNumberFrom&nimNumberTo&name=${search}&address&regencyId&status`, <any>{
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
        pagination.value =
        {
            next: _resp.value.pagination.next,
            prev: _resp.value.pagination.prev,
            total_pages: _resp.value.pagination.total_pages,
            total_records: _resp.value.pagination.total_records,
            limit: _resp.value.pagination.limit,
            page: _resp.value.pagination.page
        }
        students.value = _resp.value.data
    } catch (error) {
        alert(error)
    }  
}

function getAutocompleteStudyProgram(data: any){
    createObj.value.student_id = data.id
}
const labelFileAchievement = ref('File Prestasi dan Penghargaan')
const labelFileOrganizer = ref('File Pengalaman Organisasi')
const labelFileCertificate = ref('File Sertifikat Keahlian')
const labelFileLanguage = ref('File Bahasa Internasional')
const validFileAchievement = ref(true)
const validFileOrganizer = ref(true)
const validFileCertificate = ref(true)
const validFileLanguage = ref(true)
const fileAchievementBase64 = ref('')
const fileOrganizerBase64 = ref('')
const fileCertificateBase64 = ref('')
const fileLanguageBase64 = ref('')
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
    createObj.value = {
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
async function save(){
    createObj.value.achievements = achievements.value
    createObj.value.organizations = organizations.value
    createObj.value.certificates = certificates.value
    createObj.value.internships = internships.value
    createObj.value.languages = languages.value
    createObj.value.character_buildings = character_buildings.value
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
            createObj.value.achievement_path = _achievement.value?.data.path
            createObj.value.achievement_path_type = _achievement.value?.data.path_type
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
            createObj.value.organization_path = _organizer.value?.data.path
            createObj.value.organization_path_type = _organizer.value?.data.path_type
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
            createObj.value.certificate_path = _certificate.value?.data.path
            createObj.value.certificate_path_type = _certificate.value?.data.path_type
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
            createObj.value.language_path = _language.value?.data.path
            createObj.value.language_path_type = _language.value?.data.path_type
        } catch (error) {
            alert(error)
        }
    }
    emit('dataCreate', createObj.value)
}
</script>
<template>
    <v-card max-height="600" style="overflow: auto;">
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Tambah {{ props.title }}</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12" sm="12">
                        <Autocomplete @reload="(data) => getDataStudent(20, 1, data.search)"
                        :label="'*Pilih Mahasiswa'" @selected="(data) => getAutocompleteStudyProgram(data)"
                        :options="students" />
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
                </v-row>
                <v-row>
                    <v-col cols="6" sm="6" v-if="fileAchievementBase64 != ''">
                        <object :data="'data:application/pdf;base64, '+fileAchievementBase64" alt="" style="width: 100%; height: 300px;" />
                    </v-col>
                    <v-col cols="6" sm="6" v-if="fileOrganizerBase64 != ''">
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
                    <v-col cols="6" sm="6" v-if="fileCertificateBase64 != ''">
                        <object :data="'data:application/pdf;base64, '+fileCertificateBase64" alt="" style="width: 100%; height: 300px;" />
                    </v-col>
                    <v-col cols="6" sm="6" v-if="fileLanguageBase64 != ''">
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
                    <VBtn color="secondary" :disabled="createObj.student_id == ''" @click="save()">
                    Simpan
                    </VBtn>
                </VCardActions>
            </v-form>
        </v-card-text>
    </v-card>
</template>