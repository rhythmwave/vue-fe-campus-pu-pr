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
        text: 'Bimbingan Akademik',
        disabled: true,
        href: '#'
    }
]);


const valid = ref(true)
const mode = ref('list')
const dialogUpdate = ref(false)
const dialogUpdateColective = ref(false)
const dialogShow = ref(false)

const page = ref({ title: 'Daftar Bimbingan Akademik' });
const title = ref('Daftar Bimbingan Akademik')

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
    status: [],
    getAcademicGuidance: true,
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
const selectedAdminStudyPrograms = ref(<GetAdminStudyProgramListData>{
    id:"",
    name:""
})
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
    updateData.value = data
    mode.value = 'update'
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateStudentId.value = ""
    }, 300)
}


const updateColectivedData = ref(<GetStudentListData>{})

function updateColectiveItem() {
    mode.value = 'updateColective'
    dialogUpdateColective.value = true
}


function closeUpdateColective() {
    dialogUpdateColective.value = false
}

function AdminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>AdminStudyPrograms.value.find((x) => x.id == id)
    studentRequests.value.studyProgramId = selectedAdminStudyPrograms.value.id
    getData(limit, 1)
}

</script>

<template>
    <div>
        <!-- <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeStudentDetail :getStudentListData="detailData" />
                </v-dialog>
            </v-col>
        </div> -->
        <div v-if="mode == 'updateColective'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdateColective" max-width="800">
                    <PagesBackofficeAcademicGuidanceUpsert :studyProgramId="studentRequests.studyProgramId" @reload="getData(limit, 1)" @close="closeUpdateColective()"
                        />
                </v-dialog>
            </v-col>
        </div>
        <!-- <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeAcademicGuidanceUpdateStudentGuidance @reload="getData(limit, 1)" @close="closeUpdate()"
                        :getStudentListData="updateData" :studyProgramId="updateData.study_program_id" />
                </v-dialog>
            </v-col>
        </div> -->
        <!-- <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdateColective" max-width="800">
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
                                        <v-btn color="error" @click="closeUpdateColective()">
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
        </div> -->
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
                        <v-col cols="12" lg="4" md="6">
                            <v-label style="margin-bottom: 5px;">Nama</v-label>
                            <v-text-field density="compact" label="Nama" hide-details variant="outlined"
                                @input="getData(limit, 1)" v-model="studentRequests.name"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <div>
                            <v-btn color="primary" flat class="ml-3" @click="updateColectiveItem()">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Ubah Kolektif
                            </v-btn>
                        </div>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>

        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <!-- <th class="text-subtitle-1 font-weight-semibold">Aksi</th> -->
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Angkatan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Lengkap</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Dosen Pembimbing Akademik</th>
                    <!-- <th class="text-subtitle-1 font-weight-semibold">Status TA</th> -->
                    <!-- <th class="text-subtitle-1 font-weight-semibold">Dosen Pembimbing Tugas Akhir</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in students" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <!-- <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Ubah">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="editItem(item)">
                                        <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td> -->
                    <td class="text-subtitle-1">{{ item.nim_number }}</td>
                    <td class="text-subtitle-1">{{ item.student_force }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.dikti_study_program_code }}</td>
                    <td class="text-subtitle-1">{{ item.academic_guidance_lecturer_name }}</td>
                    <!-- <td class="text-subtitle-1">{{ item.final }}</td> -->
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