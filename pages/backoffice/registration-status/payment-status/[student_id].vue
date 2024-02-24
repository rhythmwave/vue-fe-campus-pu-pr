<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import moment from 'moment';

import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { GetStudentPaymentLogData } from '~~/types/api/student/GetStudentPaymentLog';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { getStudentPaymentLogList } from '~~/composables/api/student/getStudentPaymentLog';


definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Riwayat Pembayaran Mahasiswa')
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
const studentId = ref('')
const studentDetail = ref(<GetStudentDetailData>{})
const studentPaymentLog = ref(<GetStudentPaymentLogData[]>[])


async function detailStudent(id: string) {
    try {
        const { response: resp, error: error } = await getStudentDetail(id)
        console.log("response data")
        console.log(resp)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentDetail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getStudentPaymentLog(id: string) {
    try {
        const { response: resp, error: error } = await getStudentPaymentLogList(id)
        console.log("response data")
        console.log(resp)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentPaymentLog.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    studentId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await detailStudent(studentId.value)
    await getStudentPaymentLog(studentId.value)
    console.log(studentPaymentLog.value)
})
</script>
<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="12" md="12" class="text-left">
                            <v-table>
                                <thead>
                                    <tr>
                                        <th colspan="2" class="text-subtitle-1 font-weight-semibold"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Program Studi</td>
                                        <td>{{ studentDetail.study_program_name }}</td>
                                    </tr>
                                    <tr>
                                        <td>NIM</td>
                                        <td>{{ studentDetail.nim_number }}</td>
                                    </tr>
                                    <tr>
                                        <td>Nama</td>
                                        <td>{{ studentDetail.name }}</td>
                                    </tr>
                                    <tr>
                                        <td>Angkatan</td>
                                        <td>{{ studentDetail.student_force }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <nuxt-Link class="text-decoration-none color-inherits" :to="'/backoffice/registration-status/payment-status'">
                                <v-btn color="warning" flat class="ml-auto">
                                    <v-Icon class="mr-2">
                                        mdi-keyboard-backspace
                                    </v-Icon>Kembali
                                </v-btn>
                            </nuxt-Link>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Semester</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tanggal Pembayaran</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in studentPaymentLog">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.semester_school_year }} - {{ item.semester_type }}</td>
                    <td>
                        {{ moment(item.created_at).day() == 0 ? convertDayOfWeek(7) : convertDayOfWeek(moment(item.created_at).day()) }},
                        {{ moment(item.created_at).format('YYYY-MM-DD') }}
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>