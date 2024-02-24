<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetBuildingListData } from '~~/types/api/building/GetBuildingList';
import { deleteBuilding } from '~~/composables/api/building/deleteBuilding';
import { getBuildingList } from '~~/composables/api/building/getBuildingList';

const route = useRoute()
definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Manajemen Gedung')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: title.value,
        disabled: true,
        href: '#'
    }
]);


const valid = ref(true)
const mode = ref('list')
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const dialogShow = ref(false)

const limit = 20
const search = ref('')
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

onMounted(async () => {
    await getData(limit, 1, search.value)
})

const buildings = ref<GetBuildingListData[]>([])
async function getData(limit: number, page: number, searchText: string) {
    try {
        search.value = searchText;
        const { response: resp, error: error } = await getBuildingList(limit, page, searchText)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            buildings.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}


const updateBuildingId = ref('')
const updateData = ref(<GetBuildingListData>{
})

function editItem(data: GetBuildingListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateBuildingId.value = ""
    }, 300)
}


const deletedData = ref(<GetBuildingListData>{})

function deleteItem(data: GetBuildingListData) {
    mode.value = 'delete'
    deletedData.value = data
    console.log(data)
    dialogDelete.value = true
}


function closeDelete() {
    dialogDelete.value = false
}

async function deleteItm() {
    try {
        const { response: deleteResponse, error } = await deleteBuilding(deletedData.value)
        if (error) {
            let dataError = <ErrorRoot>error.data;
            alert(dataError.meta.message);
            return;
        }
        // return true;
    } catch (error) {
        alert(error)
        // return false;
    }
    closeDelete()
    getData(limit, 1, search.value)
}

function create() {
    mode.value = 'create'
    dialogCreate.value = true
}
function closeCreate() {
    dialogCreate.value = false
}

</script>

<template>
    <div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeBuildingCreate @reload="getData(limit, 1, search)" @close="closeCreate()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeBuildingUpdate @reload="getData(limit, 1, search)" @close="closeUpdate()"
                        :getBuildingListData="updateData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Gedung</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-row>
                                    <h5>Kode</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.code }}</div>
                                </v-row>
                                <v-row>
                                    <h5>Name</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.name }}</div>
                                </v-row>
                                <v-row>
                                    <h5>Tingkatan</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.level == 'faculty' ? 'Fakultas' : 'Jurusan' }}</div>
                                </v-row>
                                <v-row>
                                    <h5>Fakultas</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.faculty_name }}</div>
                                </v-row>
                                <v-row v-if="deletedData.level == 'major'">
                                    <h5>Jurusan</h5>
                                </v-row>
                                <v-row v-if="deletedData.level == 'major'">
                                    <div>{{ deletedData.major_name }}</div>
                                </v-row>


                                <v-col class="text-right">
                                    <v-card-actions class="pa-4">
                                        <v-spacer />
                                        <v-btn color="error" @click="closeDelete()">
                                            Batal
                                        </v-btn>
                                        <v-btn color="secondary" :disabled="deletedData.id == ''" @click="deleteItm()">
                                            Hapus
                                        </v-btn>
                                    </v-card-actions>
                                </v-col>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Daftar Gedung">
                    <v-row>
                        <v-col cols="12">
                            <v-col lg="4" md="4">
                                <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                    @input="getData(limit, 1, $event.target.value)"></v-text-field>
                            </v-col>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-col lg="12" md="12">
                                <v-btn color="primary" flat class="ml-2" @click="create()">
                                    <v-icon class="mr-2">
                                        mdi-account-multiple-plus
                                    </v-icon>Tambah Gedung
                                </v-btn>
                                <nuxt-link :to="'/backoffice/space-management/building-management/print'" target="_blank">
                                    <v-btn color="primary" flat class="ml-2">
                                        <v-icon class="mr-2">
                                            mdi-printer
                                        </v-icon>Cetak
                                    </v-btn>
                                </nuxt-link>
                            </v-col>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tingkat</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Tingkat</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in buildings" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Ubah">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="editItem(item)">
                                        <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Hapus">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="deleteItem(item)">
                                        <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                    <td class="text-subtitle-1">{{ item.code }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ !item.major_id ? 'Fakultas' : 'Jurusan' }}</td>
                    <td class="text-subtitle-1">{{ !item.major_id ? item.faculty_name : item.major_name }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getData(limit, page, search)"
                            @nextPage="getData(limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>