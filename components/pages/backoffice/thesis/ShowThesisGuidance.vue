<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';
import { PaginationModel } from '~~/types/api/pagination';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';
import { convertNumberTimeToStringTimeBootstrap } from '~~/utils/helpers/date-utils';

import { GetThesisData } from '~~/types/api/thesis/GetThesis';

import { getThesis } from '~~/composables/api/admin-thesis/getThesis';

const props = defineProps({
    lecturerId: String,
    semesterId: String,
});

const pagination = ref<PaginationModel>({
    page: 1,
    limit: 20,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const emit = defineEmits(['close'])
const lecturer_id = ref('')
const semester_id = ref('')
const datas = ref(<GetThesisData[]>[])

async function getData(limit: number, page: number, search: string ) {
    try {
        const { response: resp, error: error } = await getThesis(limit, page, search, '', '', semester_id.value, '', lecturer_id.value)
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

onMounted(async () => {
    semester_id.value = <string>props.semesterId
    lecturer_id.value = <string>props.lecturerId
    await getData(pagination.value.limit, 1, '')
})
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">Daftar Mahasiswa TA</v-card-title>
            <v-card-text>
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-table class="mt-5">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                                    <th class="text-subtitle-1 font-weight-semibold">NIM</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Nama</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Prodi</th>
                                    <th class="text-subtitle-1 font-weight-semibold">Judul</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item, index in datas">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.student_nim_number }}</td>
                                    <td>{{ item.student_name }}</td>
                                    <td>{{ item.study_program_name }}</td>
                                    <td>{{ item.title }}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3">
                                        <TablePaginationView :limit="pagination.limit" :page="pagination.page" :total_pages="pagination.total_pages"
                                            :total_records="pagination.total_records" :prev="pagination.prev" :next="pagination.next"
                                            @prevPage="getData(pagination.limit, pagination.prev, '')"
                                            @jumpPage="(page: any) => getData(pagination.limit, page, '')"
                                            @nextPage="getData(pagination.limit, pagination.next, '')" />
                                    </td>
                                </tr>
                            </tfoot>
                        </v-table>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>