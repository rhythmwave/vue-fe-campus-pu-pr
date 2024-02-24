<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateStudentActivity } from '~~/composables/api/student-activity/updateStudentActivity';
import { getSampleApiList } from '~~/composables/api/sample-api/getSampleApiList';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentActivityDetailData } from '~~/types/api/student-activity/GetStudentActivityDetail';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetStudentListData, GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { UpdateStudentActivityRequest, UpdateStudentActivityParticipant, UpdateStudentActivityMentor, UpdateStudentActivityExaminer } from '~~/types/api/student-activity/UpdateStudentActivity';
import { getStudentActivityDetail } from '~~/composables/api/student-activity/getStudentActivityDetail';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';

const props = defineProps({
    studentActivityId: String,
});

const valid = ref(true)
const studentActivityId = ref('')
const studyProgramId = ref('')
const detail = ref(<GetStudentActivityDetailData>{});
const updateStudentActivityRequest = ref(<UpdateStudentActivityRequest>{});
const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const selectedAdminStudyPrograms = ref(<GetAdminStudyProgramListData>{ id: "" })
const students = ref<GetStudentListData[]>([])
const semesters = ref<GetSemesterListData[]>([])
const lecturers = ref<GetLecturerListData[]>([])
const studentParticipants = ref(<UpdateStudentActivityParticipant[]>[])
const studentParticipant = ref(<UpdateStudentActivityParticipant>{})
const mentors = ref(<UpdateStudentActivityMentor[]>[])
const mentor = ref(<UpdateStudentActivityMentor>{})
const examiners = ref(<UpdateStudentActivityExaminer[]>[])
const examiner = ref(<UpdateStudentActivityExaminer>{})
const dialogStudent = ref(false)
const dialogLecturerMentor = ref(false)
const dialogLecturerExaminer = ref(false)

const emitData = defineEmits(['close', 'reload'])

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

async function getDetail(id: string){
    try {
        const { response: resp, error: error } = await getStudentActivityDetail(id)
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
        }
    } catch (error) {
        alert(error)
    }
}
async function getStudentData(name: string) {
    try {
        if (!studyProgramId.value) {
            return [];
        }
        const { response: resp, error: error } = await getStudentList(1000000, 1, <GetStudentListRequest>{
            studyProgramId: studyProgramId.value,
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
async function getSemesterData() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, studyProgramId.value, "")
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
async function getLecturerData(name: string) {
    try {
        if (!studyProgramId.value) {
            return [];
        }
        const { response: resp, error: error } = await getLecturerList(1000000, 1, name, studyProgramId.value, "", "", "", '', '', '', '', '')
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
async function adminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>adminStudyPrograms.value.find((x) => x.id == id)
    updateStudentActivityRequest.value.study_program_id = id
}
async function addStudent(){
    dialogStudent.value = true
}
async function studentOnChange(data: any){
    studentParticipant.value.student_id = data.id
    studentParticipant.value.student_name = data.name
}
async function closeStudentDialog(){
    dialogStudent.value = false
}
async function saveAddStudent(){
    const found = studentParticipants.value.some(el => el.student_id === studentParticipant.value.student_id);
    if (!found){
        studentParticipants.value.push(studentParticipant.value)
        closeStudentDialog()
        studentParticipant.value = <UpdateStudentActivityParticipant>{}
    }else{
        alert('mahasiswa sudah di masukan')
    }
}
async function deleteStudent(item: any){
    let index = studentParticipants.value.findIndex(x => x.student_id === item.student_id);
    studentParticipants.value.splice(index, 1)
}
async function addLecturerMentor(){
    dialogLecturerMentor.value = true
}
async function lecturerMentorOnChange(data: any){
    mentor.value.lecturer_id = data.id
    mentor.value.lecturer_name = data.name
}
async function closeMentorDialog(){
    dialogLecturerMentor.value = false
}
async function deleteMentor(data: any){
    let index = mentors.value.findIndex(x => x.lecturer_id === data.lecturer_id);
    mentors.value.splice(index, 1)
}
async function saveAddMentor(){
    const found = mentors.value.some(el => el.lecturer_id === mentor.value.lecturer_id);
    if (!found){
        mentors.value.push(mentor.value)
        closeMentorDialog()
        mentor.value = <UpdateStudentActivityMentor>{}
    }else{
        alert('pembimbing sudah di masukan')
    }
}
async function addLecturerExaminer(){
    dialogLecturerExaminer.value = true
}
async function lecturerExminerOnChange(data: any){
    examiner.value.lecturer_id = data.id
    examiner.value.lecturer_name = data.name
}
async function closeExaminerDialog(){
    dialogLecturerExaminer.value = false
}
async function deleteExaminer(data: any){
    let index = examiners.value.findIndex(x => x.lecturer_id === data.lecturer_id);
    examiners.value.splice(index, 1)
}
async function saveAddExaminer(){
    const found = examiners.value.some(el => el.lecturer_id === examiner.value.lecturer_id);
    if (!found){
        examiners.value.push(examiner.value)
        closeExaminerDialog()
        examiner.value = <UpdateStudentActivityMentor>{}
    }else{
        alert('penguji sudah di masukan')
    }
}
async function update() {
    if(studentParticipants.value.length > 0){
        updateStudentActivityRequest.value.participants = studentParticipants.value
    }else{
        updateStudentActivityRequest.value.participants = []
    }
    if(mentors.value.length > 0){
        updateStudentActivityRequest.value.mentors = mentors.value
    }else{
        updateStudentActivityRequest.value.mentors = []
    }
    if(examiners.value.length > 0){
        updateStudentActivityRequest.value.examiners = examiners.value
    }else{
        updateStudentActivityRequest.value.examiners = []
    }
    try {
        const { response: createRoleResponse, error } = await updateStudentActivity(updateStudentActivityRequest.value)

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
onMounted(async () => {
    studentActivityId.value = <string>props.studentActivityId
    await getDetail(studentActivityId.value)
    studyProgramId.value = detail.value.study_program_id
    await getAdminStudyProgramData()
    await getSemesterData()
    await getStudentData('')
    await getLecturerData('')
    updateStudentActivityRequest.value = <UpdateStudentActivityRequest>{
        id: detail.value.id,
        study_program_id: detail.value.study_program_id,
        semester_id: detail.value.semester_id,
        activity_type: detail.value.activity_type,
        title: detail.value.title,
        location: detail.value.location,
        decision_number: detail.value.decision_number,
        decision_date: formatYearMonthDate(detail.value.decision_date),
        is_group_activity: detail.value.is_group_activity,
        remarks: detail.value.remarks
    }
    for (let index = 0; index < detail.value.participants.length; index++) {
        let studentParticipant = <UpdateStudentActivityParticipant>{
            student_id: detail.value.participants[index].student_id,
            student_name: detail.value.participants[index].name,
            role: detail.value.participants[index].role,
        } 
        studentParticipants.value.push(studentParticipant)
    }
    for (let index = 0; index < detail.value.mentors.length; index++) {
        let mentor = <UpdateStudentActivityMentor>{
            lecturer_id: detail.value.mentors[index].lecturer_id,
            lecturer_name: detail.value.mentors[index].name,
            activity_category: detail.value.mentors[index].activity_category,
            sort: detail.value.mentors[index].sort,
        } 
        mentors.value.push(mentor)
    }
    for (let index = 0; index < detail.value.examiners.length; index++) {
        let mentor = <UpdateStudentActivityMentor>{
            lecturer_id: detail.value.examiners[index].lecturer_id,
            lecturer_name: detail.value.examiners[index].name,
            activity_category: detail.value.examiners[index].activity_category,
            sort: detail.value.examiners[index].sort,
        } 
        examiners.value.push(mentor)
    }
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
                            <v-autocomplete variant="outlined" hide-details :items="students" item-title="name" item-value="id" label="Cari Mahasiswa" @update:search="(data:any)=>getStudentData(data)" @update:model-value="(data:any)=>studentOnChange(data)" return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" class="float-left">
                            <v-select v-if="updateStudentActivityRequest.is_group_activity" v-model="studentParticipant.role" variant="outlined" hide-details :items="['Ketua', 'Anggota']"></v-select>
                            <v-select v-else variant="outlined" v-model="studentParticipant.role" hide-details :items="['Personal']"></v-select>
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
                            <v-autocomplete variant="outlined" hide-details :items="lecturers" item-title="name" item-value="id" label="Cari Dosen" @update:search="(data:any)=>getLecturerData(data)" @update:model-value="(data:any)=>lecturerMentorOnChange(data)" return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" class="float-left">
                            <v-text-field type="number" v-model="mentor.sort" variant="outlined" hide-details label="Urutan"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" class="float-left">
                            <v-select v-model="mentor.activity_category" variant="outlined" hide-details :items="lecturerActivityTypes" label="Kategori Aktifitas"></v-select>
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
                            <v-autocomplete variant="outlined" hide-details :items="lecturers" item-title="name" item-value="id" label="Cari Dosen" @update:search="(data:any)=>getLecturerData(data)" @update:model-value="(data:any)=>lecturerExminerOnChange(data)" return-object></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" class="float-left">
                            <v-text-field type="number" v-model="examiner.sort" variant="outlined" hide-details label="Urutan"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" class="float-left">
                            <v-select v-model="examiner.activity_category" variant="outlined" hide-details :items="lecturerActivityTypes" label="Kategori Aktifitas"></v-select>
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
                            <v-select v-model="updateStudentActivityRequest.study_program_id" variant="outlined" hide-details  :items="adminStudyPrograms" item-value="id"
                                item-title="name" label="Program Studi"
                                @update:model-value="(sl: any) => adminStudyProgramsOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <!-- <v-select v-model="updateStudentActivityRequest.semester_id" variant="outlined" hide-details :items="semesters" item-value="id"
                                item-title="semester_type_year" label="Semester"></v-select> -->
                                <v-select v-model="updateStudentActivityRequest.semester_id " item-value="id" variant="outlined" hide-details
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
                            <v-select v-model="updateStudentActivityRequest.activity_type" variant="outlined" hide-details :items="activityTypes" item-value="id"
                                item-title="name" label="Tipe Aktivitas"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentActivityRequest.title" variant="outlined" hide-details
                                label="Judul" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentActivityRequest.location" variant="outlined" hide-details
                                label="Lokasi" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentActivityRequest.decision_number" variant="outlined"
                                hide-details label="Nomor SK Tugas" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateStudentActivityRequest.decision_date" type="date"
                                variant="outlined" hide-details label="Tanggal SK Tugas" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-radio-group label="Jenis Anggota" v-model="updateStudentActivityRequest.is_group_activity"
                                inline hide-details="auto">
                                <v-radio label="Personal" :value="false" color="primary"></v-radio>
                                <v-radio label="Kelompok" :value="true" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="updateStudentActivityRequest.remarks" variant="outlined" hide-details
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
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" @click="update();" :disabled="updateStudentActivityRequest.study_program_id == '' || studentParticipants.length == 0 || mentors.length == 0 || examiners.length == 0">
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