<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetLectureListData } from '~~/types/api/lecture/GetLectureList';
import { getLectureList } from '~~/composables/api/lecture/getLectureList';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils'

const props = defineProps({
    classId: String,
});
const classId = ref('')
const lectures = ref(<GetLectureListData[]>[])
async function getLecture(limit: number, page: number, classId: string) {
    try {
        const { response: resp, error: error } = await getLectureList(limit, page, classId, true, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lectures.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    classId.value = <string>props.classId
    await getLecture(1000, 1, classId.value)
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
                        <th class="text-subtitle-1 font-weight-semibold">Status Mengajar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in lectures">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.lecture_plan_date ? formatYearMonthDate(item.lecture_plan_date) : '' }}</td>
                        <td>{{ item.lecture_actual_date ? formatYearMonthDate(item.lecture_actual_date) : '' }}</td>
                        <td>
                            {{ item.is_original_lecturer ? 'Dosen Kelas' : 'Dosen Pengganti' }}
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
</template>