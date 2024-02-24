<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { GetRoomScheduleData } from '~~/types/api/room/GetRoomSchedule';
import { GetRoomScheduleSchedule } from '~~/types/api/room/GetRoomSchedule';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';
import { getRoomSchedule } from '~~/composables/api/room/getRoomSchedule';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';
import { getRoomList } from '~~/composables/api/room/getRoomList';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { ErrorRoot } from '~~/types/api/error';

const props = defineProps({
    title: String,
    dataDetail: Array,
});
const room_schedules = ref<GetRoomScheduleData[]>([])
const used_room_schedules = ref<GetRoomScheduleData[]>([])
const not_used_room_schedules = ref<GetRoomScheduleData[]>([])
const buildings = ref<GetBuildingListData[]>([])
const rooms = ref<GetRoomListData[]>([])
const building_id = ref('')
const room_id = ref('')
const filter = ref({
    is_used: true,
    room_id: '',
    semester_id: '',
    day_of_week: 0,
})
async function getRoomScheduleNotUsed(){
    try {
        const { response: resp, error: error } = await getRoomSchedule(1000, 1, '', room_id.value, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            not_used_room_schedules.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getBuilding() {
    try {
        const { response: resp, error: error } = await getBuildingList(1000, 1, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            buildings.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getRoom() {
    // try {
    //     const { response: resp, error: error } = await getRoomList(1000, 1, '', building_id.value)
    //     if (error) {
    //         let dataError = <ErrorRoot>error;
    //         alert(dataError.meta.message);
    //         return;
    //     }
    //     if (resp != null) {
    //         rooms.value = resp?.data
    //     }
    // } catch (error) {
    //     alert(error)
    // }
}
async function buildingOnChange(item: any){
    if(item != ''){
        building_id.value = item
    }
    await getRoom()
}
async function roomOnChange(item: any){
    if(item != ''){
        room_id.value = item
    }
    await getRoomScheduleNotUsed()
}
watch(not_used_room_schedules, (value) => {
    for (let a = 0; a < value.length; a++) {
        for (let b = 0; b < used_room_schedules.value.length; b++) {
            if(value[a].room_id == used_room_schedules.value[b].room_id){
                for (let c = 0; c < value[a].day_of_weeks.length; c++) {
                    for (let d = 0; d < used_room_schedules.value[b].day_of_weeks.length; d++) {
                        if(value[a].day_of_weeks[c].day_of_week == used_room_schedules.value[b].day_of_weeks[d].day_of_week){
                            let schedules = ref<GetRoomScheduleSchedule[]>([])
                            for (let e = 0; e < used_room_schedules.value[b].day_of_weeks[d].schedules.length; e++) {
                                let objSchedule = ref(<GetRoomScheduleSchedule>{})
                                
                                objSchedule.value = {
                                    start_time: used_room_schedules.value[b].day_of_weeks[d].schedules[e].start_time,
                                    end_time: used_room_schedules.value[b].day_of_weeks[d].schedules[e].end_time,
                                    subject_name: used_room_schedules.value[b].day_of_weeks[d].schedules[e].subject_name,
                                    schedule_total_credit: used_room_schedules.value[b].day_of_weeks[d].schedules[e].schedule_total_credit,
                                    class_name: used_room_schedules.value[b].day_of_weeks[d].schedules[e].class_name,
                                    study_program_name: used_room_schedules.value[b].day_of_weeks[d].schedules[e].study_program_name,
                                }
                                schedules.value.push(objSchedule.value)
                                value[a].day_of_weeks[c].schedules = schedules.value
                            }
                        }
                    }
                }
            }
        }
    }
});
onMounted(async () => {
    // await getBuilding()
    // await getRoomScheduleNotUsed()
    // used_room_schedules.value = <GetRoomScheduleData[]>props.dataDetail
    
    // for (let a = 0; a < not_used_room_schedules.value.length; a++) {
    //     for (let b = 0; b < used_room_schedules.value.length; b++) {
    //         if(not_used_room_schedules.value[a].room_id == used_room_schedules.value[b].room_id){
    //             for (let c = 0; c < not_used_room_schedules.value[a].day_of_weeks.length; c++) {
    //                 for (let d = 0; d < used_room_schedules.value[b].day_of_weeks.length; d++) {
    //                     if(not_used_room_schedules.value[a].day_of_weeks[c].day_of_week == used_room_schedules.value[b].day_of_weeks[d].day_of_week){
    //                         let schedules = ref<GetRoomScheduleSchedule[]>([])
    //                         for (let e = 0; e < used_room_schedules.value[b].day_of_weeks[d].schedules.length; e++) {
    //                             let objSchedule = ref(<GetRoomScheduleSchedule>{})
                                
    //                             objSchedule.value = {
    //                                 start_time: used_room_schedules.value[b].day_of_weeks[d].schedules[e].start_time,
    //                                 end_time: used_room_schedules.value[b].day_of_weeks[d].schedules[e].end_time,
    //                                 subject_name: used_room_schedules.value[b].day_of_weeks[d].schedules[e].subject_name,
    //                                 schedule_total_credit: used_room_schedules.value[b].day_of_weeks[d].schedules[e].schedule_total_credit,
    //                                 class_name: used_room_schedules.value[b].day_of_weeks[d].schedules[e].class_name,
    //                                 study_program_name: used_room_schedules.value[b].day_of_weeks[d].schedules[e].study_program_name,
    //                             }
    //                             schedules.value.push(objSchedule.value)
    //                             not_used_room_schedules.value[a].day_of_weeks[c].schedules = schedules.value
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
})
</script>
<template>
    <div>
        <!-- <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">{{ title }}</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-col cols=6 lg="6" md="6" class="float-left">
                    <v-select variant="outlined" hide-details :items="buildings" item-value="id"
                    item-title="name" label="Pilih Gedung"
                    @update:model-value="(sl: any) => buildingOnChange(sl)"></v-select>
                </v-col>
                <v-col cols=6 lg="6" md="6" class="float-left">
                    <v-select variant="outlined" hide-details :items="rooms" item-value="id"
                    item-title="name" label="Pilih Ruangan"
                    @update:model-value="(sl: any) => roomOnChange(sl)"></v-select>
                </v-col>
                <Vspace space="3" />
                <v-col cols=12 lg="12" md="12" class="float-left">
                    <v-form ref="form" lazy-validation>
                        <v-row>
                            <v-col cols=12 lg="12" md="12">
                                <v-table class="month-table">
                                    <thead>
                                        <tr>
                                            <th>Ruangan</th>
                                            <th>Senin</th>
                                            <th>Selasa</th>
                                            <th>Rabu</th>
                                            <th>Kamis</th>
                                            <th>Jum'at</th>
                                            <th>Sabtu</th>
                                            <th>Minggu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in not_used_room_schedules">
                                            <td>{{ item.room_name }}</td>
                                            <td v-for="day in item.day_of_weeks">
                                                <ul v-for="schedule in day.schedules">
                                                    <li v-if="schedule.class_name != ''">
                                                        <p>Kelas : {{ schedule.class_name }}</p>
                                                        <p>
                                                            {{ convertTimeNumberToString(schedule.start_time) }} s/d {{ convertTimeNumberToString(schedule.end_time) }}
                                                        </p>
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-card-text>
        </v-card> -->
    </div>
</template>
<style>
    ul{
        list-style-type: none;
    }
</style>