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
const title = ref('Pendaftaran SKPI')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Pendaftaran SKPI',
    disabled: true,
    href: '#'
  }
])
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)
const skpi_registrations = ref<GetSKPIRegistrationData[]>([])
const skpiRegistration = ref({
    id: '',
    student_id: '',
    student_nim_number: '',
    student_name: '',
    student_study_program_id: '',
    student_study_program_name: '',
    student_dikti_study_program_code: '',
    skpi_number: '',
    is_approved: false,
    achievement_path: '',
    achievement_path_type: '',
    achievement_url: '',
    organization_path: '',
    organization_path_type: '',
    organization_url: '',
    certificate_path: '',
    certificate_path_type: '',
    certificate_url: '',
    language_path: '',
    language_path_type: '',
    language_url: '',
    achievements: [],
    organizations: [],
    certificates: [],
    character_buildings: [],
    internships: [],
    languages: [],
})
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
        skpi_registrations.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}
function create(){
    mode.value = 'create'
    dialog.value = true
}

function editItem(item: any){
    mode.value = 'edit'
    dialog.value = true
    skpiRegistration.value = item
}

async function saveFromCreate(input: any){
    dialog.value = false
    try {
        var createData = Object.assign({}, input);
            const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_student_skpi.AdminStudentSkpiHandler/Upsert`, <any>{
            method: 'POST',
            body: {
                student_id: createData.student_id,
                achievement_path: createData.achievement_path,
                achievement_path_type: createData.achievement_path_type,
                organization_path: createData.organization_path,
                organization_path_type: createData.organization_path_type,
                certificate_path: createData.certificate_path,
                certificate_path_type: createData.certificate_path_type,
                language_path: createData.language_path,
                language_path_type: createData.language_path_type,
                achievements: createData.achievements,
                organizations: createData.organizations,
                certificates: createData.certificates,
                character_buildings: createData.character_buildings,
                internships: createData.internships,
                languages: createData.languages,
            },
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
        close()
        getData(limit, 1)
    } catch (error) {
        alert(error)
    }
}
async function saveFromEdit(input: any){
    dialog.value = false
    try {
        var editData = Object.assign({}, input);
            const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_student_skpi.AdminStudentSkpiHandler/Upsert`, <any>{
            method: 'POST',
            body: {
                student_id: editData.student_id,
                achievement_path: editData.achievement_path,
                achievement_path_type: editData.achievement_path_type,
                organization_path: editData.organization_path,
                organization_path_type: editData.organization_path_type,
                certificate_path: editData.certificate_path,
                certificate_path_type: editData.certificate_path_type,
                language_path: editData.language_path,
                language_path_type: editData.language_path_type,
                achievements: editData.achievements,
                organizations: editData.organizations,
                certificates: editData.certificates,
                character_buildings: editData.character_buildings,
                internships: editData.internships,
                languages: editData.languages,
            },
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
        close()
        getData(limit, 1)
    } catch (error) {
        alert(error)
    }
}
function deleteItem(item: any){
    mode.value = 'delete'
    dialog.value = true
    skpiRegistration.value = item
}
function closeDialogEdit(data: any){
    if(data){
        dialog.value = false
    }
}
function closeDialogCreate(data: any){
    if(data){
        dialog.value = false
    }
}
function close(){
    dialog.value = false
}
async function deleteData(){
    try {
            const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_student_skpi.AdminStudentSkpiHandler/Delete`, <any>{
                method: 'DELETE',
                body: {
                    id: skpiRegistration.value.id,
                },
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
        close()
        getData(limit, 1)
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
        <div v-if="mode == 'delete'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                    <span class="title text-white">hapus {{ title }} {{ skpiRegistration.student_name }}</span>
                    </VCardTitle>
                    <VCardText>
                    <VForm ref="form" v-model="valid" lazy-validation>
                        <VRow>
                        <VCardActions class="pa-4">
                            <VSpacer />
                            <VBtn color="error" @click="close">
                            Batal
                            </VBtn>
                            <VBtn color="secondary" @click="deleteData">
                            Hapus
                            </VBtn>
                        </VCardActions>
                        </VRow>
                    </VForm>
                    </VCardText>
                </VCard>
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'edit'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminSkpiRegistrationEdit :title="title" :data="skpiRegistration" :dialog="dialog" @dataEdit="(data: any) => saveFromEdit(data)" @closeDialog="(data: any) => closeDialogEdit(data)" />
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'create'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminSkpiRegistrationCreate :title="title" :dialog="dialog" @dataCreate="(data: any) => saveFromCreate(data)" @closeDialog="(data: any) => closeDialogCreate(data)" />
                </VDialog>
            </VCol>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title">
            <VCol cols="12" lg="4" md="6" class="float-left">
                <v-text-field v-model="name" density="compact" :label="'Pencarian '+title" hide-details variant="outlined" />
            </VCol>
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VBtn color="primary" flat class="ml-auto" @click="create()">
                <VIcon class="mr-2">
                    mdi-account-multiple-plus
                </VIcon>Tambah {{ title }}
                </VBtn>
            </VCol>
        </SharedUiParentCard>
        <VTable class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Studi Program</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in skpi_registrations">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.student_study_program_name }}</td>
                    <td>{{ item.is_approved ? 'disetujui' : 'belum disetujui'  }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <VTooltip text="Detail">
                                <template #activator="{ props }">
                                    <NuxtLink :to="'/backoffice/skpi/skpi-registration/'+item.id" :data="item.id">
                                        <VBtn icon flat v-bind="props">
                                            <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                        </VBtn>
                                    </NuxtLink>
                                </template>
                            </VTooltip>
                            <VTooltip text="Ubah">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="editItem(item)">
                                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                                </template>
                            </VTooltip>
                            <VTooltip text="Hapus">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="deleteItem(item)">
                                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                </VBtn>
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
                            @prevPage="getData(limit, pagination.page)"
                            @jumpPage="(page: any) => getData(limit, page)"
                            @nextPage="getData(limit, pagination.page)" />
                    </td>
                </tr>
            </tfoot>
        </VTable>
    </div>
</template>