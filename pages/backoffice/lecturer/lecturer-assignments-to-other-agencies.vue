<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { ErrorRoot } from '~~/types/api/error';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetLecturerMutationListData } from '~~/types/api/lecturer-mutation/GetLecturerMutationList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { getLecturerMutationList } from '~~/composables/api/lecturer-mutation/getLecturerMutationList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
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
const semester_id = ref('')
const pagination = ref({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const title = ref('Data Dosen Tugas Ke Instansi Lain')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Data Dosen Tugas Ke Instansi Lain',
        disabled: true,
        href: '#'
    }
])
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)

function create() {
    mode.value = 'create'
    dialog.value = true
}
function close() {
    dialog.value = false
}

const GetLecturerMutationLists = ref<GetLecturerMutationListData[]>([])
async function getData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getLecturerMutationList(limit, page, search.value, selectedAdminStudyProgramLists.value.id, idNationalLecturer.value, selectedSemesterLists.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            GetLecturerMutationLists.value = resp?.data
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
            SemesterLists.value.forEach((s) => {
                s.semester_type_year = s.semester_start_year + " " + s.semester_type
            });
        }
    } catch (error) {
        alert(error)
    }
}
getData(limit, 1)
async function AdminStudyProgramChanged(id: any) {
    AdminStudyProgramLists.value.forEach((sp) => {
        if (sp.id == id) {
            selectedAdminStudyProgramLists.value = sp;
        }
        if (sp.id == '') {
            selectedAdminStudyProgramLists.value = <GetAdminStudyProgramListData>{ id: '', name: '' };
        }
    })
    await getSemesterListData()
    await getData(limit, 1)
}
async function SemesterChanged(id: any) {
    SemesterLists.value.forEach((s) => {
        if (s.id == id) {
            selectedSemesterLists.value = s;
        }
    })
    getData(limit, 1)
}

function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>

<template>
    <div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeLecturerMutationCreate @reload="getData(limit, 1)" @close="close()"
                        :semester="selectedSemesterLists" :adminStudyProgram="selectedAdminStudyProgramLists" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title">
            <v-row>
                <v-col cols="12" lg="4" md="6">
                    <v-select variant="outlined" hide-details
                        :items="[{ id: '', name: 'Semua' }, ...AdminStudyProgramLists]" item-value="id" item-title="name"
                        label="Program Studi" @update:model-value="(c: any) => AdminStudyProgramChanged(c)"></v-select>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                    <v-text-field density="compact" v-model="idNationalLecturer" label="NIDN" hide-details
                        variant="outlined" @input="getData(limit, 1)"></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                    <v-text-field density="compact" v-model="search" label="Nama" hide-details variant="outlined"
                        @input="getData(limit, 1)"></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                    <!-- <v-select variant="outlined" hide-details :items="SemesterLists" item-value="id"
                        item-title="semester_type_year" label="Semester" v-model="selectedSemesterLists.id"
                        @update:model-value="(c: any) => SemesterChanged(c)"></v-select> -->
                    <v-select v-model="semester_id" item-value="id" variant="outlined" hide-details :items="SemesterLists"
                        label="Semester"  @update:model-value="(c: any) => SemesterChanged(c)">
                        <template v-slot:selection="{ item }">
                            <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                            }}</span>
                        </template>
                        <template v-slot:item="{ item, props: { onClick, title, value } }">
                            <ul>
                                <li style="padding: 10px; margin: 2px;">
                                    <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                        @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                        <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                                        }}</span>
                                    </a>
                                </li>
                            </ul>
                        </template>
                    </v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="12" md="12" class="text-right">
                    <v-btn color="primary" flat class="ml-auto" @click="create()"
                        :disabled="!selectedSemesterLists.id || !selectedAdminStudyProgramLists.id">
                        <v-icon class="mr-2">
                            mdi-account-multiple-plus
                        </v-icon>Tambah
                    </v-btn>
                </v-col>
            </v-row>
        </SharedUiParentCard>

        <VTable class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIDN</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nomor Keputusan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tanggal Mutasi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in GetLecturerMutationLists">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.id_national_lecturer }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.decision_number }}</td>
                    <td>{{ moment(item.mutation_date).format("DD MMM YYYY") }}</td>

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