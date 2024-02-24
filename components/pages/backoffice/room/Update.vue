<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { updateRoom } from '~~/composables/api/room/updateRoom';
import { ErrorRoot } from '~~/types/api/error';
import { UpdateRoomRequest } from '~~/types/api/room/UpdateRoom';
import { GetRoomListData } from '~~/types/api/room/GetRoomList';
import { GetBuildingDetaiData } from '~~/types/api/building/GetBuildingDetail';
import { getRoomDetail } from '~~/composables/api/room/getRoomDetail';
import { GetRoomDetaiData } from '~~/types/api/room/GetRoomDetail';

const props = defineProps({
    getBuildingDetaiData: Array as any,
    getRoomListData: Array as any,
});

onMounted(async () => {
    getBuildingDetaiData.value = <GetBuildingDetaiData>props.getBuildingDetaiData
    detailRoom = <GetRoomListData>props.getRoomListData
    updateRoomRequest.value = Object.assign({}, <UpdateRoomRequest>props.getRoomListData)
    await getRoomDetailData(detailRoom.id)
    updateRoomRequest.value = Object.assign({}, <UpdateRoomRequest>roomDetailData.value)
});


const getBuildingDetaiData = ref(<GetBuildingDetaiData>{})

const valid = ref(true)


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
            console.log('test')
            console.log(resp?.data)
            roomDetailData.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const updateRoomRequest = ref(<UpdateRoomRequest>{});
let detailRoom: GetRoomListData;

const emit = defineEmits(['close', 'reload'])

async function update() {
    try {
        const { response: updateRoleResponse, error } = await updateRoom(updateRoomRequest.value)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emit('reload');
        }
        // return true;
        emit('close');
    } catch (error) {
        alert(error)
        // return false;
    }

}


const functions = ref([
    {
        id: "Administrasi/Kantor",
        name: "Administrasi/Kantor",
    },
    {
        id: "Ahli",
        name: "Ahli",
    },
    {
        id: "Asisten",
        name: "Asisten",
    },
    {
        id: "Bengkel/Workshop/Reparasi",
        name: "Bengkel/Workshop/Reparasi",
    },
    {
        id: "Buku",
        name: "Buku",
    },
    {
        id: "Dapur/Pantry",
        name: "Dapur/Pantry",
    },
    {
        id: "Di Luar Ruang",
        name: "Di Luar Ruang",
    },
    {
        id: "Dosen",
        name: "Dosen",
    },
    {
        id: "Garasi",
        name: "Garasi",
    },
    {
        id: "Gudang/Alat",
        name: "Gudang/Alat",
    },
    {
        id: "Hall/Lobby",
        name: "Hall/Lobby",
    },
    {
        id: "Ibadah",
        name: "Ibadah",
    },
    {
        id: "Istirahhat/Tidur/Ganti",
        name: "Istirahhat/Tidur/Ganti",
    },
    {
        id: "Kantin",
        name: "Kantin",
    },
    {
        id: "Ketua/Kepala",
        name: "Ketua/Kepala",
    },
    {
        id: "Klinik/Kesehatan",
        name: "Klinik/Kesehatan",
    },
    {
        id: "Komputer",
        name: "Komputer",
    },
    {
        id: "Koperasi",
        name: "Koperasi",
    },
    {
        id: "Koridor/Salasar/Teras",
        name: "Koridor/Salasar/Teras",
    },
    {
        id: "Kuliah",
        name: "Kuliah",
    },
    {
        id: "List",
        name: "List",
    },
    {
        id: "Panggung/Stage",
        name: "Panggung/Stage",
    },
    {
        id: "Parkir",
        name: "Parkir",
    },
    {
        id: "Pengelola/Receptionist",
        name: "Pengelola/Receptionist",
    },
    {
        id: "Perpustakaan",
        name: "Perpustakaan",
    },
    {
        id: "Praktikum",
        name: "Praktikum",
    },
    {
        id: "Ruang Tak Terdefinisi",
        name: "Ruang Tak Terdefinisi",
    },
    {
        id: "Security/Keamanan/Satpam/Penjaga",
        name: "Security/Keamanan/Satpam/Penjaga",
    },
    {
        id: "Sekretaris",
        name: "Sekretaris",
    },
    {
        id: "Seminar",
        name: "Seminar",
    },
    {
        id: "Senat",
        name: "Senat",
    },
    {
        id: "Studio",
        name: "Studio",
    },
    {
        id: "Tamu",
        name: "Tamu",
    },
    {
        id: "Tangga",
        name: "Tangga",
    },
    {
        id: "Toilet/Lavatory",
        name: "Toilet/Lavatory",
    },
    {
        id: "Wakil",
        name: "Wakil",
    },
])

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Ubah Ruangan</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-label text="Kode Gedung : "></v-label> {{ getBuildingDetaiData.code }}
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateRoomRequest.code" variant="outlined" hide-details
                                label="Kode Ruang(*)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateRoomRequest.name" variant="outlined" hide-details
                                label="Nama Ruang" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="updateRoomRequest.capacity" type="number" variant="outlined"
                                hide-details label="Kapasitas" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="updateRoomRequest.exam_capacity" type="number" variant="outlined"
                                hide-details label="Kapasitas Ujian" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label text="Status Kelayakan"></v-label>
                            <v-radio-group v-model="updateRoomRequest.is_usable" inline hide-details="auto">
                                <v-radio label="Layak Pakai" :value="true" color="primary"></v-radio>
                                <v-radio label="Tidak Layak Pakai" :value="false" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="updateRoomRequest.area" type="number" variant="outlined"
                                hide-details label="Luas(m2)" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="updateRoomRequest.phone_number" variant="outlined" hide-details
                                label="Telepon" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea outlined v-model="updateRoomRequest.facility" label="Fasilitas" variant="outlined"
                                hide-details></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea outlined v-model="updateRoomRequest.remarks" label="Catatan" variant="outlined"
                                hide-details></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="functions" item-value="id" item-title="name"
                                label="Fungsi" v-model="updateRoomRequest.purpose"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" :disabled="updateRoomRequest.name == ''" @click="update(); ">
                                    Ubah
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>