<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { GetStudentClassRequest } from "~~/types/api/student-class/GetStudentClassRequest1";
import { GetStudentClassList } from "~~/types/api/student-class/GetStudentClassList1";
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';

import { getStudentClassList } from '~~/composables/api/student-class/getStudentClassList1';
import { ErrorRoot } from '~~/types/api/error';

const props = defineProps({
    studyPlanId: Array as any,
});
const studyPlanId = ref('')
const data = ref(<GetStudentClassList[]>[])
async function getDetail(){
    try {
        let req = <GetStudentClassRequest>{
            studyPlanId: studyPlanId.value,
            studentId: '',
            semesterId: '',
        }
        const { response: resp, error: error } = await getStudentClassList(100, 1, '', req)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            data.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    studyPlanId.value = <string>props.studyPlanId
    await getDetail()
});
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Rencana Studi</span>
        </v-card-title>
        <v-table class="month-table">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">SKS</th>
                    <th colspan="7" class="text-subtitle-1 font-weight-semibold text-center">Jadwal</th>
                </tr>
                <tr>
                    <th colspan="5" class="text-subtitle-1 font-weight-semibold"></th>
                    <th class="text-subtitle-1 font-weight-semibold">Senin</th>
                    <th class="text-subtitle-1 font-weight-semibold">Selasa</th>
                    <th class="text-subtitle-1 font-weight-semibold">Rabu</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kamis</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumat</th>
                    <th class="text-subtitle-1 font-weight-semibold">Sabtu</th>
                    <th class="text-subtitle-1 font-weight-semibold">Minggu</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.class_name }}</td>
                    <td>{{ item.subject_code }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>{{ item.subject_total_credit }}</td>
                    <td>
                        <ul v-if="item.monday_schedules.length > 0">
                            <li v-for="itm in item.monday_schedules">
                                {{ convertTimeNumberToString(itm.start_time) }} - {{ convertTimeNumberToString(itm.end_time) }} ({{ itm.room_name }})
                            </li>
                        </ul>
                        <ul v-else>-</ul>
                    </td>
                    <td>
                        <ul v-if="item.tuesday_schedules.length > 0">
                            <li v-for="itm in item.tuesday_schedules">
                                {{ convertTimeNumberToString(itm.start_time) }} - {{ convertTimeNumberToString(itm.end_time) }} ({{ itm.room_name }})
                            </li>
                        </ul>
                        <ul v-else>-</ul>
                    </td>
                    <td>
                        <ul v-if="item.wednesday_schedules.length > 0">
                            <li v-for="itm in item.wednesday_schedules">
                                {{ convertTimeNumberToString(itm.start_time) }} - {{ convertTimeNumberToString(itm.end_time) }} ({{ itm.room_name }})
                            </li>
                        </ul>
                        <ul v-else>-</ul>
                    </td>
                    <td>
                        <ul v-if="item.thursday_schedules.length > 0">
                            <li v-for="itm in item.thursday_schedules">
                                {{ convertTimeNumberToString(itm.start_time) }} - {{ convertTimeNumberToString(itm.end_time) }} ({{ itm.room_name }})
                            </li>
                        </ul>
                        <ul v-else>-</ul>
                    </td>
                    <td>
                        <ul v-if="item.friday_schedules.length > 0">
                            <li v-for="itm in item.friday_schedules">
                                {{ convertTimeNumberToString(itm.start_time) }} - {{ convertTimeNumberToString(itm.end_time) }} ({{ itm.room_name }})
                            </li>
                        </ul>
                        <ul v-else>-</ul>
                    </td>
                    <td>
                        <ul v-if="item.saturday_schedules.length > 0">
                            <li v-for="itm in item.saturday_schedules">
                                {{ convertTimeNumberToString(itm.start_time) }} - {{ convertTimeNumberToString(itm.end_time) }} ({{ itm.room_name }})
                            </li>
                        </ul>
                        <ul v-else>-</ul>
                    </td>
                    <td>
                        <ul v-if="item.sunday_schedules.length > 0">
                            <li v-for="itm in item.sunday_schedules">
                                {{ convertTimeNumberToString(itm.start_time) }} - {{ convertTimeNumberToString(itm.end_time) }} ({{ itm.room_name }})
                            </li>
                        </ul>
                        <ul v-else>-</ul>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>