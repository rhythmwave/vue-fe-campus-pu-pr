<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { deleteSemester } from '~~/composables/api/semester/deleteSemester';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { updateSemesterActivation } from '~~/composables/api/semester/updateSemesterActivation';
import { UpdateSemesterActivationRequest } from '~~/types/api/semester/UpdateSemesterActivation';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';

const route = useRoute()
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
        text: 'Semester',
        disabled: true,
        href: '#'
    }
]);


const valid = ref(true)
const mode = ref('list')
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const dialogActivate = ref(false)
const dialogShow = ref(false)

const page = ref({ title: 'Daftar Semester Prodi' });
const title = ref('Daftar Semester Prodi')

const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

const subject_id = ref('')
onMounted(async () => {
    subject_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    // await getData(limit, 1)
    getAdminStudyProgram()
})

const semesters = ref<GetSemesterListData[]>([])
async function getData(limit: number, page: number) {
    try {
        if (!selectedAdminStudyPrograms.value.id) {
            return;
        }
        const { response: resp, error: error } = await getSemesterList(limit, page, selectedAdminStudyPrograms.value.id, '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

const detailData = ref(<GetSemesterListData>{
})
function showItem(data: GetSemesterListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}

const updateSemesterId = ref('')
const updateData = ref(<GetSemesterListData>{
})

function editItem(data: GetSemesterListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateSemesterId.value = ""
    }, 300)
}


const activatedData = ref(<GetSemesterListData>{})

function activateItem(data: GetSemesterListData) {
    mode.value = 'activate'
    activatedData.value = data
    console.log(data)
    dialogActivate.value = true
}

function closeActivate() {
    dialogActivate.value = false
}
async function activateItm() {
    try {
        const { response: activateResponse, error } = await updateSemesterActivation(<UpdateSemesterActivationRequest>{ id: activatedData.value.id, is_active: true, })
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
    closeActivate()
    getData(limit, 1)
}


const deletedData = ref(<GetSemesterListData>{})

function deleteItem(data: GetSemesterListData) {
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
        const { response: deleteResponse, error } = await deleteSemester(deletedData.value)
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
    getData(limit, 1)
}

function create() {
    mode.value = 'create'
    dialogCreate.value = true
}
function closeCreate() {
    dialogCreate.value = false
}

const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const selectedAdminStudyPrograms = ref(<GetAdminStudyProgramListData>{})
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyPrograms.value = resp?.data
            await getData(limit, 1)
        }
    } catch (error) {
        alert(error)
    }
}

function adminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>adminStudyPrograms.value.find((x) => x.id == id)

    getData(limit, 1)
}

</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeSemesterDetail :getSemesterListData="detailData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeSemesterCreate :subject_id="subject_id" @reload="getData(limit, 1)"
                        @close="closeCreate()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeSemesterUpdate :subject_id="subject_id" @reload="getData(limit, 1)"
                        @close="closeUpdate()" :getSemesterListData="updateData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Semester Prodi</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-row>
                                    <h5>Semester</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.school_year }}</div>
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
        <div v-if="mode == 'activate'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogActivate" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Aktifkan Semester</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-row>
                                    <h5>Semester</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ activatedData.school_year }}</div>
                                </v-row>


                                <v-col class="text-right">
                                    <v-card-actions class="pa-4">
                                        <v-spacer />
                                        <v-btn color="error" @click="closeActivate()">
                                            Batal
                                        </v-btn>
                                        <v-btn color="secondary" :disabled="activatedData.id == ''" @click="activateItm()">
                                            Aktifkan
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
                <UiParentCard title="Daftar Semester Prodi">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="adminStudyPrograms" item-value="id"
                                item-title="name" label="Program Studi"
                                @update:model-value="(sl: any) => adminStudyProgramsOnChange(sl)"></v-select>
                        </v-col>
                    </v-row>
                    <!-- <v-row>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Semester
                            </v-btn>
                        </v-col>
                    </v-row> -->
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tahun Ajaran</th>
                    <th class="text-subtitle-1 font-weight-semibold">Semester</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in semesters" :key="item.id">
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
                        </div>
                    </td>
                    <td class="text-subtitle-1">{{ item.school_year }}</td>
                    <td class="text-subtitle-1">{{ item.semester_start_year }}</td>
                    <td class="text-subtitle-1">{{ item.is_active ? "Aktif" : "Tidak Aktif" }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev)" @jumpPage="(page) => getData(limit, page)"
                            @nextPage="getData(limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>