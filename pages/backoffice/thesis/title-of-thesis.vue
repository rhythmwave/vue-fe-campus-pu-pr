<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetThesisData } from '~~/types/api/thesis/GetThesis';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getThesis } from '~~/composables/api/admin-thesis/getThesis';
import { deleteThesis } from '~~/composables/api/admin-thesis/deleteThesis';

const route = useRoute()
definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Tugas Akhir')
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
const datas = ref<GetThesisData[]>([])
const single = ref(<GetThesisData>{})
const thesis_id = ref('')
const studyPrograms = ref(<GetAdminStudyProgramListData[]>[])
const study_program_id = ref('')

async function getData(limit: number, page: number, search: string ) {
    try {
        const { response: resp, error: error } = await getThesis(limit, page, search, study_program_id.value, '', semester_id.value, '', '')
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
    mode.value = 'create'
    dialog.value = true
}
function close(){
    dialog.value = false
}
function showItem(item: any){
    thesis_id.value = item.id
    mode.value = 'show'
    dialog.value = true
}
function editItem(item: any){
    thesis_id.value = item.id
    mode.value = 'edit'
    dialog.value = true
}
async function deleteItem(item: GetThesisData){
    if (confirm('Yakin Menghapus Item Ini ' + item.title + ' ?')) {
        try {
            const { response: resp, error: error } = await deleteThesis(item.id)
            if (error) {
                let dataError = <ErrorRoot>error;
                alert(dataError.meta.message);
                return;
            }else{
                await getData(pagination.value.limit, pagination.value.page, '')
            }
        } catch (error) {
            alert(error)
        }
    }
}
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
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
})
</script>

<template>
    <div>
        <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeThesisDetail :thesis-id="thesis_id"/>
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeThesisCreate :semesterId="semester_id" :studyProgramId="study_program_id" @reload="getData(pagination.limit, 1, search)" @close="close()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'edit'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeThesisEdit :thesis-id="thesis_id" @reload="getData(pagination.limit, 1, search)" @close="close()" />
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
                                </v-icon>Tambah Tugas Akhir
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
                    <th class="text-subtitle-1 font-weight-semibold">Prodi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Semester</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Mahasiswa</th>
                    <th class="text-subtitle-1 font-weight-semibold">Judul</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in datas">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.start_semester_school_year }} - {{ item.start_semester_type }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                        <v-tooltip text="Lihat">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" @click="showItem(item)">
                                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Ubah">
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