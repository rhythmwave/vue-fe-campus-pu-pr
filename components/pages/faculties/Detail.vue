
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetFacultyDetailData, GetFacultyDetailRoot } from '~~/types/api/faculty/GetFacultyDetail';

const props = defineProps({
    id: String,
});

onMounted(() => {
    console.log(props);
    getDetail(props.id as String);
});
const getFacultyDetailData = ref(<GetFacultyDetailData>{});

async function getDetail(id: String) {
    try {
        try {
            const { data: getFacultyDetail, pending, refresh, error } = await useAPIFetch<GetFacultyDetailRoot>(() => `/api/v1/root/root_faculty.RootFacultyHandler/GetDetail?id=${id}`, <any>{
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
            getFacultyDetailData.value = <GetFacultyDetailData>getFacultyDetail.value?.data;
        } catch (error) {
            return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
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
            <span class="title text-white">Detail Fakultas</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesFacultiesDetailItem title="Nama" :value="getFacultyDetailData.name" />
                <PagesFacultiesDetailItem title="Nama Singkat" :value="getFacultyDetailData.short_name" />
                <PagesFacultiesDetailItem title="Nama Asing" :value="getFacultyDetailData.english_name" />
                <PagesFacultiesDetailItem title="Nama Asing Singkat" :value="getFacultyDetailData.english_short_name" />
                <PagesFacultiesDetailItem title="Alamat" :value="getFacultyDetailData.address" />
                <PagesFacultiesDetailItem title="Telepon" :value="getFacultyDetailData.phone_number" />
                <PagesFacultiesDetailItem title="Fax" :value="getFacultyDetailData.fax" />
                <PagesFacultiesDetailItem title="Email" :value="getFacultyDetailData.email" />
                <PagesFacultiesDetailItem title="Kontak Person" :value="getFacultyDetailData.contact_person" />
                <PagesFacultiesDetailItem title="Luas Gedung Percobana(m2)"
                    :value="getFacultyDetailData.experiment_building_area?.toString()" />
                <PagesFacultiesDetailItem title="Luas Ruang Kuliah(m2)"
                    :value="getFacultyDetailData.lecture_hall_area?.toString()" />
                <PagesFacultiesDetailItem title="Jumlah Ruang Kuliah"
                    :value="getFacultyDetailData.lecture_hall_count?.toString()" />
                <PagesFacultiesDetailItem title="Luas Laboratorium(m2)"
                    :value="getFacultyDetailData.laboratorium_area?.toString()" />
                <PagesFacultiesDetailItem title="Jumlah Laboratorium"
                    :value="getFacultyDetailData.laboratorium_count?.toString()" />
                <PagesFacultiesDetailItem title="Luas Ruang Dosen Tetap(m2)"
                    :value="getFacultyDetailData.permanent_lecturer_room_area?.toString()" />
                <PagesFacultiesDetailItem title="Luas Ruang Administrasi(m2)"
                    :value="getFacultyDetailData.administration_room_area?.toString()" />
                <PagesFacultiesDetailItem title="Jumlah Judul Buku" :value="getFacultyDetailData.book_count?.toString()" />
                <PagesFacultiesDetailItem title="Jumlah Expemplar Buku"
                    :value="getFacultyDetailData.book_copy_count?.toString()" />
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
