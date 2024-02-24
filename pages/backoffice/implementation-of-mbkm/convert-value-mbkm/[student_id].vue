<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import moment from 'moment';

import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetSubjectListData } from '~~/types/api/subject/GetSubjectList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { ConvertStudentMbkmRequest } from "~~/types/api/student/ConvertStudentMbkm";

import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { convertStudentMbkm } from '~~/composables/api/student/convertStudentMbkm';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const title = ref('Konversi Nilai MBKM')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: title,
    disabled: true,
    href: '#'
  }
])
const student_id = ref('')
const student_detail = ref(<GetStudentDetailData>{})
const semesters = ref(<GetSemesterListData[]>[])
const semester_id = ref('')
const subject_regular = ref(<GetSubjectListData[]>[])
const class_mbkm = ref(<GetClassroomListData[]>[])
const curriculums = ref(<GetCuriculumListData[]>[])
const curriculum_id = ref('')
const mbkm_class_id = ref('')
const destination_subject_ids = ref([])

async function studentDetail() {
    try {
        const { response: resp, error: error } = await getStudentDetail(student_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            student_detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(10000, 1, student_detail.value.study_program_id, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
            semesters.value.forEach(item => {
                item.school_year = item.school_year + ' ' + item.semester_type
                return item
            })
        }
    } catch (error) {
        alert(error)
    }
}

async function getCurriculum() {
    try {
        const { response: resp, error: error } = await getCuriculumList(10000, 1, '', student_detail.value.study_program_id)
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

async function subjectRegular() {
    try {
        const { response: resp, error: error } = await getSubjectList(100000, 1, '', [curriculum_id.value], '', '', '', '', '', false)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            subject_regular.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function classMbkm() {
    try {
        const { response: resp, error: error } = await getClassroomList(100000, 1, '', student_detail.value.study_program_id, semester_id.value, true, '', true)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            class_mbkm.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function save(){
    try {
        let req = <ConvertStudentMbkmRequest>{
            student_id: student_id.value,
            mbkm_class_id: mbkm_class_id.value,
            destination_subject_ids: destination_subject_ids.value,
        }
        const { response: createRoleResponse, error } = await convertStudentMbkm(req)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
        let router = useRouter()
        router.push('/backoffice/implementation-of-mbkm/convert-value-mbkm')
        }
    } catch (error) {
        alert(error)
    }
}

watch(curriculum_id, async function(value){
    if(value != ''){
        await subjectRegular()
        await classMbkm()
    }
})
onMounted(async () => {
    student_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await studentDetail()
    await getSemester()
    await getCurriculum()

})
</script>
<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="semester_id" variant="outlined" hide-details :items="semesters" item-value="id" item-title="school_year" label="Pilih Semester"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="curriculum_id" variant="outlined" hide-details :items="curriculums" item-value="id" item-title="name" label="Pilih Kurikulum"></v-select>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th width="100"></th>
                    <th width="100"></th>
                    <th width="100"></th>
                    <th width="100"></th>
                    <th width="100"></th>
                </tr>
                <tr>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th colspan="3" class="text-subtitle-1 font-weight-semibold">{{student_detail.name}}</th>
                </tr>
                <tr>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">Nim</th>
                    <th colspan="3" class="text-subtitle-1 font-weight-semibold">{{student_detail.nim_number}}</th>
                </tr>
                <tr>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th colspan="3" class="text-subtitle-1 font-weight-semibold">{{student_detail.study_program_name}}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="2">
                        <p class="mt-5 mb-5 ml-5">
                            <b>Dari Kelas</b>
                        </p>
                        <v-select v-model="mbkm_class_id" variant="outlined" hide-details :items="class_mbkm" item-value="id" item-title="name" label="Pilih Kelas"></v-select>
                    </td>
                    <td colspan="3">
                        <p class="mt-5 mb-5 ml-5">
                            <b>Ke Mata Kuliah</b>
                        </p>
                        <v-select v-model="destination_subject_ids" variant="outlined" hide-details :items="subject_regular" item-value="id" item-title="name" label="Pilih Mata Kuliah" multiple></v-select>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="5">
                        <v-btn title="Add" flat class="float-right" color="primary" @click="save">
                            Konversi
                        </v-btn>
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>