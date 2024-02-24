<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { getOfferedSchedule } from '~~/composables/api/student-class/getOfferedSchedule';
import { ErrorRoot } from '~~/types/api/error';
import { GetOfferedScheduleData } from '~~/types/api/student-class/GetOfferedSchedule';
import { GetStudentStudyPlanDetailClass, GetStudentStudyPlanDetailData } from '~~/types/api/student-study-plan/GetStudentStudyPlanDetail';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertNumberTime } from '~~/utils/helpers/convert-number-time';
import moment from 'moment';

const props = defineProps({
    title: String,
    classId: String,
    // studyPlanData: Array as any,
    // classData: Array as any,
});

onMounted(async () => {
    // studyPlan.value = Object.assign({}, props.studyPlanData)
    // classDetail.value = Object.assign({}, props.classData)
    await getOfferedScheduleData(<string>props.classId)
})

// const studyPlan = ref(<GetStudentStudyPlanDetailData>{})
// const classDetail = ref(<GetStudentStudyPlanDetailClass>{})
const offeredSchedulss = ref(<GetOfferedScheduleData>{})
async function getOfferedScheduleData(classId: string) {
    try {
        const { response: resp, error: error } = await getOfferedSchedule(classId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            offeredSchedulss.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">{{ title }}</span>
        </v-card-title>
        <v-col cols="12">
            <v-alert type="info" variant="tonal">
                Keterangan :
                <br />
                Detail Kelas merupakan informasi detail mengenai kelas-kelas yang ditawarkan untuk Mata Kuliah tertentu.
                Pembagian kelas ini diatur berdasarkan program studi, kurikulum, serta aturan-aturan akademis lainnya.
            </v-alert>
        </v-col>
        <Vspace space="3" />
        <v-table class="month-table">
            <thead>
                <tr>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">Detail Kelas Berdasar Program Studi</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Program Studi</td>
                    <td>{{ offeredSchedulss.study_program_name }}</td>
                </tr>
                <tr>
                    <td>Kode Mata Kuliah</td>
                    <td>{{ offeredSchedulss.subject_code }}</td>
                </tr>
                <tr>
                    <td>Nama Mata Kuliah</td>
                    <td>{{ offeredSchedulss.subject_name }}</td>
                </tr>
                <tr>
                    <td>Semester</td>
                    <td>{{ offeredSchedulss.semester_package }}</td>
                </tr>
                <tr>
                    <td>Bobot SKS</td>
                    <td>
                        Kuliah: {{ offeredSchedulss.theory_credit }} SKS
                        <br>
                        Praktik:
                        {{ offeredSchedulss.practicum_credit }} SKS
                    </td>
                </tr>
                <tr>
                    <td>Nilai Minimal Kelulusan</td>
                    <td> {{ offeredSchedulss.subject_minimum_passing_grade_point }} </td>
                </tr>
                <tr>
                    <td>Prasyarat</td>
                    <td>
                        <ul>
                            <li v-for="ps in  offeredSchedulss.prerequisite_subjects">{{ ps }}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>Sifat Mata Kuliah</td>
                    <td>{{ offeredSchedulss.subject_is_mandatory ? 'Wajib' : 'Optional' }}</td>
                </tr>
                <tr>
                    <td>Keterangan</td>
                    <td>Angkatan: semua angkatan <br> Angka Akhir NIM: semua akhiran <br> Rentang NIM: tidak ada nim minimal
                        dan maksimal <br> Peserta Maksimal: 999</td>
                </tr>
            </tbody>
        </v-table>
        <Vspace space="3" />
        <v-table class="month-table">
            <thead>
                <tr>
                    <th colspan="3" class="text-subtitle-1 font-weight-semibold">Jadwal Kuliah Harian</th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Hari</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jam</th>
                    <th class="text-subtitle-1 font-weight-semibold">Ruang</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="rs in  offeredSchedulss.regular_schedules">
                    <td>{{ convertDayOfWeek(rs.day_of_week) }}</td>
                    <td>{{ convertNumberTime(rs.start_time) }} - {{ convertNumberTime(rs.end_time) }}</td>
                    <td>{{ rs.room_name }}</td>
                </tr>
            </tbody>
        </v-table>
        <Vspace space="3" />
        <v-table class="month-table">
            <thead>
                <tr>
                    <th colspan="3" class="text-subtitle-1 font-weight-semibold">Jadwal Kuliah Tengah Semester</th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jam</th>
                    <th class="text-subtitle-1 font-weight-semibold">Ruang</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ offeredSchedulss.midterm_exam_date ?
                        moment(Date.parse(offeredSchedulss.midterm_exam_date)).format('DD MMM YYYY') : '' }}</td>
                    <td>{{ offeredSchedulss.midterm_start_time && offeredSchedulss.midterm_end_time ?
                        convertNumberTime(offeredSchedulss.midterm_start_time) : '' }} - {{
        offeredSchedulss.midterm_start_time && offeredSchedulss.midterm_end_time ?
        convertNumberTime(offeredSchedulss.midterm_end_time) : '' }}</td>
                    <td>{{ offeredSchedulss.midterm_room_name }}</td>
                </tr>
            </tbody>
        </v-table>
        <Vspace space="3" />
        <v-table class="month-table">
            <thead>
                <tr>
                    <th colspan="3" class="text-subtitle-1 font-weight-semibold">Jadwal Kuliah Akhir Semester</th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jam</th>
                    <th class="text-subtitle-1 font-weight-semibold">Ruang</th>
                </tr>
            </thead>
            <tbody>
                <tr>

                    <td>{{ offeredSchedulss.endterm_exam_date ?
                        moment(Date.parse(offeredSchedulss.endterm_exam_date)).format('DD MMM YYYY') : '' }}</td>
                    <td>{{ offeredSchedulss.endterm_start_time && offeredSchedulss.endterm_end_time ?
                        convertNumberTime(offeredSchedulss.endterm_start_time) : '' }} - {{
        offeredSchedulss.endterm_start_time && offeredSchedulss.endterm_end_time
        ? convertNumberTime(offeredSchedulss.endterm_end_time) : '' }}</td>
                    <td>{{ offeredSchedulss.endterm_room_name }}</td>
                </tr>
            </tbody>
        </v-table>
        <v-col cols="12">
            <v-card-actions class="pa-4">
                <v-spacer />
                <v-btn color="error" @click="$emit('close')">
                    Batal
                </v-btn>
            </v-card-actions>
        </v-col>
    </v-card>
</template>