<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetStudentData } from '~~/types/api/admin-student/GetAdminStudent';
import { BulkAssignStudentAccountRequest, UserDataResponse } from "~~/types/api/account/BulkAssignStudentAccount";
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
const title = ref('Akun Mahasiswa')
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
const students = ref<GetStudentData[]>([])
const createAuthenticationAccountObj = ref({
    authentication_type: 'student',
    user_id: '',
    user_name: '',
})
const authenticationAccountObj = ref({
    authentication_id: '',
    user_name: '',
})
const showUserPassObj = ref({
    username: '',
    password: ''
})
const newPasswordStr = ref('')
const blockAuthStudentObj = ref({
    id: '',
    name: '',
    is_active: false,
    suspension_remarks: '',
})
const userIds = ref(<string[]>[])
const bulkResponseData = ref(<UserDataResponse[]>[])

async function getData(limit: number, page: number, search: String) {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/admin_student.AdminStudentHandler/GetList?limit=${limit}&page=${page}&studyProgramId&studentForceFrom&studentForceTo&nimNumberFrom&name=${search}`, <any>{
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
        students.value = _resp.value.data
    } catch (error) {
        alert(error)
    }
}
async function assignStudent(item: any) {
    if (item.authentication_id != '') {
        alert('user sudah di tetapkan untuk login')
        return false
    }
    createAuthenticationAccountObj.value = {
        authentication_type: 'student',
        user_id: item.id,
        user_name: item.name,
    }
    dialog.value = true
    mode.value = 'assign'
}
async function deleteAuthStudent(item: any) {
    authenticationAccountObj.value = {
        authentication_id: item.authentication_id,
        user_name: item.name,
    }
    dialog.value = true
    mode.value = 'delete'
}
async function closeDialogAssign(data: any) {
    if (data.dialog) {
        dialog.value = false
    }
    createAuthenticationAccountObj.value = {
        authentication_type: 'student',
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
async function closeDialogResetPassword(data: any) {
    authenticationAccountObj.value = {
        authentication_id: '',
        user_name: '',
    }
    if (data.dialog) {
        dialog.value = false
    }
    newPasswordStr.value = data.data?.new_password
    await getData(limit, 1, search.value)
    mode.value = 'show-new-password'
    dialog.value = true
}
function close() {
    dialog.value = false
}
async function closeDialogDeleteAuthStudent(data: any) {
    if (data) {
        dialog.value = false
    }
    authenticationAccountObj.value = {
        authentication_id: '',
        user_name: '',
    }
    await getData(limit, 1, search.value)
}
function resetPassword(item: any) {
    authenticationAccountObj.value = {
        authentication_id: item.authentication_id,
        user_name: item.name,
    }
    dialog.value = true
    mode.value = 'reset-password'
}
function blockAuthStudent(item: any) {
    blockAuthStudentObj.value = {
        id: item.authentication_id,
        name: item.name,
        is_active: false,
        suspension_remarks: '',
    }
    dialog.value = true
    mode.value = 'block-auth-student'
}
async function closeDialogBlockAuthStudent(data: any) {
    if (data) {
        dialog.value = false
    }
    blockAuthStudentObj.value = {
        id: '',
        name: '',
        is_active: false,
        suspension_remarks: '',
    }
    await getData(limit, 1, search.value)
}
const dataDetail = ref({
    id: '',
    name: '',
    sex: '',
    marital_status: '',
    birth_regency_id: 0,
    birth_regency_name: '',
    birth_date: '',
    religion: '',
    address: '',
    rt: '',
    rw: '',
    village_id: 0,
    village_name: '',
    district_id: 0,
    district_name: '',
    regency_id: 0,
    regency_name: '',
    province_id: 0,
    province_name: '',
    country_id: 0,
    country_name: '',
    postal_code: '',
    previous_address: '',
    id_number: '',
    npwp_number: '',
    nisn_number: '',
    residence_type: '',
    transportation_mean: '',
    kps_receiver: '',
    phone_number: '',
    mobile_phone_number: '',
    email: '',
    homepage: '',
    work_type: '',
    work_place: '',
    nationality: '',
    askes_number: '',
    total_brother: 0,
    total_sister: 0,
    hobby: '',
    experience: '',
    total_dependent: 0,
    nim_number: 0,
    student_force: 0,
    admittance_semester: '',
    study_program_id: '',
    study_program_name: '',
    study_program_code: '',
    curriculum_id: '',
    curriculum_name: '',
    admittance_test_number: '',
    admittance_date: '',
    admittance_status: '',
    total_transfer_credit: '',
    previous_college: '',
    previous_study_program: '',
    previous_nim_number: '',
    previous_nim_admittance_year: '',
    status: '',
    is_foreign_student: false,
    college_entrance_type: '',
    class_time: '',
    fund_source: '',
    is_scholarship_grantee: false,
    has_complete_requirement: false,
    school_certificate_type: '',
    school_graduation_year: '',
    school_name: '',
    school_accreditation: '',
    school_address: '',
    school_major: '',
    school_certificate_number: '',
    school_certificate_date: '',
    total_school_final_exam_subject: '',
    school_final_exam_score: 0,
    guardian_name: '',
    guardian_birth_date: '',
    guardian_death_date: '',
    guardian_address: '',
    guardian_regency_id: '',
    guardian_regency_name: '',
    guardian_postal_code: '',
    guardian_phone_number: '',
    guardian_email: '',
    guardian_final_academic_background: '',
    guardian_occupation: '',
    father_id_number: '',
    father_name: '',
    father_birth_date: '',
    father_death_date: '',
    mother_id_number: '',
    mother_name: '',
    mother_birth_date: '',
    mother_death_date: '',
    parent_address: '',
    parent_regency_id: 0,
    parent_regency_name: '',
    parent_postal_code: '',
    parent_phone_number: '',
    parent_email: '',
    father_final_academic_background: '',
    father_occupation: '',
    mother_final_academic_background: '',
    mother_occupation: '',
    parent_income: 0,
    is_financially_capable: false,
    authentication_id: '',
    authentication_is_active: false,
    authentication_suspension_remarks: '',
})
function showItem(item: any) {
    dialog.value = true
    mode.value = 'detail'
    dataDetail.value = {
        id: item.id,
        name: item.name,
        sex: '',
        marital_status: '',
        birth_regency_id: 0,
        birth_regency_name: '',
        birth_date: '',
        religion: '',
        address: '',
        rt: '',
        rw: '',
        village_id: 0,
        village_name: '',
        district_id: 0,
        district_name: '',
        regency_id: 0,
        regency_name: '',
        province_id: 0,
        province_name: '',
        country_id: 0,
        country_name: '',
        postal_code: '',
        previous_address: '',
        id_number: '',
        npwp_number: '',
        nisn_number: '',
        residence_type: '',
        transportation_mean: '',
        kps_receiver: '',
        phone_number: '',
        mobile_phone_number: '',
        email: '',
        homepage: '',
        work_type: '',
        work_place: '',
        nationality: '',
        askes_number: '',
        total_brother: 0,
        total_sister: 0,
        hobby: '',
        experience: '',
        total_dependent: 0,
        nim_number: item.nim_number,
        student_force: 0,
        admittance_semester: '',
        study_program_id: item.study_program_id,
        study_program_name: item.study_program_name,
        study_program_code: item.study_program_code,
        curriculum_id: '',
        curriculum_name: '',
        admittance_test_number: '',
        admittance_date: item.admittance_date,
        admittance_status: '',
        total_transfer_credit: '',
        previous_college: '',
        previous_study_program: '',
        previous_nim_number: '',
        previous_nim_admittance_year: '',
        status: '',
        is_foreign_student: false,
        college_entrance_type: '',
        class_time: '',
        fund_source: '',
        is_scholarship_grantee: false,
        has_complete_requirement: false,
        school_certificate_type: '',
        school_graduation_year: '',
        school_name: '',
        school_accreditation: '',
        school_address: '',
        school_major: '',
        school_certificate_number: '',
        school_certificate_date: '',
        total_school_final_exam_subject: '',
        school_final_exam_score: 0,
        guardian_name: '',
        guardian_birth_date: '',
        guardian_death_date: '',
        guardian_address: '',
        guardian_regency_id: '',
        guardian_regency_name: '',
        guardian_postal_code: '',
        guardian_phone_number: '',
        guardian_email: '',
        guardian_final_academic_background: '',
        guardian_occupation: '',
        father_id_number: '',
        father_name: '',
        father_birth_date: '',
        father_death_date: '',
        mother_id_number: '',
        mother_name: '',
        mother_birth_date: '',
        mother_death_date: '',
        parent_address: '',
        parent_regency_id: 0,
        parent_regency_name: '',
        parent_postal_code: '',
        parent_phone_number: '',
        parent_email: '',
        father_final_academic_background: '',
        father_occupation: '',
        mother_final_academic_background: '',
        mother_occupation: '',
        parent_income: 0,
        is_financially_capable: false,
        authentication_id: item.authentication_id,
        authentication_is_active: item.authentication_is_active,
        authentication_suspension_remarks: item.authentication_suspension_remarks,
    }
}
async function selectedAll() {
    if (!(userIds.value.some(el => el === 'all'))) {
        students.value?.forEach(function (item) {
            userIds.value.push(item.id)
        })
    } else {
        userIds.value = <string[]>[]
    }
}
async function assignStudentBulk() {
    if (!confirm('Yakin Memberikan Hak Akses Pada User Yang Dipilih')) {
        return false
    }

    let tempIds:string[]=[]
    userIds.value.forEach((uid)=>{
        if(uid!="all") tempIds.push(uid)
    })

    let req = <BulkAssignStudentAccountRequest>{
        authentication_type: 'student',
        user_ids: tempIds,
    }
    try {
        const { response: createResponse, error } = await bulkAssignStudentAccount(req)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        
        if (createResponse) {
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
async function resetPasswordBulk() {
    if (!confirm('Yakin Mereset Password Pada User Yang Dipilih')) {
        return false
    }
    let req = <BulkAssignStudentAccountRequest>{
        authentication_type: 'student',
        user_ids: userIds.value,
    }
    try {
        const { response: createResponse, error } = await bulkAssignStudentAccount(req)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (createResponse) {
            mode.value = 'show-user-bluk'
            dialog.value = true
            bulkResponseData.value = createResponse.data
        }

    } catch (error) {
        alert(error)
        // return false;
    }
}

watch(search, async function (value) {
    if (value != '') {
        await getData(limit, 1, value)
    }
})

onMounted(async () => {
    await getData(limit, 1, '')
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
        <div v-if="mode == 'detail'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicDetail :title="title" :data="dataDetail" />
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'block-auth-student'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicBlockAuthStudent :title="title" :dialog="dialog" :data="blockAuthStudentObj"
                        @closeDialog="(data: any) => closeDialogBlockAuthStudent(data)" />
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'delete'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicDeleteAuthStudent :title="title" :dialog="dialog"
                        :data="authenticationAccountObj" @closeDialog="(data: any) => closeDialogDeleteAuthStudent(data)" />
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'reset-password'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicResetPassword :title="title" :dialog="dialog" :data="authenticationAccountObj"
                        @closeDialog="(data: any) => closeDialogResetPassword(data)" />
                </VDialog>
            </VCol>
        </div>
        <div v-if="mode == 'assign'">
            <VCol cols="12" lg="8" md="6" class="text-right">
                <VDialog v-model="dialog" max-width="800">
                    <PagesAdminPortalAcademicAssignStudent :title="title" :dialog="dialog"
                        :data="createAuthenticationAccountObj" @closeDialog="(data: any) => closeDialogAssign(data)" />
                </VDialog>
            </VCol>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'Daftar ' + title">
            <VCol cols="12" lg="4" md="6">
                <v-text-field v-model="search" density="compact" :label="'Pencarian ' + title" hide-details
                    variant="outlined" />
            </VCol>
            <!-- <VCol cols="12" lg="8" md="6" class="text-right">
                <VBtn color="primary" flat class="ml-auto" @click="create()">
                <VIcon class="mr-2">
                    mdi-account-multiple-plus
                </VIcon>Tambah {{ title }}
                </VBtn>
            </VCol> -->
        </SharedUiParentCard>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">
                        <v-checkbox v-model="userIds" :value="'all'" hide-details variant="outlined"
                            @click="selectedAll"></v-checkbox>
                    </th>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nim</th>
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
                <tr v-for="item, index in students">
                    <td>
                        <v-checkbox v-model="userIds" :value="item.id" hide-details variant="outlined"></v-checkbox>
                    </td>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.nim_number }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.study_program_name ?? '-' }}</td>
                    <td>{{ item.status ?? '-' }}</td>
                    <td v-if="item.authentication_id != ''" style="color: green">Sudah</td>
                    <td v-else style="color: red">Belum</td>
                    <td v-if="item.authentication_suspension_remarks == ''" style="color: green">Tidak</td>
                    <td v-else style="color: red">Ya</td>
                    <td>{{ item.authentication_suspension_remarks }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Detail">
                                <template #activator="{ props }">
                                    <VBtn icon flat v-bind="props" @click="showItem(item)">
                                        <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </VBtn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Berikan Akses">
                                <template #activator="{ props }">
                                    <VBtn icon flat v-bind="props">
                                        <v-icon color="primary" @click="assignStudent(item)">
                                            mdi-share
                                        </v-icon>
                                    </VBtn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Reset Password">
                                <template #activator="{ props }">
                                    <VBtn icon flat v-bind="props">
                                        <v-icon color="primary" @click="resetPassword(item)">
                                            mdi-refresh
                                        </v-icon>
                                    </VBtn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Blokir">
                                <template #activator="{ props }">
                                    <VBtn icon flat v-bind="props">
                                        <v-icon class="text-error" @click="blockAuthStudent(item)">
                                            mdi-block-helper
                                        </v-icon>
                                    </VBtn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Hapus Akses">
                                <template #activator="{ props }">
                                    <VBtn icon flat v-bind="props" @click="deleteAuthStudent(item)">
                                        <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                    </VBtn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="10">
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
        </v-table>
    </div>
</template>