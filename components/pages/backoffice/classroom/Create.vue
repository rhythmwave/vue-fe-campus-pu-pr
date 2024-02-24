<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { GetSubjectListData } from '~~/types/api/subject/GetSubjectList';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetLecturerDetailData } from '~~/types/api/lecturer/GetLecturerDetail';
import { LecturerForClassRoom } from '~~/types/api/lecturer/LecturerForClassroom';
import { CreateClassroomRequest } from '~~/types/api/classroom/CreateClassroomRequest';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getLecturerDetail } from '~~/composables/api/lecturer/getLecturerDetail';
import { createClassroom } from '~~/composables/api/classroom/createClassroom';
import { ErrorRoot } from '~~/types/api/error';

const props = defineProps({
    title: String,
    isMbkm: Boolean,
    studyProgramId: String,
});
const emit = defineEmits(['close', 'reload'])
const lecturerObj = ref<LecturerForClassRoom>()
const lecturersObj = ref<LecturerForClassRoom[]>([])
const studyProgramId = ref('')
const curriculum_id = ref('')
const curriculumIds = ref([''])
const curriculums = ref<GetCuriculumListData[]>([])
const semesters = ref<GetSemesterListData[]>([])
const subjects = ref<GetSubjectListData[]>([])
const lecturers = ref<GetLecturerListData[]>([])
const lecturerDetail = ref(<GetLecturerDetailData>{})
const create = ref(<CreateClassroomRequest>{
    subject_id: '',
    semester_id: '',
    name: '',
    scope: '',
    is_online: false,
    is_offline: false,
    minimum_participant: 0,
    maximum_participant: 0,
    remarks: '',
    lecturers: <LecturerForClassRoom[]>[],
    is_mbkm: false,
    application_deadline: '',
})
async function getCuriculum() {
    try {
        const { response: resp, error: error } = await getCuriculumList(1000, 1, '', studyProgramId.value)
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
async function getSubject() {
    try {
        const { response: resp, error: error } = await getSubjectList(1000, 1, '', curriculumIds.value, '', '', '', '', '', create.value.is_mbkm)
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
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000, 1, studyProgramId.value, '')
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
async function curiculumOnChange(item: any) {
    curriculumIds.value = []
    if (item != '') {
        curriculum_id.value = item
    }
    curriculumIds.value.push(<string>curriculum_id?.value)
    await getSubject()
}
async function subjectOnChange(item: any) {
    create.value.subject_id = ''
    if (item != '') {
        create.value.subject_id = item
    }
}
async function semesterOnChange(item: any) {
    create.value.semester_id = ''
    if (item != '') {
        create.value.semester_id = item
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
async function save() {
    create.value.lecturers = lecturersObj.value
    try {
        const { response: createRoleResponse, error } = await createClassroom(create.value)
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
watch(studyProgramId, async function (value) {
    if (value != '') {
        await getCuriculum()
        await getSemester()
        await getLecturer()
        await getSubject()
    }
})
onMounted(async () => {
    create.value.is_mbkm = <boolean>props.isMbkm
    studyProgramId.value = <string>props.studyProgramId
})

function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
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
                            <v-text-field v-model="create.name" variant="outlined" hide-details label="*Nama"
                                :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="create.scope" :items="['Internal', 'External', 'Campuran']"
                                label="Cakupan"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="curriculums" item-value="id" item-title="name"
                                label="Pilih Kurikulum" @update:model-value="(sl: any) => curiculumOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="subjects" item-value="id" item-title="name"
                                label="*Pilih Mata Kuliah"
                                @update:model-value="(sl: any) => subjectOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">

                            <!-- <v-select :items="semesters" label="Semester" item-value="id"
                                item-title="semester_start_year" @update:model-value="(sl: any) => semesterOnChange(sl)"></v-select> -->
                            <v-select v-model="create.semester_id" item-value="id" variant="outlined" hide-details
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
                            <v-switch v-model="create.is_online" label="Online" color="primary"></v-switch>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-switch v-model="create.is_offline" label="Offline" color="primary"></v-switch>
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field type="number" v-model.number="create.minimum_participant" variant="outlined"
                                hide-details label="Minimal Jumlah Peserta" :readonly="false" />
                        </v-col>
                        <v-col cols="6" sm="6">
                            <v-text-field type="number" v-model.number="create.maximum_participant" variant="outlined"
                                hide-details label="Maksimal Jumlah Peserta" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="create.remarks" label="Catatan"></v-textarea>
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
                        <v-col cols="12" sm="12" v-if="create.is_mbkm">
                            <v-text-field type="date" v-model="create.application_deadline" variant="outlined" hide-details
                                label="Tanggal Tutup Pendaftaran"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary"
                                    :disabled="create.name == '' || (create.is_mbkm && create.application_deadline == '')"
                                    @click="save()">
                                    Tambah
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</div></template>