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
import { GetRegistrationThesisData } from '~~/types/api/thesis/GetRegistrationThesis';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getRegistrationThesis } from '~~/composables/api/admin-thesis/getRegistrationThesis';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Pengelolaan Ujian TA')
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
const search = ref('')
const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

const mode = ref('')
const dialog = ref(false)
const semesters = ref<GetSemesterListData[]>([])
const semester_id = ref('')
const studyPrograms = ref(<GetAdminStudyProgramListData[]>[])
const study_program_id = ref('')
const datas = ref<GetRegistrationThesisData[]>([])
const result = ref<GetRegistrationThesisData[]>([])
const single_result = ref(<GetRegistrationThesisData>{})

async function getData(limit: number, page: number, search: string ) {
    try {
        const { response: resp, error: error } = await getRegistrationThesis(limit, page, search, study_program_id.value, '', semester_id.value)
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

async function getStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyPrograms.value = resp?.data
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
            semesters.value.forEach((s) => {
                s.semester_type_year = s.semester_type + " " + s.school_year
            })
        }
    } catch (error) {
        alert(error)
    }
}

function create(){
    dialog.value = true
    mode.value = 'create'
}

function close(){
    dialog.value = false
}

function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

async function reload(){
    result.value = <GetRegistrationThesisData[]>[]
    await getData(pagination.value.limit, 1, '')
    if(datas.value.length > 0){
        for (let index = 0; index < datas.value.length; index++) {
            const element = datas.value[index];
            if(datas.value[index].thesis_defense_id != ''){
                result.value.push(element) 
            }
        }
    }
}

function updateItem(item: any){
    single_result.value = item
    mode.value = 'update'
    dialog.value = true
}

watch(semester_id, async (value) => {
    await getData(pagination.value.limit, pagination.value.page, search.value)
    await getStudyProgram()
    await getSemester()
});

watch(study_program_id, async (value) => {
    await getData(pagination.value.limit, pagination.value.page, search.value)
    await getStudyProgram()
    await getSemester()
});

onMounted(async () => {
    await getData(pagination.value.limit, pagination.value.page, search.value)
    await getStudyProgram()
    if(datas.value.length > 0){
        for (let index = 0; index < datas.value.length; index++) {
            const element = datas.value[index];
            if(datas.value[index].thesis_defense_id != ''){
                result.value.push(element) 
            }
        }
    }
})
</script>

<template>
    <div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeThesisEditThesisDefence :data="single_result" @reload="reload()" @close="close()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeThesisCreateThesisDefence :studyProgramId="study_program_id" :semesterId="semester_id" @reload="reload()" @close="close()" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Pencarian Aktivitas Mahasiswa">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field density="compact" v-model="search" label="Cari Tugas Akhir" hide-details
                                variant="outlined" @input="getData(limit, 1, $event.target.value)"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-autocomplete :items="studyPrograms" item-value="id" item-title="name" variant="outlined" hide-details label="Pillih Program Studi" v-model="study_program_id"></v-autocomplete>
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
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()" :disabled="semester_id == '' || study_program_id == ''">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Ujian TA
                            </v-btn>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status Ujian TA</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Mahasiswa</th>
                    <th class="text-subtitle-1 font-weight-semibold">Prodi</th>
                    <!-- <th class="text-subtitle-1 font-weight-semibold">Tanggal Daftar</th> -->
                    <th class="text-subtitle-1 font-weight-semibold">Ujian Ke</th>
                    <th class="text-subtitle-1 font-weight-semibold">Rencana TA</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jam Rencana TA</th>
                    <th class="text-subtitle-1 font-weight-semibold">Terlaksana TA</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jam Terlaksana TA</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status Tugas Akhir</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in result">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <v-btn flat solo color="success" v-if="item.thesis_defense_is_passed">Selesai</v-btn>
                        <v-btn flat solo color="error" v-else>Belum Selesai</v-btn>
                    </td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <!-- <td>{{ convertDayOfWeek(new Date(item.created_at).getDay()) }}, {{ formatYearMonthDate(item.created_at) }}</td> -->
                    <td>{{ item.thesis_defense_count }}</td>
                    <td>
                        <p v-if="item.thesis_defense_plan_date">
                            {{ convertDayOfWeek(new Date(item.thesis_defense_plan_date).getDay()) }}, {{ formatYearMonthDate(item.thesis_defense_plan_date) }}
                        </p>
                        <p></p>
                    </td>
                    <td>
                        <p v-if="item.thesis_defense_plan_start_time">
                            {{ convertNumberTimeToStringTime(item.thesis_defense_plan_start_time) }} - {{ convertNumberTimeToStringTime(item.thesis_defense_plan_end_time) }}
                        </p>
                    </td>
                    <td>
                        <p v-if="item.thesis_defense_actual_date">
                            {{ convertDayOfWeek(new Date(item.thesis_defense_actual_date).getDay()) }}, {{ formatYearMonthDate(item.thesis_defense_actual_date) }}
                        </p>
                        <p></p>
                    </td>
                    <td>
                        <p v-if="item.thesis_defense_actual_start_time">
                            {{ convertNumberTimeToStringTime(item.thesis_defense_actual_start_time) }} - {{ convertNumberTimeToStringTime(item.thesis_defense_actual_end_time) }}
                        </p>
                    </td>
                    <td>{{ item.thesis_status }}</td>
                    <td>
                        <v-tooltip text="Proses Ujian TA">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" @click="updateItem(item)">
                                    <v-icon color="primary">
                                        mdi-calendar
                                    </v-icon>
                                </v-btn>
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