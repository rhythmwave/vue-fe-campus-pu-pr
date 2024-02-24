
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { getLaboratoryDetail } from '~~/composables/api/laboratory/getLaboratoryDetail';
import { GetBuildingDetaiData } from '~~/types/api/building/GetBuildingDetail';
import { ErrorRoot } from '~~/types/api/error';
import { GetLaboratoryDetaiData } from '~~/types/api/laboratory/GetLaboratoryDetail';
import { GetLaboratoryListData } from '~~/types/api/laboratory/GetLaboratoryList';

const props = defineProps({
    getLaboratoryListData: Array as any,
    getBuildingDetaiData: Array as any,
});

onMounted(async () => {
    getBuildingDetaiData.value = <GetBuildingDetaiData>props.getBuildingDetaiData
    detailLaboratory.value = <GetLaboratoryListData>props.getLaboratoryListData
    laboratoryDetailData.value = <GetLaboratoryDetaiData>detailLaboratory.value
    await getLaboratoryDetailData(detailLaboratory.value.id)
});
const getBuildingDetaiData = ref(<GetBuildingDetaiData>{})
const detailLaboratory = ref(<GetLaboratoryListData>{});
const laboratoryDetailData = ref(<GetLaboratoryDetaiData>{
    id: '',
    building_id: '',
    building_code: '',
    building_name: '',
    code: '',
    name: '',
    capacity: 0,
    exam_capacity: 0,
    purpose: '',
    is_usable: false,
    area: 0,
    phone_number: '',
    facility: '',
    remarks: '',
    owner: '',
    location: '',
    study_program_id: '',
    study_program_name: '',
    is_laboratory: false,
})
async function getLaboratoryDetailData(id: string) {
    try {
        const { response: resp, error: error } = await getLaboratoryDetail(<string>props.getLaboratoryListData.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            laboratoryDetailData.value = resp?.data
            console.log('test')
            console.log(resp?.data)
        }
    } catch (error) {
        alert(error)
    }
}

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Laboratorium</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Kode Gedung" :value="getBuildingDetaiData.code" />
                <PagesStudyProgramsDetailItem title="Kode Laboratorium" :value="laboratoryDetailData.code" />
                <PagesStudyProgramsDetailItem title="Kapasitas" :value="laboratoryDetailData.capacity.toString()" />
                <PagesStudyProgramsDetailItem title="Kapasitas Ujian" :value="laboratoryDetailData.exam_capacity.toString()" />
                <PagesStudyProgramsDetailItem title="Guna" :value="laboratoryDetailData.purpose" />
                <PagesStudyProgramsDetailItem title="Status Kelayakan"
                    :value="laboratoryDetailData.is_usable ? 'Layak Pakai' : 'Tidak Layak Pakai'" />
                <PagesStudyProgramsDetailItem title="Luas(m2)" :value="laboratoryDetailData.area.toString()" />
                <PagesStudyProgramsDetailItem title="Telepon" :value="laboratoryDetailData.phone_number" />
                <PagesStudyProgramsDetailItem title="Catatan" :value="laboratoryDetailData.remarks" />
                <PagesStudyProgramsDetailItem title="Fasilitas" :value="laboratoryDetailData.facility" />
                <PagesStudyProgramsDetailItem title="Kepemilikan" :value="laboratoryDetailData.owner" />
                <PagesStudyProgramsDetailItem title="Lokasi" :value="laboratoryDetailData.location" />
                <PagesStudyProgramsDetailItem title="Program Studi" :value="laboratoryDetailData.study_program_name" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
