<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetSupervisorRoleData } from '~~/types/api/thesis/GetSupervisorRole';

import { getSupervisorRole } from '~~/composables/api/admin-thesis/getSupervisorRole';
import { deleteSupervisorRole } from '~~/composables/api/admin-thesis/deleteSupervisorRole';

const route = useRoute()
definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Peran Dosen Pengawas TA')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: title,
        disabled: true,
        href: '#'
    }
]);

const search = ref('')
const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

const mode = ref('')
const dialog = ref(false)
const supervisor_roles = ref(<GetSupervisorRoleData[]>[])
const supervisor_role = ref(<GetSupervisorRoleData>{})

async function getData(limit: number, page: number, search: string ) {
    try {
        const { response: resp, error: error } = await getSupervisorRole(limit, page, search)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            supervisor_roles.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

function create(){
    mode.value = 'create'
    dialog.value = true
}
function editItem(item: any){
    supervisor_role.value = item
    mode.value = 'edit'
    dialog.value = true
}
async function deleteItem(item: GetSupervisorRoleData){
    if (confirm('Yakin Menghapus Item Ini ' + item.name + ' ?')) {
        try {
            const { response: resp, error: error } = await deleteSupervisorRole(item.id)
            if (error) {
                let dataError = <ErrorRoot>error;
                alert(dataError.meta.message);
                return;
            }else{
                await getData(pagination.value.limit, pagination.value.page, '')
            }
        } catch (error) {
            alert(error)
        }
    }
}
function close(){
    dialog.value = false
}
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

onMounted(async () => {
    await getData(pagination.value.limit, pagination.value.page, search.value)
})
</script>

<template>
    <div>
        <div v-if="mode == 'edit'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeThesisEditSupervisorRole :supervisor-role="supervisor_role" @reload="getData(pagination.limit, 1, search)" @close="close()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeThesisCreateSupervisorRole @reload="getData(pagination.limit, 1, search)" @close="close()" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="'Pencarian '+ title">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field density="compact" v-model="search" :label="'Cari '+title" hide-details
                                variant="outlined" @input="getData(pagination.limit, 1, $event.target.value)"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
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
                    <th class="text-subtitle-1 font-weight-semibold">Urutan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in supervisor_roles">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.sort }}</td>
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
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(pagination.limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getData(pagination.limit, page, search)"
                            @nextPage="getData(pagination.limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>