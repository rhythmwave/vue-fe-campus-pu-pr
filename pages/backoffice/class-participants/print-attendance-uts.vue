<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import user1 from '/images/profile/user-1.jpg';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { ErrorRoot } from '~~/types/api/error';
import { GetLectureListData } from '~~/types/api/lecture/GetLectureList';
import { getLectureList } from '~~/composables/api/lecture/getLectureList';
import moment from 'moment';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const store = useContactStore();


const page = ref({ title: 'Cetak Presensi UTS' });
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Cetak Presensi UTS',
        disabled: true,
        href: '#'
    }
]);

onMounted(async () => {
    // getAdminStudyProgram()
    getLectureData(pagination.value.limit, 1)
});

const pagination = ref({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const getContacts: any = computed(() => {
    return store.contacts;
});

const valid = ref(true);
const dialog = ref(false);
const search = ref('');
const rolesbg = ref(['primary', 'secondary', 'error', 'success', 'warning']);
const desserts = ref(contact);
const editedIndex = ref(-1);
const editedItem = ref({
    id: '',
    avatar: user1,
    userinfo: '',
    usermail: '',
    phone: '',
    jdate: '',
    role: '',
    rolestatus: ''
});
const defaultItem = ref({
    id: '',
    avatar: user1,
    userinfo: '',
    usermail: '',
    phone: '',
    jdate: '',
    role: '',
    rolestatus: ''
});

//Methods
const filteredList = computed(() => {
    return desserts.value.filter((user: any) => {
        return user.userinfo.toLowerCase().includes(search.value.toLowerCase());
    });
});

function editItem(item: any) {
    editedIndex.value = desserts.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialog.value = true;
}
function deleteItem(item: any) {
    const index = desserts.value.indexOf(item);
    confirm('Are you sure you want to delete this item?') && desserts.value.splice(index, 1);
}

function close() {
    dialog.value = false;
    setTimeout(() => {
        editedItem.value = Object.assign({}, defaultItem.value);
        editedIndex.value = -1;
    }, 300);
}
function save() {
    if (editedIndex.value > -1) {
        Object.assign(desserts.value[editedIndex.value], editedItem.value);
    } else {
        desserts.value.push(editedItem.value);
    }
    close();
}

//Computed Property
const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'New Contact' : 'Edit Contact';
});

const AdminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const selectedAdminStudyPrograms = ref(<GetAdminStudyProgramListData>{})
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            AdminStudyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

function AdminStudyProgramsOnChange(id: string) {
    selectedAdminStudyPrograms.value = <GetAdminStudyProgramListData>AdminStudyPrograms.value.find((x) => x.id == id)
    getLectureData(pagination.value.limit, 1)
}
const lectures = ref(<GetLectureListData[]>[])
async function getLectureData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getLectureList(limit, page, "", false, true, "midterm")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lectures.value = resp?.data
            pagination.value = resp.pagination
        }
    } catch (error) {
        alert(error)
    }
}
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <!-- <v-row>
            <v-col cols="12">
                <UiParentCard title="Program Studi">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="AdminStudyPrograms" item-value="id"
                                item-title="name" label="Studi Program"
                                @update:model-value="(sl: any) => AdminStudyProgramsOnChange(sl)"></v-select>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row> -->
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tanggal</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jam</th>
                    <th class="text-subtitle-1 font-weight-semibold">Ruang</th>
                    <th class="text-subtitle-1 font-weight-semibold">Matakuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kelas</th>
                    <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah Peserta</th>
                    <th class="text-subtitle-1 font-weight-semibold" width="1100">Pengawas</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in lectures" :key="item.id">
                    <td class="text-subtitle-1">{{ (pagination.limit * (pagination.page - 1)) + lectures.indexOf(item) + 1
                    }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <v-tooltip text="Print">
                                <template #activator="{ props }">
                                    <a target="_blank" icon flat v-bind="props"
                                        :href="'/backoffice/class-participants/prints/uts/' + item.class_id">
                                        <PrinterIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </a>
                                </template>
                            </v-tooltip>
                            &nbsp;
                            <v-tooltip text="Print Berita Acara">
                                <template v-slot:activator="{ props }">
                                    <a target="_blank" :href="'/backoffice/class-participants/prints/ba/' + item.class_id+'/midterm'">
                                        <v-btn color="primary" v-bind="props" flat class="ml-auto">
                                            <PrinterIcon stroke-width="1.5" size="20" />&nbsp; Berita Acara
                                        </v-btn>
                                    </a>
                                </template>
                            </v-tooltip>
                        </div>
                    </td>
                    <td>
                        <!-- //tanggal -->
                    </td>
                    <td>
                        <!-- //jam -->
                    </td>
                    <td>
                        <!-- Ruang -->
                        {{ item.room_name }}
                    </td>
                    <td>
                        <!-- Matakuliah -->
                        {{ item.subject_name }}
                    </td>
                    <td>
                        <!-- Kelas -->
                        {{ item.class_name }}
                    </td>
                    <td>
                        <!-- Dosen -->
                        {{ item.lecturer_name }}
                    </td>
                    <td>
                        <!-- Dosen -->
                        {{ item.total_participant }}
                    </td>
                    <td>
                        <!-- Pengawas -->
                        <p v-if="item.exam_supervisors?.length > 0" v-for="itm in item.exam_supervisors">
                            - {{ itm.front_title + ' ' + itm.name + ' ' + itm.back_degree }}
                        </p>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="pagination.limit" :page="pagination.page"
                            :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                            :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getLectureData(pagination.limit, pagination.prev)"
                            @jumpPage="(page: any) => getLectureData(pagination.limit, page)"
                            @nextPage="getLectureData(pagination.limit, pagination.next)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>