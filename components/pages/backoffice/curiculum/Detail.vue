
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { GetCuriculumDetaiData } from '~~/types/api/curiculum/GetCuriculumDetail';
import { getCuriculumDetail } from '~~/composables/api/curiculum/getCuriculumDetail';

const props = defineProps({
    getCuriculumListData: Array as any,
});

onMounted(() => {
    // detailCuriculum.value = <GetCuriculumListData>props.getCuriculumListData
    getCuriculumDetilData()
});
const detailCuriculum = ref(<GetCuriculumDetaiData>{});

async function getCuriculumDetilData() {
    try {
        const { response: resp, error: error } = await getCuriculumDetail(props.getCuriculumListData.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            detailCuriculum.value = Object.assign({}, <GetCuriculumDetaiData><unknown>resp?.data)

            detailCuriculum.value.aggreement_date = detailCuriculum.value.aggreement_date.substring(0, 10)
            detailCuriculum.value.rector_decision_date = detailCuriculum.value.rector_decision_date.substring(0, 10)
        }
    } catch (error) {
        alert(error)
    }
}
</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Sample</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Program Studi" :value="detailCuriculum.study_program_name" />
                <PagesStudyProgramsDetailItem title="Nama Kurikulum" :value="detailCuriculum.name" />
                <PagesStudyProgramsDetailItem title="Tahun" :value="detailCuriculum.year" />
                <PagesStudyProgramsDetailItem title="Keputusan Rektor" :value="detailCuriculum.rector_decision_number" />
                <PagesStudyProgramsDetailItem title="Tanggal Keputusan" :value="detailCuriculum.rector_decision_date" />
                <PagesStudyProgramsDetailItem title="Pihak yang Menyetujui" :value="detailCuriculum.aggreeing_party" />
                <PagesStudyProgramsDetailItem title="Tanggal Disetujui" :value="detailCuriculum.aggreement_date" />
                <PagesStudyProgramsDetailItem title="Masa Studi Ideal" :value="detailCuriculum.name" />
                <PagesStudyProgramsDetailItem title="Masa Studi Maksimum" :value="detailCuriculum.name" />
                <PagesStudyProgramsDetailItem title="Keterangan" :value="detailCuriculum.remarks" />
                <PagesStudyProgramsDetailItem title="Aktif" :value="detailCuriculum.is_active ? 'Ya' : 'Tidak'" />
                <PagesStudyProgramsDetailItem title="Komponen Pengambilan Nilai"
                    :value="detailCuriculum.final_score_determinant=='best'?'Terbaik':'Terakhir'" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
