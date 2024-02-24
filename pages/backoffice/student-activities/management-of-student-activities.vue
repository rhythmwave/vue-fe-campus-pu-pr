<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetStudentActivityListData } from '~~/types/api/student-activity/GetStudentActivityList';
import { deleteStudentActivity } from '~~/composables/api/student-activity/deleteStudentActivity';
import { getStudentActivityList } from '~~/composables/api/student-activity/getStudentActivityList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
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
        text: 'Aktivitas Mahasiswa',
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

const page = ref({ title: 'Pengelolaan Aktivitas Mahasiswa' });
const title = ref('Pengelolaan Aktivitas Mahasiswa')

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
    await getSemesterData()
    await getAdminStudyProgramData()
    await getData(limit, 1, search.value)
})


const selectedActivityTpe = ref('')
const activityTypes = ref(<any[]>[
    {
        id: "",
        name: "Semua Jenis Aktifitas",
    },
    {
        id: "Kuliah Kerja Nyata",
        name: "Kuliah Kerja Nyata",
    },
    {
        id: "Kerja Praktek/PKL",
        name: "Kerja Praktek/PKL",
    },
    {
        id: "Aktivitas Kemahasiswaan",
        name: "Aktivitas Kemahasiswaan",
    },
    {
        id: "Program Kreativitas Mahasiswa",
        name: "Program Kreativitas Mahasiswa",
    },
    {
        id: "Kompetisi",
        name: "Kompetisi",
    },
])

const studentActivitys = ref<GetStudentActivityListData[]>([])
async function getData(limit: number, page: number, searchText: string) {
    try {
        // if (!selectedSemesters.value.id) {
        //     studentActivitys.value = []
        //     pagination.value = {
        //         page: 1,
        //         limit,
        //         prev: 1,
        //         next: 1,
        //         total_pages: 1,
        //         total_records: 0
        //     }
        //     return;
        // }
        // if (!selectedAdminStudyPrograms.value.id) {
        //     studentActivitys.value = []
        //     pagination.value = {
        //         page: 1,
        //         limit,
        //         prev: 1,
        //         next: 1,
        //         total_pages: 1,
        //         total_records: 0
        //     }
        //     return;
        // }
        search.value = searchText;
        const { response: resp, error: error } = await getStudentActivityList(limit, page, searchText, selectedActivityTpe.value, selectedAdminStudyPrograms.value.id, selectedSemesters.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentActivitys.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}


const semesters = ref<GetSemesterListData[]>([])
const selectedSemesters = ref(<GetSemesterListData>{ id: "" })
async function getSemesterData() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
            semesters.value.forEach((s) => {
                s.semester_type_year = s.semester_type + " " + s.school_year
            })
        }
    } catch (error) {
        alert(error)
    }
}

const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const selectedAdminStudyPrograms = ref(<GetAdminStudyProgramListData>{ id: "" })
async function getAdminStudyProgramData() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
const detailData = ref(<GetStudentActivityListData>{
})
function showItem(data: GetStudentActivityListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}

const updateStudentActivityId = ref('')
const updateData = ref(<GetStudentActivityListData>{
})

function editItem(data: GetStudentActivityListData) {
    mode.value = 'update'
    updateStudentActivityId.value = data.id
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateStudentActivityId.value = ""
    }, 300)
}


const deletedData = ref(<GetStudentActivityListData>{})

function deleteItem(data: GetStudentActivityListData) {
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
        const { response: deleteResponse, error } = await deleteStudentActivity(deletedData.value)
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
    console.log("wadaw")
    mode.value = 'create'
    dialogCreate.value = true
}
function closeCreate() {
    dialogCreate.value = false
}

function adminStudyProgramOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>adminStudyPrograms.value.find((x) => x.id == id)
    getData(limit, 1, search.value)
}
function semesterOnChange(id: string) {
    selectedSemesters.value = <GetSemesterListData>semesters.value.find((x) => x.id == id)
    getData(limit, 1, search.value)
}
function activityTypesOnChange(id: string) {
    selectedActivityTpe.value = id
    getData(limit, 1, search.value)
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
        <!-- <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeStudentActivityDetail :getStudentActivityListData="detailData" />
                </v-dialog>
            </v-col>
        </div> -->
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeStudentActivityCreate @reload="getData(limit, 1, search)" @close="closeCreate()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeStudentActivityUpdate @reload="getData(limit, 1, search)" @close="closeUpdate()"
                        :studentActivityId="updateStudentActivityId" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Aktivitas Mahasiswa</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-row>
                                    <h5>Aktifitas</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.title }}</div>
                                </v-row>
                                <!-- <v-row>
                                    <h5>Umur</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.age }}</div>
                                </v-row> -->


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
                <UiParentCard title="Pencarian Aktivitas Mahasiswa">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Judul Aktivitas" hide-details
                                variant="outlined" @input="getData(limit, 1, $event.target.value)"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="activityTypes" item-value="id"
                                item-title="name" label="Tipe Aktivitas"
                                @update:model-value="(sl: any) => activityTypesOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="adminStudyPrograms" item-value="id"
                                item-title="name" label="Program Studi"
                                @update:model-value="(sl: any) => adminStudyProgramOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <!-- <v-select variant="outlined" hide-details :items="semesters" item-value="id"
                                item-title="semester_type_year" label="Semester"
                                @update:model-value="(sl: any) => semesterOnChange(sl)"></v-select> -->
                            <v-select item-value="id" variant="outlined" hide-details :items="semesters"
                                label="Semester" @update:model-value="(sl: any) => semesterOnChange(sl)">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                    }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                            <li style="padding: 10px; margin: 2px;" @click="onClick">
                                                <span>{{ title.school_year }} - {{ title.semester_type
                                                }}</span>
                                            </li>
                                        </a>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Aktivitas Mahasiswa
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
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Semester</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jenis Aktifitas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Judul Aktifitas</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in studentActivitys" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <!-- <v-tooltip text="Detail">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="showItem(item)">
                                        <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip> -->
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
                    <td class="text-subtitle-1">{{ item.semester_type + " " + item.semester_school_year }}</td>
                    <td class="text-subtitle-1">{{ item.activity_type }}</td>
                    <td class="text-subtitle-1">{{ item.title }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev, search)"
                            @jumpPage="(page:any) => getData(limit, page, search)"
                            @nextPage="getData(limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>