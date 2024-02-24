<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { PaginationModel } from '~~/types/api/pagination';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { activationClassroom } from '~~/composables/api/classroom/activationClassroom';
import { deleteClassroom } from '~~/composables/api/classroom/deleteClassroom';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const title = ref('Kelas')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Daftar ' + title.value,
        disabled: true,
        href: '#'
    }
]);
const dialog = ref(true)
const is_active = ref(true)
const label_is_active = ref('Aktif')
const mode = ref('list')
const limit = 20
const page = ref(1)
const search = ref('')
const classroomObj = ref({
    id: '',
    name: '',
    is_active: true
})
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const studyProgramId = ref('')
const semester_id = ref('')
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, "", "")
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
const classrooms = ref<GetClassroomListData[]>([])
const classroomDetail = ref(<GetClassroomDetail>{})
const semesters = ref<GetSemesterListData[]>([])
async function getClassroom(limit: number, page: number, search: string, is_active: boolean) {
    try {
        const { response: resp, error: error } = await getClassroomList(limit, page, search, studyProgramId.value, semester_id.value, is_active, '', true)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classrooms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getClassroomDetailData(id: string) {
    try {
        const { response: resp, error: error } = await getClassroomDetail(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classroomDetail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000, 1, studyProgramId.value, '')
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
async function semesterOnChange(item: any) {
    if (item != '') {
        semester_id.value = item
    }
    if (semester_id.value != '') {
        await getClassroom(limit, page.value, search.value, is_active.value)
    }
}
async function activeOnChange(item: any) {
    if (item == 'Aktif') {
        is_active.value = true
        label_is_active.value = 'Aktif'
    } else {
        is_active.value = false
        label_is_active.value = 'Tidak Aktif'
    }
    await getClassroom(limit, page.value, search.value, is_active.value)
}
async function showDetail(item: any) {
    await getClassroomDetailData(item.id)
    mode.value = 'show'
    dialog.value = true
}
async function activation(item: any) {
    mode.value = 'activation'
    dialog.value = true
    let is_active = true
    if (item.is_active) {
        is_active = false
    }
    classroomObj.value = {
        id: item.id,
        name: item.name,
        is_active: is_active
    }
}
async function deleteItem(item: any) {
    mode.value = 'delete'
    classroomObj.value = {
        id: item.id,
        name: item.name,
        is_active: true
    }
    dialog.value = true
}
async function edit(item: any) {
    await getClassroomDetailData(item.id)
    mode.value = 'edit'
    dialog.value = true
}
function create() {
    if (studyProgramId.value == '') {
        alert('Pilih Program Studi Terlebih Dahulu')
        return false
    }
    mode.value = 'create'
    dialog.value = true
}
function close() {
    dialog.value = false
}
async function actionActivation(data: any) {
    try {
        const { response: createRoleResponse, error } = await activationClassroom(data.id, data.is_active)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            await getClassroom(limit, page.value, search.value, is_active.value)
        }
    } catch (error) {
        alert(error)
        return false;
    }
    classroomObj.value = {
        id: '',
        name: '',
        is_active: true
    }
    await getClassroom(limit, page.value, search.value, is_active.value)
    close()
}
async function deleteData(data: any) {
    try {
        const { response: createRoleResponse, error } = await deleteClassroom(data.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            await getClassroom(limit, page.value, search.value, is_active.value)
        }
    } catch (error) {
        alert(error)
        return false;
    }
    classroomObj.value = {
        id: '',
        name: '',
        is_active: true
    }
    await getClassroom(limit, page.value, search.value, is_active.value)
    close()
}
function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
watch(studyProgramId, async function (value) {
    if (value != '') {
        await getClassroom(limit, page.value, search.value, is_active.value)
        await getSemester()
    }
})
onMounted(async () => {
    await getAdminStudyProgram()
    await getSemester()
})
</script>

<template>
    <div v-if="mode == 'delete'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">Hapus {{ title }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form" lazy-validation>
                            <v-row>
                                <h5>Nama</h5>
                            </v-row>
                            <v-row>
                                <div>{{ classroomObj.name }}</div>
                            </v-row>
                            <v-col class="text-right">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="close()">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" :disabled="classroomObj.id == ''"
                                        @click="deleteData(classroomObj)">
                                        Hapus
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-col>
    </div>
    <div v-if="mode == 'activation'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <v-card>
                    <v-card-title class="pa-4 bg-secondary">
                        <span class="title text-white">Batalkan {{ title }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form" lazy-validation>
                            <v-row>
                                <h5>Nama</h5>
                            </v-row>
                            <v-row>
                                <div>{{ classroomObj.name }}</div>
                            </v-row>
                            <v-col class="text-right">
                                <v-card-actions class="pa-4">
                                    <v-spacer />
                                    <v-btn color="error" @click="close()">
                                        Batal
                                    </v-btn>
                                    <v-btn color="secondary" :disabled="classroomObj.id == ''"
                                        @click="actionActivation(classroomObj)">
                                        Ya
                                    </v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-col>
    </div>
    <div v-if="mode == 'create'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <PagesBackofficeClassroomCreate :studyProgramId="studyProgramId" :title="'Tambah ' + title" :isMbkm="true"
                    @close="close" @reload="getClassroom(limit, 1, '', is_active)" />
            </v-dialog>
        </v-col>
    </div>
    <div v-if="mode == 'show'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <PagesBackofficeClassroomDetail :title="'Detil ' + title" :data-detail="classroomDetail" />
            </v-dialog>
        </v-col>
    </div>
    <div v-if="mode == 'edit'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="800">
                <PagesBackofficeClassroomEdit :title="'Edit ' + title" :isMbkm="true" :data-detail="classroomDetail"
                    @close="close" @reload="getClassroom(limit, 1, '', is_active)" />
            </v-dialog>
        </v-col>
    </div>
    <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard :title="'Pilih ' + title">
                <v-row>
                    <v-col cols="12" lg="4" md="6">
                        <v-select v-model="studyProgramId" variant="outlined" hide-details :items="adminStudyPrograms"
                            item-value="id" item-title="name" label="Pilih Program Studi"></v-select>
                    </v-col>
                    <v-col cols="12" lg="4" md="6">
                        <v-select @update:model-value="(sl: any) => semesterOnChange(sl)" item-value="id" variant="outlined"
                            hide-details :items="semesters" label="Pilih Semester">
                            <template v-slot:selection="{ item }">
                                <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
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
                        <!-- <v-select variant="outlined" hide-details :items="semesters" item-value="id"
                            item-title="semester_start_year" label="Pilih Semester"
                            @update:model-value="(sl: any) => semesterOnChange(sl)"></v-select> -->
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
                            @input="getClassroom(limit, page, $event.target.value, is_active)"></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="4" md="6">
                        <v-select v-model="label_is_active" :items="['Aktif', 'Tidak Aktif']" label="Pilih Aktif / Tidak"
                            @update:model-value="(sl: any) => activeOnChange(sl)"></v-select>
                    </v-col>
                    <v-col cols="12" lg="4" md="6" class="text-right">
                        <v-btn color="primary" flat class="ml-auto" @click="create()">
                            <v-icon class="mr-2">
                                mdi-account-multiple-plus
                            </v-icon>Tambah {{ title }}
                        </v-btn>

                        <a target="_blank"
                            :href="'/backoffice/implementation-of-mbkm/prints/mbkm-class/' + studyProgramId + '/' + semester_id">
                            <v-btn color="success float-right" flat class="ml-2 mb-2"
                                :disabled="studyProgramId == '' || semesterId == ''">
                                <PrinterIcon />Cetak
                            </v-btn>
                        </a>
                    </v-col>
                </v-row>

            </UiParentCard>
        </v-col>
    </v-row>
    <v-table class="mt-5">
        <thead>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">No</th>
                <th class="text-subtitle-1 font-weight-semibold">Kode Mata Kuliah</th>
                <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                <th class="text-subtitle-1 font-weight-semibold">Nama Kelas</th>
                <th class="text-subtitle-1 font-weight-semibold">Sifat</th>
                <th class="text-subtitle-1 font-weight-semibold">SKS</th>
                <th class="text-subtitle-1 font-weight-semibold">Paket Semester</th>
                <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
                <th class="text-subtitle-1 font-weight-semibold">Jumlah Peserta</th>
                <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in classrooms" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.subject_code }}</td>
                <td>{{ item.subject_name }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.subject_is_mandatory ? 'Wajib' : 'Pilihan' }}</td>
                <td>{{ item.subject_practicum_credit + item.subject_theory_credit }}</td>
                <td>{{ item.subject_semester_package }}</td>
                <td>
                    <ul v-for="lecturer in item.lecturers">
                        <li>{{ lecturer.front_title }} {{ lecturer.name }}, {{ lecturer.back_degree }}</li>
                    </ul>
                </td>
                <td>{{ item.total_participant }}</td>
                <td>
                    <div class="d-flex align-center">
                        <v-tooltip text="Detil">
                            <template #activator="{ props }">
                                <VBtn title="Detil" icon flat @click="showDetail(item)">
                                    <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Deaktif">
                            <template #activator="{ props }">
                                <VBtn title="Deaktif" icon flat @click="activation(item)">
                                    <LockIcon v-if="item.is_active" stroke-width="1.5" size="20" class="text-error" />
                                    <LockOpenIcon v-else stroke-width="1.5" size="20" class="text-error" />
                                </VBtn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Ubah">
                            <template #activator="{ props }">
                                <VBtn title="Ubah" icon flat @click="edit(item)">
                                    <PencilIcon stroke-width="1.5" size="20" class="text-primary" />
                                </VBtn>
                            </template>
                        </v-tooltip>
                        <v-tooltip text="Hapus">
                            <template #activator="{ props }">
                                <VBtn title="Hapus" icon flat @click="deleteItem(item)">
                                    <TrashIcon stroke-width="1.5" size="20" class="text-error" />
                                </VBtn>
                        </template>
                    </v-tooltip>
                </div>
            </td>
        </tr>
    </tbody>
</v-table></template>