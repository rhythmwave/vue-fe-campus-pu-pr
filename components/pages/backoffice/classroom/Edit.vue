<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { EditClassroomRequest } from '~~/types/api/classroom/EditClassroomRequest';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { LecturerForClassRoom } from '~~/types/api/lecturer/LecturerForClassroom';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { GetSubjectListData } from '~~/types/api/subject/GetSubjectList';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetLecturerDetailData } from '~~/types/api/lecturer/GetLecturerDetail';
import { CreateClassroomRequest } from '~~/types/api/classroom/CreateClassroomRequest';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getLecturerDetail } from '~~/composables/api/lecturer/getLecturerDetail';
import { updateClassroom } from '~~/composables/api/classroom/updateClassroom';
import { formatYearMonthDate } from "~~/utils/helpers/date-utils"
import { ErrorRoot } from '~~/types/api/error';

const props = defineProps({
    title: String,
    dataDetail: Object,
    isMbkm: Boolean,
});
const emit = defineEmits(['close', 'reload'])
const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const study_program_id = ref('')
const curriculum_id = ref('')
const curriculumIds = ref([''])
const subject_id = ref('')
const semester_id = ref('')
const detail = ref(<GetClassroomDetail>{});
const lecturers = ref<GetLecturerListData[]>([])
const edit = ref(<EditClassroomRequest>{})
const lecturerObj = ref<LecturerForClassRoom>()
const lecturersObj = ref<LecturerForClassRoom[]>([])
const curriculums = ref<GetCuriculumListData[]>([])
const semesters = ref<GetSemesterListData[]>([])
const subjects = ref<GetSubjectListData[]>([])
const lecturerDetail = ref(<GetLecturerDetailData>{})

async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, "", "")
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
async function getCuriculum() {
    try {
        const { response: resp, error: error } = await getCuriculumList(1000, 1, '', study_program_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            curriculums.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000, 1, study_program_id.value, '')
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
async function getLecturer() {
    try {
        const { response: resp, error: error } = await getLecturerList(1000, 1, '', '', '', '', '', '', '', '', '', '')
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
async function getSubject() {
    try {
        const { response: resp, error: error } = await getSubjectList(1000, 1, '', curriculumIds.value, '', '', '', '', '', edit.value.is_mbkm)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            subjects.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getLecturerDetailObj(id: string) {
    try {
        const { response: resp, error: error } = await getLecturerDetail(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturerDetail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function adminStudyProgramsOnChange(item: any) {
    if (item != '') {
        study_program_id.value = item
    }
    await getCuriculum()
    await getSemester()
    await getLecturer()
}
async function curiculumOnChange(item: any) {
    curriculumIds.value = []
    if (item != '') {
        curriculum_id.value = item
    }
    curriculumIds.value.push(<string>curriculum_id?.value)
    await getSubject()
}
async function subjectOnChange(item: any) {
    edit.value.subject_id = ''
    if (item != '') {
        edit.value.subject_id = item
    }
}
async function semesterOnChange(item: any) {
    edit.value.semester_id = ''
    if (item != '') {
        edit.value.semester_id = item
    }
}
async function lecturerOnChange(item: any) {
    await getLecturerDetailObj(item)
    lecturerObj.value = {
        id: item,
        name: <string>lecturerDetail.value?.name,
        is_grading_responsible: false
    }
    lecturersObj.value.push(lecturerObj.value)
    lecturerObj.value = {
        id: '',
        name: '',
        is_grading_responsible: false
    }
}
function closeLecturer(item: any) {
    lecturersObj.value.splice(lecturersObj.value.findIndex(v => v.id === item.id), 1)
}
async function update() {
    edit.value.lecturers = lecturersObj.value
    try {
        const { response: createRoleResponse, error } = await updateClassroom(edit.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emit('reload');
        }
    } catch (error) {
        alert(error)
        return false;
    }
    emit('close');
}
onMounted(async () => {
    await getAdminStudyProgram()
    await getAdminStudyProgram()
    await getCuriculum()
    await getSubject()
    await getSemester()
    await getLecturer()
    detail.value = <GetClassroomDetail>props.dataDetail
    if (detail.value) {
        curriculum_id.value = detail.value.curriculum_id
        study_program_id.value = detail.value.study_program_id
        subject_id.value = detail.value.subject_id
        semester_id.value = detail.value.semester_id
        detail.value.lecturers.forEach(element => {
            lecturersObj.value.push(<LecturerForClassRoom>{
                id: element.id,
                name: element.name,
                is_grading_responsible: element.is_grading_responsible,
            })
        });
        edit.value = <EditClassroomRequest>{
            id: detail.value.id,
            subject_id: detail.value.subject_id,
            semester_id: detail.value.semester_id,
            name: detail.value.name,
            scope: detail.value.scope,
            is_online: detail.value.is_online,
            is_offline: detail.value.is_offline,
            minimum_participant: detail.value.minimum_participant,
            maximum_participant: detail.value.maximum_participant,
            remarks: detail.value.remarks,
            is_mbkm: <boolean>props.isMbkm,
            application_deadline: detail.value.application_deadline ? formatYearMonthDate(detail.value.application_deadline) : '',
        }
    }
});

function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">{{ title }}</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="edit.name" variant="outlined" hide-details label="*Nama"
                                :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="edit.scope" :items="['Internal', 'External', 'Campuran']"
                                label="Cakupan"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="study_program_id" variant="outlined" hide-details :items="adminStudyPrograms"
                                item-value="id" item-title="name" label="Pilih Program Studi"
                                @update:model-value="(sl: any) => adminStudyProgramsOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="curriculum_id" variant="outlined" hide-details :items="curriculums"
                                item-value="id" item-title="name" label="Pilih Kurikulum"
                                @update:model-value="(sl: any) => curiculumOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="subject_id" variant="outlined" hide-details :items="subjects" item-value="id"
                                item-title="name" label="*Pilih Mata Kuliah"
                                @update:model-value="(sl: any) => subjectOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <!-- <v-select v-model="semester_id" :items="semesters" label="Semester" item-value="id"
                                item-title="semester_start_year" @update:model-value="(sl: any) => semesterOnChange(sl)"></v-select> -->
                            <v-select v-model="edit.semester_id" item-value="id" variant="outlined" hide-details
                                :items="semesters" label="Pilih Semester">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
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
                        <v-col cols="6" sm="6">
                            <v-switch v-model="edit.is_online" label="Online" color="primary"></v-switch>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-switch v-model="edit.is_offline" label="Offline" color="primary"></v-switch>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field type="number" v-model.number="edit.minimum_participant" variant="outlined"
                                hide-details label="Minimal Jumlah Peserta" :readonly="false" />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field type="number" v-model.number="edit.maximum_participant" variant="outlined"
                                hide-details label="Maksimal Jumlah Peserta" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="edit.remarks" label="Catatan"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select :items="lecturers" label="Dosen" item-value="id" item-title="name"
                                @update:model-value="(sl: any) => lecturerOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" v-if="lecturersObj.length > 0" v-for="(item, index) in lecturersObj">
                            <v-col cols="6" sm="6" class="float-left">
                                <v-text-field v-model="lecturersObj[index].name" variant="outlined" hide-details
                                    label="Dosen" :readonly="true" />
                            </v-col>
                            <v-col cols="5" sm="5" class="float-left">
                                <v-switch v-model="lecturersObj[index].is_grading_responsible" label="Penanggung Jawab"
                                    color="primary"></v-switch>
                            </v-col>
                            <v-col cols="1" sm="1" class="float-left">
                                <v-btn icon="mdi-close" color="warning" style="width: 30px; height: 30px;"
                                    @click="closeLecturer(item)"></v-btn>
                            </v-col>
                        </v-col>
                        <v-col cols="12" sm="12" v-if="edit.is_mbkm">
                            <v-text-field type="date" v-model="edit.application_deadline" variant="outlined" hide-details
                                label="Tanggal Tutup Pendaftaran"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="edit.name == ''" @click="update()">
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