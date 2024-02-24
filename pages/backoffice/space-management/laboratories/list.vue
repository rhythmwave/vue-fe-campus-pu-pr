<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetLaboratoryListData } from '~~/types/api/laboratory/GetLaboratoryList';
import { deleteLaboratory } from '~~/composables/api/laboratory/deleteLaboratory';
import { getLaboratoryList } from '~~/composables/api/laboratory/getLaboratoryList';
import { GetBuildingDetaiData } from '~~/types/api/building/GetBuildingDetail';
import { getBuildingDetail } from '~~/composables/api/building/getBuildingDetail';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Manajemen Ruang/Laboratorium',
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

const page = ref({ title: 'Manajemen Ruang/Laboratorium' });
const title = ref('Manajemen Ruang/Laboratorium')


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
    await getBuildingDetailData(<string>route.query.id)
})


const route = useRoute()
const laboratorys = ref<GetLaboratoryListData[]>([])
async function getData(limit: number, page: number, searchText: string) {
    console.log(route.fullPath)
    try {
        search.value = searchText;
        const { response: resp, error: error } = await getLaboratoryList(limit, page, searchText, <string>route.query.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            laboratorys.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}


const buildingDetailData = ref(<GetBuildingDetaiData>{
    id: '',
    level: '',
    faculty_id: '',
    faculty_name: '',
    major_id: '',
    major_name: '',
    code: '',
    name: '',
})
async function getBuildingDetailData(id: string)  {
    try {
        const { response: resp, error: error } = await getBuildingDetail(<string>route.query.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            console.log('test')
            console.log(resp?.data)
            buildingDetailData.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const detailData = ref(<GetLaboratoryListData>{
})
function showItem(data: GetLaboratoryListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}

const updateLaboratoryId = ref('')
const updateData = ref(<GetLaboratoryListData>{
})

function editItem(data: GetLaboratoryListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateLaboratoryId.value = ""
    }, 300)
}


const deletedData = ref(<GetLaboratoryListData>{})

function deleteItem(data: GetLaboratoryListData) {
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
        const { response: deleteResponse, error } = await deleteLaboratory(deletedData.value)
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
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeLaboratoryDetail :getLaboratoryListData="detailData" :getBuildingDetaiData="buildingDetailData"/>
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeLaboratoryCreate @reload="getData(limit, 1, search)" @close="closeCreate()" 
                    :getBuildingDetaiData="buildingDetailData"/>
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeLaboratoryUpdate @reload="getData(limit, 1, search)" @close="closeUpdate()"
                        :getLaboratoryListData="updateData" :getBuildingDetaiData="buildingDetailData"/>
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Laboratorium</span>
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
                                    <h5>Nama</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.name }}</div>
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
                <UiParentCard title="Daftar Laboratorium">
                    <v-row>
                        <v-col cols="12" lg="12" md="12">
                           <v-label text="Pengelola"></v-label> : {{ buildingDetailData.faculty_name }}
                        </v-col>
                        <v-col cols="12" lg="12" md="12">
                           <v-label text="Kode Gedung"></v-label> : {{ buildingDetailData.code }}
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                @input="getData(limit, 1, $event.target.value)"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="8" md="6" class="text-right">
                            <v-btn color="primary" flat class="ml-auto mr-2" @click="create()">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Laboratorium
                            </v-btn>
                            <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/space-management/lab-management'">
                                <v-btn color="warning" flat class="ml-auto">
                                    <v-Icon class="mr-2">
                                        mdi-keyboard-backspace
                                    </v-Icon>Kembali
                                </v-btn>
                            </nuxt-Link>
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
                    <th class="text-subtitle-1 font-weight-semibold">Kode Ruang</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Ruang</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kapasitas</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in laboratorys" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Detail">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="showItem(item)">
                                        <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
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
                    <td class="text-subtitle-1">{{ item.capacity }}</td>
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