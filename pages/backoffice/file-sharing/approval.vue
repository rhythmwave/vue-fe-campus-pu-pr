<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetFileSharingData } from '~~/types/api/file-sharing/GetFileSharing';

import { getAdminFileSharing } from '~~/composables/api/admin-file-sharing/getAdminFileSharing';
import { approveAdminFileSharing } from '~~/composables/api/admin-file-sharing/approveAdminFileSharing';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Persetujuan File Sharing')
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

const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

const is_approved = ref('')
const search = ref('')
const datas = ref(<GetFileSharingData[]>[])

async function getData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getAdminFileSharing(limit, page, search.value, is_approved.value)
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
    }
}
async function save(id: string){
    if(!confirm('Yakin Setujui')){
        return false
    }
    try {
        const { response: resp, error: error } = await approveAdminFileSharing(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
    } catch (error) {
        alert(error)
    }
    await getData(pagination.value.limit, 1)
}
onMounted(async () => {
    await getData(pagination.value.limit, 1)
})
</script>
<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Pencarian File Sharing">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="is_approved" variant="outlined" hide-details :items="[{title: 'Disetujui', value: 1}, {title: 'Belum Disetujui', value: 0}]" label="Persetujuan"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field v-model="search" variant="outlined" hide-details label="Cari File"></v-text-field>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Pembuat</th>
                    <th class="text-subtitle-1 font-weight-semibold">Judul</th>
                    <th class="text-subtitle-1 font-weight-semibold">File</th>
                    <th class="text-subtitle-1 font-weight-semibold">Disetujui</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in datas" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.lecturer_front_title }} {{ item.lecturer_name }} {{ item.lecturer_back_degree }}</td>
                    <td>{{ item.title }}</td>
                    <td>
                        <a :href="item.file_url" target="_blank">
                            {{ item.file_url }}
                        </a>
                    </td>
                    <td>{{ item.is_approved ? 'Disetujui' : 'Belum' }}</td>
                    <td>
                        <v-btn color="primary" flat class="ml-auto" @click="save(item.id)" v-if="!item.is_approved">
                            <v-icon class="mr-2">
                                mdi-content-save
                            </v-icon>Setujui
                        </v-btn>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages" :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next" @prevPage="getStudent(limit, pagination.prev)" @jumpPage="(page: any) => getStudent(limit, page)" @nextPage="getStudent(limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>