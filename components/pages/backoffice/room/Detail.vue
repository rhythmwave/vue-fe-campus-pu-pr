
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { getRoomDetail } from '~~/composables/api/room/getRoomDetail';
import { GetBuildingDetaiData } from '~~/types/api/building/GetBuildingDetail';
import { ErrorRoot } from '~~/types/api/error';
import { GetRoomDetaiData } from '~~/types/api/room/GetRoomDetail';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';

const props = defineProps({
    getRoomListData: Array as any,
    getBuildingDetaiData: Array as any,
});

onMounted(async () => {
    getBuildingDetaiData.value = <GetBuildingDetaiData>props.getBuildingDetaiData
    detailRoom.value = <GetRoomListData>props.getRoomListData
    roomDetailData.value = <GetRoomDetaiData>detailRoom.value
    await getRoomDetailData(detailRoom.value.id)
});
const getBuildingDetaiData = ref(<GetBuildingDetaiData>{})
const detailRoom = ref(<GetRoomListData>{});
const roomDetailData = ref(<GetRoomDetaiData>{
    id: '',
    building_id: '',
    building_code: '',
    building_name: '',
    code: '',
    name: '',
    capacity: 0,
    exam_capacity: 0,
    purpose: '',
    is_usable: false,
    area: 0,
    phone_number: '',
    facility: '',
    remarks: '',
    owner: '',
    location: '',
    study_program_id: '',
    study_program_name: '',
    is_laboratory: false,
})
async function getRoomDetailData(id: string) {
    try {
        const { response: resp, error: error } = await getRoomDetail(<string>props.getRoomListData.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            roomDetailData.value = resp?.data
            console.log('test')
            console.log(resp?.data)
        }
    } catch (error) {
        alert(error)
    }
}

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Ruangan</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama Ruang" :value="getBuildingDetaiData.name" />
                <PagesStudyProgramsDetailItem title="Kode Gedung" :value="getBuildingDetaiData.code" />
                <PagesStudyProgramsDetailItem title="Kode Ruang" :value="roomDetailData.code" />
                <PagesStudyProgramsDetailItem title="Kapasitas" :value="roomDetailData.capacity.toString()" />
                <PagesStudyProgramsDetailItem title="Kapasitas Ujian" :value="roomDetailData.exam_capacity.toString()" />
                <PagesStudyProgramsDetailItem title="Guna" :value="roomDetailData.purpose" />
                <PagesStudyProgramsDetailItem title="Status Kelayakan"
                    :value="roomDetailData.is_usable ? 'Layak Pakai' : 'Tidak Layak Pakai'" />
                <PagesStudyProgramsDetailItem title="Luas(m2)" :value="roomDetailData.area.toString()" />
                <PagesStudyProgramsDetailItem title="Telepon" :value="roomDetailData.phone_number" />
                <PagesStudyProgramsDetailItem title="Fasilitas" :value="roomDetailData.facility" />
                <PagesStudyProgramsDetailItem title="Catatan" :value="roomDetailData.remarks" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
