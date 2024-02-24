<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { upsertStudentSkpi } from '~~/composables/api/student-skpi/upsertStudentSemester';
import { AchievementCertificateEscortLetterRequest, OrganizationCertificateEscortLetterRequest, SkillCertificateEscortLetterRequest, CharacterBuildingCertificateEscortLetterRequest, PracticalWorkCertificateEscortLetterRequest, ThesisCertificateEscortLetterRequest, LanguageCertificateEscortLetterRequest } from '~~/types/api/academic-portal-certificate-escort-letter/UpdateCertificateEscortLetter';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentSkpiDetailData } from '~~/types/api/student-skpi/GetStudentSkpiDetail';
import { UpsertStudentSkpiAchievement, UpsertStudentSkpiCertificate, UpsertStudentSkpiCharacterBuilding, UpsertStudentSkpiInternship, UpsertStudentSkpiLanguage, UpsertStudentSkpiOrganization, UpsertStudentSkpiRequest } from '~~/types/api/student-skpi/UpsertStudentSkpi';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

import { fileUpload } from '~~/utils/helpers/file-upload';

const emitData = defineEmits(['close', 'reload'])
const props = defineProps({
    title: String,
    studentSkpiDetails: Array as any
});
let detail: GetStudentSkpiDetailData = <GetStudentSkpiDetailData>{};
let upsertStudentSkpiRequest = ref(<UpsertStudentSkpiRequest>{})
const achievements = ref<AchievementCertificateEscortLetterRequest[]>([])
const organizations = ref<OrganizationCertificateEscortLetterRequest[]>([])
const skills = ref<SkillCertificateEscortLetterRequest[]>([])
const character_buildings = ref<CharacterBuildingCertificateEscortLetterRequest[]>([])
const practical_works = ref<PracticalWorkCertificateEscortLetterRequest[]>([])
const theses = ref<ThesisCertificateEscortLetterRequest[]>([])
const languages = ref<LanguageCertificateEscortLetterRequest[]>([])
const achievement = ref(<AchievementCertificateEscortLetterRequest>{
    name: '',
    year: 0,
})
const organization = ref(<OrganizationCertificateEscortLetterRequest>{
    name: "",
    year: 0,
    position: "",
})
const skill = ref(<SkillCertificateEscortLetterRequest>{
    name: '',
})
const character_building = ref(<CharacterBuildingCertificateEscortLetterRequest>{
    name: '',
})
const practical_work = ref(<PracticalWorkCertificateEscortLetterRequest>{
    name: "",
})
const thesis = ref(<ThesisCertificateEscortLetterRequest>{})
const language = ref(<LanguageCertificateEscortLetterRequest>{
    date: '',
    name: '',
    value: '',
})
const achievement_file = ref('')
const organization_file = ref('')
const skill_file = ref('')
const language_file = ref('')

onMounted(async () => {
    detail = Object.assign({}, props.studentSkpiDetails)
    upsertStudentSkpiRequest = Object.assign({}, props.studentSkpiDetails)
    detail.achievements.forEach(d => {
        achievements.value.push(<AchievementCertificateEscortLetterRequest>{
            name: d.name,
            year: d.year,
        })
    });
    detail.certificates.forEach(d => {
        skills.value.push(<SkillCertificateEscortLetterRequest>{
            name: d.name,
        })
    });
    detail.character_buildings.forEach(d => {
        character_buildings.value.push(<CharacterBuildingCertificateEscortLetterRequest>{
            name: d.name,
        })
    });
    detail.internships.forEach(d => {
        practical_works.value.push(<PracticalWorkCertificateEscortLetterRequest>{
            name: d.name,
        })
    });
    detail.organizations.forEach(d => {
        organizations.value.push(<OrganizationCertificateEscortLetterRequest>{
            name: d.name,
            position: d.position,
            year: d.service_length,
        })
    });
    detail.languages.forEach(d => {
        languages.value.push(<LanguageCertificateEscortLetterRequest>{
            name: d.name,
            date: d.date.substring(0, 10),
            value: d.score,
        })
    });
});
const validFileAchievement = ref(true)
const validFileOrganizer = ref(true)
const validFileCertificate = ref(true)
const validFileLanguage = ref(true)
const fileAchievementBase64 = ref('')
const fileOrganizerBase64 = ref('')
const fileCertificateBase64 = ref('')
const fileLanguageBase64 = ref('')
async function fileAchievementChange(event: any) {
    const target = event.target as HTMLInputElement
    if (target.files?.length == 0) {
        validFileAchievement.value = false
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function () {
        const base64 = reader.result!.toString().split(',')[1]
        fileAchievementBase64.value = base64
    }
}
async function fileOrganizerChange(event: any) {
    const target = event.target as HTMLInputElement
    if (target.files?.length == 0) {
        validFileOrganizer.value = false
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function () {
        const base64 = reader.result!.toString().split(',')[1]
        fileOrganizerBase64.value = base64
    }
}
async function fileCertificateChange(event: any) {
    const target = event.target as HTMLInputElement
    if (target.files?.length == 0) {
        validFileCertificate.value = false
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function () {
        const base64 = reader.result!.toString().split(',')[1]
        fileCertificateBase64.value = base64
    }
}
async function fileLanguageChange(event: any) {
    const target = event.target as HTMLInputElement
    if (target.files?.length == 0) {
        validFileLanguage.value = false
        return false
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files![0])
    reader.onload = function () {
        const base64 = reader.result!.toString().split(',')[1]
        fileLanguageBase64.value = base64
    }
}
function addAchievement() {
    achievements.value.push(achievement.value)
    achievement.value = <AchievementCertificateEscortLetterRequest>{
        name: "",
        year: 0,
    }
}
function deleteAchievement(item: any) {
    var temp = <AchievementCertificateEscortLetterRequest[]>[]
    achievements.value.forEach(a => {
        if (item != a) {
            temp.push(a)
        }
    });
    achievements.value = temp
}
function addOrganization() {
    organizations.value.push(organization.value)
    organization.value = <OrganizationCertificateEscortLetterRequest>{
        name: "",
        year: 0,
        position: "",
    }
}
function deleteOrganization(item: any) {
    var temp = <OrganizationCertificateEscortLetterRequest[]>[]
    organizations.value.forEach(a => {
        if (item != a) {
            temp.push(a)
        }
    });
    organizations.value = temp
}
function addSkill() {
    skills.value.push(skill.value)
    skill.value = <SkillCertificateEscortLetterRequest>{
        name: '',
    }
}
function deleteSkill(item: any) {
    var temp = <SkillCertificateEscortLetterRequest[]>[]
    skills.value.forEach(a => {
        if (item != a) {
            temp.push(a)
        }
    });
    skills.value = temp
}
function addCharacterBuilding() {
    character_buildings.value.push(character_building.value)
    character_building.value = <CharacterBuildingCertificateEscortLetterRequest>{
        name: '',
    }
}
function deleteCharacterBuilding(item: any) {
    var temp = <SkillCertificateEscortLetterRequest[]>[]
    character_buildings.value.forEach(a => {
        if (item != a) {
            temp.push(a)
        }
    });
    character_buildings.value = temp
}
function addPracticalWork() {
    practical_works.value.push(practical_work.value)
    practical_work.value = <PracticalWorkCertificateEscortLetterRequest>{
        name: "",
    }
}
function deletePracticalWork(item: any) {
    var temp = <PracticalWorkCertificateEscortLetterRequest[]>[]
    practical_works.value.forEach(a => {
        if (item != a) {
            temp.push(a)
        }
    });
    practical_works.value = temp
}
function addThesis() {
    theses.value.push(thesis.value)
    thesis.value = <ThesisCertificateEscortLetterRequest>{}
}
function deleteThesis(item: any) {
    // theses.value.splice(item, 1)
    var temp = <ThesisCertificateEscortLetterRequest[]>[]
    theses.value.forEach(a => {
        if (item != a) {
            temp.push(a)
        }
    });
    theses.value = temp
}
function addLanguage() {
    languages.value.push(language.value)
    language.value = <LanguageCertificateEscortLetterRequest>{
        date: '',
        name: '',
        value: '',
    }
}
function deleteLanguage(item: any) {
    // languages.value.splice(item, 1)
    var temp = <LanguageCertificateEscortLetterRequest  []>[]
    languages.value.forEach(a => {
        if (item != a) {
            temp.push(a)
        }
    });
    languages.value = temp
}
// const studentSkpis = ref(<GetStudentSkpiData>{})
async function upsertStudentSkpiData() {
    try {
        let tempAchievementFile: any = {};
        let tempOrganizerFile: any = {};
        let tempCertificateFile: any = {};
        let tempLanguageFile: any = {};

        if (fileAchievementBase64.value) {
            tempAchievementFile = await fileUpload(fileAchievementBase64.value)
        } else {
            if (detail.achievement_url) {
                tempAchievementFile = {
                    path: detail.achievement_path,
                    path_type: detail.achievement_path_type,
                }
            } else {
                tempAchievementFile = {
                    path: "",
                    path_type: "",
                }
            }
        }
        if (fileOrganizerBase64.value) {
            tempOrganizerFile = await fileUpload(fileOrganizerBase64.value)
        } else {
            if (detail.organization_url) {
                tempOrganizerFile = {
                    path: detail.organization_path,
                    path_type: detail.organization_path_type,
                }
            } else {
                tempOrganizerFile = {
                    path: "",
                    path_type: "",
                }
            }
        }
        if (fileCertificateBase64.value) {
            tempCertificateFile = await fileUpload(fileCertificateBase64.value)
        } else {
            if (detail.certificate_url) {
                tempCertificateFile = {
                    path: detail.certificate_path,
                    path_type: detail.certificate_path_type,
                }
            } else {
                tempCertificateFile = {
                    path: "",
                    path_type: "",
                }
            }
        }
        if (fileLanguageBase64.value) {
            tempLanguageFile = await fileUpload(fileLanguageBase64.value)
        } else {
            if (detail.language_url) {
                tempLanguageFile = {
                    path: detail.language_path,
                    path_type: detail.language_path_type,
                }
            } else {
                tempLanguageFile = {
                    path: "",
                    path_type: "",
                }
            }
        }
        let tempachievements = <UpsertStudentSkpiAchievement[]>[]
        achievements.value.forEach(a => {
            tempachievements.push(<UpsertStudentSkpiAchievement>{
                name: a.name,
                year: a.year,
            })
        });
        let temporganizations = <UpsertStudentSkpiOrganization[]>[]
        organizations.value.forEach(a => {
            temporganizations.push(<UpsertStudentSkpiOrganization>{
                name: a.name,
                service_length: a.year,
                position: a.position
            })
        });
        let tempcertificates = <UpsertStudentSkpiCertificate[]>[]
        skills.value.forEach(a => {
            tempcertificates.push(<UpsertStudentSkpiCertificate>{
                name: a.name,
            })
        });
        let tempcharacter_buildings = <UpsertStudentSkpiCharacterBuilding[]>[]
        character_buildings.value.forEach(a => {
            tempcharacter_buildings.push(<UpsertStudentSkpiCharacterBuilding>{
                name: a.name,
            })
        });
        let tempinternships = <UpsertStudentSkpiInternship[]>[]
        practical_works.value.forEach(a => {
            tempinternships.push(<UpsertStudentSkpiInternship>{
                name: a.name,
            })
        });
        let templanguages = <UpsertStudentSkpiLanguage[]>[]
        languages.value.forEach(a => {
            templanguages.push(<UpsertStudentSkpiLanguage>{
                name: a.name,
                date: convertDateWithoutTimeToTimezoned(a.date),
                score: a.value,
            })
        });
        const { response: resp, error: error } = await upsertStudentSkpi(
            <UpsertStudentSkpiRequest>{
                achievement_path: tempAchievementFile.path,
                achievement_path_type: tempAchievementFile.path_type,
                organization_path: tempOrganizerFile.path,
                organization_path_type: tempOrganizerFile.path_type,
                certificate_path: tempCertificateFile.path,
                certificate_path_type: tempCertificateFile.path_type,
                language_path: tempLanguageFile.path,
                language_path_type: tempLanguageFile.path_type,
                achievements: tempachievements,
                organizations: temporganizations,
                certificates: tempcertificates,
                character_buildings: tempcharacter_buildings,
                internships: tempinternships,
                languages: templanguages,
            }
        )
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            // studentSkpis.value = resp?.data
            emitData('reload')
            // alert("Skpi berhasil di ubah");
        }
    } catch (error) {
        alert(error)
    }
}
async function save() {
    await upsertStudentSkpiData()
}
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">{{ title }}</span>
        </v-card-title>
        <v-card-text>
            <v-col cols="12">
                <v-alert type="info" variant="tonal">
                    Keterangan :
                    <br />
                    Merupakan fasilitas untuk input informasi Surat Keterangan Pendamping Ijazah secara online.
                </v-alert>
            </v-col>
            <Vspace space="3" />
            <label>Prestasi dan Penghargaan</label>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="4" md="4" class="float-left">
                            <v-text-field v-model="achievement.name" variant="outlined" hide-details="auto"
                                label="Prestasi" />
                        </v-col>
                        <v-col cols=12 lg="4" md="4" class="float-left">
                            <v-text-field v-model="achievement.year" type="number" variant="outlined" hide-details="auto"
                                label="Tahun" />
                        </v-col>
                        <v-col cols=12 lg="4" md="4" class="float-left mt-1 text-right">
                            <v-btn color="primary" @click="addAchievement()"
                                :disabled="achievement.name == '' || achievement.year == 0">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="12" md="12" class="float-left">
                            <v-text-field type="file" v-model="achievement_file" variant="outlined" hide-details="auto"
                                label="File Prestasi" @change="fileAchievementChange" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12" class="float-left " v-if="detail.achievement_url">
                            File Prestasi dan Penghargaan:<br />
                            <a :href="detail.achievement_url">{{ detail.achievement_url }}</a>
                        </v-col>
                        <v-alert type="info" variant="tonal">
                            Keterangan :
                            <br />
                            - Upload semua dokumen prestasi dan penghargaan digabung menjadi 1 dalam bentuk *.rar / *.zip
                            (jika ada) <br> - Ukuran file maksimal 2Mb
                        </v-alert>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-table class="mt-5">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Prestasi</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Tahun</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in achievements">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.year }}</td>
                                    <td>
                                        <v-btn color="error" @click="deleteAchievement(item)">
                                            Batal
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
            </v-form>
            <Vspace space="3" />
            <label>Pengalaman Organisasi</label>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="3" md="3" class="float-left">
                            <v-text-field v-model="organization.name" variant="outlined" hide-details="auto"
                                label="Nama Organisasi" />
                        </v-col>
                        <v-col cols=12 lg="3" md="3" class="float-left">
                            <v-text-field v-model="organization.position" variant="outlined" hide-details="auto"
                                label="Posisi" />
                        </v-col>
                        <v-col cols=12 lg="3" md="3" class="float-left">
                            <v-text-field v-model="organization.year" type="number" variant="outlined" hide-details="auto"
                                label="Tahun" />
                        </v-col>
                        <v-col cols=12 lg="3" md="3" class="float-left mt-1 text-right">
                            <v-btn color="primary" @click="addOrganization()"
                                :disabled="organization.name == '' || organization.position == '' || organization.year == 0">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="12" md="12" class="float-left">
                            <v-text-field type="file" v-model="organization_file" variant="outlined" hide-details="auto"
                                label="File Organisasi" @change="fileOrganizerChange" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12" class="float-left " v-if="detail.organization_url">
                            File Organisasi:<br />
                            <a :href="detail.organization_url">{{ detail.organization_url }}</a>
                        </v-col>
                        <v-alert type="info" variant="tonal">
                            Keterangan :
                            <br />
                            - Upload semua dokumen pengalaman organisasi digabung menjadi 1 dalam bentuk *.rar / *.zip (jika
                            ada) <br> - Ukuran file maksimal 2Mb
                        </v-alert>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-table class="mt-5">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Organisasi</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Posisi</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Masa Jabatan (Tahun)</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in organizations">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.position }}</td>
                                    <td>{{ item.year }}</td>
                                    <td>
                                        <v-btn color="error" @click="deleteOrganization(item)">
                                            Batal
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
            </v-form>
            <Vspace space="3" />
            <label>Sertifikat Keahlian</label>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="6" md="6" class="float-left">
                            <v-text-field v-model="skill.name" variant="outlined" hide-details="auto"
                                label="Sertifikat Keahlian" />
                        </v-col>
                        <v-col cols=12 lg="6" md="6" class="float-left mt-1 text-right">
                            <v-btn color="primary" @click="addSkill()" :disabled="skill.name == ''">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="12" md="12" class="float-left">
                            <v-text-field type="file" v-model="skill_file" variant="outlined" hide-details="auto"
                                label="File Skill" @change="fileCertificateChange" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12" class="float-left " v-if="detail.certificate_url">
                            File Sertifikat Keahlian:<br />
                            <a :href="detail.certificate_url">{{ detail.certificate_url }}</a>
                        </v-col>
                        <v-alert type="info" variant="tonal">
                            Keterangan :
                            <br />
                            - Upload semua dokumen sertifikat keahlian digabung menjadi 1 dalam bentuk *.rar / *.zip (jika
                            ada) <br> - Ukuran file maksimal 2Mb
                        </v-alert>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-table class="mt-5">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in skills">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>
                                        <v-btn color="error" @click="deleteSkill(item)">
                                            Batal
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
            </v-form>
            <Vspace space="3" />
            <label>Pendidikan Karakter</label>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="6" md="6" class="float-left">
                            <v-text-field v-model="character_building.name" variant="outlined" hide-details="auto"
                                label="Nama" />
                        </v-col>
                        <v-col cols=12 lg="6" md="6" class="float-left mt-1 text-right">
                            <v-btn color="primary" @click="addCharacterBuilding()"
                                :disabled="character_building.name == ''">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-table class="mt-5">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in character_buildings">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>
                                        <v-btn color="error" @click="deleteCharacterBuilding(item)">
                                            Batal
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
            </v-form>
            <Vspace space="3" />
            <label>Kerja Praktik</label>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="6" md="6" class="float-left">
                            <v-text-field v-model="practical_work.name" variant="outlined" hide-details="auto"
                                label="Nama" />
                        </v-col>
                        <v-col cols=12 lg="6" md="6" class="float-left mt-1 text-right">
                            <v-btn color="primary" @click="addPracticalWork()" :disabled="practical_work.name == ''">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-table class="mt-5">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in practical_works">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>
                                        <v-btn color="error" @click="deletePracticalWork(item)">
                                            Batal
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
            </v-form>
            <Vspace space="3" />
            <label>Bahasa Internasional</label>
            <v-form ref="form" lazy-validation>
                <v-row>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="3" md="3" class="float-left">
                            <v-select v-model="language.name"
                                :items="['Bahasa Inggris/English', 'Bahasa Jepang/Japanese', 'Bahasa Prancis/French', 'Bahasa Arab/Arabic', 'Bahasa Mandarin/Mandarin']"
                                variant="outlined" hide-details="auto" label="Bahasa"></v-select>
                        </v-col>
                        <v-col cols=12 lg="3" md="3" class="float-left">
                            <v-text-field v-model="language.value" variant="outlined" hide-details="auto" label="Nilai" />
                        </v-col>
                        <v-col cols=12 lg="3" md="3" class="float-left">
                            <v-text-field type="date" v-model="language.date" variant="outlined" hide-details="auto"
                                label="Tanggal" />
                        </v-col>
                        <v-col cols=12 lg="3" md="3" class="float-left mt-1 text-right">
                            <v-btn color="primary" @click=" addLanguage()"
                                :disabled="language.name == '' || language.value == '' || language.date == ''">
                                Tambah
                            </v-btn>
                        </v-col>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-col cols=12 lg="12" md="12" class="float-left">
                            <v-text-field type="file" v-model="language_file" variant="outlined" hide-details="auto"
                                label="File Bahasa" @change="fileLanguageChange" />
                        </v-col>
                        <v-col cols=12 lg="12" md="12" class="float-left " v-if="detail.language_url">
                            File Bahasa Internasional:<br />
                            <a :href="detail.language_url">{{ detail.language_url }}</a>
                        </v-col>
                        <v-alert type="info" variant="tonal">
                            Keterangan :
                            <br />
                            - Upload semua dokumen bahasa internasional digabung menjadi 1 dalam bentuk *.rar / *.zip (jika
                            ada) <br> - Ukuran file maksimal 2Mb
                        </v-alert>
                    </v-col>
                    <v-col cols=12 lg="12" md="12">
                        <v-table class="mt-5">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Bahasa</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nilai</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(  item, index  ) in   languages  ">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.value }}</td>
                                    <td>{{ moment(item.date).format("D MMMM YYYY") }}</td>
                                    <td>
                                        <v-btn color="error" @click="deleteLanguage(item)">
                                            Batal
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-col cols="12">
            <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn color="error" @click="$emit('close')">
                    Batal
                </v-btn>
                <v-btn color="secondary" @click="save()">
                    Simpan
                </v-btn>
            </v-card-actions>
        </v-col>
    </v-card>
</template>