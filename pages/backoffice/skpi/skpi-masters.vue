<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetMasterSKPIData } from '~/types/api/admin-skpi/GetMasterSKPI';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

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
const search: String = ''
const title = ref('Master SKPI')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: 'Master SKPI',
    disabled: true,
    href: '#'
  }
])
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)
const masterSKPIList = ref<GetMasterSKPIData[]>([])
const dialogShow = ref(false)
const masterSKPI = ref({
    id: '',
    name: '',
    short_name: '',
    kkni_qualification: '',
    acceptance_requirement: '',
    further_education_level: '',
    professional_status: '',
    course_language: '',
})
const updateMasterSKPI = ref({
    id: '',
    name: '',
    short_name: '',
    kkni_qualification: '',
    acceptance_requirement: '',
    further_education_level: '',
    professional_status: '',
    course_language: '',
})
async function getData(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_study_level.AdminStudyLevelHandler/GetList?limit=${limit}&page=${page}&search=${search}`, <any>{
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
        masterSKPIList.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}
function editItem(item: any){
    mode.value = 'edit'
    dialog.value = true
    updateMasterSKPI.value = {
        id: item.id,
        name: item.name,
        short_name: item.short_name,
        kkni_qualification: item.kkni_qualification,
        acceptance_requirement: item.acceptance_requirement,
        further_education_level: item.further_education_level,
        professional_status: item.professional_status,
        course_language: item.course_language,
    }
}
async function update() {
    try {
        var updateData = Object.assign({}, updateMasterSKPI.value);
            const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/skpi/admin_study_level.AdminStudyLevelHandler/UpdateSkpi`, <any>{
            method: 'PATCH',
            body: {
                id: updateData.id,
                name: updateData.name,
                short_name: updateData.short_name,
                kkni_qualification: updateData.kkni_qualification,
                acceptance_requirement: updateData.acceptance_requirement,
                further_education_level: updateData.further_education_level,
                professional_status: updateData.professional_status,
                course_language: updateData.course_language,
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
        getData(limit, 1, search)
        return { response: _resp.value, error: null };
    } catch (error) {
        alert(error)
    }
}
function close(){
    dialog.value = false
    setTimeout(() => {
        updateMasterSKPI.value = {
            id: '',
            name: '',
            short_name: '',
            kkni_qualification: '',
            acceptance_requirement: '',
            further_education_level: '',
            professional_status: '',
            course_language: '',
        }
    }, 300)
}
onMounted(async () => {
    await getData(limit, 1, search)
})
</script>

<template>
    <div>
        <div v-if="mode == 'edit'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                <VCard>
                    <VCardTitle class="pa-4 bg-secondary">
                        <span class="title text-white">tambah predikat kelulusan</span>
                    </VCardTitle>
                    <VCardText>
                        <VForm ref="form" v-model="valid" lazy-validation>
                            <VRow>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateMasterSKPI.name" variant="outlined" hide-details label="*Jenjang" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateMasterSKPI.kkni_qualification" variant="outlined" hide-details label="Kualifikasi KKNI" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateMasterSKPI.acceptance_requirement" variant="outlined" hide-details label="Persyaratan Penerimaan" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateMasterSKPI.further_education_level" variant="outlined" hide-details label="Jenis dan Jejang Pendidikan Lanjutan" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateMasterSKPI.professional_status" variant="outlined" hide-details label="Status Profesi" />
                                </VCol>
                                <VCol cols="12" sm="12">
                                    <v-text-field v-model="updateMasterSKPI.course_language" variant="outlined" hide-details label="Bahasa Pengantar Kuliah" />
                                </VCol>
                                <VCardActions class="pa-4">
                                    <VSpacer />
                                    <VBtn color="error" @click="close">
                                    Batal
                                    </VBtn>
                                    <VBtn color="secondary" :disabled="updateMasterSKPI.name == ''" @click="update()">
                                    Ubah
                                    </VBtn>
                                </VCardActions>
                            </VRow>
                        </VForm>
                    </VCardText>
                </VCard>
                </VDialog>
            </VCol>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title">
            <VCol cols="12" lg="4" md="6">
                <v-text-field density="compact" :label="'Pencarian '+title" hide-details variant="outlined" @input="getData(limit, pagination.page, $event.target.value)" />
            </VCol>
        </SharedUiParentCard>
        <VTable class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jenjang</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kualifikasi KKNI</th>
                    <th class="text-subtitle-1 font-weight-semibold">Persyaratan Penerimaan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jenis dan Jejang Pendidikan Lanjutan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status Profesi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Bahasa Pengantar Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in masterSKPIList">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.kkni_qualification }}</td>
                    <td>{{ item.acceptance_requirement }}</td>
                    <td>{{ item.further_education_level }}</td>
                    <td>{{ item.professional_status }}</td>
                    <td>{{ item.course_language }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <VTooltip text="Ubah">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="editItem(item)">
                                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                                </template>
                            </VTooltip>
                        </div>
                    </td>
                </tr>
            </tbody>
        </VTable>
    </div>
</template>