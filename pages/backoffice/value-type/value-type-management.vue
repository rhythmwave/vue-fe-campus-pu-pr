<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetGradeTypeListData } from '~~/types/api/grade-type/GetGradeTypeList';
import { deleteGradeType } from '~~/composables/api/grade-type/deleteGradeType';
import { getGradeTypeList } from '~~/composables/api/grade-type/getGradeTypeList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { getStudyLevelList } from '~~/composables/api/study-level/getGradeTypeList';
import { GetStudyLevelListData } from '~~/types/api/study-level/GetStudyLevelList';
import moment from "moment"

const route = useRoute()
definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});
const title = ref('Manajemen Jenis Nilai')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: title.value,
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
    await getStudyLevel()
    // await getData(limit, 1, search.value)
    getData(limit, 1, search.value, selectedStudyLevels.value)
})

const gradeTypes = ref<GetGradeTypeListData[]>([])
async function getData(limit: number, page: number, searchText: string, studyLevel: GetStudyLevelListData) {
    try {
        selectedStudyLevels.value = studyLevel
        search.value = searchText;
        const { response: resp, error: error } = await getGradeTypeList(limit, page, searchText, selectedStudyLevels.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            gradeTypes.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}


const studyLevels = ref<GetStudyLevelListData[]>([])
const selectedStudyLevels = ref(<GetStudyLevelListData>{})
async function getStudyLevel() {
    try {
        const { response: resp, error: error } = await getStudyLevelList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyLevels.value = resp?.data
            studyLevels.value.forEach(sl => {
                if (sl.short_name == "D3") {
                    selectedStudyLevels.value = sl
                }
            });
            console.log(selectedStudyLevels.value)
        }
    } catch (error) {
        alert(error)
    }
}

const updateGradeTypeId = ref('')
const updateData = ref(<GetGradeTypeListData>{
    id: '',
    study_level_id: '',
    study_level_short_name: '',
    code: '',
    grade_point: 0,
    minimum_grade: 0,
    maximum_grade: 0,
    grade_category: '',
    grade_point_category: 0,
    label: '',
    english_label: '',
    start_date: '',
    end_date: ''
})

function editItem(data: GetGradeTypeListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateGradeTypeId.value = ""
    }, 300)
}


const deletedData = ref(<GetGradeTypeListData>{})

function deleteItem(data: GetGradeTypeListData) {
    mode.value = 'delete'
    deletedData.value = data
    dialogDelete.value = true
}


function closeDelete() {
    dialogDelete.value = false
}

async function deleteItm() {
    try {
        const { response: deleteResponse, error } = await deleteGradeType(deletedData.value)
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
    getData(limit, 1, search.value, selectedStudyLevels.value)
}

function create() {
    mode.value = 'create'
    dialogCreate.value = true
}
function closeCreate() {
    dialogCreate.value = false
}

function studyLevelsOnChange(id: string) {
    selectedStudyLevels.value = <GetStudyLevelListData>studyLevels.value.find((x) => x.id == id)

    getData(limit, 1, search.value, selectedStudyLevels.value)
}

</script>

<template>
    <div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesGradeTypeCreate @reload="getData(limit, 1, search, selectedStudyLevels)" @close="closeCreate()"
                        :studyLevel="selectedStudyLevels" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesGradeTypeUpdate @reload="getData(limit, 1, search, selectedStudyLevels)" @close="closeUpdate()"
                        :grade_type="updateData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Kategori Mata Kuliah</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-row>
                                    <h5>Jenjang</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.study_level_short_name }}</div>
                                </v-row>
                                <v-row>
                                    <h5>Kode</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.code }}</div>
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
        <!-- <v-row>
            <v-col cols="12">
                <UiParentCard title="Pencarian Jenis Nilai">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="studyLevels" item-value="id" item-title="name"
                                label="Jenis Jenjang Studi"
                                @update:model-value="(sl: any) => studyLevelsOnChange(sl)"></v-select>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row> -->
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Daftar Jenis Nilai">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                @input="getData(limit, 1, $event.target.value, selectedStudyLevels)"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="8" md="6" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()"
                                :disabled="!selectedStudyLevels.id">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Jenis Nilai
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
                    <th class="text-subtitle-1 font-weight-semibold">Jenjang</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Bobot</th>
                    <th class="text-subtitle-1 font-weight-semibold">Rentang Nilai</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelompok Nilai</th>
                    <th class="text-subtitle-1 font-weight-semibold">Bobot Kelompok</th>
                    <th class="text-subtitle-1 font-weight-semibold">Label Indonesia</th>
                    <th class="text-subtitle-1 font-weight-semibold">Label Asing</th>
                    <th class="text-subtitle-1 font-weight-semibold" width="120">Tangggal Mulai Efektif</th>
                    <th class="text-subtitle-1 font-weight-semibold" width="120">Tangggal Akhir Efektif</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in gradeTypes" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
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
                    <td class="text-subtitle-1">{{ item.study_level_short_name }}</td>
                    <td class="text-subtitle-1">{{ item.code }}</td>
                    <td class="text-subtitle-1">{{ item.grade_point }}</td>
                    <td class="text-subtitle-1">{{ item.minimum_grade + " - " + item.maximum_grade }}</td>
                    <td class="text-subtitle-1">{{ item.grade_category }}</td>
                    <td class="text-subtitle-1">{{ item.grade_point_category }}</td>
                    <td class="text-subtitle-1">{{ item.label }}</td>
                    <td class="text-subtitle-1">{{ item.english_label }}</td>
                    <td class="text-subtitle-1">{{ moment(item.start_date).format("YYYY-MM-DD") }}</td>
                    <td class="text-subtitle-1">{{ moment(item.end_date).format("YYYY-MM-DD") }}</td>

                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev, search, selectedStudyLevels)"
                            @jumpPage="(page: number) => getData(limit, page, search, selectedStudyLevels)"
                            @nextPage="getData(limit, pagination.next, search, selectedStudyLevels)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>