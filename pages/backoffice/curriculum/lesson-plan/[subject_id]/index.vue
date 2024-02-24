<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { GetLessonPlanListData } from '~~/types/api/lesson-plan/GetLessonPlanList';
import { deleteLessonPlan } from '~~/composables/api/lesson-plan/deleteLessonPlan';
import { getLessonPlanList } from '~~/composables/api/lesson-plan/getLessonPlanList';
import { getSampleList } from '~~/composables/api/sample/getSampleList';
import { GetSampleListData } from '~~/types/api/sample/GetSampleList';

const route = useRoute()
definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const breadcrumbs = ref([
    {
        text: 'Backoffice',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Rencana pembelajaran',
        disabled: true,
        href: '#'
    }
]);


const valid = ref(true)
const mode = ref('list')
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogDelete = ref(false)
const dialogShow = ref(false)

const page = ref({ title: 'Rencana pembelajaran' });
const title = ref('Rencana pembelajaran')

const limit = 20
const search = ref('')
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})

const subject_id = ref('')
onMounted(async () => {
    subject_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getData(limit, 1, search.value)
})

const lessonPlans = ref<GetLessonPlanListData[]>([])
async function getData(limit: number, page: number, searchText: string) {
    try {
        search.value = searchText;
        const { response: resp, error: error } = await getLessonPlanList(limit, page, searchText, subject_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lessonPlans.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

const detailData = ref(<GetLessonPlanListData>{
})
function showItem(data: GetLessonPlanListData) {
    mode.value = 'show'
    detailData.value = data
    dialogShow.value = true
}

const updateLessonPlanId = ref('')
const updateData = ref(<GetLessonPlanListData>{
})

function editItem(data: GetLessonPlanListData) {
    mode.value = 'update'
    updateData.value = data
    dialogUpdate.value = true
}

function closeUpdate() {
    dialogUpdate.value = false
    setTimeout(() => {
        updateLessonPlanId.value = ""
    }, 300)
}


const deletedData = ref(<GetLessonPlanListData>{})

function deleteItem(data: GetLessonPlanListData) {
    mode.value = 'delete'
    deletedData.value = data
    console.log(data)
    dialogDelete.value = true
}


function closeDelete() {
    dialogDelete.value = false
}

async function deleteItm() {
    try {
        const { response: deleteResponse, error } = await deleteLessonPlan(deletedData.value)
        if (error) {
            let dataError = <ErrorRoot>error.data;
            alert(dataError.meta.message);
            return;
        }
        // return true;
    } catch (error) {
        alert(error)
        // return false;
    }
    closeDelete()
    getData(limit, 1, search.value)
}

function create() {
    mode.value = 'create'
    dialogCreate.value = true
}
function closeCreate() {
    dialogCreate.value = false
}


</script>

<template>
    <div>
        <!-- <div v-if="mode == 'show'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogShow" max-width="800">
                    <PagesBackofficeLessonPlanDetail :getLessonPlanListData="detailData" />
                </v-dialog>
            </v-col>
        </div> -->
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogCreate" max-width="800">
                    <PagesBackofficeLessonPlanCreate :subject_id="subject_id" @reload="getData(limit, 1, search)"
                        @close="closeCreate()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'update'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogUpdate" max-width="800">
                    <PagesBackofficeLessonPlanUpdate :subject_id="subject_id" @reload="getData(limit, 1, search)"
                        @close="closeUpdate()"
                        :getLessonPlanListData="updateData" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'delete'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialogDelete" max-width="800">
                    <v-card>
                        <v-card-title class="pa-4 bg-secondary">
                            <span class="title text-white">Hapus Rencana Pembelajaran</span>
                        </v-card-title>
                        <v-card-text>
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-row>
                                    <h5>Pertemuan</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.meeting_order }}</div>
                                </v-row>
                                <v-row>
                                    <h5>Materi</h5>
                                </v-row>
                                <v-row>
                                    <div>{{ deletedData.lesson }}</div>
                                </v-row>
                                

                                <v-col class="text-right">
                                    <v-card-actions class="pa-4">
                                        <v-spacer />
                                        <v-btn color="error" @click="closeDelete()">
                                            Batal
                                        </v-btn>
                                        <v-btn color="secondary" :disabled="deletedData.id == ''" @click="deleteItm()">
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
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Daftar Rencana Pembelajaran">
                    <v-row>
                        <v-col cols="12" lg="4" md="4">
                            <v-text-field density="compact" v-model="search" label="Cari" hide-details variant="outlined"
                                @input="getData(limit, 1, $event.target.value)"></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="4" md="4" class="text-right">
                            <v-btn color="primary" flat class="ml-auto" @click="create()"
                                >
                                <v-icon class="mr-2">
                                    mdi-account-multiple-plus
                                </v-icon>Tambah Rencana Pembelajaran
                            </v-btn>
                        </v-col>
                        <v-col cols="12" lg="4" md="4" class="text-right">
                            <nuxt-link :to="'/backoffice/curriculum/lesson-plan'">
                                <v-btn color="error" flat class="ml-auto">
                                    <v-icon class="mr-2">
                                    mdi-arrow-collapse-left
                                    </v-icon>Kembali
                                </v-btn>
                            </nuxt-link>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Pertemuan</th>
                    <th class="text-subtitle-1 font-weight-semibold">Materi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Materi (Inggris)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in lessonPlans" :key="item.id">
                    <td class="text-subtitle-1">{{ index + 1 }}</td>
                    <td>
                        <div class="d-flex align-center">
                            <!-- <v-tooltip text="Detail">
                                <template #activator="{ props }">
                                    <v-btn icon flat v-bind="props" @click="showItem(item)">
                                        <EyeIcon stroke-width="1.5" size="20" class="text-primary" />
                                    </v-btn>
                                </template>
                            </v-tooltip> -->
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
                        </div>
                    </td>
                    <td class="text-subtitle-1">{{ item.meeting_order }}</td>
                    <td class="text-subtitle-1">{{ item.lesson }}</td>
                    <td class="text-subtitle-1">{{ item.english_lesson }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">
                        <TablePaginationView :limit="limit" :page="pagination.page" :total_pages="pagination.total_pages"
                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                            @prevPage="getData(limit, pagination.prev, search)"
                            @jumpPage="(page) => getData(limit, page, search)"
                            @nextPage="getData(limit, pagination.next, search)" />
                    </td>
                </tr>
            </tfoot>
        </v-table>
    </div>
</template>