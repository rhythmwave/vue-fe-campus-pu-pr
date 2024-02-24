<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetStudentClassParticipantData } from '~~/types/api/student-class/GetStudentClassParticipantList';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetScheduleListData } from '~~/types/api/schedule/GetScheduleList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getScheduleList } from '~~/composables/api/schedule/getScheduleList';
import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';
import moment from 'moment';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Detail Input Nilai Per Kelas')
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
const classId = ref('')

const classParticipants = ref<GetStudentClassParticipantData[]>([])
const classDetail = ref(<GetClassroomDetail>{})
async function getClassParticipant(limit: number, page: number, search: string, class_id: string) {
    try {
        const { response: resp, error: error } = await getStudentClassParticipantList(limit, page, search, class_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classParticipants.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function classroomDetail(id: string) {
    try {
        const { response: resp, error: error } = await getClassroomDetail(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classDetail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getClassParticipant(limit, page, '', classId.value)
    await classroomDetail(classId.value)
})
</script>
<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="12" md="12" class="text-left">
                            <v-table>
                                <thead>
                                    <tr>
                                        <th colspan="2" class="text-subtitle-1 font-weight-semibold"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Program Studi</td>
                                        <td>{{ classDetail.study_program_name }}</td>
                                    </tr>
                                    <tr>
                                        <td>Semester</td>
                                        <td>{{ classDetail.semester_start_year }}</td>
                                    </tr>
                                    <tr>
                                        <td>Kode</td>
                                        <td>{{ classDetail.subject_code }}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama</td>
                                        <td>{{ classDetail.subject_name }}</td>
                                    </tr>
                                    <tr>
                                        <td>Kelas</td>
                                        <td>{{ classDetail.name }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <!-- <v-col cols="12" lg="4" md="6">
                            <v-select v-model="studyProgramId" variant="outlined" hide-details :items="studyPrograms" item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="semesterId" variant="outlined" hide-details :items="semesters" item-value="id" item-title="school_year" label="Pilih Semester"></v-select>
                        </v-col> -->
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <nuxt-Link class="text-decoration-none color-inherits" :to="{path:`/backoffice/input-value/input-value-per-class/${classDetail.id}/input`, query:{subject_id: classDetail.subject_id, study_level_id: classDetail.study_level_id}}">
                                <v-btn color="primary mr-2" flat class="ml-auto">
                                    <v-icon class="mr-2">
                                        mdi-plus
                                    </v-icon>Input Nilai Kolektif
                                </v-btn>
                            </nuxt-Link>
                            <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/input-value/input-value-per-class'">
                                <v-btn color="warning" flat class="ml-auto">
                                    <v-Icon class="mr-2">
                                        mdi-keyboard-backspace
                                    </v-Icon>Kembali
                                </v-btn>
                            </nuxt-Link>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Ke</th>
                    <th class="text-subtitle-1 font-weight-semibold">Bobot Nilai</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Pengubah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tanggal Pengubah</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in classParticipants">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.subject_repetition }}</td>
                    <td>{{ item.grade_point }}</td>
                    <td>{{ item.grade_code }}</td>
                    <td>{{ item.graded_by_admin_name ? item.graded_by_admin_name : item.graded_by_lecturer_name }}</td>
                    <td>{{ item.graded_at ? formatYearMonthDate(item.graded_at) : '' }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>