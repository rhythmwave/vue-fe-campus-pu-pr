<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetStudentListData, GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { deleteStudent } from '~~/composables/api/student/deleteStudent';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetRegencyListData } from '~~/types/api/location/GetRegencyList';
import { getRegencyList } from '~~/composables/api/location/getRegencyList';

const route = useRoute()
definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const breadcrumbs = ref([
    {
        text: 'Mahasiswa',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Mahasiswa',
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
const status = ref('')
const page = ref({ title: 'Daftar Mahasiswa' });
const title = ref('Daftar Mahasiswa')

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

const students = ref(<GetStudentListData[]>[])
const studentRequests = ref(<GetStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    address: '',
    regencyId: '',
    status: ['MBKM'],
    getAcademicGuidance: '',
    hasAuthentication: '',
    studyPlanSemesterId: '',
    studyPlanIsApproved: '',
    studyPlanIsSubmitted: '',
    hasStudyPlan: '',
    statusSemesterId: '',
    isRegistered: '',
    hasPaid: '',
    isGraduateEligible: '',
    isThesisEligible: '',
    yudiciumSessionId: '',
})
async function getData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, studentRequests.value)
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

const detailData = ref(<GetStudentListData>{
})
function showItem(data: GetStudentListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}

const updateStudentId = ref('')
const updateData = ref(<GetStudentListData>{
})

function editItem(data: GetStudentListData) {
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


const deletedData = ref(<GetStudentListData>{})

function deleteItem(data: GetStudentListData) {
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

function create() {
    mode.value = 'create'
    dialogCreate.value = true
}
function closeCreate() {
    dialogCreate.value = false
}

function AdminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>AdminStudyPrograms.value.find((x) => x.id == id)
    studentRequests.value.studyProgramId = selectedAdminStudyPrograms.value.id
    getData(limit, 1)
}
function GetRegencyListsOnChange(id: string) {
    selectedGetRegencyLists.value = <GetRegencyListData>GetRegencyLists.value.find((x) => x.id == id)
    studentRequests.value.regencyId = selectedGetRegencyLists.value.id
    getData(limit, 1)
}
async function updateStudent(item: string){
    if(studentRequests.value.studyProgramId == ''){
        alert('Pilih Program Studi Terlebih Dahulu')
        return false
    }
    status.value = item
    mode.value = 'update-status'
    dialogShow.value = true
}
async function close(){
    dialogShow.value = false
}

</script>

<template>
    <div>
        <div v-if="mode == 'update-status'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeStudentUpdateStatus :studyProgramId="studentRequests.studyProgramId" :isMbkm="true" :status="status" @close="close" @reload="getData(limit, pagination.page)" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeStudentDetail :getStudentListData="detailData" />
                </v-dialog>
            </v-col>
        </div>
        <!-- <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeStudentCreate @reload="getData(limit, 1)" @close="closeCreate()" />
                </v-dialog>
            </v-col>
        </div> -->
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeStudentUpdate @reload="getData(limit, 1)" @close="closeUpdate()"
                        :getStudentListData="updateData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Mahasiswa</span>
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
                <UiParentCard title="Pencarian Mahasiswa">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-label style="margin-bottom: 5px;">Program Studi</v-label>
                            <v-select variant="outlined" hide-details :items="AdminStudyPrograms" item-value="id"
                                item-title="name" label="Program Studi"
                                @update:model-value="(sl: any) => AdminStudyProgramsOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-label style="margin-bottom: 5px;">Angkatan</v-label>
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field density="compact" label="Dari" hide-details variant="outlined"
                                        @input="getData(limit, 1)" v-model="studentRequests.studentForceFrom"
                                        type="number"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field density="compact" label="Sampai" hide-details variant="outlined"
                                        @input="getData(limit, 1)" v-model="studentRequests.studentForceTo"
                                        type="number"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-label style="margin-bottom: 5px;">NIM</v-label>
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field density="compact" label="Dari" hide-details variant="outlined"
                                        @input="getData(limit, 1)" v-model="studentRequests.nimNumberFrom"
                                        type="number"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field density="compact" label="Sampai" hide-details variant="outlined"
                                        @input="getData(limit, 1)" v-model="studentRequests.nimNumberTo"
                                        type="number"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-label style="margin-bottom: 5px;">Nama</v-label>
                            <v-text-field density="compact" label="Nama" hide-details variant="outlined"
                                @input="getData(limit, 1)" v-model="studentRequests.name"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-label style="margin-bottom: 5px;">Alamat</v-label>
                            <v-text-field density="compact" label="Alamat" hide-details variant="outlined"
                                @input="getData(limit, 1)" v-model="studentRequests.address"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="3" md="3">
                            <v-label style="margin-bottom: 5px;">Kota</v-label>
                            <v-select variant="outlined" hide-details :items="GetRegencyLists" item-value="id"
                                item-title="name" label="Kota"
                                @update:model-value="(sl: any) => GetRegencyListsOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="3" md="3" class="text-right mt-7">
                            <v-btn color="primary" flat class="ml-auto" @click="updateStudent('MBKM')">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Ganti Status Jadi MBKM
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
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Angkatan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Lengkap</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kurikulum</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jenis Kelamin</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in students" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">

                            <v-tooltip text="Ubah">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="editItem(item)">
                                        <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                    <v-btn icon flat v-bind="props" @click="deleteItem(item)">
                                        <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                    <td class="text-subtitle-1">{{ item.nim_number }}</td>
                    <td class="text-subtitle-1">{{ item.student_force }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.study_program_name }}</td>
                    <td class="text-subtitle-1">{{ item.curriculum_name }}</td>
                    <td class="text-subtitle-1">{{ item.sex }}</td>
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