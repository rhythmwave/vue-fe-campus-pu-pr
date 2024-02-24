<script setup lang="ts">
import Vspace from '@/components/shared/commons/Vspace.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { convertDateTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { ErrorRoot } from '~~/types/api/error';

import { GetLecturerClassWorkSubmissionData } from '~~/types/api/lecturer-class-work/GetLecturerClassWorkSubmission';

import { getLecturerClassWorkSubmissionList } from '~~/composables/api/lecturer-class-work/getLecturerClassWorkSubmission';

const props = defineProps({
    detail: Array as any,
});

const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const emit = defineEmits(['close', 'reload'])
const class_work_id = ref('')
const point = ref(0)
const datas = ref(<GetLecturerClassWorkSubmissionData[]>[])

async function getData(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getLecturerClassWorkSubmissionList(limit, page, search, class_work_id.value)
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

function update(){
    console.log('belum beres')
}

onMounted(async () => {
    class_work_id.value = <string>props.detail?.id
    await getData(10000, 1, '')
});
</script>
<template>
    <div>
        <v-card max-height="550" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Lihat Tugas</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-table class="mt-5">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nilai</th>
                                    <th class="text-subtitle-1 font-weight-semibold">File</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item, index in datas">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.nim_number }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>
                                        <v-text-field v-model="point" variant="outlined" hide-details :value="item.point" />
                                    </td>
                                    <td>{{ item.file_url }}</td>
                                    <td>
                                        <v-btn solo flat color="primary" @click="update()">
                                            Ubah Nilai
                                        </v-btn>    
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
                        <!-- <v-col cols="12" sm="12">
                            <v-text-field v-model="updateLecturerClassWorkRequest.title" variant="outlined" hide-details
                                label="Judul" />
                        </v-col>
                        <v-col cols="12" sm="12" v-if="detail.file_url">
                            File tugas sebelumnya <br />
                            <NuxtLink :href="detail.file_url" target="_blank" download>
                                {{ detail.file_url }}
                            </NuxtLink>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field type="file" @change="createFileData" v-model="file" variant="outlined"
                                hide-details label="Tugas" :suffix="createFiles.url ? 'uploaded' : ''" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea v-model="updateLecturerClassWorkRequest.abstraction" variant="outlined" hide-details
                                label="Abstraksi" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="startDate" type="date" variant="outlined" hide-details
                                label="Waktu Mulai" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="startTime" type="time" variant="outlined" hide-details
                                label="Jam Mulai" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="endDate" type="date" variant="outlined" hide-details
                                label="Waktu Selesai" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="endTime" type="time" variant="outlined" hide-details
                                label="Jam Selesai" />
                        </v-col>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" @click="update();">
                                    Ubah
                                </v-btn>
                            </v-card-actions>
                        </v-col> -->
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>