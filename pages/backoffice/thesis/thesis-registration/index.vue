<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetThesisData } from '~~/types/api/thesis/GetThesis';
import { CreateRegistrationThesisRequest } from '~~/types/api/thesis/CreateRegistrationThesis';
import { GetRegistrationThesisData } from '~~/types/api/thesis/GetRegistrationThesis';

import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getThesis } from '~~/composables/api/admin-thesis/getThesis';
import { getRegistrationThesis } from '~~/composables/api/admin-thesis/getRegistrationThesis';
import { createRegistrationThesis } from '~~/composables/api/admin-thesis/createRegistrationThesis';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Pendaftaran Ujian TA')
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
const thesis_list = ref<GetThesisData[]>([])
const create = ref(<CreateRegistrationThesisRequest>{
    student_id: ''
})
const registration_thesis_list = ref(<GetRegistrationThesisData[]>[])

async function getData(limit: number, page: number, search: string ) {
    try {
        const { response: resp, error: error } = await getRegistrationThesis(limit, page, search, study_program_id.value, '', semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            registration_thesis_list.value = resp?.data
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

async function getThesisList() {
    try {
        const { response: resp, error: error } = await getThesis(10000, 1, '', study_program_id.value, '', semester_id.value, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            thesis_list.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

function createReg(){
    dialog.value = true
    mode.value = 'create'
}

function close(){
    dialog.value = false
}

async function save(){
    try {
        const { response: createRoleResponse, error } = await createRegistrationThesis(create.value)
        
        if (error) {
            let dataError = <ErrorRoot>error;
            if(dataError.meta.message.search('active thesis defense request is exist') > -1){
                alert('TA Mahasiswa Tersebut Sedang Berjalan')
            }else{
                alert(dataError.meta.message)
            }
            return;
        } else {
            await getData(pagination.value.limit, pagination.value.page, search.value)
            close()
        }
        create.value = <CreateRegistrationThesisRequest>{
            student_id: ''
        }
        // return true;
    } catch (error) {
        alert(error)
        console.log(error)
        // return false;
    }
}

// function showItem(item: any){
//     console.log(item)
// }

function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}

function print(){
    window.open('/backoffice/thesis/thesis-registration/print/'+study_program_id.value+'/'+semester_id.value, '_blank')
}

watch(study_program_id, async (value) => {
    await getSemester()
    await getThesisList()
    await getData(pagination.value.limit, pagination.value.page, search.value)
});
onMounted(async () => {
    await getStudyProgram()
    await getData(pagination.value.limit, pagination.value.page, search.value)
})
</script>

<template>
    <div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <v-card max-height="600" style="overflow: auto;">
                        <v-card-title class="pa-4 bg-secondary">Pendaftaran TA</v-card-title>
                        <v-card-text>
                            <v-col cols="12" sm="12">
                                <v-form ref="form" lazy-validation>
                                    <v-row>
                                        <v-col cols="12" sm="12">
                                            <v-select v-model="create.student_id" item-value="student_id" item-title="name" variant="outlined" hide-details :items="thesis_list" label="Mahasiswa">
                                            <template v-slot:selection="{ item }">
                                                <span>{{ item.raw.student_name }}</span>
                                            </template>
                                            <template v-slot:item="{ item, props: { onClick, title, value } }">
                                                <ul>
                                                    <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                        <li style="padding: 10px; margin: 2px;" @click="onClick">
                                                            <span>{{ item.raw.student_name }}</span>
                                                        </li>
                                                    </a>
                                                </ul>
                                            </template>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-col>
                            <v-col cols="12">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="close()">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" @click="save()" :disabled="create.student_id == ''">
                                        Simpan
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Pendaftaran Tugas Akhir">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            
                            <v-text-field density="compact" v-model="search" label="Cari Tugas Akhir" hide-details variant="outlined" @input="getData(limit, 1, $event.target.value)"></v-text-field>
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
                            <v-btn color="primary" flat class="ml-auto" @click="createReg()" :disabled="semester_id == '' || study_program_id == ''">
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Pendaftaran TA
                            </v-btn>
                            <v-btn title="Add" flat color="primary" class="ml-2" :disabled="semester_id == ''" @click="print">
                                Cetak
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
                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                    <th class="text-subtitle-1 font-weight-semibold">Mahasiswa</th>
                    <th class="text-subtitle-1 font-weight-semibold">Judul</th>
                    <th class="text-subtitle-1 font-weight-semibold">Status</th>
                    <!-- <th class="text-subtitle-1 font-weight-semibold">Aksi</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in registration_thesis_list">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.thesis_title }}</td>
                    <td>{{ item.thesis_status }}</td>
                    <!-- <td>
                        <v-tooltip text="Lihat">
                            <template #activator="{ props }">
                                <v-btn icon flat v-bind="props" @click="showItem(item)">
                                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </td> -->
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(pagination.limit, pagination.prev, search)"
                            @jumpPage="(page: any) => getData(pagination.limit, page, search)"
                            @nextPage="getData(pagination.limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>