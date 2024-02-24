
<script setup lang="ts">
// import Hspace from '@/components/shared/commons/Hspace.vue';
// import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { GetAdminStudyProgramDetailData } from '~~/types/api/admin-study-program/GetAdminStudyProgramDetail';
import { ErrorRoot } from '~~/types/api/error';

const props = defineProps({
    id: String,
});

const adminStudyProgramDetail = ref(<GetAdminStudyProgramDetailData>{});

async function getDetail(id: String) {
    try {
        try {
            const { data: resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/study_program/admin_study_program.AdminStudyProgramHandler/GetDetail?id=${id}`, <any>{
                method: 'GET',
            })
            if (error.value) {
                let errorRoot = <ErrorRoot><unknown>error.value.data;
                if (!errorRoot.meta) {
                    alert(errorRoot)
                    return ;
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
            adminStudyProgramDetail.value = resp.value?.data
        } catch (error) {
            alert(error)
        }
    } catch (error) {
        alert(error);
        console.log(error);
    }
}

onMounted(() => {
    getDetail(props.id as String);
});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Manajemen Program Studi</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesAdminProgramStudyDetailItem title="Nama Prodi" :value="adminStudyProgramDetail.name" />
                <PagesAdminProgramStudyDetailItem title="Nama Program Studi DIKTI"
                    :value="adminStudyProgramDetail.dikti_study_program_name" />
                <PagesAdminProgramStudyDetailItem title="Jenjang"
                    :value="adminStudyProgramDetail.study_level_short_name + '-' + adminStudyProgramDetail.study_level_name" />
                <PagesAdminProgramStudyDetailItem title="Nama Asing" :value="adminStudyProgramDetail.english_name" />
                <PagesAdminProgramStudyDetailItem title="Nama Singkat" :value="adminStudyProgramDetail.short_name" />
                <PagesAdminProgramStudyDetailItem title="Kode Ujian Masuk" />
                <PagesAdminProgramStudyDetailItem title="Kode Universitas"
                    :value="adminStudyProgramDetail.dikti_study_program_code" />
                <PagesAdminProgramStudyDetailItem title="Fakultas" :value="adminStudyProgramDetail.faculty_name" />
                <PagesAdminProgramStudyDetailItem title="Jurusan" :value="adminStudyProgramDetail.major_name" />
                <PagesAdminProgramStudyDetailItem title="Mode Perkuliahan"
                    :value="adminStudyProgramDetail.dikti_study_program_type" />
                <PagesAdminProgramStudyDetailItem title="Jumlah SKS Lulus"
                    :value="`${adminStudyProgramDetail.minimum_graduation_credit}`" />
                <PagesAdminProgramStudyDetailItem title="Alamat" :value="adminStudyProgramDetail.address" />
                <PagesAdminProgramStudyDetailItem title="Telepon" :value="adminStudyProgramDetail.phone_number" />
                <PagesAdminProgramStudyDetailItem title="Fax" :value="adminStudyProgramDetail.fax" />
                <PagesAdminProgramStudyDetailItem title="Email" :value="adminStudyProgramDetail.email" />
                <PagesAdminProgramStudyDetailItem title="Website" :value="adminStudyProgramDetail.website" />
                <PagesAdminProgramStudyDetailItem title="Kontak Person" :value="adminStudyProgramDetail.contact_person" />
                <PagesAdminProgramStudyDetailItem title="Frekuensi peninjauan kurikulum"
                    :value="adminStudyProgramDetail.curiculum_review_frequency" />
                <PagesAdminProgramStudyDetailItem title="Pelaksanaan peninjauan kurikulum"
                    :value="adminStudyProgramDetail.curiculum_review_method" />
                <PagesAdminProgramStudyDetailItem title="Tanggal berdiri"
                    :value="moment(adminStudyProgramDetail.establishment_date).format('DD MMM YYYY')" />
                <PagesAdminProgramStudyDetailItem title="Status"
                    :value="adminStudyProgramDetail.is_active ? 'Aktif' : 'Tidak Aktif'" />
                <PagesAdminProgramStudyDetailItem title="Semester mulai" :value="adminStudyProgramDetail.start_semester" />
                <PagesAdminProgramStudyDetailItem title="No. S.K. (Surat Keputusan) Izin operasional Dikti (terakhir)"
                    :value="adminStudyProgramDetail.operational_permit_number" />
                <PagesAdminProgramStudyDetailItem title="Tanggal S.K. (Surat Keputusan) Izin operasional Dikti"
                    :value="moment(adminStudyProgramDetail.operational_permit_date).format('DD MMM YYYY')" />
                <PagesAdminProgramStudyDetailItem
                    title="Tanggal batas akhir berlaku S.K. (Surat Keputusan) Izin operasional Dikti"
                    :value="moment(adminStudyProgramDetail.operational_permit_due_date).format('DD MMM YYYY')" />
                <PagesAdminProgramStudyDetailItem title="Kepala Prodi" :value="adminStudyProgramDetail.head_lecturer_name" />
                <PagesAdminProgramStudyDetailItem title="No Telp Kepala Prodi"
                    :value="adminStudyProgramDetail.head_lecturer_mobile_phone_number" />
                <PagesAdminProgramStudyDetailItem title="Nama Operator" :value="adminStudyProgramDetail.operator_name" />
                <PagesAdminProgramStudyDetailItem title="No Telp Operator"
                    :value="adminStudyProgramDetail.operator_phone_number" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
