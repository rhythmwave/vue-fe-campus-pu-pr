<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { ErrorRoot } from '~~/types/api/error';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';

import { GetAcademicGuidanceSessionListData } from '~~/types/api/academic-guidance/GetAcademicGuidanceSession';

import { getAcademicGuidanceSessionList } from '~~/composables/api/academic-guidance/getAcademicGuidanceSession';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});

const pagination = ref({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const title = ref('Sesi Bimbingan Akademik')
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

const mode = ref('list')
const dialog = ref(false)
const semester_id = ref('')
const academic_guidance_id = ref('')
const lecturer_id = ref('')
const sessions = ref(<GetAcademicGuidanceSessionListData[]>[])

async function getAcademicGuidanceSession() {
    try {
        const { response: resp, error: error } = await getAcademicGuidanceSessionList(academic_guidance_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            sessions.value = resp?.data
            // pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

function createItem(){
    mode.value = 'create'
    dialog.value = true
}

function close(){
    dialog.value = false
}

onMounted(async () => {
    semester_id.value = window.location.href.split('/')[window.location.href.split('/').length - 3]
    academic_guidance_id.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
    lecturer_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getAcademicGuidanceSession()
})
</script>
<template>
    <div>
        <div v-if="mode == 'create'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesBackofficeAcademicGuidanceCreateSession @reload="getAcademicGuidanceSession()" @close="close" :semesterId="semester_id" :academicGuidanceId="academic_guidance_id" :lecturerId="lecturer_id" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title">
            <v-row>
                <!-- <v-col cols="12" lg="4" md="6">
                </v-col> -->
                <!-- <v-col cols="12" lg="12" md="12">
                    <v-btn solo flat color="warning">
                        <v-icon class="mr-2">
                            mdi-keyboard-backspace
                        </v-icon>Tambah
                    </v-btn>
                </v-col> -->
                <v-col cols="12" lg="12" md="12">
                    <v-col cols="12" lg="6" md="6" class="text-left" style="float: left;">
                        <v-btn solo flat color="primary" @click="createItem">
                            <v-icon class="mr-2">
                                mdi-plus
                            </v-icon>Tambah
                        </v-btn>
                    </v-col>
                    <v-col cols="12" lg="6" md="6" class="text-right" style="float: left;">
                        <NuxtLink class="text-decoration-none color-inherits" :to="'/backoffice/lecturer/academic-guidance-students-per-lecturer'">
                            <v-btn solo flat color="warning">
                                <v-icon class="mr-2">
                                    mdi-keyboard-backspace
                                </v-icon>Kembali
                            </v-btn>
                        </NuxtLink>
                    </v-col>
                </v-col>
            </v-row>
        </SharedUiParentCard>
        <v-table class="mt-5">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Subjek</th>
                    <th class="text-subtitle-1 font-weight-semibold">Kesimpulan</th>
                    <th class="text-subtitle-1 font-weight-semibold">File</th>
                    <th class="text-subtitle-1 font-weight-semibold">Mahasiswa</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in sessions">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject }}</td>
                    <td>{{ item.summary }}</td>
                    <td>
                        <ul>
                            <li v-for="(itm, indx) in item.files">
                                <a :href="itm.file_url" target="_blank" rel="noopener noreferrer">
                                    <span>Lihat File {{ indx + 1 }}</span>
                                </a>
                            </li>
                        </ul>
                    </td>
                    <td>
                        <ul>
                            <li v-for="itm in item.students">
                                {{ itm.name }} - {{ itm.nim_number }}
                            </li>
                        </ul>
                    </td>
                    
                    <!-- {{ item }} -->
                </tr>
            </tbody>
        </v-table>
    </div>
</template>