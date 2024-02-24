<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetGradeComponentWithCategoryListData } from '~~/types/api/grade-component/GetGradeComponentWithCategoryList';
import { getGradeComponentWithCategoryList } from '~~/composables/api/grade-component/getGradeComponentWithCategoryList';
import { ErrorRoot } from '~~/types/api/error';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { PaginationModel } from '~~/types/api/pagination';

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
        text: 'Manajemen Komponen Nilai',
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

const page = ref({ title: 'Daftar Manajemen Komponen Nilai' });
const title = ref('Daftar Manajemen Komponen Nilai')

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
    await getAdminStudyProgram()
    // await getData(limit, 1, search.value)
})

const gradeComponentWithCategorys = ref<GetGradeComponentWithCategoryListData[]>([])
async function getData(limit: number, page: number, searchText: string, adminStudyProgram: GetAdminStudyProgramListData) {
    try {
        selectedAdminStudyPrograms.value = adminStudyProgram
        search.value = searchText;
        const { response: resp, error: error } = await getGradeComponentWithCategoryList(limit, page, searchText, selectedAdminStudyPrograms.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            gradeComponentWithCategorys.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
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
        }
    } catch (error) {
        alert(error)
    }
}

const detailData = ref(<GetGradeComponentWithCategoryListData>{
})
function showItem(data: GetGradeComponentWithCategoryListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}

const updateGradeComponentWithCategoryId = ref('')
const updateData = ref(<GetGradeComponentWithCategoryListData>{
})

function editItem(data: GetGradeComponentWithCategoryListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateGradeComponentWithCategoryId.value = ""
    }, 300)
}



function adminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>adminStudyPrograms.value.find((x) => x.id == id)

    getData(limit, 1, search.value, selectedAdminStudyPrograms.value)
}

</script>

<template>
    <div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesGradeComponentUpdatePercentage @reload="getData(limit, 1, search, selectedAdminStudyPrograms)"
                        @close="closeUpdate()" :getGradeComponentWithCategoryListData="updateData" />
                </v-dialog>
            </v-col>
        </div>

        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Pencarian Manajemen Komponen Nilai">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="adminStudyPrograms" item-value="id"
                                item-title="name" label="Manajemen Jenjang Studi"
                                @update:model-value="(sl: any) => adminStudyProgramsOnChange(sl)"></v-select>
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
                    <th class="text-subtitle-1 font-weight-semibold">Kategori Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Jenis / Persentase(%)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in gradeComponentWithCategorys" :key="item.subject_category_id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">

                            <v-tooltip text="Ubah">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="editItem(item)">
                                        <PencilIcon stroke-width="1.5" size="20" class="text-primary" /> set
                                    </v-btn>
                                </template>
                            </v-tooltip>

                        </div>
                    </td>
                    <td class="text-subtitle-1">{{ item.study_program_name }}</td>
                    <td class="text-subtitle-1">{{ item.subject_category_name }}</td>
                    <td class="text-subtitle-1">
                        <table>
                            <tr v-for="gc, index in item.grade_components.filter((x) => x.is_active)">
                                <td width="150px" style="border-bottom: 1pt solid black;">{{ gc.name }}</td>
                                <td style="border-bottom: 1pt solid black;">{{ gc.default_percentage }}%</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev, search, selectedAdminStudyPrograms)"
                            @jumpPage="(page: any) => getData(limit, page, search, selectedAdminStudyPrograms)"
                            @nextPage="getData(limit, pagination.next, search, selectedAdminStudyPrograms)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>