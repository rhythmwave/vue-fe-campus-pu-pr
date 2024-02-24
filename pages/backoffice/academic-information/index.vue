<script setup lang="ts">
import moment from 'moment';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';

import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import Detail from '@/components/pages/academic-information/Detail.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetAcademicInformationListData } from '~~/types/api/academic-information/GetAcademicInformation';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';

import { getAcademicInformationList } from '~~/composables/api/academic-information/getAcademicInformationList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { deleteAcademicInformation } from '~~/composables/api/academic-information/deleteAcademicInformation';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Informasi Akademik')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: title.value,
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
const type = ref('')
const dialog = ref(false)
const mode = ref('')
const datas = ref(<GetAcademicInformationListData[]>[])
const singleData = ref(<GetAcademicInformationListData>{})
const studyPrograms = ref<GetAdminStudyProgramListData[]>([])

async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, "", "")
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
async function getData(limit: number, page: number) {
    try {
        const { response: resp, error } = await getAcademicInformationList(limit, page, search.value, type.value)
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
        console.log(error)
    }
}
function create(){
    mode.value = 'create'
    dialog.value = true
}
function close(){
    dialog.value = false
}
function showItem(item: GetAcademicInformationListData){
    singleData.value = <GetAcademicInformationListData>{
        id: item.id,
        type: item.type,
        title: item.title,
        announcement_date: item.announcement_date,
        file_url: item.file_url,
        file_path: item.file_path,
        file_path_type: item.file_path_type,
        file_title: item.file_title,
        content: item.content,
        for_lecturer: item.for_lecturer,
        for_student: item.for_student,
        study_programs: item.study_programs
    }
    mode.value = 'show'
    dialog.value = true
}
function editItem(item: GetAcademicInformationListData){
    let study_program_ids = <string[]>[]

    item.study_programs.forEach(function(itm){
        study_program_ids.push(itm.study_program_id)
    })
    singleData.value = <GetAcademicInformationListData>{
        id: item.id,
        type: item.type,
        title: item.title,
        announcement_date: item.announcement_date,
        file_url: item.file_url,
        file_path: item.file_path,
        file_path_type: item.file_path_type,
        file_title: item.file_title,
        content: item.content,
        for_lecturer: item.for_lecturer,
        for_student: item.for_student,
        study_programs: item.study_programs
    }
    mode.value = 'edit'
    dialog.value = true
}
async function deleteItem(item: any){
    if(confirm('Are you sure you want to delete this item?')){
        try {
            const { response: createRoleResponse, error } = await deleteAcademicInformation(item.id)
            if (error) {
                let dataError = <ErrorRoot>error;
                alert(dataError.meta.message);
                return;
            } else {
                getData(20, 1)
            }
        } catch (error) {
            alert(error)
        }
    }
}
watch(search, async (value) => {
    await getData(pagination.value.limit, pagination.value.page)
})
watch(type, async (value) => {
    await getData(pagination.value.limit, pagination.value.page)
})
onMounted(async () => {
    await getData(pagination.value.limit, pagination.value.page)
    await getAdminStudyProgram()
})
</script>
<template>
    <div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesAcademicInformationCreate :title="title" @close="close" @reload="getData(pagination.limit, pagination.page)" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'edit'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesAcademicInformationUpdate :title="title" :data="singleData" @close="close" @reload="getData(pagination.limit, pagination.page)" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <Detail :data="singleData" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field v-model="search" variant="outlined" hide-details label="Cari Data"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-select v-model="type" :items="[
                                {title: 'Informasi Akademik',value: 'academic_information'},
                                {title: 'Aktifitas Mahasiswa',value: 'student_activity'},
                                {title: 'Registrasi',value: 'registration'},
                                {title: 'Acara',value: 'event'},
                            ]" variant="outlined" hide-details label="Tipe"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="4">
                            <v-btn color="primary" flat class="ml-auto" @click="create()">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah {{title}}
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
                    <th class="text-subtitle-1 font-weight-semibold">Judul</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
                    <th class="text-subtitle-1 font-weight-semibold">File</th>
                    <th class="text-subtitle-1 font-weight-semibold">Untuk Mahasiswa</th>
                    <th class="text-subtitle-1 font-weight-semibold">Untuk Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tipe</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in datas">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.title }}</td>
                    <td>
                        {{ convertDayOfWeek(moment(item.announcement_date).weekday() + 1) }}, {{ moment(item.announcement_date).format('DD-MM-YYYY') }}
                    </td>
                    <td>
                        <a :href="item.file_url" target="_blank" :rel="item.file_title">
                            {{ item.file_title }}
                        </a>
                    </td>
                    <td>{{ item.for_lecturer ? 'Ya' : 'Tidak' }}</td>
                    <td>{{ item.for_student ? 'Ya' : 'Tidak' }}</td>
                    <td>{{ item.type }}</td>
                    <td>
                        <ul>
                            <li v-for="itm in item.study_programs">{{ itm.study_program_name }}</li>
                        </ul>    
                    </td>
                    <td>
                        <v-tooltip text="Lihat">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" @click="showItem(item)">
                                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Lihat">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" @click="editItem(item)">
                                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Hapus">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" @click="deleteItem(item)">
                                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                </v-btn>
                            </template>
                        </v-tooltip>    
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                        :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                        :prev="pagination.prev" :next="pagination.next"
                        @prevPage="getData(pagination.limit, pagination.prev)"
                        @jumpPage="(page: any) => getData(pagination.limit, page)"
                        @nextPage="getData(pagination.limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>