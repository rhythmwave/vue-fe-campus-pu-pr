<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/backoffice/backofficeTypes';
import { GetAccreditationListData } from '~~/types/api/admin-study-program/GetAccreditationList';
import moment from 'moment';
const route = useRoute()
definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const valid = ref(true)
const mode = ref('list')
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const dialogShow = ref(false)

const page = ref({ title: 'Daftar Akreditasi' });
const title = ref('Daftar Akreditasi')

const breadcrumbs = ref([
    {
        text: 'Backoffice',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Manajemen Program Studi Akreditasi',
        disabled: true,
        href: '/backoffice/study-program/accreditation'
    },
    {
        text: 'Daftar Akreditasi',
        disabled: true,
        href: '#'
    },
]);

const limit = 20
const search = ref('')
const accreditations = ref<GetAccreditationListData[]>([])
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

onMounted(() => {
    getData(limit, 1, search.value)
})

async function getData(limit: number, page: number, searchText: string) {

    search.value = searchText;
    try {
        const { data: resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_accreditation.AdminAccreditationHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&studyProgramId=${route.query.id}`, <any>{
            method: 'GET',
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
        accreditations.value = resp.value?.data
        pagination.value = resp.value?.pagination

    } catch (error) {
        alert(error)

    }
}

const updateAdminStudyProgramId = ref('')
const updateData = ref(<GetAccreditationListData>{})

function editItem(data: GetAccreditationListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateAdminStudyProgramId.value = ""
    }, 300)
}


const deletedData = ref(<GetAccreditationListData>{})

function deleteItem(data: GetAccreditationListData) {
    mode.value = 'delete'
    deletedData.value = data
    dialogDelete.value = true
}


function closeDelete() {
    dialogDelete.value = false
}

async function deleteItm() {

    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/study_program/admin_accreditation.AdminAccreditationHandler/Delete`, <any>{
            method: 'Delete',
            body: deletedData.value ?? {},
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                return { response: null, error: errorRoot };
            }
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return { response: null, error: errorRoot };
            }
            return { response: null, error: errorRoot };
        }
        // return { response: data.value, error: null };
    } catch (error) {
        alert(error)
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
                    <PagesAccreditationCreate :id="`${route.query.id}`" @reload="getData(limit, 1, search)"
                        @close="closeCreate()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesAccreditationUpdate @reload="getData(limit, 1, search)" @close="closeUpdate()" :id="updateData.id"
                        :accreditation="updateData.accreditation" :is_active="updateData.is_active"
                        :decree_number="updateData.decree_number" :decree_date="updateData.decree_date"
                        :decree_due_date="updateData.decree_due_date" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Akreditasi</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-row>
                                    <h5>Nomor SK</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.decree_number }}</div>
                                </v-row>
                                <v-row>
                                    <h5>Akreditasi</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.accreditation }}</div>
                                </v-row>
                                <v-row>
                                    <h5>Status</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.is_active ? 'Dipakai' : 'Tidak Dipakai' }}</div>
                                </v-row>

                                <v-col class="text-right">
                                    <v-card-actions class="pa-4">
                                        <v-spacer />
                                        <v-btn color="error" @click="closeDelete">
                                            Batal
                                        </v-btn>
                                        <v-btn color="secondary" :disabled="deletedData.id == ''" @click="deleteItm">
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
                <UiParentCard title="Daftar Akreditasi">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                @input="getData(limit, 1, $event.target.value)"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="8" md="6" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Akreditasi
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
                    <th class="text-subtitle-1 font-weight-semibold">Nomor SK</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tanggal SK</th>
                    <th class="text-subtitle-1 font-weight-semibold" width="300">Tanggal Batas Akhir Berlaku SK (Surat
                        Keputusan)
                        Akreditasi Ban</th>
                    <th class="text-subtitle-1 font-weight-semibold">Akreditasi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in accreditations" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td class="text-subtitle-1">{{ item.decree_number }}</td>
                    <td class="text-subtitle-1">{{ moment(item.decree_date).format("YYYY-MM-DD") }}</td>
                    <td class="text-subtitle-1">{{ moment(item.decree_due_date).format("YYYY-MM-DD") }}</td>
                    <td class="text-subtitle-1">{{ item.accreditation }}</td>
                    <td class="text-subtitle-1">{{ item.is_active ? "Dipakai" : "Tidak Dipakai" }}</td>
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