<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetSubjectListData } from '~~/types/api/subject/GetSubjectList';
import { deleteSubject } from '~~/composables/api/subject/deleteSubject';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { getActiveCuriculumByStudyProgramId } from '~~/composables/api/curiculum/getActiveCuriculumByStudyProgramId';
import { GetActiveCuriculumByStudyProgramIdData } from '~~/types/api/curiculum/GetActiveCuriculumByStudyProgramId';

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
        text: 'Mata Kuliah',
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

const page = ref({ title: 'Daftar Mata Kuliah' });
const title = ref('Daftar Mata Kuliah')

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
const paginationMBKM = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

onMounted(async () => {
    await getAdminStudyProgram()
    // await getData(limit, 1, search.value)
})

const subjects = ref<GetSubjectListData[]>([])
const subjectMBKM = ref<GetSubjectListData[]>([])
async function getData(limit: number, page: number, searchText: string) {
    try {
        search.value = searchText;
        if (!ActiveCuriculumByStudyProgramId.value.id) {
            subjects.value = []
            pagination.value = <PaginationModel>{}
            return;
        }
        const { response: resp, error: error } = await getSubjectList(limit, page, searchText, [ActiveCuriculumByStudyProgramId.value.id], '', '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            subjects.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
    try {
        search.value = searchText;
        if (!ActiveCuriculumByStudyProgramId.value.id) {
            subjects.value = []
            pagination.value = <PaginationModel>{}
            return;
        }
        const { response: resp, error: error } = await getSubjectList(limit, page, searchText, [ActiveCuriculumByStudyProgramId.value.id], '', '', '', '', '', true)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            subjectMBKM.value = resp?.data
            paginationMBKM.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}


const ActiveCuriculumByStudyProgramId = ref(<GetCuriculumListData>{})
async function getActiveCuriculumByStudyProgramIdData() {
    try {
        const { response: resp, error: error } = await getActiveCuriculumByStudyProgramId(selectedAdminStudyPrograms.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            ActiveCuriculumByStudyProgramId.value = <GetCuriculumListData><unknown>resp?.data
            console.log("ActiveCuriculumByStudyProgramId.value")
            console.log(ActiveCuriculumByStudyProgramId.value)
            getData(limit, 1, search.value)
        }
    } catch (error) {
        alert(error)
    }
}

const CuriculumList = ref(<GetCuriculumListData[]>[])
async function getCuriculumListData() {
    try {
        const { response: resp, error: error } = await getCuriculumList(100000, 1, '', selectedAdminStudyPrograms.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            CuriculumList.value = <GetCuriculumListData[]>resp?.data
            getData(limit, 1, search.value)
        }
    } catch (error) {
        alert(error)
    }
}

const AdminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
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
            AdminStudyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const detailData = ref(<GetSubjectListData>{
})
function showItem(data: GetSubjectListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}

const updateSubjectId = ref('')
const updateData = ref(<GetSubjectListData>{
})

function editItem(data: GetSubjectListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateSubjectId.value = ""
    }, 300)
}


const deletedData = ref(<GetSubjectListData>{})

function deleteItem(data: GetSubjectListData) {
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
        const { response: deleteResponse, error } = await deleteSubject(deletedData.value)
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

function printSubjectPerSemester(){
    let study_program_id = ''
    let curriculum_id = ''
    if(!(typeof selectedAdminStudyPrograms.value.id === 'undefined' || selectedAdminStudyPrograms.value.id == '')){
        study_program_id = selectedAdminStudyPrograms.value.id
    }
    if(!(typeof ActiveCuriculumByStudyProgramId.value.id === 'undefined' || ActiveCuriculumByStudyProgramId.value.id == '')){
        curriculum_id = ActiveCuriculumByStudyProgramId.value.id
    }
    window.open('/backoffice/curriculum/course/'+study_program_id+'/'+curriculum_id, '_blank');
}

function printSubjectCurriculum(){
    let study_program_id = ''
    if(!(typeof selectedAdminStudyPrograms.value.id === 'undefined' || selectedAdminStudyPrograms.value.id == '')){
        study_program_id = selectedAdminStudyPrograms.value.id
    }
    window.open('/backoffice/curriculum/course/'+study_program_id, '_blank');
}

function create() {
    mode.value = 'create'
    dialogCreate.value = true
}
function closeCreate() {
    dialogCreate.value = false
}

async function AdminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>AdminStudyPrograms.value.find((x) => x.id == id)
    await getCuriculumListData()
    ActiveCuriculumByStudyProgramId.value = <GetCuriculumListData>{}
    subjects.value = []
    // await getActiveCuriculumByStudyProgramIdData()
}



</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeSubjectDetail :getSubjectListData="detailData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeSubjectCreate @reload="getData(limit, 1, search)" @close="closeCreate()"
                        :AdminStudyProgram="selectedAdminStudyPrograms" :curiculum="ActiveCuriculumByStudyProgramId" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeSubjectUpdate @reload="getData(limit, 1, search)" @close="closeUpdate()"
                        :getSubjectListData="updateData"
                        :AdminStudyProgram="selectedAdminStudyPrograms" :curiculum="ActiveCuriculumByStudyProgramId" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Mata Kuliah</span>
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
                <UiParentCard title="Program Studi">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="AdminStudyPrograms" item-value="id"
                                item-title="name" label="Program Studi"
                                @update:model-value="(sl: any) => AdminStudyProgramsOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="CuriculumList" item-value="id"
                                item-title="name" label="Kurikulum" v-model="ActiveCuriculumByStudyProgramId.id"
                                @update:model-value="(c: any) => getData(limit, 1, search)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                @input="ActiveCuriculumByStudyProgramId.id ? getData(limit, 1, $event.target.value) : () => { }"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="12" md="6" class="text-right">
                            <v-btn color="primary float-right" flat class="ml-2 mb-2" @click="create()">
                                <v-icon>
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Mata Kuliah
                            </v-btn>
                            <v-btn color="success float-right" flat class="ml-2 mb-2" @click="printSubjectPerSemester()" :disabled="typeof selectedAdminStudyPrograms.id === 'undefined' || selectedAdminStudyPrograms.id == '' || typeof ActiveCuriculumByStudyProgramId.id == 'undefined' || ActiveCuriculumByStudyProgramId.id == ''">
                                <PrinterIcon />Cetak Sebaran Mata Kuliah
                            </v-btn>
                            <v-btn color="success float-right" flat class="ml-2 mb-2" @click="printSubjectCurriculum()" :disabled="typeof selectedAdminStudyPrograms.id === 'undefined' || selectedAdminStudyPrograms.id == ''">
                                <PrinterIcon />Cetak Daftar Mata Kuliah
                            </v-btn>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <caption>Reguler</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">No</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Kurikulum</th>
                    <th class="text-subtitle-1 font-weight-semibold" colspan="2">Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Sifat</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Paket Semester</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">MBKM</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">TA</th>
                    <th class="text-subtitle-1 font-weight-semibold" colspan="3">Jumlah SKS</th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">T</th>
                    <th class="text-subtitle-1 font-weight-semibold">P</th>
                    <th class="text-subtitle-1 font-weight-semibold">PL</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" item, index  in  subjects " :key="item.id">
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
                    <td class="text-subtitle-1">{{ item.study_program_name }}</td>
                    <td class="text-subtitle-1">{{ item.curriculum_name }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.code }}</td>
                    <!-- <td class="text-subtitle-1">{{ item.trait }}</td> -->
                    <td class="text-subtitle-1">{{ item.is_mandatory ? 'Wajib' : 'Tidak Wajib' }}</td>
                    <td class="text-subtitle-1">{{ item.semester_package }}</td>
                    <td class="text-subtitle-1">{{ item.is_mbkm ? "Iya" : "Bukan" }}</td>
                    <td class="text-subtitle-1">{{ item.is_thesis ? "Iya" : "Bukan" }}</td>
                    <td class="text-subtitle-1">{{ item.theory_credit }}</td>
                    <td class="text-subtitle-1">{{ item.practicum_credit }}</td>
                    <td class="text-subtitle-1">{{ item.field_practicum_credit }}</td>
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
        <v-table class="mt-5">
            <caption>MBKM</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">No</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Kurikulum</th>
                    <th class="text-subtitle-1 font-weight-semibold" colspan="2">Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Sifat</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Paket Semester</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">MBKM</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">TA</th>
                    <th class="text-subtitle-1 font-weight-semibold" colspan="3">Jumlah SKS</th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">T</th>
                    <th class="text-subtitle-1 font-weight-semibold">P</th>
                    <th class="text-subtitle-1 font-weight-semibold">PL</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" item, index  in  subjectMBKM " :key="item.id">
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
                    <td class="text-subtitle-1">{{ item.study_program_name }}</td>
                    <td class="text-subtitle-1">{{ item.curriculum_name }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.code }}</td>
                    <!-- <td class="text-subtitle-1">{{ item.trait }}</td> -->
                    <td class="text-subtitle-1">{{ item.is_mandatory ? 'Wajib' : 'Tidak Wajib' }}</td>
                    <td class="text-subtitle-1">{{ item.semester_package }}</td>
                    <td class="text-subtitle-1">{{ item.is_mbkm ? "Iya" : "Bukan" }}</td>
                    <td class="text-subtitle-1">{{ item.is_thesis ? "Iya" : "Bukan" }}</td>
                    <td class="text-subtitle-1">{{ item.theory_credit }}</td>
                    <td class="text-subtitle-1">{{ item.practicum_credit }}</td>
                    <td class="text-subtitle-1">{{ item.field_practicum_credit }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="paginationMBKM.page" :total_pages="paginationMBKM.total_pages"
                            :total_records="paginationMBKM.total_records" :prev="paginationMBKM.prev" :next="paginationMBKM.next"
                            @prevPage="getData(limit, paginationMBKM.prev, search)"
                            @jumpPage="(page: any) => getData(limit, page, search)"
                            @nextPage="getData(limit, paginationMBKM.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>