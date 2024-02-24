<script setup lang="ts">
import { getLecturerAssignedScheduleList } from '~~/composables/api/lecturer-class/getLecturerAssignedScheduleList';
import { ErrorRoot } from '~~/types/api/error';
import { GetLecturerAssignedScheduleListData } from '~~/types/api/lecturer-class/GetLecturerAssignedScheduleList';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertNumberTimeToString } from '~~/utils/helpers/time-utils';

import moment from 'moment';
const props = defineProps({
    title: String,
    classId: String,
});
onMounted(async () => {
    getLecturerAssignedScheduleListData(<string>props.classId)
})
const LecturerAssignedScheduleLists = ref(<GetLecturerAssignedScheduleListData>{
    study_program_name: '',
    subject_code: '',
    subject_name: '',
    semester_package: 0,
    theory_credit: 0,
    practicum_credit: 0,
    field_practicum_credit: 0,
    subject_minimum_passing_grade_point: 0,
    subject_is_mandatory: false,
    maximum_participant: 0,
    prerequisite_subjects: [],
    single_day_schedules: [],
    midterm_exam_date: "",
    midterm_start_time: 0,
    midterm_end_time: 0,
    midterm_room_name: "",
    endterm_exam_date: "",
    endterm_start_time: 0,
    endterm_end_time: 0,
    endterm_room_name: "",
})
async function getLecturerAssignedScheduleListData(classId: string) {
    try {
        const { response: resp, error: error } = await getLecturerAssignedScheduleList(classId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            LecturerAssignedScheduleLists.value = resp?.data
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

        <v-table class="month-table">
            <tbody>
                <PagesBackofficeClassroomDetailItem title="PROGRAM STUDI"
                    :value="LecturerAssignedScheduleLists.study_program_name" />
                <PagesBackofficeClassroomDetailItem title="NAMA Mata Kuliah"
                    :value="LecturerAssignedScheduleLists.subject_name" />
                <PagesBackofficeClassroomDetailItem title="SEMESTER" value="2" />
                <PagesBackofficeClassroomDetailItem title="BOBOT SKS"
                    :value="(LecturerAssignedScheduleLists.theory_credit + LecturerAssignedScheduleLists.practicum_credit) + ' SKS'" />
                <PagesBackofficeClassroomDetailItem title="NILAI MINIMAL KELULUSAN"
                    :value="LecturerAssignedScheduleLists.subject_minimum_passing_grade_point" />
                <PagesBackofficeClassroomDetailItem title="PRASYARAT"
                    :value="LecturerAssignedScheduleLists.prerequisite_subjects.join(', ')" />
                <PagesBackofficeClassroomDetailItem title="SIFAT Mata Kuliah"
                    :value="LecturerAssignedScheduleLists.subject_is_mandatory ? 'Wajib' : 'Pilihan'" />
                <PagesBackofficeClassroomDetailItem title="KETERANGAN"
                    value="Angkatan: semua angkatan Angka Akhir NIM: semua akhiran Rentang NIM: tidak ada nim minimal dan maksimal Peserta Maksimal: 999" />

                <tr>
                    <td>
                        <h6 class="text-h6">JADWAL KULIAH HARIAN</h6>
                    </td>
                    <td>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Jam</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Ruang</th>
                                </tr>
                            </thead>
            <tbody>
                <tr v-for="s, i in LecturerAssignedScheduleLists.single_day_schedules">
                    <td>
                        {{ convertDayOfWeek(new Date(s.date).getDay()) }},
                        {{ new Date(s.date).getDate() }}, {{ convertMonthToTextString(new Date(s.date).getMonth() + 1) }} {{ new
                            Date(s.date).getFullYear() }}
                    </td>
                    <td>{{ convertNumberTimeToString(s.start_time) }} - {{ convertNumberTimeToString(s.end_time) }}</td>
                    <td>{{ s.room_name }}</td>
                </tr>
            </tbody>
        </v-table>
        </td>
        </tr>
        <tr>
            <td>
                <h6 class="text-h6">JADWAL UJIAN TENGAH SEMESTER</h6>
            </td>
            <td>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
                            <th class="text-subtitle-1 font-weight-semibold">Jam</th>
                            <th class="text-subtitle-1 font-weight-semibold">Ruang</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {{ convertDayOfWeek(new Date(LecturerAssignedScheduleLists.midterm_exam_date).getDay()) }},
                                {{ moment(new Date(LecturerAssignedScheduleLists.midterm_exam_date)).format("DD MMMM YYYY")
                                }}
                            </td>
                            <td>{{ convertNumberTimeToString(LecturerAssignedScheduleLists.midterm_start_time) }} - {{
                                convertNumberTimeToString(LecturerAssignedScheduleLists.midterm_end_time) }}
                            </td>
                            <td>{{ LecturerAssignedScheduleLists.midterm_room_name }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </td>
        </tr>
        <tr>
            <td>
                <h6 class="text-h6">JADWAL UJIAN AKHIR SEMESTER</h6>
            </td>
            <td>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
                            <th class="text-subtitle-1 font-weight-semibold">Jam</th>
                            <th class="text-subtitle-1 font-weight-semibold">Ruang</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {{ convertDayOfWeek(new Date(LecturerAssignedScheduleLists.endterm_exam_date).getDay()) }},
                                {{ moment(new Date(LecturerAssignedScheduleLists.endterm_exam_date)).format("DD MMMM YYYY")
                                }}
                            </td>
                            <td>{{ convertNumberTimeToString(LecturerAssignedScheduleLists.endterm_start_time) }} - {{
                                convertNumberTimeToString(LecturerAssignedScheduleLists.endterm_end_time) }}
                            </td>
                            <td>{{ LecturerAssignedScheduleLists.endterm_room_name }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </td>
        </tr>
        </tbody>
        </v-table>
    </v-card>
</template>
<style lang="scss"></style>