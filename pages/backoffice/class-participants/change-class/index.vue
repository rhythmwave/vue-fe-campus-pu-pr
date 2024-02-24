<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import { ErrorRoot } from '~~/types/api/error';

import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Pindah Kelas')
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
const studyPrograms = ref<GetAdminStudyProgramListData[]>([])
const studyProgramId = ref('')
const semester_id = ref('')
const classrooms = ref<GetClassroomListData[]>([])

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
async function getClassroom(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getClassroomList(limit, page, search, studyProgramId.value, semester_id.value, true, '', false)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classrooms.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}
watch(studyProgramId, async function(value){
    if(value != ''){
        await getClassroom(pagination.value.limit, pagination.value.page, search.value)
    }
})
watch(search, async function(value){
    if(value != ''){
        await getClassroom(pagination.value.limit, pagination.value.page, value)
    }
})
onMounted(async () => {
    await getAdminStudyProgram()
})
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="'Daftar '+title">
            <v-row>
                <v-col cols="12" lg="6" md="6">
                    <v-autocomplete v-model="studyProgramId" :items="studyPrograms" item-title="name" item-value="id" density="compact" :label="'Pilih Program Studi'" hide-details variant="outlined" />
                </v-col>
                <v-col cols="12" lg="6" md="6">
                    <v-text-field v-model="search" label="Cari Kelas" hide-details variant="outlined"></v-text-field>
                </v-col>
            </v-row>
        </SharedUiParentCard>
        <v-table class="mt-10">
            <caption>Daftar Kelas</caption>
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama Mata Kuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kapasitas Maksimal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Peserta</th>
                    <th class="text-subtitle-1 font-weight-semibold">KRS Belum Disetujui</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in classrooms">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_name }} ({{ item.subject_code }})</td>
                    <td>{{ item.name }}</td>
                    <td>
                        <ul v-for="lecturer in item.lecturers">
                            <li>{{ lecturer.name }}</li>
                        </ul>
                    </td>
                    <td>{{ item.maximum_participant }}</td>
                    <td>{{ item.total_participant }}</td>
                    <td>{{ item.unapproved_study_plan }}</td>
                    <td>
                        <v-col col="12" sm="12" class="float-left">
                            <nuxt-link :to="'/backoffice/class-participants/change-class/'+item.id">
                                <v-btn color="primary" flat class="ml-auto">
                                    <v-icon class="mr-2">
                                        mdi-eye
                                    </v-icon>Lihat
                                </v-btn>
                            </nuxt-link>
                        </v-col>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getClassroom(pagination.limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getClassroom(pagination.limit, page, search)"
                            @nextPage="getClassroom(pagination.limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>