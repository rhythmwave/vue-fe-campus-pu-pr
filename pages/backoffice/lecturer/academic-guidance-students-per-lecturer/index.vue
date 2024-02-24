<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { ErrorRoot } from '~~/types/api/error';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { GetAcademicGuidanceListData } from '~~/types/api/academic-guidance/GetAcademicGuidanceList';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

onMounted(async () => {

    await getAdminStudyProgramListData()
    await getSemesterListData()
    await getData(limit, 1)
})

const limit = 20
const search = ref('')
const idNationalLecturer = ref('')
const pagination = ref({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const title = ref('Data Mahasiswa Bimbingan Akademik Perdosen')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Data Mahasiswa Bimbingan Akademik Perdosen',
        disabled: true,
        href: '#'
    }
])
const mode = ref('list')
const dialog = ref(false)
const valid = ref(true)
const dialogUpdate = ref(false)

const GetLecturerLists = ref<GetLecturerListData[]>([])
async function getData(limit: number, page: number) {
    try {
        if (!selectedSemesterLists.value.id) return;
        const { response: resp, error: error } = await getLecturerList(limit, page, search.value, selectedAdminStudyProgramLists.value.id, idNationalLecturer.value, "",selectedSemesterLists.value.id, '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            GetLecturerLists.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}


const updateAcademicGuidanceId = ref('')
const updateData = ref(<GetLecturerListData>{
})

// function editItem(data: GetAcademicGuidanceListData) {
function editItem(data: GetLecturerListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateAcademicGuidanceId.value = ""
    }, 300)
}

const AdminStudyProgramLists = ref(<GetAdminStudyProgramListData[]>[])
const selectedAdminStudyProgramLists = ref(<GetAdminStudyProgramListData>{
    id: "",
})
async function getAdminStudyProgramListData() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            AdminStudyProgramLists.value = <GetAdminStudyProgramListData[]><unknown>resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const SemesterLists = ref(<GetSemesterListData[]>[])
const selectedSemesterLists = ref(<GetSemesterListData>{
    id: "",
})
async function getSemesterListData() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            SemesterLists.value = <GetSemesterListData[]><unknown>resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>

<template>
    <div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeAcademicGuidanceUpdate @reload="getData(limit, 1)"
                        @close="closeUpdate()"  :getAcademicGuidanceListData="updateData" :semesterId="selectedSemesterLists.id"/>
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title">
            <v-row>
                <v-col cols="12" lg="4" md="6">
                    <v-select variant="outlined" hide-details
                        :items="[{ id: '', name: 'Semua' }, ...AdminStudyProgramLists]" item-value="id" item-title="name"
                        label="Program Studi" v-model="selectedAdminStudyProgramLists.id"
                        @update:model-value="(c: any) => getData(limit, 1)"></v-select>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                    <v-text-field density="compact" v-model="idNationalLecturer" label="NIDN" hide-details
                        variant="outlined" @input="getData(limit, 1)"></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                    <v-text-field density="compact" v-model="search" label="Nama" hide-details variant="outlined"
                        @input="getData(limit, 1)"></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="6">
                    <v-select v-model="selectedSemesterLists.id" item-value="id" variant="outlined" hide-details :items="SemesterLists" label="Semester"
                        @update:model-value="(sl: any) => getData(limit, 1)">
                        <template v-slot:selection="{ item }">
                            <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                            }}</span>
                        </template>
                        <template v-slot:item="{ item, props: { onClick, title, value } }">
                            <ul>
                                <li style="padding: 10px; margin: 2px;">
                                    <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                        @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                        <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                                        }}</span>
                                    </a>
                                </li>
                            </ul>
                        </template>
                    </v-select>
                    <!-- <v-select variant="outlined" hide-details :items="SemesterLists" item-value="id"
                        item-title="school_year" label="Semeseter" v-model="selectedSemesterLists.id"
                        @update:model-value="(c: any) => getData(limit, 1)"></v-select> -->
                </v-col>
            </v-row>
        </SharedUiParentCard>
        <VTable class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold">NIDN</th>
                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                    <th class="text-subtitle-1 font-weight-semibold">Gelar</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Bimbingan Mahasiswa</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in GetLecturerLists">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Sesi" v-if="item.academic_guidance_total_student != 0">
                                <template #activator="{ props }">
                                    <nuxt-link :to="'/backoffice/lecturer/academic-guidance-students-per-lecturer/'+selectedSemesterLists.id+'/'+item.academic_guidance_id+'/'+item.id" class="mr-2">
                                        <v-btn color="warning" flat class="ml-auto">
                                            Sesi Bimbingan
                                        </v-btn>
                                    </nuxt-link>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Input SK">
                                <template #activator="{ props }">
                                    <v-btn color="primary" flat class="ml-auto" @click="editItem(item)">
                                        Input SK Bimbingan
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                    <td>{{ item.id_national_lecturer }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.front_title }}</td>
                    <td>{{ item.academic_guidance_total_student }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev)" @jumpPage="(page: any) => getData(limit, page)"
                            @nextPage="getData(limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </VTable>
    </div>
</template>