
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetMajorDetailData, GetMajorDetailRoot } from '~~/types/api/major/GetMajorDetail';

const props = defineProps({
    id: String,
});

onMounted(() => {
    console.log(props);
    getDetail(props.id as String);
});
const getMajorDetailData = ref(<GetMajorDetailData>{});

async function getDetail(id: String) {
    try {
        try {
            const { data: getFacultyDetail, pending, refresh, error } = await useAPIFetch<GetMajorDetailRoot>(() => `/api/v1/root/root_major.RootMajorHandler/GetDetail?id=${id}`, <any>{
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
            getMajorDetailData.value = <GetMajorDetailData>getFacultyDetail.value?.data;
        } catch (error) {
            alert(error)
        }
    } catch (error) {
        alert(error);
        console.log(error);
    }
}

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Jurusan</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesMajorsDetailItem title="Nama" :value="getMajorDetailData.name" />
                <PagesMajorsDetailItem title="Nama Singkat" :value="getMajorDetailData.short_name" />
                <PagesMajorsDetailItem title="Nama Asing" :value="getMajorDetailData.english_name" />
                <PagesMajorsDetailItem title="Nama Asing Singkat" :value="getMajorDetailData.english_short_name" />
                <PagesMajorsDetailItem title="Fakultas" :value="getMajorDetailData.faculty_name" />
                <PagesMajorsDetailItem title="Alamat" :value="getMajorDetailData.address" />
                <PagesMajorsDetailItem title="Telepon" :value="getMajorDetailData.phone_number" />
                <PagesMajorsDetailItem title="Fax" :value="getMajorDetailData.fax" />
                <PagesMajorsDetailItem title="Email" :value="getMajorDetailData.email" />
                <PagesMajorsDetailItem title="Kontak Person" :value="getMajorDetailData.contact_person" />
                <PagesMajorsDetailItem title="Luas Gedung Percobana(m2)"
                    :value="getMajorDetailData.experiment_building_area?.toString()" />
                <PagesMajorsDetailItem title="Luas Ruang Kuliah(m2)"
                    :value="getMajorDetailData.lecture_hall_area?.toString()" />
                <PagesMajorsDetailItem title="Jumlah Ruang Kuliah"
                    :value="getMajorDetailData.lecture_hall_count?.toString()" />
                <PagesMajorsDetailItem title="Luas Laboratorium(m2)"
                    :value="getMajorDetailData.laboratorium_area?.toString()" />
                <PagesMajorsDetailItem title="Jumlah Laboratorium"
                    :value="getMajorDetailData.laboratorium_count?.toString()" />
                <PagesMajorsDetailItem title="Luas Ruang Dosen Tetap(m2)"
                    :value="getMajorDetailData.permanent_lecturer_room_area?.toString()" />
                <PagesMajorsDetailItem title="Luas Ruang Administrasi(m2)"
                    :value="getMajorDetailData.administration_room_area?.toString()" />
                <PagesMajorsDetailItem title="Jumlah Judul Buku" :value="getMajorDetailData.book_count?.toString()" />
                <PagesMajorsDetailItem title="Jumlah Expemplar Buku"
                    :value="getMajorDetailData.book_copy_count?.toString()" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
