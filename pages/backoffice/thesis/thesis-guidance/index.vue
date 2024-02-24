<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { formatYearMonthDate, convertStringTimeToNumberTime, convertNumberTimeToStringTime } from '~~/utils/helpers/date-utils';

import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetThesisSupervisorLogData } from '~~/types/api/thesis/GetThesisSupervisorLog';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getThesisSupervisorLog } from '~~/composables/api/admin-thesis/getThesisSupervisorLog';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Bimbingan Tugas Akhir')
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
]);
const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const search = ref('')
const study_programs = ref(<GetAdminStudyProgramListData[]>[])
const study_program_id = ref('')
const semesters = ref<GetSemesterListData[]>([])
const semester_id = ref('')
const id_national_lecturer = ref('')
const datas = ref(<GetThesisSupervisorLogData[]>[])
const mode = ref('')
const dialog = ref(false)
const lecturer_id = ref('')

async function getStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            study_programs.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, study_program_id.value, "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function getData(limit: number, page: number, search: string ) {
    try {
        const { response: resp, error: error } = await getThesisSupervisorLog(limit, page, search, id_national_lecturer.value, semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            datas.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

function show(item: any){
    mode.value = 'show'
    dialog.value = true
    lecturer_id.value = item.id
}

function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

watch(semester_id, async (value) => {
    await getData(pagination.value.limit, 1, '')
});

watch(study_program_id, async (value) => {
    // await getData(pagination.value.limit, 1, '')
    await getSemester()
});

onMounted(async () => {
    await getStudyProgram()
});
</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeThesisShowThesisGuidance :lecturer-id="lecturer_id" :semester-id="semester_id" @reload="reload()" @close="close()" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="'Pencarian '+title">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field density="compact" v-model="search" :label="'Cari '+title " hide-details variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-autocomplete :items="study_programs" item-value="id" item-title="name" variant="outlined" hide-details label="Pillih Program Studi" v-model="study_program_id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="semester_id" item-value="id" variant="outlined" hide-details :items="semesters" label="Semester">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                    }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                            <li style="padding: 10px; margin: 2px;" @click="onClick">
                                                <span>{{ title.school_year }} - {{ title.semester_type
                                                }}</span>
                                            </li>
                                        </a>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIDN</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Mahasiswa Aktif</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Mahasiswa Selesai</th>
                    <th class="text-subtitle-1 font-weight-semibold">Pembimbing</th>
                    <th width="150" class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in datas">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.id_national_lecturer }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.active_supervised_thesis }}</td>
                    <td>{{ item.total_supervised_thesis }}</td>
                    <td>
                        <ul v-for="itm in item.thesis_supervisor_roles">
                            <li>
                                <p>{{ itm.name }} : {{ itm.total }}</p>
                            </li>
                        </ul>
                    </td>
                    <td>
                        <v-tooltip text="Lihat">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" @click="show(item)">
                                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Cetak">
                            <template #activator="{ props }">
                                <nuxt-link :to="'/backoffice/thesis/thesis-guidance/print?'+`lecturer_id=${item.id}&semester_id=${semester_id}`" target="_blank">
                                    <v-btn icon flat v-bind="props">
                                        <PrinterIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </nuxt-link>
                            </template>
                        </v-tooltip>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(pagination.limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getData(pagination.limit, page, search)"
                            @nextPage="getData(pagination.limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>