<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetYudiciumStudentListData, GetYudiciumStudentListRequest } from '~~/types/api/yudicium/GetYudiciumStudentList';
import { deleteStudent } from '~~/composables/api/student/deleteStudent';
import { getYudiciumStudentList } from '~~/composables/api/yudicium/getYudiciumStudentList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetRegencyListData } from '~~/types/api/location/GetRegencyList';
import { getRegencyList } from '~~/composables/api/location/getRegencyList';
import { getYearBatch } from '~~/utils/helpers/graduation'

import moment from 'moment';

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
        text: 'Pengelolaan Yudicium',
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

const page = ref({ title: 'Pengelolaan Yudisium' });
const title = ref('Pengelolaan Yudisium')

const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

onMounted(async () => {
    await getAdminStudyProgram()
    await getRegencyListData();
    await getData(limit, 1)
})

const students = ref(<GetYudiciumStudentListData[]>[])
const yudidicumStudentRequests = ref(<GetYudiciumStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    semesterId: '',
})
const from = ref('')
const to = ref('')

async function getData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getYudiciumStudentList(limit, page, yudidicumStudentRequests.value)
        console.log("response data")
        console.log(resp)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
            pagination.value = resp?.pagination
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
        console.log("response stury program")
        console.log(resp)
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

const GetRegencyLists = ref<GetRegencyListData[]>([])
const selectedGetRegencyLists = ref(<GetRegencyListData>{})
async function getRegencyListData() {
    try {
        const { response: resp, error: error } = await getRegencyList(1000000, 1, "", "")
        console.log("response regency")
        console.log(resp)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            GetRegencyLists.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const detailData = ref(<GetYudiciumStudentListData>{
})
function showItem(data: GetYudiciumStudentListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}

const updateStudentId = ref('')
const updateData = ref(<GetYudiciumStudentListData>{
})

function editItem(data: GetYudiciumStudentListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateStudentId.value = ""
    }, 300)
}


const deletedData = ref(<GetYudiciumStudentListData>{})

function deleteItem(data: GetYudiciumStudentListData) {
    mode.value = 'delete'
    deletedData.value = data
    dialogDelete.value = true
}


function closeDelete() {
    dialogDelete.value = false
}

async function deleteData() {
    try {
        const { response: deleteResponse, error } = await deleteStudent(deletedData.value)
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

function create(data: GetYudiciumStudentListData) {
    mode.value = 'create'
    dialogCreate.value = true
    updateData.value = data
}
function closeCreate() {
    dialogCreate.value = false
}

function AdminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>AdminStudyPrograms.value.find((x) => x.id == id)
    yudidicumStudentRequests.value.studyProgramId = selectedAdminStudyPrograms.value.id
    getData(limit, 1)
}

watch(from, async function (value) {
    if (value != '') {
        yudidicumStudentRequests.value.studentForceFrom = value
        await getData(limit, 1)
    }
})
watch(to, async function (value) {
    if (value != '') {
        yudidicumStudentRequests.value.studentForceTo = value
        await getData(limit, 1)
    }
})

</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeYudiciumApplyDetail :getYudiciumStudentListData="detailData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeYudiciumDo @reload="getData(limit, 1)" @close="closeCreate()"
                        :getYudiciumStudentListData="updateData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeStudentUpdate @reload="getData(limit, 1)" @close="closeUpdate()"
                        :getYudiciumStudentListData="updateData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Pengelolaan Yudisium</span>
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
                                    <h5>ID</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.nim_number }}</div>
                                </v-row>


                                <v-col class="text-right">
                                    <v-card-actions class="pa-4">
                                        <v-spacer />
                                        <v-btn color="error" @click="closeDelete()">
                                            Batal
                                        </v-btn>
                                        <v-btn color="secondary" :disabled="deletedData.id == ''" @click="deleteData">
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
                <UiParentCard title="Pencarian Pengelolaan Yudisium">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-label style="margin-bottom: 5px;">Program Studi</v-label>
                            <v-select variant="outlined" hide-details :items="AdminStudyPrograms" item-value="id"
                                item-title="name" label="Program Studi"
                                @update:model-value="(sl: any) => AdminStudyProgramsOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="6" md="6">
                            <v-label style="margin-bottom: 5px;">Angkatan</v-label>
                            <v-row>
                                <v-col cols="6">
                                    <v-select v-model="from" :items="getYearBatch()" hide-details variant="outlined"
                                        label="Dari"></v-select>
                                    <!-- <v-text-field density="compact" label="Dari" hide-details variant="outlined"
                                        @input="getData(limit, 1)" v-model="yudidicumStudentRequests.studentForceFrom"
                                        type="number"></v-text-field> -->
                                </v-col>
                                <v-col cols="6">
                                    <v-select v-model="to" :items="getYearBatch()" hide-details variant="outlined"
                                        label="Sampai"></v-select>
                                    <!-- <v-text-field density="compact" label="Sampai" hide-details variant="outlined"
                                        @input="getData(limit, 1)" v-model="yudidicumStudentRequests.studentForceTo"
                                        type="number"></v-text-field> -->
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" lg="6" md="6">
                            <v-label style="margin-bottom: 5px;">NIM</v-label>
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field density="compact" label="Dari" hide-details variant="outlined"
                                        @input="getData(limit, 1)" v-model="yudidicumStudentRequests.nimNumberFrom"
                                        type="number"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field density="compact" label="Sampai" hide-details variant="outlined"
                                        @input="getData(limit, 1)" v-model="yudidicumStudentRequests.nimNumberTo"
                                        type="number"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-label style="margin-bottom: 5px;">Nama</v-label>
                            <v-text-field density="compact" label="Nama" hide-details variant="outlined"
                                @input="getData(limit, 1)" v-model="yudidicumStudentRequests.name"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <!-- <a :target="selectedAdminStudyPrograms.id ? '_blank' : ''"
                                :href="selectedAdminStudyPrograms.id ? '/backoffice/transcript/prints/transcript?req=' + JSON.stringify(studentRequests) : '#'">
                                <v-btn color="info" flat class="ml-2" :disabled="!selectedAdminStudyPrograms.id">
                                    Cetak
                                </v-btn>
                            </a> -->
                            <!-- <v-btn color="primary" flat class="ml-2" @click="create()">
                                Tambah
                            </v-btn> -->
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>

                <!-- <tr>
                    <th rowspan="2" class="text-subtitle-1 font-weight-semibold">No</th>
                    <th rowspan="2" class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th rowspan="2" class="text-subtitle-1 font-weight-semibold">Nama Lengkap</th>
                    <th rowspan="2" class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th colspan="3" class="text-subtitle-1 font-weight-semibold">Jumlah SKS</th>
                    <th rowspan="2" class="text-subtitle-1 font-weight-semibold">IPK</th>
                    <th rowspan="2" class="text-subtitle-1 font-weight-semibold">Tanggal Daftar</th>
                    <th rowspan="2" class="text-subtitle-1 font-weight-semibold">Keterangan</th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Wajib</th>
                    <th class="text-subtitle-1 font-weight-semibold">Pilihan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Total</th>
                </tr> -->
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Lengkap</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">IPK</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tanggal Daftar</th>
                    <th class="text-subtitle-1 font-weight-semibold">Keterangan</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in students" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">

                            <v-tooltip text="Yudisium">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="create(item)">
                                        <PencilIcon stroke-width=" 1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                    <td class="text-subtitle-1">{{ item.nim_number }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.study_program_name }}</td>
                    <td class="text-subtitle-1">{{ item.total_credit }}</td>
                    <td class="text-subtitle-1">{{ item.gpa }}</td>
                    <td class="text-subtitle-1">{{ moment(new Date(item.application_date)).format("DD MM YYYY") }}</td>
                    <td class="text-subtitle-1">{{ item.done_yudicium ? "Telah Yudisium" : "Belum Yudisium" }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev)" @jumpPage="(page: any) => getData(limit, page)"
                            @nextPage="getData(limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>