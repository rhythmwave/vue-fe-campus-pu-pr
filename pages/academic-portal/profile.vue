<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import ListDetail from '@/components/shared/academic-portal/ListDetail.vue';
import { GetAcademicPortalLecturerGeneralProfileData } from '~~/types/api/academic-portal-lecturer-general/GetAcademicPortalLecturerGeneralProfile';
import { getAcademicPortalLecturerGeneralProfile } from '~~/composables/api/academic-portal-lecturer-general/getAcademicPortalLecturerGeneralProfile';
import { ErrorRoot } from "~~/types/api/error";
import moment from 'moment';

definePageMeta(<PageMeta>{
    layout: "academic-portal",
    middleware: ['check-auth'],
});

const page = ref({ title: 'Profile' });
const breadcrumbs = ref([
    {
        text: 'Home',
        disabled: false,
        href: '/academic-portal'
    },
    {
        text: 'Profile',
        disabled: true,
        href: '#'
    }
]);
const profile = ref(<GetAcademicPortalLecturerGeneralProfileData>{})
async function getProfileLecturer(){
  try {
    const { response: resp, error: error } = await getAcademicPortalLecturerGeneralProfile()
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
        profile.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
onMounted(async () => {
  const user = useAuth()
  if(user.value.app_type == 'lecturer'){
    await getProfileLecturer()
  }
})
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
          <AcademicBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
      </v-col>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          Keterangan : 
          <br />
          Profil berisi data pribadi pengguna portal akademik. Apabila terdapat kesalahan data, anda dapat menghubungi bagian akademik untuk memperbaikinya.
        </v-alert>
      </v-col>
      <v-col cols="12">
        <v-card class="border" elevation="0">
            <v-table class="month-table">
                <tbody>
                  <ListDetail title="NIDN" :value="profile.id_national_lecturer" />
                  <ListDetail title="Nama" :value="profile.name" />
                  <ListDetail title="Alamat" :value="profile.address" />
                  <ListDetail title="Tempat Lahir" :value="profile.birth_regency_name" />
                  <ListDetail title="Tanggal Lahir" :value="profile.birth_date ? moment(profile.birth_date).format('DD MMM YYYY') : ''" />
                  <ListDetail title="Agama" :value="profile.religion" />
                  <ListDetail title="Jenis Kelamin" :value="profile.sex" />
                  <ListDetail title="Telp. Kantor" :value="profile.office_phone_number" />
                  <ListDetail title="Telp. Rumah" :value="profile.phone_number" />
                  <ListDetail title="Telp. Selular" :value="profile.mobile_phone_number" />
                  <ListDetail title="Jabatan Fungsional" :value="profile.academic_position" />
                  <ListDetail title="Status" :value="profile.status" />
                  <ListDetail title="Golongan" :value="profile.employment_status" />
                </tbody>
            </v-table>
        </v-card>
      </v-col>
    </v-row>
    
  </div>
</template>

<style scoped></style>