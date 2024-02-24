
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudyProgramDetailData, GetStudyProgramDetailRoot } from '~~/types/api/study-program/GetStudyProgramDetail';

const props = defineProps({
    id: String,
});

onMounted(() => {
    console.log(props);
    getDetail(props.id as String);
});
const getStudyProgramDetailData = ref(<GetStudyProgramDetailData>{});

async function getDetail(id: String) {
    try {
        const { data: getFacultyDetail, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_study_program.RootStudyProgramHandler/GetDetail?id=${id}`, <any>{
            method: 'GET',
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                alert(errorRoot)
                return;
            }
            alert(errorRoot.meta.message)
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return;
            }
            return;
        }
        getStudyProgramDetailData.value = <GetStudyProgramDetailData>getFacultyDetail.value?.data;
        console.log(JSON.stringify(getStudyProgramDetailData.value))
    } catch (error) {
        alert(error)
    }
}

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Program Studi</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Nama Program Studi DIKTI"
                    :value="getStudyProgramDetailData.dikti_study_program_name" />
                <PagesStudyProgramsDetailItem title="Jenjang" :value="getStudyProgramDetailData.study_level_name" />
                <PagesStudyProgramsDetailItem title="Nama" :value="getStudyProgramDetailData.name" />
                <PagesStudyProgramsDetailItem title="Nama Asing" :value="getStudyProgramDetailData.english_name" />
                <PagesStudyProgramsDetailItem title="Nama Singkat" :value="getStudyProgramDetailData.short_name" />
                <PagesStudyProgramsDetailItem title="Fakultas" :value="getStudyProgramDetailData.faculty_name" />
                <PagesStudyProgramsDetailItem title="Jurusan" :value="getStudyProgramDetailData.major_name" />
                <PagesStudyProgramsDetailItem title="Satuan Administrasi"
                    :value="getStudyProgramDetailData.administrative_unit" />
                <PagesStudyProgramsDetailItem title="Alamat" :value="getStudyProgramDetailData.address" />
                <PagesStudyProgramsDetailItem title="Telepon" :value="getStudyProgramDetailData.phone_number" />
                <PagesStudyProgramsDetailItem title="Fax" :value="getStudyProgramDetailData.fax" />
                <PagesStudyProgramsDetailItem title="Email" :value="getStudyProgramDetailData.email" />
                <PagesStudyProgramsDetailItem title="Website" :value="getStudyProgramDetailData.website" />
                <PagesStudyProgramsDetailItem title="Kontak Person" :value="getStudyProgramDetailData.contact_person" />
                <PagesStudyProgramsDetailItem title="Frekuensi peninjauan kurikulum"
                    :value="getStudyProgramDetailData.curiculum_review_frequency" />
                <PagesStudyProgramsDetailItem title="Pelaksanaan peninjauan kurikulum"
                    :value="getStudyProgramDetailData.curiculum_review_method" />
                <PagesStudyProgramsDetailItem title="Tanggal Berdiri"
                    :value="moment(getStudyProgramDetailData.establishment_date).format('DD MMM YYYY')" />
                <PagesStudyProgramsDetailItem title="Status"
                    :value="getStudyProgramDetailData.is_active ? 'Aktif' : 'Hapus'" />
                <PagesStudyProgramsDetailItem title="Semester mulai" :value="getStudyProgramDetailData.start_semester" />
                <PagesStudyProgramsDetailItem title="No. S.K. (Surat Keputusan) Izin operasional Dikti (terakhir)"
                    :value="getStudyProgramDetailData.operational_permit_number" />
                <PagesStudyProgramsDetailItem title="Tanggal S.K. (Surat Keputusan) Izin operasional Dikti"
                    :value="moment(getStudyProgramDetailData.operational_permit_date).format('DD MMM YYYY')" />
                <PagesStudyProgramsDetailItem
                    title="Tanggal batas akhir berlaku S.K. (Surat Keputusan) Izin operasional Dikti"
                    :value="moment(getStudyProgramDetailData.operational_permit_due_date).format('DD MMM YYYY')" />
                <PagesStudyProgramsDetailItem title="Kepala Prodi" :value="getStudyProgramDetailData.head_lecturer_name" />
                <PagesStudyProgramsDetailItem title="No HP Kepala Prodi"
                    :value="getStudyProgramDetailData.head_lecturer_mobile_phone_number" />
                <PagesStudyProgramsDetailItem title="Nama Operator" :value="getStudyProgramDetailData.operator_name" />
                <PagesStudyProgramsDetailItem title="No HP Operator"
                    :value="getStudyProgramDetailData.operator_phone_number" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
