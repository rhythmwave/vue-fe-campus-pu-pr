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


const curiculum_id = ref('')
onMounted(async () => {
    curiculum_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    console.log(curiculum_id.value)
    await getData(limit, 1, search.value)
})

const subjects = ref<GetSubjectListData[]>([])
async function getData(limit: number, page: number, searchText: string) {
    try {
        search.value = searchText;
        const { response: resp, error: error } = await getSubjectList(limit, page, searchText, [curiculum_id.value], '', '', '', '', '', '')
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


function closePrerequisite() {
    dialogShow.value = false
}

</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeSubjectSetPrerequisite :getSubjectListData="detailData" @reload="getData(limit, 1, search)" @close="closePrerequisite()"/>
                </v-dialog>
            </v-col>
        </div>
        
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Daftar Mata Kuliah">
                    <v-row>
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
                    <th class="text-subtitle-1 font-weight-semibold" colspan="4">Mata Kuliah</th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Kode</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Sifat</th>
                    <th class="text-subtitle-1 font-weight-semibold">Paket Semester</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in subjects" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Detail">
                                <template #activator="{ props }">
                                    <v-btn color="primary" flat @click="showItem(item)">
                                        <v-icon>
                                            mdi-badge-account-horizontal
                                        </v-icon> &nbsp; Prasyarat
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                    <td class="text-subtitle-1">{{ item.code }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.trait }}</td>
                    <td class="text-subtitle-1">{{ item.semester_package }}</td>

                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev, search)"
                            @jumpPage="(page) => getData(limit, page, search)"
                            @nextPage="getData(limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>