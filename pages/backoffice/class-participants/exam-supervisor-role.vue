<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import { ErrorRoot } from '~~/types/api/error';

import { GetExamSupervisorRoleListData } from '~~/types/api/class-participant/GetExamSupervisorRole';
import { EditExamSupervisorRole } from '~~/types/api/class-participant/EditExamSupervisorRole';
import { DeleteExamSupervisorRole } from '~~/types/api/class-participant/DeleteExamSupervisorRole';

import { getExamSupervisorRoleList } from '~~/composables/api/class-participant/exam-supervisor-role/getExamSupervisorRoleList';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});
const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Peran Pengawas Ujian')
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
])
const examSupervisorRoleList = ref(<GetExamSupervisorRoleListData[]>[])
const editObj = ref(<EditExamSupervisorRole>{})
const deleteObj = ref(<DeleteExamSupervisorRole>{})
async function getData(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getExamSupervisorRoleList(limit, page, search)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            examSupervisorRoleList.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
async function create(){
    mode.value = 'create'
    dialog.value = true
}
async function close(){
    dialog.value = false
}
async function edit(item: any){
    mode.value = 'edit'
    dialog.value = true
    editObj.value = <EditExamSupervisorRole>{
        id: item.id,
        name: item.name,
        sort: item.sort,
    }
}
async function deleteItem(item: any){
    mode.value = 'delete'
    dialog.value = true
    deleteObj.value = item
}
onMounted(async () => {
    await getData(pagination.value.limit, pagination.value.page, search.value)
})
</script>

<template>
    <div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeClassParticipantExamSupervisorRoleCreate @reload="getData(limit, 1, '')" @close="close()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'edit'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeClassParticipantExamSupervisorRoleEdit @reload="getData(limit, 1, '')" @close="close()" :data="editObj"/>
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeClassParticipantExamSupervisorRoleDelete @reload="getData(limit, 1, '')" @close="close()" :data="deleteObj"/>
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'Daftar '+title">
            <v-row>
                <v-col cols="12" lg="4" md="4" class="text-left">
                    <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined" @input="getData(pagination.limit, 1, $event.target.value)"></v-text-field>
                </v-col>
                <v-col cols="12" lg="12" md="12" class="text-right">
                    <v-btn color="primary" flat class="ml-auto" @click="create">
                        <v-icon class="mr-2">
                        mdi-plus
                        </v-icon>Tambah
                    </v-btn>
                </v-col>
            </v-row>
        </SharedUiParentCard>
        <v-table class="mt-10">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Urutan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in examSupervisorRoleList">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.sort }}</td>
                    <td>
                        <v-btn icon flat v-bind="props" @click="edit(item)">
                            <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                        </v-btn>
                        <v-btn icon flat v-bind="props" @click="deleteItem(item)">
                            <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                        </v-btn>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(pagination.limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getData(pagination.limit, page, search)"
                            @nextPage="getData(pagination.limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>