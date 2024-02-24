<script setup lang="ts">
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetAuthenticationData } from '~~/types/api/admin-authentication/GetAdminAuthentication';

const props = defineProps({
    title: String,
    data: Object as any,
});
const detail = ref<GetAuthenticationData>()
async function getData() {
    try {
        const { data: _resp, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/admin/auth/admin_authentication.AdminAuthenticationHandler/GetDetail?id=${props.data.authentication_id}`, <any>{
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
        detail.value = _resp.value.data
    } catch (error) {
        alert(error)
    }   
}
if(props.data.id != ''){
    getData()
}
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail {{ title }}</span>
        </v-card-title>
        <v-table class="month-table">
            <thead>
                <tr>
                    <th colspan="2">Detail {{ title }}</th>
                </tr>
            </thead>
            <tbody>
                <PagesAdminPortalAcademicDetailItemLecturer title="NIDN" :value="data.id_national_lecturer" />
                <PagesAdminPortalAcademicDetailItemLecturer title="Nama" :value="data.name" />
            </tbody>
            <thead>
                <tr>
                    <th colspan="2">Detail Login {{ title }}</th>
                </tr>
            </thead>
            <tbody v-if="props.data.authentication_id != ''">
                <PagesAdminPortalAcademicDetailItemLecturer title="Username" :value="detail?.username" />
                <PagesAdminPortalAcademicDetailItemLecturer title="Profil" :value="detail?.lecturer_name" />
                <PagesAdminPortalAcademicDetailItemLecturer title="Hak Akses" :value="detail?.authentication_type == 'lecturer' ? 'Dosen' : 'Mahasiswa'" />
                <PagesAdminPortalAcademicDetailItemLecturer title="Studi Program" :value="data.study_program_name" />
            </tbody>
            <tbody v-else>
                <tr>
                    <td style="color: red">Belum Dapat Akses Login</td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>