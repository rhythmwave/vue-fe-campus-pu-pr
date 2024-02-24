<script setup lang="ts">
import moment from 'moment';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import user1 from '/images/profile/user-1.jpg';
import { GetAdminActivityLogListData, GetAdminActivityLogListRoot } from '~~/types/api/admin-activity-log/GetAdminActivityLogList';
import { PaginationModel } from '~~/types/api/pagination';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});


const store = useContactStore();

const page = ref({ title: 'Log Aktifitas Backoffice' });
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Log Aktifitas Backoffice',
        disabled: true,
        href: '#'
    }
]);


const months = [
    {
        name: "Januari",
        value: 1,
    },
    {
        name: "Februari",
        value: 2,
    },
    {
        name: "Maret",
        value: 3,
    },
    {
        name: "April",
        value: 4,
    },
    {
        name: "Mei",
        value: 5,
    },
    {
        name: "Juni",
        value: 6,
    },
    {
        name: "Juli",
        value: 7,
    },
    {
        name: "Agustus",
        value: 8,
    },
    {
        name: "September",
        value: 9,
    },
    {
        name: "Oktober",
        value: 10,
    },
    {
        name: "November",
        value: 11,
    },
    {
        name: "Desember",
        value: 12,
    },
]

const now = new Date();
let firstYear = 2019;

let selectedMonth = ref(now.getMonth() + 1);
let selectedYear = ref(now.getFullYear());
let years = <number[]>[];
for (let i = firstYear; i <= now.getFullYear(); i++) {
    years.push(i);
}


let limit = 20;
onMounted(() => {
    getData(limit, 1, selectedMonth.value, selectedYear.value);
});

const adminLogList = ref(<GetAdminActivityLogListData[]>[]);

const pagination = ref(<PaginationModel>{
    "page": 1,
    "limit": limit,
    "prev": 1,
    "next": 1,
    "total_pages": 1,
    "total_records": 0
});

async function getData(limit: number, page: number, month: number, year: number) {
    try {
        const { data: getAdminActivityLogList, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_admin_activity_log.RootAdminActivityLogHandler/GetList?limit=${limit}&page=${page}&month=${month}&year=${year}`, <any>{
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
        pagination.value = <PaginationModel>getAdminActivityLogList.value?.pagination;
        adminLogList.value = <GetAdminActivityLogListData[]>getAdminActivityLogList.value?.data;
        console.log(adminLogList.value);

    } catch (error) {
        alert(error)
    }

}

</script>

<template>
    <div>
        <SharedBackofficeBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></SharedBackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <SharedUiParentCard title="Log Aktifitas Backoffice">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="selectedMonth" label="Bulan" placeholder="Bulan" item-title="name"
                                item-value="value" :items="months" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="selectedYear" label="Tahun" placeholder="Tahun" item-title="name"
                                item-value="value" :items="years" />
                        </v-col>
                        <v-col cols="12" lg="4" md="4" class="text-right">
                            <v-btn color="primary" flat class="ml-auto"
                                @click="getData(limit, 1, selectedMonth, selectedYear)">
                                Tampilkan
                            </v-btn>
                        </v-col>
                    </v-row>
                </SharedUiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">Id</th>
                    <th class="text-subtitle-1 font-weight-semibold">Username</th>
                    <th class="text-subtitle-1 font-weight-semibold">Real Name</th>
                    <th class="text-subtitle-1 font-weight-semibold">Modul/Menu</th>
                    <th class="text-subtitle-1 font-weight-semibold">Action</th>
                    <th class="text-subtitle-1 font-weight-semibold">IP Address</th>
                    <th class="text-subtitle-1 font-weight-semibold">UserAgent</th>
                    <th class="text-subtitle-1 font-weight-semibold">Time Exceution(second)</th>
                    <th class="text-subtitle-1 font-weight-semibold">Memory Usage</th>
                    <th class="text-subtitle-1 font-weight-semibold">Date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in adminLogList" :key="item.id">
                    <td class="text-subtitle-1">{{ (pagination.limit * (pagination.page - 1)) + index + 1 }}</td>
                    <td class="text-subtitle-1">{{ item.admin_username }}</td>
                    <td class="text-subtitle-1">{{ item.admin_name }}</td>
                    <td class="text-subtitle-1">{{ item.module }}</td>
                    <td class="text-subtitle-1">{{ item.action }}</td>
                    <td class="text-subtitle-1">{{ item.ip_address }}</td>
                    <td class="text-subtitle-1">{{ item.user_agent }}</td>
                    <td class="text-subtitle-1">{{ item.execution_time }}</td>
                    <td class="text-subtitle-1">{{ item.memory_usage }}</td>
                    <td class="text-subtitle-1">{{ moment(item.created_at).format("DD MMMM YYYY") }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>