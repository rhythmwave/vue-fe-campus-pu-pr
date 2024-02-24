<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
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
        text: 'Mata Kuliah Prasyarat',
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

const page = ref({ title: 'Daftar Mata Kuliah Prasyarat' });
const title = ref('Daftar Mata Kuliah Prasyarat')

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

const CuriculumList = ref(<GetCuriculumListData[]>[])
async function getData(limit: number, page: number, search: string) {
    try {
        if (!selectedAdminStudyPrograms.value.id) {
            CuriculumList.value = <GetCuriculumListData[]>[]
            return;
        }
        const { response: resp, error: error } = await getCuriculumList(limit, page, search, selectedAdminStudyPrograms.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            CuriculumList.value = <GetCuriculumListData[]>resp?.data
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

async function AdminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>AdminStudyPrograms.value.find((x) => x.id == id)
    await getData(limit, 1, search.value)
}

</script>

<template>
    <div>
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
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                @input="selectedAdminStudyPrograms.id ? getData(limit, 1, $event.target.value) : () => { }"></v-text-field>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">No</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Kurikulum</th>
                    <th class="text-subtitle-1 font-weight-semibold" colspan="3">Jumlah Mata Kuliah</th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Memiliki Prasyarat</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tidak Memiliki Prasyarat</th>
                    <th class="text-subtitle-1 font-weight-semibold">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" item, index  in  CuriculumList " :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <v-tooltip text="Detail">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" :to="'/backoffice/curriculum/prerequisite-courses/' + item.id">
                                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Print">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" :to="'/backoffice/curriculum/prerequisite-courses/' + item.id+'/print'" target="_blank">
                                    <PrinterIcon stroke-width="1.5" size="20" class="text-success" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.total_subject_with_prerequisite }}</td>
                    <td class="text-subtitle-1">{{ item.total_subject - item.total_subject_with_prerequisite }}</td>
                    <td class="text-subtitle-1">{{ item.total_subject }}</td>
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
    </div>
</template>