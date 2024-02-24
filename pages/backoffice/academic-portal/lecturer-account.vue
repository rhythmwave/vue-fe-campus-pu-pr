<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { BulkAssignStudentAccountRequest, UserDataResponse } from "~~/types/api/account/BulkAssignStudentAccount";
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetLecturerListPortalAcademic } from '~~/types/api/admin-lecturer/GetLecturerList';
import { bulkAssignStudentAccount } from '~~/composables/api/account/bulkAssignStudentAccount';
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
const search = ref('')
const title = ref('Akun Dosen')
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
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)
const lecturers = ref<GetLecturerListPortalAcademic[]>([])
const createAuthenticationAccountObj = ref({
    authentication_type: 'lecturer',
    user_id: '',
    user_name: '',
})
const showUserPassObj = ref({
    username: '',
    password: ''
})
const authenticationAccountObj = ref({
    authentication_id: '',
    user_name: '',
})
const newPasswordStr = ref('')
const blockAuthLecturerObj = ref({
    id: '',
    name: '',
    is_active: false,
    suspension_remarks: '',
})
const dataDetail = ref({
    id: '',
    name: '',
    phone_number: '',
    mobile_phone_number: '',
    office_phone_number: '',
    id_national_lecturer: '',
    front_title: '',
    back_degree: '',
    dikti_study_program_code: '',
    study_program_name: '',
    employment_status: '',
    status: '',
    authentication_id: '',
    authentication_is_active: false,
    authentication_suspension_remarks: '',
})
const userIds = ref(<string[]>[])
const bulkResponseData = ref(<UserDataResponse[]>[])

async function getData(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_lecturer.AdminLecturerHandler/GetList?limit=${limit}&page=${page}&search=${search}&idNationalLecturer&studyProgramId&employmentStatus`, <any>{
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
        lecturers.value = _resp.value.data
    } catch (error) {
        alert(error)
    }  
}
function showItem(item: any){
    dialog.value = true
    mode.value = 'detail'
    dataDetail.value = {
        id: item.id,
        name: item.name,
        phone_number: item.phone_number,
        mobile_phone_number: item.mobile_phone_number,
        office_phone_number: item.office_phone_number,
        id_national_lecturer: item.id_national_lecturer,
        front_title: item.front_title,
        back_degree: item.back_degree,
        dikti_study_program_code: item.dikti_study_program_code,
        study_program_name: item.study_program_name,
        employment_status: item.employment_status,
        status: item.status,
        authentication_id: item.authentication_id,
        authentication_is_active: item.lseauthentication_is_active,
        authentication_suspension_remarks: item.authentication_suspension_remarks,
    }
}
function assignLecturer(item: any){
    if(item.authentication_id != ''){
        alert('dosen sudah di tetapkan untuk login')
        return false
    }
    createAuthenticationAccountObj.value = {
        authentication_type: 'lecturer',
        user_id: item.id,
        user_name: item.name,
    }
    dialog.value = true
    mode.value = 'assign'
}
async function closeDialogAssign(data: any) {
    if(data.dialog){
        dialog.value = false
    }
    createAuthenticationAccountObj.value = {
        authentication_type: 'lecturer',
        user_id: '',
        user_name: '',
    }
    showUserPassObj.value = {
        username: data.data.username,
        password: data.data.password
    }
    await getData(limit, 1, search.value)
    mode.value = 'show-username-password'
    dialog.value = true
}
function resetPassword(item: any){
    authenticationAccountObj.value = {
        authentication_id: item.authentication_id,
        user_name: item.name,
    }
    dialog.value = true
    mode.value = 'reset-password'
}
function blockAuthLecturer(item: any){
    blockAuthLecturerObj.value = {
        id: item.authentication_id,
        name: item.name,
        is_active: false,
        suspension_remarks: '',
    }
    dialog.value = true
    mode.value = 'block-auth-lecturer'
}
function deleteAuthLecturer(item: any){
    authenticationAccountObj.value = {
        authentication_id: item.authentication_id,
        user_name: item.name,
    }
    dialog.value = true
    mode.value = 'delete'
}
async function closeDialogDeleteAuthLecturer(data: any){
    if(data){
        dialog.value = false
    }
    authenticationAccountObj.value = {
        authentication_id: '',
        user_name: '',
    }
    await getData(limit, 1, search.value)
}
async function closeDialogResetPassword(data: any){
    authenticationAccountObj.value = {
        authentication_id: '',
        user_name: '',
    }
    if(data.dialog){
        dialog.value = false
    }
    newPasswordStr.value = data.data?.new_password
    await getData(limit, 1, search.value)
    mode.value = 'show-new-password'
    dialog.value = true
}
async function closeDialogBlockAuthLecturer(data: any){
    if(data){
        dialog.value = false
    }
    blockAuthLecturerObj.value = {
        id: '',
        name: '',
        is_active: false,
        suspension_remarks: '',
    }
    await getData(limit, 1, search.value)
}
async function selectedAll(){
    if(!(userIds.value.some(el => el === 'all'))){
        lecturers.value?.forEach(function(item){
            userIds.value.push(item.id)
        })
    }else{
        userIds.value = <string[]>[]
    }
}
async function assignStudentBulk(){
    if(!confirm('Yakin Memberikan Hak Akses Pada User Yang Dipilih')){
        return false
    }
    let tempIds:string[]=[]
    userIds.value.forEach((uid)=>{
        if(uid!="all") tempIds.push(uid)
    })

    let req = <BulkAssignStudentAccountRequest>{
        authentication_type: 'lecturer',
        user_ids: tempIds,
    }
    try {
        const { response: createResponse, error } = await bulkAssignStudentAccount(req)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if(createResponse){
            mode.value = 'show-user-bluk'
            dialog.value = true
            bulkResponseData.value = createResponse.data
            await getData(limit, 1, search.value)
        }

    } catch (error) {
        alert(error)
        // return false;
    }
}
async function resetPasswordBulk(){
    if(!confirm('Yakin Mereset Password Pada User Yang Dipilih')){
        return false
    }
    let req = <BulkAssignStudentAccountRequest>{
        authentication_type: 'lecturer',
        user_ids: userIds.value,
    }
    try {
        const { response: createResponse, error } = await bulkAssignStudentAccount(req)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if(createResponse){
            mode.value = 'show-user-bluk'
            dialog.value = true
            bulkResponseData.value = createResponse.data
        }

    } catch (error) {
        alert(error)
        // return false;
    }
}
function close(){
    dialog.value = false
}
watch(search, async function(value){
    if(value != ''){
        await getData(limit, 1, value)
    }
})
onMounted(async () => {
    await getData(limit, 1, search.value)
})
</script>

<template>
    <div>
        <div v-if="mode == 'show-user-bluk'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <v-card max-height="600" style="overflow: auto;">
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Akses Login</span>
                        </v-card-title>
                        <v-card-text>
                            <v-table class="mt-5">
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                        <th class="text-subtitle-1 font-weight-semibold">User Login</th>
                                        <th class="text-subtitle-1 font-weight-semibold">Password</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in bulkResponseData">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.name }}</td>
                                        <td>{{ item.username }}</td>
                                        <td>{{ item.password }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                            <v-card-actions class="pa-4">
                                <VSpacer />
                                <VBtn color="error" @click="close">
                                Tutup
                                </VBtn>
                            </v-card-actions>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'detail'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicDetailLecturer :title="title" :data="dataDetail" />
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'block-auth-lecturer'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicBlockAuthLecturer :title="title" :dialog="dialog" :data="blockAuthLecturerObj" @closeDialog="(data: any) => closeDialogBlockAuthLecturer(data)" />
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'show-new-password'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <v-card max-height="600" style="overflow: auto;">
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Akses Login</span>
                        </v-card-title>
                        <v-card-text>
                            <p>Password Baru: {{ newPasswordStr }}</p>
                            <VCardActions class="pa-4">
                                <VSpacer />
                                <VBtn color="error" @click="close">
                                Batal
                                </VBtn>
                            </VCardActions>
                        </v-card-text>
                    </v-card>
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'reset-password'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicResetPassword :title="title" :dialog="dialog" :data="authenticationAccountObj" @closeDialog="(data: any) => closeDialogResetPassword(data)" />
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'delete'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicDeleteAuthLecturer :title="title" :dialog="dialog" :data="authenticationAccountObj" @closeDialog="(data: any) => closeDialogDeleteAuthLecturer(data)" />
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'show-username-password'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <v-card max-height="600" style="overflow: auto;">
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Akses Login</span>
                        </v-card-title>
                        <v-card-text>
                            <p>Username: {{ showUserPassObj.username }}</p>
                            <p>Password: {{ showUserPassObj.password }}</p>
                            <VCardActions class="pa-4">
                                <VSpacer />
                                <VBtn color="error" @click="close">
                                Batal
                                </VBtn>
                            </VCardActions>
                        </v-card-text>
                    </v-card>
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'assign'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicAssignLecturer :title="title" :dialog="dialog" :data="createAuthenticationAccountObj" @closeDialog="(data: any) => closeDialogAssign(data)" />
                </VDialog>
            </VCol>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'Daftar '+title">
            <VCol cols="12" lg="4" md="6">
                <v-text-field v-model="search" density="compact" :label="'Pencarian '+title " hide-details variant="outlined" />
            </VCol>
        </SharedUiParentCard>
        <VTable class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">
                        <v-checkbox v-model="userIds" :value="'all'" hide-details variant="outlined" @click="selectedAll"></v-checkbox>
                    </th>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIDN</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">Akses Login</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status Blokir Login Portal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Alasan Pemblokiran Login Portal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in lecturers">
                    <td>
                        <v-checkbox v-model="userIds" :value="item.id" hide-details variant="outlined"></v-checkbox>
                    </td>
                    <td>{{ index+1 }}</td>
                    <td>{{ item.id_national_lecturer }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.status ?? '-' }}</td>
                    <td v-if="item.authentication_id != ''" style="color: green">Sudah</td>
                    <td v-else style="color: red">Belum</td>
                    <td v-if="item.authentication_suspension_remarks == ''" style="color: green">Tidak</td>
                    <td v-else style="color: red">Ya</td>
                    <td>{{ item.authentication_suspension_remarks }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <VTooltip text="Detail">
                                <template #activator="{ props }">
                                    <VBtn icon flat v-bind="props" @click="showItem(item)">
                                        <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </VBtn>
                                </template>
                            </VTooltip>
                            <VTooltip text="Berikan Akses">
                                <template #activator="{ props }">
                                    <VBtn icon flat v-bind="props">
                                        <v-icon color="primary" @click="assignLecturer(item)">
                                            mdi-share
                                        </v-icon>
                                    </VBtn>
                                </template>
                            </VTooltip>
                            <VTooltip text="Reset Password">
                                <template #activator="{ props }">
                                    <VBtn icon flat v-bind="props">
                                        <v-icon color="primary" @click="resetPassword(item)">
                                            mdi-refresh
                                        </v-icon>
                                    </VBtn>
                                </template>
                            </VTooltip>
                            <VTooltip text="Blokir">
                                <template #activator="{ props }">
                                    <VBtn icon flat v-bind="props">
                                        <v-icon class="text-error" @click="blockAuthLecturer(item)">
                                            mdi-block-helper
                                        </v-icon>
                                    </VBtn>
                                </template>
                            </VTooltip>
                            <VTooltip text="Hapus Akses">
                                <template #activator="{ props }">
                                <VBtn icon flat v-bind="props" @click="deleteAuthLecturer(item)">
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
                            @prevPage="getData(pagination.limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getData(pagination.limit, page, search)"
                            @nextPage="getData(pagination.limit, pagination.next, search)" />
                    </td>
                </tr>
                <tr>
                    <td colspan="10">
                        <v-tooltip text="Berikan Akses Yang Terseleksi">
                            <template #activator="{ props }">
                                <v-btn flat v-bind="props" color="primary" @click="assignStudentBulk">
                                    <v-icon color="white">
                                        mdi-share
                                    </v-icon>
                                    Berikan Akses User Yang Terseleksi
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Reset Password Yang Terseleksi">
                            <template #activator="{ props }">
                                <v-btn flat v-bind="props" color="primary" class="ml-2" @click="resetPasswordBulk">
                                    <v-icon color="white">
                                        mdi-refresh
                                    </v-icon>
                                    Reset Password User Yang Terseleksi
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </td>
                </tr>
            </tfoot>
        </VTable>
    </div>
</template>