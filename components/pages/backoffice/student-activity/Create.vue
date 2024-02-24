<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateStudentActivityRequest, CreateStudentActivityParticipant, CreateStudentActivityMentor, CreateStudentActivityExaminer } from '~~/types/api/student-activity/CreateStudentActivity';
import { createStudentActivity } from '~~/composables/api/student-activity/createStudentActivity';
import { AnyMap } from '@jridgewell/trace-mapping';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { GetStudentListData, GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';


const props = defineProps({
    sample: Array as any,
});

const valid = ref(true)
const createStudentActivityRequest = ref(<CreateStudentActivityRequest>{});

const emitData = defineEmits(['close', 'reload'])


const semesters = ref<GetSemesterListData[]>([])
const selectedSemesters = ref(<GetSemesterListData>{ id: "" })
async function getSemesterData() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
            semesters.value.forEach((s) => {
                s.semester_type_year = s.semester_type + " " + s.school_year
            })
        }
    } catch (error) {
        alert(error)
    }
}
function semestersOnChange(id: string) {
    selectedSemesters.value = <GetSemesterListData>semesters.value.find((x) => x.id == id)
    createStudentActivityRequest.value.semester_id = id
}

const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const selectedAdminStudyPrograms = ref(<GetAdminStudyProgramListData>{ id: "" })
async function getAdminStudyProgramData() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyPrograms.value = resp?.data
            // selectedStudents.value.push(selectedStudentSearch.value)
            // selectedStudentSearch.value = <GetStudentListData>{ id: "", name: "" }
            // Students.value = []
        }
    } catch (error) {
        alert(error)
    }
}
async function adminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>adminStudyPrograms.value.find((x) => x.id == id)
    createStudentActivityRequest.value.study_program_id = id
    await getStudentData('')
    await getLecturerData('')
}


const selectedActivityTpe = ref('Kompetisi')
const activityTypes = ref(<any[]>[
    {
        id: "Kuliah Kerja Nyata",
        name: "Kuliah Kerja Nyata",
    },
    {
        id: "Kerja Praktek/PKL",
        name: "Kerja Praktek/PKL",
    },
    {
        id: "Aktivitas Kemahasiswaan",
        name: "Aktivitas Kemahasiswaan",
    },
    {
        id: "Program Kreativitas Mahasiswa",
        name: "Program Kreativitas Mahasiswa",
    },
    {
        id: "Kompetisi",
        name: "Kompetisi",
    },
])

function activityTypesOnChange(id: string) {
    selectedActivityTpe.value = id
    createStudentActivityRequest.value.activity_type = id
}

const students = ref<GetStudentListData[]>([])
const studentParticipants = ref(<CreateStudentActivityParticipant[]>[])

const dialogStudent = ref(false)
async function getStudentData(name: string) {
    try {
        if (!selectedAdminStudyPrograms.value.id) {
            return [];
        }
        const { response: resp, error: error } = await getStudentList(1000000, 1, <GetStudentListRequest>{
            studyProgramId: createStudentActivityRequest.value.study_program_id,
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: '',
            address: '',
            regencyId: '',
            status: [],
            getAcademicGuidance: '',
            hasAuthentication: '',
            studyPlanSemesterId: '',
            studyPlanIsApproved: '',
            studyPlanIsSubmitted: '',
            hasStudyPlan: '',
            statusSemesterId: '',
            isRegistered: '',
            hasPaid: '',
            isGraduateEligible: '',
            isThesisEligible: '',
            yudiciumSessionId: '',
        })
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const lecturers = ref<GetLecturerListData[]>([])
const dialogLecturerMentor = ref(false)
const dialogLecturerExaminer = ref(false)

async function getLecturerData(name: string) {
    try {
        if (!selectedAdminStudyPrograms.value.id) {
            return [];
        }
        const { response: resp, error: error } = await getLecturerList(1000000, 1, name, createStudentActivityRequest.value.study_program_id, "", "", "", '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturers.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const studentRoles = ref(<any[]>[
    {
        id: "Ketua",
        name: "Ketua",
    },
    {
        id: "Anggota",
        name: "Anggota",
    },
    {
        id: "Personal",
        name: "Personal",
    },
])

const lecturerActivityTypes = ref(<any[]>[
    "110100 - melaksanakan perkuliahan (pengajaran, tutorial, tatap muka, dan/atau daring) dalam rangka melaksanakan metode pembelajaran student centered learning (seperti problembased learning atau project basedlearning), membimbing/menguji dalam menghasilkan disertas",
    "110101 - Asisten Ahli dengan beban mengajar 10 sks pertama",
    "110102 - Asisten Ahli dengan beban mengajar 2 sks berikutnya",
    "110103 - Lektor/Lektor Kepala/Profesor dengan beban mengajar 10 sks pertama",
    "110104 - Lektor/Lektor Kepala/Profesor dengan beban mengajar 2 sks berikutnya",
    "110105 - Melakukan pengajaran untuk peserta pendidikan dokter melalui tindakan medik spesialistik",
    "110106 - Melakukan pengajaran konsultasi spesialis kepada peserta pendidikan dokter",
    "110107 - Melakukan pemeriksaan luar dengan pembimbingan terhadap peserta pendidikan dokter",
    "110108 - Melakukan pemeriksaan dalam dengan pembimbingan terhadap peserta pendidikan dokter",
    "110109 - Menjadi saksi ahli dengan pembimbingan terhadap peserta pendidikan dokter",
    "110151 - Melakukan pengajaran untuk peserta pendidikan dokter melalui tindakan medik spesialistik",
    "110152 - Melakukan pengajaran Konsultasi spesialis kepada peserta pendidikan dokter, melakukan pemeriksaan luar dengan pembimbingan terhadap peserta pendidikan dokter ",
    "110153 - Melakukan pemeriksaan dalam dengan pembimbingan terhadap peserta pendidikan dokter ",
    "110154 - Menjadi saksi ahli dengan pembimbingan terhadap peserta pendidikan dokter",
    "110200 - Membimbing seminar mahasiswa",
    "110300 - Membimbing Kuliah Kerja Nyata, Praktek Kerja Nyata, Praktek Kerja Lapangan, termasuk membimbing pelatihan militer mahasiswa, pertukaran mahasiswa,  Magang, kuliah berbasis penelitian, wirausaha, dan bentuk lain pengabdian kepada masyarakat, dan sejenisnya",
    "110400 - Membimbing dan ikut membimbing dalam menghasilkan disertasi, tesis, skripsi dan laporan akhir studi yang sesuai dengan bidang tugasnya",
    "110401 - Disertasi (pembimbing utama)",
    "110402 - Tesis (pembimbing utama)",
    "110403 - Skripsi (pembimbing utama)",
    "110404 - Laporan/tugas akhir studi (pembimbing utama)",
    "110405 - Disertasi (pembimbing pendamping)",
    "110406 - Tesis (pembimbing pendamping)",
    "110407 - Skripsi (pembimbing pendamping)",
    "110408 - Laporan akhir studi (pembimbing pendamping)",
    "110500 - Bertugas sebagai penguji pada ujian akhir/profesi",
    "110501 - Ketua penguji",
    "110502 - Anggota penguji",
    "110600 - Membina kegiatan mahasiswa di bidang akademik dan kemahasiswaan, termasuk dalam kegiatan ini adalah membimbing mahasiswa menghasilkan produk saintifik, membimbing mahasiswa mengikuti kompetisi di bidang akademik dan kemahasiswaan",
    "110601 - Melakukan pembinaan kegiatan mahasiswa di bidang akademik (PA) dan kemahasiswaan (BEM, Maperwa, dan lain;lain",
    "110602 - Membimbing mahasiswa menghasilkan produk saintifik bereputasi dan mendapat pengakuan tingkat Internasional",
    "110603 - Membimbing mahasiswa menghasilkan produk saintifik bereputasi dan mendapat pengakuan tingkat Nasional",
    "110604 - Membimbing mahasiswa mengikuti kompetisi dibidang akademik dan kemahasiswaan bereputasi dan mencapai juara tingkat Internasional",
    "110605 - Membimbing mahasiswa mengikuti kompetisi dibidang akademik dan kemahasiswaan bereputasi dan mencapai juara tingkat Nasional",
    "110700 - Melakukan kegiatan pengembangan program kuliah tatap muka/daring (RPS, perangkat pembelajaran)",
    "110800 - Mengembangkan bahan kuliah",
    "110801 - Buku Ajar (cetak atau elektronik) ",
    "110802 - Diktat, modul, petunjuk praktikum, model, alat bantu, audio visual, naskah tutorial",
    "110803 - mengembangkan bahan pengajaran/modul/ bahan kuliah yang mempunyai nilai kebaharuan/manual/ pedoman akademik/pedoman pemagangan/pedoman pembelajaran dalam bentuk case study/problem based learning/project based learning",
    "110804 - Mengembangkan bahan pengajaran/modul/ bahan kuliah yang mempunyai nilai kebaharuan/manual/ pedoman akademik/pedoman pemagangan/pedoman pembelajaran",
    "110900 - Melakukan kegiatan orasi ilmiah pada perguruan tinggi",
    "111000 - Menduduki jabatan perguruan tinggi ",
    "111001 - Rektor",
    "111002 - Kepala LLDIKTI/ Direktur Politeknik/Wakil Rektor/Dekan/Direktur Pascasarjana/Ketua Senat Universitas",
    "111003 - Ketua Sekolah Tinggi/Ketua Lembaga/ Wakil Dekan/Wakil Direktur Pascasarjana/Ketua Senat Fakultas",
    "111004 - Wakil Ketua Sekolah Tinggi/Wakil Direktur Politeknik/Direktur Akademi",
    "111005 - Wakil Direktur Akademi/Sekretaris Lembaga/ Ketua Jurusan/ Departemen/Bagian/Program studi",
    "111006 - Kepala Laboratorium/Sekretaris Jurusan/Departemen/Bagian",
    "111007 - Pembantu direktur akademi/ketua jurusan/ketua prodi pada universitas/politeknik/akademi, sekretaris jurusan/bagian pada universitas/institut/sekolah tinggi",
    "111008 - Sekretaris jurusan pada politeknik/akademi dan kepala laboratorium (bengkel) universitas/institut/sekolah tinggi/politeknik/akademi",
    "111100 - Membimbing dosen yang lebih rendah jabatannya ",
    "111101 - Pembimbing pencangkokan",
    "111102 - Pembimbing Reguler",
    "111200 - Melaksanakan kegiatan Detasering dan Pencangkokan di luar institusi ",
    "111201 - Detasering Dosen berkegiatan pada institusi Qs 100",
    "111202 - Detasering Dosen berkegiatan pada institusi nasional",
    "111203 - Pencangkokan Dosen berkegiatan pada institusi Qs 100",
    "111204 - Pencangkokan Dosen berkegiatan pada institusi nasional",
    "111300 - Melakukan kegiatan pengembangan diri untuk meningkatkan kompetensi/memperoleh sertifikasi profesi ",
    "111301 - Lamanya lebih dari 960 jam",
    "111302 - Lamanya 641",
    "111303 - Lamanya 481",
    "111304 - Lamanya 161",
    "111305 - Lamanya 81",
    "111306 - Lamanya 31",
    "111307 - Lamanya 10",
    "111308 - Memperoleh sertifikasi profesi Bereputasi tingkat Internasional",
    "111309 - Memperoleh sertifikasi profesi Bereputasi tingkat Nasional",
    "111400 - Pendampingan, pembimbingan, mentoring mahasiswa secara terstruktur menghasilkan diantaranya: karya inovatif, karya teknologi yang bermanfaat bagi kesejahteraan masyarakat dan industri; proyek kewirausahaan; startup/usaha rintisan; magang industri; bina de",
])

async function saveSelectedStudents() {
    dialogStudent.value = false
}
async function cancelSelectedStudents() {
    dialogStudent.value = false
    // selectedStudents.value = []
}

async function save() {
    if (studentParticipants.value.length > 0) {
        createStudentActivityRequest.value.participants = studentParticipants.value
    } else {
        createStudentActivityRequest.value.participants = []
    }
    if (mentors.value.length > 0) {
        createStudentActivityRequest.value.mentors = mentors.value
    } else {
        createStudentActivityRequest.value.mentors = []
    }
    if (examiners.value.length > 0) {
        createStudentActivityRequest.value.examiners = examiners.value
    } else {
        createStudentActivityRequest.value.examiners = []
    }
    try {
        const { response: createRoleResponse, error } = await createStudentActivity(createStudentActivityRequest.value)

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

const studentParticipant = ref(<CreateStudentActivityParticipant>{})
async function addStudent() {
    dialogStudent.value = true
}
async function studentOnChange(data: any) {
    studentParticipant.value.student_id = data.id
    studentParticipant.value.student_name = data.name
}
async function closeStudentDialog() {
    dialogStudent.value = false
}
async function saveAddStudent() {
    const found = studentParticipants.value.some(el => el.student_id === studentParticipant.value.student_id);
    if (!found) {
        studentParticipants.value.push(studentParticipant.value)
        closeStudentDialog()
        studentParticipant.value = <CreateStudentActivityParticipant>{}
    } else {
        alert('mahasiswa sudah di masukan')
    }
}
async function deleteStudent(item: any) {
    let index = studentParticipants.value.findIndex(x => x.student_id === item.student_id);
    studentParticipants.value.splice(index, 1)
}
const mentors = ref(<CreateStudentActivityMentor[]>[])
const mentor = ref(<CreateStudentActivityMentor>{})
async function addLecturerMentor() {
    dialogLecturerMentor.value = true
}
async function lecturerMentorOnChange(data: any) {
    mentor.value.lecturer_id = data.id
    mentor.value.lecturer_name = data.name
}
async function closeMentorDialog() {
    dialogLecturerMentor.value = false
}
async function deleteMentor(data: any) {
    let index = mentors.value.findIndex(x => x.lecturer_id === data.lecturer_id);
    mentors.value.splice(index, 1)
}
async function saveAddMentor() {
    const found = mentors.value.some(el => el.lecturer_id === mentor.value.lecturer_id);
    if (!found) {
        mentors.value.push(mentor.value)
        closeMentorDialog()
        mentor.value = <CreateStudentActivityMentor>{}
    } else {
        alert('pembimbing sudah di masukan')
    }
}
const examiners = ref(<CreateStudentActivityExaminer[]>[])
const examiner = ref(<CreateStudentActivityExaminer>{})
async function addLecturerExaminer() {
    dialogLecturerExaminer.value = true
}
async function lecturerExminerOnChange(data: any) {
    examiner.value.lecturer_id = data.id
    examiner.value.lecturer_name = data.name
}
async function closeExaminerDialog() {
    dialogLecturerExaminer.value = false
}
async function deleteExaminer(data: any) {
    let index = examiners.value.findIndex(x => x.lecturer_id === data.lecturer_id);
    examiners.value.splice(index, 1)
}
async function saveAddExaminer() {
    const found = examiners.value.some(el => el.lecturer_id === examiner.value.lecturer_id);
    if (!found) {
        examiners.value.push(examiner.value)
        closeExaminerDialog()
        examiner.value = <CreateStudentActivityMentor>{}
    } else {
        alert('penguji sudah di masukan')
    }
}
onMounted(async () => {
    await getAdminStudyProgramData()
    await getSemesterData()
});
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>
<template>
    <div>
        <v-dialog v-model="dialogStudent" max-width="800">
            <v-card max-height="600" style="overflow: auto;">
                <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">Tambah Mahasiswa</span>
                </v-card-title>
                <v-card-text>
                    <v-col cols="12" sm="12">
                        <v-col cols="12" sm="6" class="float-left">
                            <v-autocomplete variant="outlined" hide-details :items="students" item-title="name"
                                item-value="id" label="Cari Mahasiswa" @update:search="(data: any) => getStudentData(data)"
                                @update:model-value="(data: any) => studentOnChange(data)" return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" class="float-left">
                            <v-select v-if="createStudentActivityRequest.is_group_activity"
                                v-model="studentParticipant.role" variant="outlined" hide-details
                                :items="['Ketua', 'Anggota']"></v-select>
                            <v-select v-else variant="outlined" v-model="studentParticipant.role" hide-details
                                :items="['Personal']"></v-select>
                        </v-col>
                    </v-col>
                    <v-card-actions class="pa-4">
                        <v-spacer />
                        <v-btn color="error" @click="closeStudentDialog">
                            Batal
                        </v-btn>
                        <v-btn color="secondary" @click="saveAddStudent">
                            Simpan
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogLecturerMentor" max-width="800">
            <v-card max-height="600" style="overflow: auto;">
                <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">Tambah Dosen Pembimbing</span>
                </v-card-title>
                <v-card-text>
                    <v-col cols="12" sm="12">
                        <v-col cols="12" sm="6" class="float-left">
                            <v-autocomplete variant="outlined" hide-details :items="lecturers" item-title="name"
                                item-value="id" label="Cari Dosen" @update:search="(data: any) => getLecturerData(data)"
                                @update:model-value="(data: any) => lecturerMentorOnChange(data)"
                                return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" class="float-left">
                            <v-text-field type="number" v-model="mentor.sort" variant="outlined" hide-details
                                label="Urutan"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" class="float-left">
                            <v-select v-model="mentor.activity_category" variant="outlined" hide-details
                                :items="lecturerActivityTypes" label="Kategori Aktifitas"></v-select>
                        </v-col>
                    </v-col>
                    <v-card-actions class="pa-4">
                        <v-spacer />
                        <v-btn color="error" @click="closeMentorDialog">
                            Batal
                        </v-btn>
                        <v-btn color="secondary" @click="saveAddMentor">
                            Simpan
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogLecturerExaminer" max-width="800">
            <v-card max-height="600" style="overflow: auto;">
                <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">Tambah Dosen Penguji</span>
                </v-card-title>
                <v-card-text>
                    <v-col cols="12" sm="12">
                        <v-col cols="12" sm="6" class="float-left">
                            <v-autocomplete variant="outlined" hide-details :items="lecturers" item-title="name"
                                item-value="id" label="Cari Dosen" @update:search="(data: any) => getLecturerData(data)"
                                @update:model-value="(data: any) => lecturerExminerOnChange(data)"
                                return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" class="float-left">
                            <v-text-field type="number" v-model="examiner.sort" variant="outlined" hide-details
                                label="Urutan"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" class="float-left">
                            <v-select v-model="examiner.activity_category" variant="outlined" hide-details
                                :items="lecturerActivityTypes" label="Kategori Aktifitas"></v-select>
                        </v-col>
                    </v-col>
                    <v-card-actions class="pa-4">
                        <v-spacer />
                        <v-btn color="error" @click="closeExaminerDialog">
                            Batal
                        </v-btn>
                        <v-btn color="secondary" @click="saveAddExaminer">
                            Simpan
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Aktifitas Mahasiswa</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="adminStudyPrograms" item-value="id"
                                item-title="name" label="Program Studi"
                                @update:model-value="(sl: any) => adminStudyProgramsOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <!-- <v-select variant="outlined" hide-details :items="semesters" item-value="id"
                                item-title="semester_type_year" label="Semester"
                                @update:model-value="(sl: any) => semestersOnChange(sl)"></v-select> -->

                            <v-select v-model="createStudentActivityRequest.semester_id " item-value="id" variant="outlined" hide-details
                                :items="semesters" label="Pilih Semester">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                    }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                            <li style="padding: 10px; margin: 2px;" @click="onClick">
                                                <span>{{ title.school_year }} - {{ title.semester_type
                                                }}</span>
                                            </li>
                                        </a>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="activityTypes" item-value="id"
                                item-title="name" label="Tipe Aktivitas"
                                @update:model-value="(sl: any) => activityTypesOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createStudentActivityRequest.title" variant="outlined" hide-details
                                label="Judul" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createStudentActivityRequest.location" variant="outlined" hide-details
                                label="Lokasi" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createStudentActivityRequest.decision_number" variant="outlined"
                                hide-details label="Nomor SK Tugas" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createStudentActivityRequest.decision_date" type="date"
                                variant="outlined" hide-details label="Tanggal SK Tugas" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-radio-group label="Jenis Anggota" v-model="createStudentActivityRequest.is_group_activity"
                                inline hide-details="auto">
                                <v-radio label="Personal" :value="false" color="primary"></v-radio>
                                <v-radio label="Kelompok" :value="true" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="createStudentActivityRequest.remarks" variant="outlined" hide-details
                                label="Keterangan" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-btn color="primary" flat class="ml-auto" @click="addStudent">
                                <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Tambah Mahasiswa
                            </v-btn>
                            <v-table>
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Role</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in studentParticipants">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.student_name }}</td>
                                        <td>{{ item.role }}</td>
                                        <td>
                                            <v-btn color="error" flat class="ml-auto" @click="deleteStudent(item)">
                                                <v-icon class="mr-2">mdi-trash-can</v-icon>delete
                                            </v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-btn color="primary" flat class="ml-auto" @click="addLecturerMentor">
                                <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Tambah Dosen Pembimbing
                            </v-btn>
                            <v-table>
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Urutan</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in mentors">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.lecturer_name }}</td>
                                        <td>{{ item.sort }}</td>
                                        <td>
                                            <v-btn color="error" flat class="ml-auto" @click="deleteMentor(item)">
                                                <v-icon class="mr-2">mdi-trash-can</v-icon>delete
                                            </v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-btn color="primary" flat class="ml-auto" @click="addLecturerExaminer">
                                <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>Tambah Dosen Penguji
                            </v-btn>
                            <v-table>
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Urutan</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in examiners">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.lecturer_name }}</td>
                                        <td>{{ item.sort }}</td>
                                        <td>
                                            <v-btn color="error" flat class="ml-auto" @click="deleteExaminer(item)">
                                                <v-icon class="mr-2">mdi-trash-can</v-icon>delete
                                            </v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                            <v-btn color="error" @click="dialogStudent = false">
                                Batal
                            </v-btn>
                            <v-btn color="secondary" @click="save();"
                                :disabled="createStudentActivityRequest.study_program_id == '' || studentParticipants.length == 0 || mentors.length == 0 || examiners.length == 0">
                                Tambah
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</div></template>