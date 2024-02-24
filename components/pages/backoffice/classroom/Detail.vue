<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';

const props = defineProps({
    title: String,
    dataDetail: Object,
});

const detail = ref(<GetClassroomDetail>{});
onMounted(async() => {
    detail.value = <GetClassroomDetail>props.dataDetail
});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">{{ title }}</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesBackofficeClassroomDetailItem title="Nama Kelas" :value="detail.name" />
                <PagesBackofficeClassroomDetailItem title="Program Studi" :value="detail.study_program_name" />
                <PagesBackofficeClassroomDetailItem title="Kurikulum" :value="detail.curriculum_name+' ( '+detail.curriculum_year+' )'" />
                <PagesBackofficeClassroomDetailItem title="Mata Kuliah" :value="detail.subject_name+' ( '+detail.subject_code+' )'" />
                <PagesBackofficeClassroomDetailItem title="Status Pelaksanaan" :value="detail.is_active ? 'Aktif' : 'Batal'" />
                <PagesBackofficeClassroomDetailItem title="Tahun Semester" :value="detail.semester_start_year" />
                <PagesBackofficeClassroomDetailItem title="Tipe Semester" :value="detail.semester_type" />
                <PagesBackofficeClassroomDetailItem title="Tahun Mulai Semester" :value="detail.semester_start_year" />
                <PagesBackofficeClassroomDetailItem title="Cakupan" :value="detail.scope" />
                <PagesBackofficeClassroomDetailItem title="Online" :value="detail.is_online ? 'Ya' : 'Tidak'" />
                <PagesBackofficeClassroomDetailItem title="Offline" :value="detail.is_offline ? 'Ya' : 'Tidak'" />
                <PagesBackofficeClassroomDetailItem title="Jumlah Peserta" :value="detail.total_participant" />
                <PagesBackofficeClassroomDetailItem title="Catatan" :value="detail.remarks" />
                <tr>
                    <td>
                        <div class="d-flex align-center">
                            
                            <div class="ml-4">
                                <h6 class="text-h6">Dosen Kelas</h6>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p v-if="detail.lecturers?.length > 0" v-for="item in detail.lecturers">
                            - {{ item.front_title+' '+item.name+' '+item.back_degree }} ({{ item.is_grading_responsible ? 'Penanggung Jawab' : 'Bukan Penanggung Jawab' }})
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex align-center">
                            
                            <div class="ml-4">
                                <h6 class="text-h6">Jumlah Peserta</h6>
                            </div>
                        </div>
                    </td>
                    <td>
                        <p>- Minimal : {{ detail.minimum_participant }}</p>
                        <p>- Maksimal : {{ detail.maximum_participant }}</p>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
