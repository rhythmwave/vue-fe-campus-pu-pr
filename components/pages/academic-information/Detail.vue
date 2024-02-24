
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';

import DetailItem from '@/components/pages/academic-information/DetailItem.vue';
import { GetAcademicInformationListData } from '~~/types/api/academic-information/GetAcademicInformation';

const props = defineProps({
    data: Object,
});

const singleData = ref(<GetAcademicInformationListData>{})

onMounted(() => {
    singleData.value = Object.assign(<GetAcademicInformationListData>{}, props.data)
});
</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <DetailItem title="Judul" :value="singleData.title" />
                <DetailItem title="Tanggal" :value="convertDayOfWeek(moment(singleData.announcement_date).weekday() + 1) + ',' +moment(singleData.announcement_date).format('DD-MM-YYYY')" />
                <DetailItem title="Untuk Mahasiswa" :value="singleData.for_student ? 'Ya' : 'Tidak'" />
                <DetailItem title="Untuk Dosen" :value="singleData.for_lecturer ? 'Ya' : 'Tidak'" />
                <tr>
                    <td>
                        <div class="d-flex align-center">
                            <div class="ml-4">
                                <h6 class="text-h6">Program Studi</h6>
                            </div>
                        </div>
                    </td>
                    <td>
                        <ul>
                            <li v-for="itm in singleData.study_programs">{{ itm.study_program_name }}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <img :src="singleData.file_url" alt="" style="width: 100%;">
                    </td>
                </tr>
                <DetailItem title="Type" :value="singleData.type" />
                <DetailItem title="Konten" :value="singleData.content" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
