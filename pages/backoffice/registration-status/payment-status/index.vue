<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetStudentListData, GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { BulkUpdateStudentPaymentRequest } from '~~/types/api/student/BulkUpdateStudentPayment';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { bulkUpdateStudentPayment } from '~~/composables/api/student/bulkUpdateStudentPayment';
import { getStudentList } from '~~/composables/api/student/getStudentList';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Daftar Mahasiswa')
const breadcrumbs = ref([
    {
        text: title.value,
        disabled: false,
        href: '/backoffice'
    },
    {
        text: title.value,
        disabled: true,
        href: '#'
    }
]);
const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

const AdminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const study_program_id = ref('')
const name = ref('')
const nim_from = ref('')
const nim_to = ref('')
const has_paid = ref('')
const studentRequests = ref(<GetStudentListRequest>{
    studyProgramId: '',
    studentForceFrom: '',
    studentForceTo: '',
    nimNumberFrom: '',
    nimNumberTo: '',
    name: '',
    address: '',
    regencyId: '',
    status: [],
    getAcademicGuidance: '',
    hasAuthentication: '',
    studyPlanSemesterId: '',
    studyPlanIsApproved: '',
    studyPlanIsSubmitted: '',
    hasStudyPlan: '',
    statusSemesterId: '',
    isRegistered: '',
    hasPaid: '',
    isGraduateEligible: '',
    isThesisEligible: '',
    yudiciumSessionId: '',
})
const students = ref(<GetStudentListData[]>[])
const studentIds = ref(<string[]>[])

async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            AdminStudyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getStudent(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getStudentList(limit, page, studentRequests.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
async function selectedAll(){
    if(!(studentIds.value.some(el => el === 'all'))){
        students.value?.forEach(function(item){
            if(!item.has_paid){
                studentIds.value.push(item.id)
            }
        })
    }else{
        studentIds.value = <string[]>[]
    }
}
async function clear(){
    study_program_id.value = ''
    name.value = ''
    nim_from.value = ''
    nim_to.value = ''
    has_paid.value = ''
    studentRequests.value = {
        studyProgramId: '',
        studentForceFrom: '',
        studentForceTo: '',
        nimNumberFrom: '',
        nimNumberTo: '',
        name: '',
        address: '',
        regencyId: '',
        status: [],
        getAcademicGuidance: '',
        hasAuthentication: '',
        studyPlanSemesterId: '',
        studyPlanIsApproved: '',
        studyPlanIsSubmitted: '',
        hasStudyPlan: '',
        statusSemesterId: '',
        isRegistered: '',
        hasPaid: '',
        isGraduateEligible: '',
        isThesisEligible: '',
    }
    await getStudent(limit, 1)
}
async function save(){
    let student_ids = studentIds.value.filter(x => x != 'all')

    if(student_ids.length == 0){
        alert('Harap Pilih Mahasiswa')
        return false
    }
    let req = <BulkUpdateStudentPaymentRequest>{
        student_ids: student_ids
    }
    try {
        const { response: resp, error: error } = await bulkUpdateStudentPayment(req)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
    } catch (error) {
        alert(error)
    }
    await getStudent(limit, 1)
}
watch(nim_to, async function(value){
    if(value != '' && value.length > 3){
        studentRequests.value.nimNumberFrom = nim_from.value
        studentRequests.value.nimNumberTo = value
        await getStudent(limit, 1)
    }
})
watch(has_paid, async function(value){
    studentRequests.value.hasPaid = value
    await getStudent(limit, 1)
})
watch(name, async function(value){
    if(value != ''){
        studentRequests.value.name = value
        await getStudent(limit, 1)
    }
})
watch(study_program_id, async function(value){
    if(value != ''){
        studentRequests.value.studyProgramId = value
        await getStudent(limit, 1)
    }
})
onMounted(async () => {
    await getAdminStudyProgram()
    await getStudent(limit, 1)
})
</script>
<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Pencarian Mahasiswa">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="study_program_id" variant="outlined" hide-details :items="AdminStudyPrograms" item-value="id" item-title="name" label="Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field v-model="name" variant="outlined" hide-details label="Nama"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="has_paid" :items="[{title: 'Bayar', value: 1}, {title: 'Belum', value: 0}]" variant="outlined" hide-details label="Status Bayar"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field v-model="nim_from" variant="outlined" hide-details label="NIM Dari:"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field v-model="nim_to" variant="outlined" hide-details label="NIM Sampai:"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-btn color="primary" flat class="ml-2" @click="clear()">
                                <v-icon class="mr-2">
                                    mdi-restart
                                </v-icon>Reset Filter
                            </v-btn>
                            <nuxt-link :to="'/backoffice/registration-status/registration-status-print'" target="_blank">
                                <v-btn color="primary" flat class="ml-2">
                                    <v-icon class="mr-2">
                                        mdi-printer
                                    </v-icon>Cetak
                                </v-btn>
                            </nuxt-link>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
            <v-table class="mt-5">
                <thead>
                    <tr>
                        <th class="text-subtitle-1 font-weight-semibold">
                            <v-checkbox v-model="studentIds" :value="'all'" hide-details variant="outlined" @click="selectedAll"></v-checkbox>
                        </th>
                        <th class="text-subtitle-1 font-weight-semibold">No</th>
                        <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                        <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                        <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                        <th class="text-subtitle-1 font-weight-semibold">Status Bayar</th>
                        <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, index in students" :key="item.id">
                        <td class="text-subtitle-1">
                            <v-checkbox v-if="!item.has_paid" v-model="studentIds" :value="item.id" hide-details variant="outlined"></v-checkbox>
                        </td>
                        <td class="text-subtitle-1">{{ index + 1 }}</td>
                        <td class="text-subtitle-1">{{ item.nim_number }}</td>
                        <td class="text-subtitle-1">{{ item.name }}</td>
                        <td class="text-subtitle-1">{{ item.study_program_name }}</td>
                        <td class="text-subtitle-1">{{ item.has_paid ? 'Lunas' : 'Belum' }}</td>
                        <td class="text-subtitle-1">
                            <v-tooltip text="Riwayat Pembayaran">
                                <template #activator="{ props }">
                                    <nuxt-link :to="'/backoffice/registration-status/payment-status/'+item.id">
                                        <v-btn icon flat v-bind="props">
                                            <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                        </v-btn>
                                    </nuxt-link>
                                </template>
                            </v-tooltip>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <v-btn color="primary" flat class="ml-auto" @click="save()">
                                <v-icon class="mr-2">
                                    mdi-content-save
                                </v-icon>Bayar Yang Terseleksi
                            </v-btn>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages" :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next" @prevPage="getStudent(limit, pagination.prev)" @jumpPage="(page: any) => getStudent(limit, page)" @nextPage="getStudent(limit, pagination.next)" />
                        </td>
                    </tr>
                </tfoot>
            </v-table>
        </v-row>
    </div>
</template>