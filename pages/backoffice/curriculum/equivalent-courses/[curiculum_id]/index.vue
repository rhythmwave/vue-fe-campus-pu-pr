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
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { GetCuriculumDetailData } from '~~/types/api/curiculum/GetCuriculumDetail';
import { getCuriculumDetail } from '~~/composables/api/curiculum/getCuriculumDetail';

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
        text: 'Mata Kuliah Setara',
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

const page = ref({ title: 'Daftar Mata Kuliah Setara' });
const title = ref('Daftar Mata Kuliah Setara')

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


const curiculum_id = ref('')
onMounted(async () => {
    curiculum_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    console.log(curiculum_id.value)
    await getCuriculumDetailData()
    await getCuriculumListData()
    await getData(limit, 1, search.value)
})

const subjects = ref<GetSubjectListData[]>([])
async function getData(limit: number, page: number, searchText: string) {
    try {
        search.value = searchText;
        const { response: resp, error: error } = await getSubjectList(limit, page, searchText, [curiculum_id.value], '', selectedCuriculumLists.value.id, '', '', '', '')
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
}

const detailData = ref(<GetSubjectListData>{
})
function showItem(data: GetSubjectListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}


function closeEquivalent() {
    dialogShow.value = false
}
const CuriculumLists = ref(<GetCuriculumListData[]>[])
const selectedCuriculumLists = ref(<GetCuriculumListData>{
    id: "",
})
async function getCuriculumListData() {
    try {
        const { response: resp, error: error } = await getCuriculumList(1000000, 1, "", CuriculumDetails.value.study_program_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            CuriculumLists.value = <GetCuriculumListData[]><unknown>resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const CuriculumDetails = ref(<GetCuriculumDetailData>{ id: "", name: "" })
async function getCuriculumDetailData() {
    try {
        const { response: resp, error: error } = await getCuriculumDetail(curiculum_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            CuriculumDetails.value = <GetCuriculumDetailData><unknown>resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeSubjectSetEquivalent :getSubjectListData="detailData"
                        @reload="getData(limit, 1, search)" @close="closeEquivalent()" />
                </v-dialog>
            </v-col>
        </div>

        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Daftar Mata Kuliah">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="CuriculumLists" item-value="id"
                                item-title="name" label="Kurikulum" v-model="selectedCuriculumLists.id"
                                @update:model-value="(c: any) => getData(limit, 1, search)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                @input="getData(limit, 1, $event.target.value)"></v-text-field>
                        </v-col>
                        <!-- <v-col cols="12" lg="8" md="6" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Kurikulum
                            </v-btn>
                        </v-col> -->
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">No</th>
                    <th class="text-subtitle-1 font-weight-semibold" rowspan="2">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold" colspan="2">Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold" colspan="4">Mata Kuliah Setara</th>

                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Prodi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kurikulum</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in subjects" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Detail">
                                <template #activator="{ props }">
                                    <v-btn flat @click="showItem(item)">
                                        <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                    <td class="text-subtitle-1">{{ item.code }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.equivalent_study_program_name }}</td>
                    <td class="text-subtitle-1">{{ item.equivalent_curriculum_name }}</td>
                    <td class="text-subtitle-1">{{ item.equivalent_subject_code }}</td>
                    <td class="text-subtitle-1">{{ item.equivalent_subject_name }}</td>

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