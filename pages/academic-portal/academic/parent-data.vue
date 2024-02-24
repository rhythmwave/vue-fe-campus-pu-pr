<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { getStudentParentProfileDetail } from '~~/composables/api/student-parent-profile/getStudentParentProfileDetail';
import { GetStudentParentProfileDetailData } from '~~/types/api/student-parent-profile/GetStudentParentProfileDetail';

import { convertNumberMoney } from '~~/utils/helpers/convert-number-money';
import moment from 'moment';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Data Orang Tua Mahasiswa')
const mode = ref('list')
const dialog = ref(false)
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: title.value,
    disabled: true,
    href: '#'
  }
]);
function update() {
  mode.value = 'update'
  dialog.value = true
}
function close() {
  dialog.value = false
}
onMounted(async () => {
  await getStudentParentProfileDetailData()
})
const getStudentParentProfileDetails = ref(<GetStudentParentProfileDetailData>{
  father_id_number: "",
  father_name: "",
  father_birth_date: "",
  father_death_date: "",
  father_final_academic_background: "",
  father_occupation: "",
  mother_id_number: "",
  mother_name: "",
  mother_birth_date: "",
  mother_death_date: "",
  mother_final_academic_background: "",
  mother_occupation: "",
  parent_religion: "",
  parent_nationality: "",
  parent_address: "",
  father_work_address: "",
  parent_province_id: 0,
  parent_province_name: "",
  parent_regency_id: 0,
  parent_regency_name: "",
  parent_postal_code: "",
  parent_phone_number: "",
  parent_email: "",
  is_financially_capable: false,
  parent_income: 0,
  total_dependent: 0,
  guardian_name: "",
  guardian_birth_date: "",
  guardian_death_date: "",
  guardian_address: "",
  guardian_province_id: 0,
  guardian_province_name: "",
  guardian_regency_id: 0,
  guardian_regency_name: "",
  guardian_postal_code: "",
  guardian_phone_number: "",
  guardian_email: "",
  guardian_final_academic_background: "",
  guardian_occupation: "",
})
async function getStudentParentProfileDetailData() {
  try {
    const { response: resp, error: error } = await getStudentParentProfileDetail()
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      getStudentParentProfileDetails.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
</script>
<template>
  <div v-if="mode == 'update'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalAcademicParentDataUpdate @close="close" @reload="getStudentParentProfileDetailData()" :getStudentParentProfileDetails="getStudentParentProfileDetails"/>
      </v-dialog>
    </v-col>
  </div>
  <v-col cols="12">
    <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
  </v-col>
  <v-col cols="12">
    <v-alert type="info" variant="tonal">
      Keterangan :
      <br />
      Data Orang Tua berisi data Orang Tua Mahasiswa portal akademik. Apabila terdapat kesalahan data, anda dapat
      memperbaikinya.
    </v-alert>
  </v-col>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Data Ayah</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>No KTP / NIK Ayah</td>
        <td>{{ getStudentParentProfileDetails.father_id_number }}</td>
      </tr>
      <tr>
        <td>Nama Ayah</td>
        <td>{{ getStudentParentProfileDetails.father_name }}</td>
      </tr>
      <tr>
        <td>Tanggal Lahir Ayah</td>
        <td><span v-if="getStudentParentProfileDetails.father_birth_date">{{ moment(new
          Date(getStudentParentProfileDetails.father_birth_date)).format("DD MMMM YYYY") }}</span></td>
      </tr>
      <tr>
        <td>Ayah Meninggal</td>
        <td>{{ getStudentParentProfileDetails.father_death_date ? "Sudah Meninggal" : "Belum Meninggal" }}</td>
      </tr>
      <tr>
        <td>Tanggal Ayah Meninggal</td>
        <td><span v-if="getStudentParentProfileDetails.father_death_date">{{ moment(new
          Date(getStudentParentProfileDetails.father_death_date)).format("DD MMMM YYYY") }}</span></td>
      </tr>
      <tr>
        <td>Pendidikan Terakhir Ayah</td>
        <td>{{ getStudentParentProfileDetails.father_final_academic_background }}</td>
      </tr>
      <!-- <tr>
        <td>Pendidikan Terakhir Ayah</td>
        <td>-</td>
      </tr> -->
      <tr>
        <td>Pekerjaan Ayah</td>
        <td>{{ getStudentParentProfileDetails.father_occupation }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Data Ibu</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>No KTP / NIK Ibu</td>
        <td>{{ getStudentParentProfileDetails.mother_id_number }}</td>
      </tr>
      <tr>
        <td>Nama Ibu</td>
        <td>{{ getStudentParentProfileDetails.mother_name }}</td>
      </tr>
      <tr>
        <td>Tanggal Lahir Ibu</td>
        <td><span v-if="getStudentParentProfileDetails.mother_birth_date">{{ moment(new
          Date(getStudentParentProfileDetails.mother_birth_date)).format("DD MMMM YYYY") }}</span></td>
      </tr>
      <tr>
        <td>Ibu Meninggal</td>
        <td>{{ getStudentParentProfileDetails.mother_death_date ? "Sudah Meninggal" : "Belum Meninggal" }}</td>
      </tr>
      <tr>
        <td>Tanggal Ibu Meninggal</td>
        <td><span v-if="getStudentParentProfileDetails.mother_death_date">{{ moment(new
          Date(getStudentParentProfileDetails.mother_death_date)).format("DD MMMM YYYY") }}</span></td>
      </tr>
      <tr>
        <td>Pendidikan Terakhir Ibu</td>
        <td>{{ getStudentParentProfileDetails.mother_final_academic_background }}</td>
      </tr>
      <!-- <tr>
        <td>Pendidikan Terakhir Ibu</td>
        <td>-</td>
      </tr> -->
      <tr>
        <td>Pekerjaan Ibu</td>
        <td>{{ getStudentParentProfileDetails.mother_occupation }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Data Orang Tua</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Agama Orang Tua</td>
        <td>{{ getStudentParentProfileDetails.parent_religion }}</td>
      </tr>
      <tr>
        <td>Warganegara Orang Tua</td>
        <td>{{ getStudentParentProfileDetails.parent_nationality }}</td>
      </tr>
      <tr>
        <td>Alamat Orang Tua</td>
        <td>{{ getStudentParentProfileDetails.parent_address }}</td>
      </tr>
      <tr>
        <td>Alamat Kantor Ayah</td>
        <td>{{ getStudentParentProfileDetails.father_work_address }}</td>
      </tr>
      <tr>
        <td>Provinsi Orang Tua</td>
        <td>{{ getStudentParentProfileDetails.parent_province_name }}</td>
      </tr>
      <tr>
        <td>Kota Orang Tua</td>
        <td>{{ getStudentParentProfileDetails.parent_regency_name }}</td>
      </tr>
      <tr>
        <td>Kode Pos Orang Tua</td>
        <td>{{ getStudentParentProfileDetails.parent_postal_code }}</td>
      </tr>
      <tr>
        <td>No Telepon / Hp Orang Tua</td>
        <td>{{ getStudentParentProfileDetails.parent_phone_number }}</td>
      </tr>
      <tr>
        <td>Email Orang Tua</td>
        <td>{{ getStudentParentProfileDetails.parent_email }}</td>
      </tr>
      <!-- <tr>
        <td>Orang Tua Mampu ?</td>
        <td>Mampu</td>
      </tr> -->
      <tr>
        <td>Penghasilan Orang Tua</td>
        <td><span v-if="getStudentParentProfileDetails.parent_income">{{ convertNumberMoney(getStudentParentProfileDetails.parent_income) }}</span></td>
      </tr>
      <tr>
        <td>Jumlah Tanggungan</td>
        <td>{{ getStudentParentProfileDetails.total_dependent }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Data Wali</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nama Wali</td>
        <td>{{ getStudentParentProfileDetails.guardian_name }}</td>
      </tr>
      <tr>
        <td>Tanggal Lahir Wali</td>
        <td><span v-if="getStudentParentProfileDetails.guardian_birth_date">{{ moment(new
          Date(getStudentParentProfileDetails.guardian_birth_date)).format("DD MMMM YYYY") }}</span></td>
      </tr>
      <tr>
        <td>Wali Meninggal ?</td>
        <td><span>{{ getStudentParentProfileDetails.guardian_death_date ? "Sudah Meninggal" : "Belum Meninggal" }}</span>
        </td>
      </tr>
      <tr>
        <td>Tanggal Wali Meninggal ?</td>
        <td><span v-if="getStudentParentProfileDetails.guardian_birth_date">{{ moment(new
          Date(getStudentParentProfileDetails.guardian_birth_date)).format("DD MMMM YYYY") }}</span></td>
      </tr>
      <tr>
        <td>Alamat Wali</td>
        <td>{{ getStudentParentProfileDetails.guardian_address }}</td>
      </tr>
      <tr>
        <td>Provinsi Wali</td>
        <td>{{ getStudentParentProfileDetails.guardian_province_name }}</td>
      </tr>
      <tr>
        <td>Kota Wali</td>
        <td>{{ getStudentParentProfileDetails.guardian_regency_name }}</td>
      </tr>
      <tr>
        <td>Kode Pos Wali</td>
        <td>{{ getStudentParentProfileDetails.guardian_postal_code }}</td>
      </tr>
      <tr>
        <td>No Telepon / Hp Wali</td>
        <td>{{ getStudentParentProfileDetails.guardian_phone_number }}</td>
      </tr>
      <tr>
        <td>Email Wali</td>
        <td>{{ getStudentParentProfileDetails.guardian_email }}</td>
      </tr>
      <tr>
        <td>Pekerjaan Wali</td>
        <td>{{ getStudentParentProfileDetails.guardian_occupation }}</td>
      </tr>
      <!-- <tr>
        <td>Pendidikan Wali</td>
        <td>-</td>
      </tr> -->
      <tr>
        <td>Pendidikan Terakhir Wali</td>
        <td>{{ getStudentParentProfileDetails.guardian_final_academic_background }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-col cols="12">
    <v-card-actions class="pa-4">
      <v-spacer />
      <v-btn color="secondary" @click="update">
        Ubah
      </v-btn>
    </v-card-actions>
  </v-col>
</template>
