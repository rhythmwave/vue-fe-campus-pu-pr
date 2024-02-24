<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateAcademicGuidance } from '~~/composables/api/academic-guidance/updateAcademicGuidance';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { ErrorRoot } from '~~/types/api/error';
import { GetAcademicGuidanceListData } from '~~/types/api/academic-guidance/GetAcademicGuidanceList';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { UpsertAcademicGuidanceRequest } from '~~/types/api/academic-guidance/UpsertAcademicGuidance';
import { GetStudentListData, GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { GetActiveSemesterData } from '~~/types/api/semester/GetActiveSemester';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { upsertAcademicGuidance } from '~~/composables/api/academic-guidance/upsertAcademicGuidance';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { getStudentList } from '~~/composables/api/student/getStudentList';

const props = defineProps({
    studyProgramId: String,
});
const valid = ref(true)
const updateAcademicGuidanceRequest = ref(<UpsertAcademicGuidanceRequest>{
    semester_id: '',
    lecturer_id: '',
    student_ids: [],
});
const semester_id = ref('')
let studyProgram: GetAdminStudyProgramListData = <GetAdminStudyProgramListData>{};
const study_program_id = ref('')
const emitData = defineEmits(['close', 'reload'])


async function update() {
    try {
        let request: any = Object.assign({}, updateAcademicGuidanceRequest.value)
        if (request.decision_date) {
            request.decision_date = convertDateWithoutTimeToTimezoned(request.decision_date)
        }
        const { response: updateRoleResponse, error } = await upsertAcademicGuidance(request)

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

const Lecturers = ref<GetLecturerListData[]>([])
async function getLecturer() {
    try {
        const { response: resp, error: error } = await getLecturerList(1000000, 1, "", '', "", "", semester_id.value, '', '', '', '', '')

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            Lecturers.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
const Students = ref<GetStudentListData[]>([])
const selectedStudents = ref<GetStudentListData[]>([])
const searchStudent = ref("")

const studentsCheckbox = ref(<any[]>[]);
const studentsSelected = ref(0);

async function getStudent(search: string) {
    try {
        if (updateAcademicGuidanceRequest.value.lecturer_id == "") {
            return []
        };
        const { response: resp, error: error } = await getStudentList(20, 1, <GetStudentListRequest>{
            studyProgramId: '',
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: search,
            address: '',
            regencyId: '',
            status: [],
            getAcademicGuidance: false,
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
        console.log("response stury program")
        console.log(resp)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            let temp = <any[]>[];
            studentsCheckbox.value.forEach((s) => {
                if (s.value) temp.push(s)
            })

            Students.value = resp?.data
            Students.value.forEach((d) => {
                let tData = {
                    data: d,
                    value: isStudentExist(d.id),
                }
                let find = false
                temp.forEach((s) => {
                    if (s.data.id == d.id) find = true
                })
                if (!find) temp.push(tData);
            });
            studentsCheckbox.value = temp;
            saveStudents();
        }
    } catch (error) {
        alert(error)
    }
}
const semesters = ref(<GetSemesterListData[]>[])
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000, 1, study_program_id.value, '')
        console.log("response stury program")
        console.log(resp)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const dialog = ref(false);

function isStudentExist(id: string): boolean {
    console.log(updateAcademicGuidanceRequest.value);
    let isExist = false;
    updateAcademicGuidanceRequest.value.student_ids.forEach((r) => {
        if (r == id) {
            isExist = true;
        }
    });
    return isExist;
}
function clearStudents() {
    let temp = <any[]>[];
    studentsCheckbox.value.forEach((d) => {
        let tData = {
            data: d.data,
            value: isStudentExist(d.data.id),
        }
        temp.push(tData);
    });
    studentsCheckbox.value = temp;
    let newArray = studentsCheckbox.value.filter(function (el) {
        return el.value;
    });
    studentsSelected.value = newArray.length;
}

function saveStudents() {
    let newArray = studentsCheckbox.value.filter(function (el) {
        return el.value;
    });
    studentsSelected.value = newArray.length;
    let tempIds = <string[]>[];
    newArray.forEach((sp) => {
        tempIds.push(sp.data.id);
    });
    updateAcademicGuidanceRequest.value.student_ids = tempIds;
}
function lecturerOnChange(value: any) {
    updateAcademicGuidanceRequest.value.lecturer_id = value;
    getStudent(searchStudent.value)
}
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
watch(semester_id, async (value) => {
    updateAcademicGuidanceRequest.value.semester_id = value
})
watch(searchStudent, async (value) => {
    getStudent(value)
})
onMounted(async () => {
    if (typeof props.studyProgramId != 'undefined') {
        study_program_id.value = <string>props.studyProgramId
    }
    await getSemester()
    await getLecturer()
    await getStudent("")
});
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Pembimbing Akademik Kolektif</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" lg="12" md="12">
                            <v-label style="margin-bottom: 5px;">Semester</v-label>
                            <v-select v-model="semester_id" item-value="id" variant="outlined" hide-details
                                :items="semesters" label="Pilih Semester">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <li style="padding: 10px; margin: 2px;">
                                            <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                                                }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" lg="12" md="12">
                            <v-label style="margin-bottom: 5px;">Dosen PA</v-label>
                            <v-select variant="outlined" hide-details :items="Lecturers" item-value="id" item-title="name"
                                label="Dosen PA" @update:model-value="(sl: any) => lecturerOnChange(sl)"></v-select>
                        </v-col>
                        <div cols="12" />
                        <v-col cols="2" sm="2">
                            <v-dialog v-model="dialog" scrollable>
                                <template v-slot:activator="{ props }">
                                    <v-btn color="success" style="width: 20px;height: 20px;" v-bind="props" flat>
                                        <PlusIcon style="width: 20px;height: 20px;" />
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>Hak Akses Modul</v-card-title>
                                    <v-text-field v-model="searchStudent" variant="outlined" hide-details class="px-3" />
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <v-col cols="6" sm="12" md="6" lg="6" v-for="itm in studentsCheckbox">
                                            <v-checkbox-btn color="primary" hide-details v-model="itm.value"
                                                :label="itm.data.name"></v-checkbox-btn>
                                        </v-col>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn color="error" text @click="dialog = false; clearStudents();">
                                            Tutup
                                        </v-btn>
                                        <v-btn color="success" text @click="dialog = false; saveStudents();">
                                            Pilih
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-col>
                        <v-col cols="10" sm="10">
                            <h3>Mahasiswa </h3>
                            {{ studentsSelected == 0 ? '' : studentsSelected + ' Dipilih' }}
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    :disabled="updateAcademicGuidanceRequest.lecturer_id == '' || updateAcademicGuidanceRequest.semester_id == ''"
                                    @click="update();">
                                    Simpan
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>