<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { GetLecturerDetailData } from '~~/types/api/lecturer/GetLecturerDetail';
import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';
import { getLecturerAssignedClassList } from '~~/composables/api/admin-lecturer-class/getLecturerAssignedClassList';
import { getLecturerDetail } from '~~/composables/api/lecturer/getLecturerDetail';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const limit = 20
const page = 1
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Rekap Kehadiran Dosen')
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
const semesterId = ref('')
const lecturerId = ref('')
const lecturerAssignedClasses = ref(<GetLecturerAssignedClassListData[]>([]));
const lecturer = ref(<GetLecturerDetailData>{});
const semester = ref(<GetSemesterDetailData>{});
const classId = ref('')
async function getLecturerAssignedClassData(semesterId: string, lecturerId: string) {
    try {
        const { response: resp, error: error } = await getLecturerAssignedClassList(semesterId, lecturerId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturerAssignedClasses.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function lecturerDetail(lecturer_id: string) {
    try {
        const { response: resp, error: error } = await getLecturerDetail(lecturer_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturer.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function semesterDetail(semester_id: string) {
    try {
        const { response: resp, error: error } = await getSemesterDetail(semester_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semester.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function show(class_id: string) {
    classId.value = class_id
    mode.value = 'show'
    dialog.value = true
}
onMounted(async () => {
    lecturerId.value = window.location.href.split('/')[window.location.href.split('/').length - 1].split('?')[0]
    semesterId.value = window.location.href.split('/')[window.location.href.split('/').length - 1].split('?')[1].replaceAll('semesterId=', '')
    await lecturerDetail(lecturerId.value)
    await semesterDetail(semesterId.value)
    await getLecturerAssignedClassData(semesterId.value, lecturerId.value)
})
</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeClassParticipantLecturerAttendanceRecapDetail :classId="classId" />
                </v-dialog>
            </v-col>
        </div>
        <SharedUiParentCard :title="'Data Dosen'">
            <v-row>
                <v-col cols="12" lg="12" md="12">
                    <v-table class="mt-10">
                        <thead>
                            <tr>
                                <th colspan="2" class="text-subtitle-1 font-weight-semibold">Dosen</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nama :</td>
                                <td>{{ lecturer.name }}</td>
                            </tr>
                            <tr>
                                <td>NIDN :</td>
                                <td>{{ lecturer.lecturer_number }}</td>
                            </tr>
                            <tr>
                                <td>Program Studi :</td>
                                <td>{{ lecturer.study_program_name }}</td>
                            </tr>
                            <tr>
                                <td>Semester :</td>
                                <td>{{ semester.school_year }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-col>
                <v-col cols="12" lg="12" md="12" class="text-right">
                    <nuxt-link :to="'/backoffice/class-participants/lecturer-attendance-recap'">
                        <v-btn color="error" flat class="ml-auto">
                            <v-icon class="mr-2">
                            mdi-arrow-collapse-left
                            </v-icon>Kembali
                        </v-btn>
                    </nuxt-link>
                    <nuxt-link :to="'/backoffice/class-participants/lecturer-attendance-recap/'+lecturerId+'/'+semesterId" target="_blank">
                        <v-btn color="primary" flat class="ml-2">
                            <PrinterIcon></PrinterIcon>
                            Cetak
                        </v-btn>
                    </nuxt-link>
                </v-col>
            </v-row>
        </SharedUiParentCard>
        <v-table class="mt-10">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Kehadiran</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Terlaksana</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in lecturerAssignedClasses">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_code }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.theory_credit + item.practicum_credit + item.field_practicum_credit }}</td>
                    <td>{{ item.total_attendance }}</td>
                    <td>{{ item.total_lecture_done }}</td>
                    <td>
                        <v-tooltip text="Absence Summary">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" @click="show(item.id)">
                                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                </v-btn>
                            </template>
                        </v-tooltip>   
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>