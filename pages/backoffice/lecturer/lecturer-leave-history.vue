<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { ErrorRoot } from '~~/types/api/error';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetLecturerLeaveListData } from '~~/types/api/lecturer-leave/GetLecturerLeaveList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { getLecturerLeaveList } from '~~/composables/api/lecturer-leave/getLecturerLeaveList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { endLecturerLeave } from '~~/composables/api/lecturer-leave/endLecturerLeave';
import moment from 'moment';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

onMounted(async () => {

    await getAdminStudyProgramListData()
    await getSemesterListData()
    await getData(limit, 1)
})

const limit = 20
const search = ref('')
const idNationalLecturer = ref('')
const isActive = ref(false)
const pagination = ref({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const title = ref('Riwayat Cuti Dosen')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Riwayat Cuti Dosen',
        disabled: true,
        href: '#'
    }
])
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)

const dialogShow = ref(false)
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogStop = ref(false)

const GetLecturerLeaveLists = ref<GetLecturerLeaveListData[]>([])
async function getData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getLecturerLeaveList(limit, page, search.value, idNationalLecturer.value, selectedAdminStudyProgramLists.value.id, selectedSemesterLists.value.id, isActive.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            GetLecturerLeaveLists.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

const AdminStudyProgramLists = ref(<GetAdminStudyProgramListData[]>[])
const selectedAdminStudyProgramLists = ref(<GetAdminStudyProgramListData>{
    id: "",
})
async function getAdminStudyProgramListData() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            AdminStudyProgramLists.value = <GetAdminStudyProgramListData[]><unknown>resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const SemesterLists = ref(<GetSemesterListData[]>[])
const selectedSemesterLists = ref(<GetSemesterListData>{
    id: "",
})
async function getSemesterListData() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            SemesterLists.value = <GetSemesterListData[]><unknown>resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const detailData = ref(<GetLecturerLeaveListData>{
})
function showItem(data: GetLecturerLeaveListData) {
    mode.value = 'detail'
    detailData.value = data
    dialogShow.value = true
}

const updateSemesterId = ref('')
const updateData = ref(<GetLecturerLeaveListData>{
})

function editItem(data: GetLecturerLeaveListData) {
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



const stopdData = ref(<GetLecturerLeaveListData>{})

function stopItem(data: GetLecturerLeaveListData) {
    mode.value = 'stop'
    stopdData.value = data
    console.log(data)
    dialogStop.value = true
}
function closeStop() {
    dialogStop.value = false
}
async function stopItm() {
    try {
        const { response: stopResponse, error } = await endLecturerLeave(stopdData.value)
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
    closeStop()
    getData(limit, 1)
}

function create() {
    mode.value = 'create'
    dialogCreate.value = true
}
function closeCreate() {
    dialogCreate.value = false
}
function closeDetail() {
    dialogShow.value = false
}
function semesterOnchanged(semesterId: any) {
    let semester = SemesterLists.value.find((x) => { return x.id == semesterId })
    console.log(semester)
    selectedSemesterLists.value = <GetSemesterListData>semester;
    getData(limit, 1);
}
function adminStudyProgramOnchanged(adminStudyProgramId: any) {
    if (adminStudyProgramId != '') {
        let adminStudyProgram = AdminStudyProgramLists.value.find((x) => { return x.id == adminStudyProgramId })
        selectedAdminStudyProgramLists.value = <GetAdminStudyProgramListData>adminStudyProgram;
        getData(limit, 1);
    }
}
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>

<template>
    <div>
        <div v-if="mode == 'stop'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialogStop" max-width="800">
                    <VCard>
                        <VCardTitle class="pa-4 bg-secondary">
                            <span class="title text-white">Akhiri Cuti Dosen {{ stopdData.name }}?</span>
                        </VCardTitle>
                        <VCardText>
                            <VForm ref="form" v-model="valid" lazy-validation>
                                <VRow>
                                    <VCardActions class="pa-4">
                                        <VSpacer />
                                        <VBtn color="error" @click="closeStop()">
                                            Batal
                                        </VBtn>
                                        <VBtn color="secondary" :disabled="stopdData.name == ''" @click="stopItm()">
                                            Yakin
                                        </VBtn>
                                    </VCardActions>
                                </VRow>
                            </VForm>
                        </VCardText>
                    </VCard>
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeLecturerLeaveUpdate @reload="getData(limit, 1)" @close="closeUpdate()"
                        :getLecturerLeaveListData="updateData" :semesterId="selectedSemesterLists.id" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'detail'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">

                    <PagesBackofficeLecturerLeaveDetail @reload="getData(limit, 1)" @close="closeDetail()"
                        :getLecturerLeaveListData="detailData" :semesterId="selectedSemesterLists.id" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeLecturerLeaveCreate @reload="getData(limit, 1)" @close="closeCreate()"
                        :adminStudyProgram="selectedAdminStudyProgramLists" :semester="selectedSemesterLists" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title">
            <v-row>
                <v-col cols="12" lg="4" md="6">
                    <v-select variant="outlined" hide-details
                        :items="[{ id: '', name: 'Semua' }, ...AdminStudyProgramLists]" item-value="id" item-title="name"
                        label="Program Studi" @update:model-value="(c: any) => adminStudyProgramOnchanged(c)"></v-select>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                    <v-text-field density="compact" v-model="idNationalLecturer" label="NIDN" hide-details
                        variant="outlined" @input="getData(limit, 1)"></v-text-field>
                </v-col>
                <!-- <v-col cols="12" lg="4" md="6">
                    <v-select variant="outlined" hide-details
                        :items="[{ id: true, name: 'Aktif' }, { id: false, name: 'Tidak Aktif' },]" item-value="id"
                        item-title="name" label="Status Cuti" v-model="isActive"
                        @update:model-value="(c: any) => getData(limit, 1)"></v-select>
                </v-col> -->
                <v-col cols="12" lg="4" md="6">
                    <v-text-field density="compact" v-model="search" label="Nama" hide-details variant="outlined"
                        @input="getData(limit, 1)"></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                    <v-select item-value="id" variant="outlined" hide-details :items="SemesterLists" label="Pilih Semester" @update:model-value="(c: any) => semesterOnchanged(c)">
                        <template v-slot:selection="{ item }">
                            <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
                        </template>
                        <template v-slot:item="{item, props: {onClick, title, value}}">
                            <ul>
                                <li style="padding: 10px; margin: 2px;">
                                    <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                        <span @click="onClick">{{ title.school_year }} - {{ title.semester_type }}</span>
                                    </a>
                                </li>
                            </ul>
                        </template>
                    </v-select>
                    <!-- <v-select variant="outlined" hide-details :items="SemesterLists" item-value="id"
                        item-title="school_year" label="Semester"
                        @update:model-value="(c: any) => semesterOnchanged(c)"></v-select> -->
                </v-col>
            </v-row>
            <v-row>
                <VCol cols="12" lg="12" md="12" class="text-right">
                    <VBtn color="primary" flat class="ml-auto" @click="create()"
                        :disabled="selectedAdminStudyProgramLists.id == '' || selectedSemesterLists.id == ''">
                        <VIcon class="mr-2">
                            mdi-account-multiple-plus
                        </VIcon>Tambah Cuti Dosen
                    </VBtn>
                </VCol>
            </v-row>
        </SharedUiParentCard>

        <VTable class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIDN</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Mulai</th>
                    <th class="text-subtitle-1 font-weight-semibold">Berakhir</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in GetLecturerLeaveLists">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <VTooltip text="Detail">
                            <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="showItem(item)">
                                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                            </template>
                        </VTooltip>
                        <VTooltip text="Ubah" v-if="!isActive">
                            <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="editItem(item)">
                                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                            </template>
                        </VTooltip>
                        <VTooltip text="Tutup" v-if="isActive">
                            <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="stopItem(item)">
                                    <VIcon class="text-error">
                                        mdi-stop-circle
                                    </VIcon>
                                    <!-- <TrashIcon stroke-width="1.5" size="20" class="text-error" /> -->
                                </VBtn>
                            </template>
                        </VTooltip>
                    </td>
                    <td>{{ item.id_national_lecturer }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ isActive ? "Aktif" : "Tidak Aktif" }}</td>
                    <td>{{ moment(item.start_date).format("DD-MM-YYYY HH:mm") }}</td>
                    <td>{{ item.end_date ? moment(item.end_date).format("DD-MM-YYYY HH:mm") : '' }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev)" @jumpPage="(page: number) => getData(limit, page)"
                            @nextPage="getData(limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </VTable>
    </div>
</template>