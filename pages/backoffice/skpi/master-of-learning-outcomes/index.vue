<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetStudyProgramListData } from '~~/types/api/study-program/GetStudyProgramList';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta({
  layout: "backoffice",
  middleware: ['check-auth'],
});

const limit = 20
const pagination = ref({
  page: 1,
  limit,
  prev: 1,
  next: 1,
  total_pages: 1,
  total_records: 0
})
const search: String = ''
const title = ref('Program Studi Capaian Pembelajaran')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Program Studi Capaian Pembelajaran',
    disabled: true,
    href: '#'
  }
])
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)
const study_programs = ref<GetStudyProgramListData[]>([])
async function getData(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_study_program.AdminStudyProgramHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
            method: 'GET',
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
        pagination.value =
        {
            next: _resp.value.pagination.next,
            prev: _resp.value.pagination.prev,
            total_pages: _resp.value.pagination.total_pages,
            total_records: _resp.value.pagination.total_records,
            limit: _resp.value.pagination.limit,
            page: _resp.value.pagination.page
        }
        study_programs.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}
onMounted(async () => {
    await getData(limit, 1, search)
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title">
            <VCol cols="12" lg="4" md="6">
                <v-text-field density="compact" label="Pencarian Data Program Studi" hide-details variant="outlined" @input="getData(limit, pagination.page, $event.target.value)" />
            </VCol>
        </SharedUiParentCard>
        <VTable class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in study_programs">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <VTooltip text="Detail">
                                <template #activator="{ props }">
                                    <a :href="'/backoffice/skpi/master-of-learning-outcomes/'+item.id">
                                        <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </a>
                                </template>
                            </VTooltip>
                            <!-- <VTooltip text="Ubah">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="editItem(item)">
                                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                                </template>
                            </VTooltip> -->
                            <!-- <VTooltip text="Hapus">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="deleteItem(item)">
                                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                </VBtn>
                                </template>
                            </VTooltip> -->
                        </div>
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
        </VTable>
    </div>
</template>