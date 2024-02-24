<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { GetLectureDetailData } from '~~/types/api/lecturer-lecture/GetLectureDetail';
import { GetLectureListData } from '~~/types/api/lecturer-lecture/GetLectureList';
import { getLectureDetail } from '~~/composables/api/academic-portal-lecturer-lecture/getLectureDetail';
import { formatYearMonthDate, formatHourMinute } from '~~/utils/helpers/date-utils'
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week'
import { ErrorRoot } from '~~/types/api/error';

const props = defineProps({
    title: String,
    lecture: <GetLectureListData>{} as any,
});
const emit = defineEmits(['close', 'reload'])

const lecture = ref(<GetLectureListData>{})
const detail = ref(<GetLectureDetailData>{})

async function getDetail() {
    try {
        const { response: resp, error: error } = await getLectureDetail(lecture.value.id)
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
onMounted(async () => {
    lecture.value = <GetLectureListData>props.lecture
    await getDetail()
})
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">{{ title }}</span>
        </v-card-title>
        <Vspace space="3" />
        <v-table class="month-table">
            <thead>
                <tr>
                    <th colspan="2" class="text-subtitle-1 font-weight-semibold">Info Pertemuan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Mata Kuliah</td>
                    <td>{{ detail.subject_name }}</td>
                </tr>
                <tr>
                    <td>Pertemuan Ke</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>Tanggal Rencana</td>
                    <td>{{ lecture.lecture_plan_date ? convertDayOfWeek(new Date(lecture.lecture_plan_date).getDay())+', ' : '' }} {{ lecture.lecture_plan_date ? formatYearMonthDate(lecture.lecture_plan_date) : ''}}</td>
                </tr>
                <tr>
                    <td>Tanggal Pelaksanaan</td>
                    <td>{{ lecture.lecture_actual_date ? convertDayOfWeek(new Date(lecture.lecture_actual_date).getDay())+', ' : '' }} {{ lecture.lecture_actual_date ? formatYearMonthDate(lecture.lecture_actual_date) : ''}}</td>
                </tr>
                <tr>
                    <td>Jadwal Akhir Presensi</td>
                    <td>{{ lecture.autonomous_participation_start_time ? convertDayOfWeek(new Date(lecture.autonomous_participation_start_time).getDay())+', ' : '' }} {{ lecture.autonomous_participation_start_time ? formatYearMonthDate(lecture.autonomous_participation_start_time) + ' : ' + formatHourMinute(lecture.autonomous_participation_start_time) : ''}}</td>
                </tr>
                <tr>
                    <td>Tema</td>
                    <td>{{ detail.lecture_theme }}</td>
                </tr>
                <tr>
                    <td>Pokok Bahasan</td>
                    <td>{{ detail.lecture_subject }}</td>
                </tr>
                <tr>
                    <td>Keterangan</td>
                    <td>{{ detail.remarks }}</td>
                </tr>
            </tbody>
        </v-table>
        <v-table class="month-table">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kehadiran</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in detail.students">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.is_attend ? 'Hadir' : item.is_leave ? 'Izin' : item.is_sick ? 'Sakit' : item.is_awol ? 'Alpha' : '' }}</td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>