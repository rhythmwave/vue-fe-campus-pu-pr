<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetSKPIRegistrationData } from '~/types/api/admin-skpi/GetSKPIRegistration'
import { ErrorRoot } from '~~/types/api/error';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';

definePageMeta(<PageMeta>{
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
const studyProgramId = ref('')
const name = ref('')
const nimNumber = ref('')
const nimNumberFrom = ref('')
const nimNumberTo = ref('')
const isApproved = ref(false)
const title = ref('Approval SKPI')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Approval SKPI',
    disabled: true,
    href: '#'
  }
])
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)
const skpi_approvals = ref<GetSKPIRegistrationData[]>([])
    async function getData(limit: number, page: number) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_student_skpi.AdminStudentSkpiHandler/GetList?limit=${limit}&page=${page}&studyProgramId=${studyProgramId.value}&name=${name.value}&nimNumber=${nimNumber.value}&nimNumberFrom=${nimNumberFrom.value}&nimNumberTo=${nimNumberTo.value}&isApproved`, <any>{
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
        skpi_approvals.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}

watch(name, async function(value){
    if(value != ''){
        await getData(limit, 1)
    }
})

onMounted(async () => {
    await getData(limit, 1)
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title">
            <VCol cols="12" lg="4" md="6">
                <v-text-field v-model="name" density="compact" :label="'Pencarian '+title" hide-details variant="outlined" />
            </VCol>
        </SharedUiParentCard>
        <VTable class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Name</th>
                    <th class="text-subtitle-1 font-weight-semibold">Studi Program</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in skpi_approvals">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.student_study_program_name }}</td>
                    <td>{{ item.is_approved ? 'disetujui' : 'belum disetujui'  }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <VTooltip text="Detail">
                                <template #activator="{ props }">
                                    <NuxtLink :to="'/backoffice/skpi/skpi-approval/skpi-approval-detail/'+item.id" :data="item.id">
                                        <VBtn icon flat v-bind="props">
                                            <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                        </VBtn>
                                    </NuxtLink>
                                </template>
                            </VTooltip>
                            <VTooltip text="Print">
                                <template #activator="{ props }">
                                    <a :href="'/backoffice/skpi/skpi-approval/skpi-approval-print/'+item.id" target="_blank">
                                        <VBtn icon flat v-bind="props">
                                            <v-icon color="primary">
                                                mdi-printer-outline
                                            </v-icon>
                                        </VBtn>
                                    </a>
                                    <!-- <NuxtLink :to="'/backoffice/skpi/skpi-approval/skpi-approval-print/'+item.id" :data="item.id">
                                        <VBtn icon flat v-bind="props">
                                            <v-icon color="primary">
                                                mdi-printer-outline
                                            </v-icon>
                                        </VBtn>
                                    </NuxtLink> -->
                                </template>
                            </VTooltip>
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
                            @prevPage="getData(pagination.limit, pagination.prev)"
                            @jumpPage="(page: any) => getData(pagination.limit, page)"
                            @nextPage="getData(pagination.limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </VTable>
    </div>
</template>