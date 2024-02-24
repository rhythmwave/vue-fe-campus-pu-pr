<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils'

import { GetRoomListData } from '~~/types/api/room/GetRoomList';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';

import { getRoomList } from '~~/composables/api/room/getRoomList';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';


definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const buildings = ref<GetBuildingListData[]>([])
const rooms = ref<GetRoomListData[]>([])
const arr_rooms = ref<GetRoomListData[]>([])

async function getBuilding() {
    try {
        const { response: resp, error: error } = await getBuildingList(10000, 1, '')
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

async function getRoom(building_id: string) {
    try {
        const { response: resp, error: error } = await getRoomList(10000, 1, '', building_id, '', '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            rooms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    await getBuilding()
    for (let index = 0; index < buildings.value.length; index++) {
        const element = buildings.value[index];
        await getRoom(element.id)
        for (let i = 0; i < rooms.value.length; i++) {
            arr_rooms.value.push(<GetRoomListData>{
                id: rooms.value[i].id,
                code: rooms.value[i].code,
                name: rooms.value[i].name,
                capacity: rooms.value[i].capacity,
                is_laboratory: rooms.value[i].is_laboratory,
                building_id: element.id,
            })
        }
    }
    await delay(1000)
    window.print()
})
</script>
<template>
    <div>
        <table class="table" v-for="(itm, indx) in buildings">
            <thead>
                <tr>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_dinas.jpg" style="width: 100%;" />
                    </th>
                    <th colspan="3">
                        <p style="letter-spacing: 1px">KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT</p>
                        <p style="letter-spacing: 0px">BADAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                        <p style="letter-spacing: 7px"><b>POLITEKNIK PEKERJAAN UMUM</b></p>
                        <p style="letter-spacing: 0px">Jalan Prof. Soedarto, SH No.15 Tembalang, Semarang 50275, Telp/Fax.024-7472848</p>
                        <p style="letter-spacing: 1.5px">Web : www.politeknikpu.ac.id, e-mail : info@politeknikpu.ac.id</p>
                    </th>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_semarang.png" style="width: 100%;" />
                    </th>
                </tr>
                <tr>
                    <th></th>
                    <th colspan="3">
                        <p><b>DAFTAR GEDUNG</b></p>
                    </th>
                    <th></th>
                </tr>
                <tr style="text-align: left;">
                    <th>
                        <p>Kode Gedung</p>
                        <p>Nama Gedung</p>
                        <p>Pengelola</p>
                    </th>
                    <th>
                        <p>{{ itm.code }}</p>
                        <p>{{ itm.name }}</p>
                        <p>{{ itm.level }}</p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th colspan="3" class="font-size-10 head-title" style="text-align: center;">Ruang</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center;">Kapasitas</th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title">Kode</th>
                    <th class="font-size-10 head-title">Nama</th>
                    <th class="font-size-10 head-title">Guna</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in arr_rooms">
                    <td v-if="item.building_id == itm.id">{{ index + 1 }}</td>
                    <td v-if="item.building_id == itm.id">{{ item.code }}</td>
                    <td v-if="item.building_id == itm.id">{{ item.name }}</td>
                    <td v-if="item.building_id == itm.id">{{ item.is_laboratory ? 'Lab' : 'Kuliah' }}</td>
                    <td v-if="item.building_id == itm.id">{{ item.capacity }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3"></td>
                    <td colspan="2" class="text-right">
                        <div class="text-center" style="margin: 0px 50px 0px 0px;">
                            <p>{{ new Date().getDate() }}, {{ convertMonthToTextString(new Date().getMonth() + 1) }} {{ new Date().getFullYear() }}</p>
                            <p>..................................................</p>
                            <p style="margin-top: 100px; border-bottom:1px solid">..................................................</p>
                            <p>NIDN: ........................................</p>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
<style scoped>
table {
    font-family: 'Tahoma' !important;
    font-size: 10px;
}
table > thead > tr > th {
    font-size: 12px;
}
table {
    background-color: transparent;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
}
.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
}
.head-title {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    border: 1px solid #2d2d2d;
}
.table > tbody > tr > td {
    border: 1px solid #2d2d2d;
}
table {
    border-spacing: 0;
    border-collapse: collapse;
}
td, th {
    padding: 0;
}
th {
    font-weight: 400;
}
.table {
    border-collapse: collapse !important;
}
.table td, .table th {
    background-color: #fff !important;
}
.font-size-10{
    font-size: 10px;
}
table { 
    page-break-inside:avoid;
    page-break-after: always;
}
</style>