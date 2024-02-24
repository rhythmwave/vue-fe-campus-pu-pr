<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetCuriculumListData } from "~~/types/api/curiculum/GetCuriculumList";
import { GetSubjectListData } from '~~/types/api/subject/GetSubjectList';

import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});
const title = ref('Nilai Mata Kuliah')
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
const valid = ref(true)
const mode = ref('list')
const search = ref('')
const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const paginationMBKM = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

const study_program_id = ref('')
const curriculum_id = ref('')
const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const adminSubjectValues = ref<GetSubjectListData[]>([])
const adminSubjectValueMBKM = ref<GetSubjectListData[]>([])
const selectedAdminStudyPrograms = ref(<GetAdminStudyProgramListData>{})
function adminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>adminStudyPrograms.value.find((x) => x.id == id)
    getData(pagination.value.limit, pagination.value.page, search.value)
}
const getCuriculumListObj = ref<GetCuriculumListData[]>([])
async function getData(limit: number, page: number, searchText: string) {
    try {
        // selectedAdminStudyPrograms.value = adminStudyProgram
        search.value = searchText;
        const { response: resp, error: error } = await getCuriculumList(10000, 1, search.value, selectedAdminStudyPrograms.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getCuriculumListObj.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
    var curiculumIds:any = []
    if(getCuriculumListObj.value != null){
        getCuriculumListObj.value.forEach(function(item){
            curiculumIds.push(item.id)
        })
    }
    try {
        const { response: resp, error: error } = await getSubjectList(limit, page, searchText, curiculumIds, '', '', '', '', '', '')
        if (resp != null) {
            adminSubjectValues.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
    try {
        const { response: resp, error: error } = await getSubjectList(limit, page, searchText, curiculumIds, '', '', '', '', '', true)
        if (resp != null) {
            adminSubjectValueMBKM.value = resp?.data
            paginationMBKM.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
    
}
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function adminCuriculumOnChange(items: any){
    try {
        const { response: resp, error: error } = await getSubjectList(100000, 1, '', items, '', '', '', '', '', '')
        if (resp != null) {
            adminSubjectValues.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
    try {
        const { response: resp, error: error } = await getSubjectList(100000, 1, '', items, '', '', '', '', '', true)
        if (resp != null) {
            adminSubjectValueMBKM.value = resp?.data
            paginationMBKM.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    await getAdminStudyProgram()
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="'Daftar '+title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Pilih Program Studi">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="study_program_id" variant="outlined" hide-details :items="adminStudyPrograms" item-value="id"
                                item-title="name" label="Pilih Program Studi"
                                @update:model-value="(sl: any) => adminStudyProgramsOnChange(sl)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="curriculum_id" variant="outlined" hide-details :items="getCuriculumListObj" item-value="id"
                                item-title="name" label="Pilih Curiculum"
                                @update:model-value="(sl: any) => adminCuriculumOnChange(sl)" multiple></v-select>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="'Daftar ' + title">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                @input="getData(pagination.limit, 1, $event.target.value)"></v-text-field>
                        </v-col>
                        <!-- <v-col cols="12" lg="8" md="6" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()"
                                :disabled="!selectedAdminStudyPrograms.id">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah {{title}}
                            </v-btn>
                        </v-col> -->
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <caption>Reguler</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kurikulum</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Semester</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in adminSubjectValues" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td class="text-subtitle-1">{{ item.study_program_name }}</td>
                    <td class="text-subtitle-1">{{ item.curriculum_name }}</td>
                    <td class="text-subtitle-1">{{ item.code }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.semester_package }}</td>
                    <td class="text-subtitle-1">{{ item.practicum_credit + item.theory_credit + item.field_practicum_credit }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Detail">
                                <template #activator="{ props }">
                                    <VBtn icon flat style="color: white" :disabled="study_program_id == '' || curriculum_id == ''">
                                        <NuxtLink :to="{path: '/backoffice/value-component/course-grade/'+item.id, query: { study_program_id: item.study_program_id, is_mbkm: false }}">
                                            <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                        </NuxtLink>
                                    </VBtn>
                                </template>
                            </v-tooltip>
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
                            @prevPage="getData(pagination.limit, pagination.prev, '')"
                            @jumpPage="(page: any) => getData(pagination.limit, page, '')"
                            @nextPage="getData(pagination.limit, pagination.next, '')" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
        <v-table class="mt-5">
            <caption>MBKM</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kurikulum</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kode Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Semester</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah SKS</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in adminSubjectValueMBKM" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td class="text-subtitle-1">{{ item.study_program_name }}</td>
                    <td class="text-subtitle-1">{{ item.curriculum_name }}</td>
                    <td class="text-subtitle-1">{{ item.code }}</td>
                    <td class="text-subtitle-1">{{ item.name }}</td>
                    <td class="text-subtitle-1">{{ item.semester_package }}</td>
                    <td class="text-subtitle-1">{{ item.practicum_credit + item.theory_credit + item.field_practicum_credit }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Detail">
                                <template #activator="{ props }">
                                    <VBtn icon flat style="color: white" :disabled="study_program_id == '' || curriculum_id == ''">
                                        <NuxtLink :to="{path: '/backoffice/value-component/course-grade/'+item.id, query: { study_program_id: item.study_program_id, is_mbkm: true }}">
                                            <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                        </NuxtLink>
                                    </VBtn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="paginationMBKM.limit" :page="paginationMBKM.page"
                            :total_pages="paginationMBKM.total_pages" :total_records="paginationMBKM.total_records"
                            :prev="paginationMBKM.prev" :next="paginationMBKM.next"
                            @prevPage="getData(paginationMBKM.limit, paginationMBKM.prev, '')"
                            @jumpPage="(page: any) => getData(paginationMBKM.limit, page, '')"
                            @nextPage="getData(paginationMBKM.limit, paginationMBKM.next, '')" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>