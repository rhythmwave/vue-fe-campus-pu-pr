<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import user1 from '/images/profile/user-1.jpg';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetCreditQuotaListData } from '~~/types/api/credit-quota/GetCreditQuotaList';
import { deleteCreditQuota } from '~~/composables/api/credit-quota/deleteCreditQuota';
import { getCreditQuotaList } from '~~/composables/api/credit-quota/getCreditQuotaList';
import { getSampleList } from '~~/composables/api/sample/getSampleList';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';

const route = useRoute()
definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const breadcrumbs = ref([
    {
        text: 'Backoffice',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Sample',
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

const page = ref({ title: 'Daftar Sample' });
const title = ref('Daftar Sample')

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
    await getSample()
    // await getData(limit, 1, search.value)
})

const creditQuotas = ref<GetCreditQuotaListData[]>([])
async function getData(limit: number, page: number, searchText: string, Sample: GetSampleListData) {
    // try {
    //     selectedSamples.value = Sample
    //     search.value = searchText;
    //     const { response: resp, error: error } = await getCreditQuotaList(limit, page, searchText, selectedSamples.value.id)
    //     if (error) {
    //         let dataError = <ErrorRoot>error;
    //         alert(dataError.meta.message);
    //         return;
    //     }
    //     if (resp != null) {
    //         creditQuotas.value = resp?.data
    //         pagination.value = resp?.pagination
    //     }
    // } catch (error) {
    //     alert(error)
    // }
}


const Samples = ref<GetSampleListData[]>([])
const selectedSamples = ref(<GetSampleListData>{})
async function getSample() {
    // try {
    //     const { response: resp, error: error } = await getSampleList(1000000, 1, "", "")
    //     if (error) {
    //         let dataError = <ErrorRoot>error;
    //         alert(dataError.meta.message);
    //         return;
    //     }
    //     if (resp != null) {
    //         Samples.value = resp?.data
    //     }
    // } catch (error) {
    //     alert(error)
    // }
}

const detailData = ref(<GetCreditQuotaListData>{
})
function showItem(data: GetCreditQuotaListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}

const updateCreditQuotaId = ref('')
const updateData = ref(<GetCreditQuotaListData>{
})

function editItem(data: GetCreditQuotaListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateCreditQuotaId.value = ""
    }, 300)
}


const deletedData = ref(<GetCreditQuotaListData>{})

function deleteItem(data: GetCreditQuotaListData) {
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
        const { response: deleteResponse, error } = await deleteCreditQuota(deletedData.value)
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
    getData(limit, 1, search.value, selectedSamples.value)
}

function create() {
    mode.value = 'create'
    dialogCreate.value = true
}
function closeCreate() {
    dialogCreate.value = false
}

function SamplesOnChange(id: string) {
    selectedSamples.value = <GetSampleListData>Samples.value.find((x) => x.id == id)

    getData(limit, 1, search.value, selectedSamples.value)
}

</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeRoomDetail :getCreditQuotaListData="detailData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeRoomCreate @reload="getData(limit, 1, search, selectedSamples)"
                        @close="closeCreate()" :Sample="selectedSamples" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeRoomUpdate @reload="getData(limit, 1, search, selectedSamples)"
                        @close="closeUpdate()" :Sample="selectedSamples"
                        :getCreditQuotaListData="updateData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Jenis Komponen Nilai</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-row>
                                    <h5>Nama</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.name }}</div>
                                </v-row>
                                <v-row>
                                    <h5>Umur</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.age }}</div>
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
                <UiParentCard title="Pencarian Jenis Komponen Nilai">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="Samples" item-value="id"
                                item-title="name" label="Options"
                                @update:model-value="(sl: any) => SamplesOnChange(sl)"></v-select>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Daftar Samples">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                @input="getData(limit, 1, $event.target.value, selectedSamples)"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="8" md="6" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()"
                                :disabled="!selectedSamples.id">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Samples
                            </v-btn>
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
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Umur</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in creditQuotas" :key="item.id">
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
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.age }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev, search, selectedSamples)"
                            @jumpPage="(page) => getData(limit, page, search, selectedSamples)"
                            @nextPage="getData(limit, pagination.next, search, selectedSamples)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>