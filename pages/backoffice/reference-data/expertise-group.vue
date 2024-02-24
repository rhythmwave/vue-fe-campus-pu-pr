<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import { ErrorRoot } from '~~/types/api/error';

import { GroupExpertiseListData } from '~~/types/api/expertise-group/GetExpertiseGroup';
import { UpdateExpertiseGroupRequest } from '~~/types/api/expertise-group/UpdateExpertiseGroup';
import { getExpertiseGroupList } from '~~/composables/api/expertise-group/getExpertiseGroup';
import { deleteExpertiseGroup } from '~~/composables/api/expertise-group/deleteExpertiseGroup';


const route = useRoute()
    definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Kelompok Keahlian')
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

const datas = ref(<GroupExpertiseListData[]>[])
const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const search = ref('')
const mode = ref('')
const dialog = ref(false)
const expertise_single = ref(<UpdateExpertiseGroupRequest>{})

async function getData(limit: number, page: number, searchText: string) {
    try {
        const { response: resp, error } = await getExpertiseGroupList(limit, page, searchText)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            datas.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
        console.log(error)
    }
}
function create(){
    mode.value = 'create'
    dialog.value = true
}
function editItem(item: UpdateExpertiseGroupRequest){
    expertise_single.value = <UpdateExpertiseGroupRequest>{
        id: item.id,
        name: item.name
    }
    mode.value = 'edit'
    dialog.value = true
}
async function deleteItem(item: UpdateExpertiseGroupRequest){
    if (!confirm('Yakin Menghapus Item Ini ' + item.name + ' ?')) {
        return false
    }
    try {
        const { response: createFileResponse, error } = await deleteExpertiseGroup(item.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            await getData(pagination.value.limit, pagination.value.page, '')
        }
    } catch (error) {
        alert(error)
    }
}

function close(){
    dialog.value = false
}

onMounted(async () => {
    await getData(pagination.value.limit, pagination.value.page, search.value)
    console.log()
})
</script>
<template>
    <div>
        <div v-if="mode == 'edit'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesExpertiseGroupEdit :data="expertise_single" @reload="getData(pagination.limit, 1, search)"
                        @close="close()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesExpertiseGroupCreate @reload="getData(pagination.limit, 1, search)"
                        @close="close()" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="'Daftar '+title">
                    <v-row>
                        <v-col cols="12" lg="6" md="6">
                            asdasad
                        </v-col>
                        <v-col cols="12" lg="8" md="6" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah {{title}}
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
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in datas">
                    <td>{{ ((pagination.page-1)* pagination.limit + 1) + index }}</td>
                    <td>{{ item.name }}</td>
                    <td>
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
                                <TrashIcon stroke-width="1.5" size="20" class="text-primary" />
                            </v-btn>
                            </template>
                        </v-tooltip>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(pagination.limit, pagination.prev, '')"
                            @jumpPage="(page: any) => getData(pagination.limit, page, '')"
                            @nextPage="getData(pagination.limit, pagination.next, '')" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>    
</template>