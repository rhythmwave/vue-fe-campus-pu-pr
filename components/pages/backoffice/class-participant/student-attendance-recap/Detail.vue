<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentParticipationListData } from '~~/types/api/lecture/GetStudentParticipation';
import { getStudentParticipationList } from '~~/composables/api/lecture/getStudentParticipationList';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils'

const props = defineProps({
    studentId: String,
    classId: String,
});
const studentId = ref('')
const classId = ref('')
const studentParticipations = ref(<GetStudentParticipationListData[]>[])
async function getStudentParticipation(limit: number, page: number, classId: string, studentId: string) {
    try {
        const { response: resp, error: error } = await getStudentParticipationList(limit, page, classId, studentId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentParticipations.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    studentId.value = <string>props.studentId
    classId.value = <string>props.classId
    await getStudentParticipation(1000, 1, classId.value, studentId.value)
});
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Rekapitulasi Kehadiran Detail per Kelas</span>
        </v-card-title>
        <v-card-text>
            <v-table class="month-table">
                <thead>
                    <tr>
                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                        <th class="text-subtitle-1 font-weight-semibold">Tanggal Rencana Pertemuan</th>
                        <th class="text-subtitle-1 font-weight-semibold">Tanggal Terlaksana</th>
                        <th class="text-subtitle-1 font-weight-semibold">Status Kehadiran</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in studentParticipations">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.lecture_plan_date ? formatYearMonthDate(item.lecture_plan_date) : '' }}</td>
                        <td>{{ item.lecture_actual_date ? formatYearMonthDate(item.lecture_actual_date) : '' }}</td>
                        <td>
                            {{ item.is_attend ? 'Hadir' : item.is_awol ? 'Alpa' : item.is_leave ? 'Izin' : item.is_sick ? 'Sakit' : 'Tidak Hadir' }}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
</template>