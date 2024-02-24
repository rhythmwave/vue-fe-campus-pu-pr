<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import user1 from '/images/profile/user-1.jpg';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination'
import { ErrorRoot } from '~~/types/api/error';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { UpdateAdminStudyProgramRequest } from '~~/types/api/admin-study-program/UpdateAdminStudyProgram';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const valid = ref(true)
const mode = ref('list')
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const dialogShow = ref(false)

const title = ref('Daftar Manajemen Program Studi')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Manajemen Program Studi',
        disabled: true,
        href: '#'
    }
])

const limit = 20
const search = ref('')
const study_programs = ref<GetAdminStudyProgramListData[]>([])
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

onMounted(() => {
    getData(limit, 1, search.value)
})

async function getData(limit: number, page: number, searchText: string) {

    search.value = searchText;
    try {
        const { data: resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_study_program.AdminStudyProgramHandler/GetList?limit=${limit}&page=${page}&search=${searchText}`, <any>{
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
        study_programs.value = resp.value?.data
        pagination.value = resp.value?.pagination

    } catch (error) {
        alert(error)

    }

}
const showId = ref('')
function showItem(id: string) {
    mode.value = 'show'
    //   updateFacultyRequest.value=<UpdateFacultyRequest>{};
    showId.value = id
    dialogShow.value = true
}

const updateAdminStudyProgramId = ref('')

function editItem(id: string) {
    mode.value = 'update'
    updateAdminStudyProgramId.value = id
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateAdminStudyProgramId.value = ""
    }, 300)
}

</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesAdminProgramStudyDetail :id="showId" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesAdminProgramStudyUpdate @reload="getData(limit, 1, search)" @close="closeUpdate()"
                        :id="updateAdminStudyProgramId" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Manajemen Program Studi">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Pencarian Program Studi" hide-details
                                variant="outlined" @input="getData(limit, 1, $event.target.value)"></v-text-field>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jenjang Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in study_programs" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td class="text-subtitle-1">{{ item.dikti_study_program_code }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.study_level_name }} - {{ item.dikti_study_program_type }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Detail">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="showItem(item.id)">
                                        <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Ubah">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="editItem(item.id)">
                                        <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
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