<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import { useStorage, StorageSerializers } from '@vueuse/core';
import { GetAcademicPortalStudentGeneralProfileData } from '~~/types/api/academic-portal-student-general/GetAcademicPortalStudentGeneralProfile';
import moment from 'moment';

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const title = ref('Biodata Mahasiswa')
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
onMounted(async () => {
  await reload()
})
async function reload() {
  let temp = useStorage('studentProfile', null, undefined, { serializer: StorageSerializers.object }).value
  profileStudent.value = temp
}
const profileStudent = ref(<GetAcademicPortalStudentGeneralProfileData>{
  id: '',
  profile_photo_path: '',
  profile_photo_path_type: '',
  profile_photo_url: '',
  name: '',
  sex: '',
  birth_province_id: 0,
  birth_province_name: '',
  birth_regency_id: 0,
  birth_regency_name: '',
  birth_date: '',
  blood_type: '',
  height: 0,
  weight: 0,
  is_color_blind: false,
  use_glasses: false,
  has_complete_teeth: false,
  study_program_id: '',
  study_program_name: '',
  dikti_study_program_type: '',
  study_level_short_name: '',
  admittance_semester: '',
  student_force: 0,
  admittance_test_number: '',
  college_entrance_type: '',
  admittance_date: '',
  admittance_status: '',
  npwp_number: '',
  nisn_number: '',
  religion: '',
  marital_status: '',
  nationality: '',
  province_id: 0,
  province_name: '',
  regency_id: 0,
  regency_name: '',
  district_id: 0,
  district_name: '',
  village_id: 0,
  village_name: '',
  rt: '',
  rw: '',
  postal_code: '',
  address: '',
  phone_number: '',
  mobile_phone_number: '',
  email: '',
  transportation_mean: '',
  is_kps_recipient: false,
  fund_source: '',
  is_scholarship_grantee: false,
  total_brother: 0,
  total_sister: 0,
  work_type: '',
  work_place: '',
  work_address: '',
  assurance_number: '',
  hobby: '',
})


function update() {
  mode.value = 'update'
  dialog.value = true
}
function close() {
  dialog.value = false
}
</script>

<template>
  <div v-if="mode == 'update'">
    <v-col cols="12" lg="8" md="6" class="text-right">
      <v-dialog v-model="dialog" max-width="800">
        <PagesAcademicPortalAcademicBiodataUpdate @close="close" @reload="reload()"
          :getAcademicPortalStudentGeneralProfiles="profileStudent" />
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
      Biodata Mahasiswa berisi data pribadi pengguna portal akademik. Apabila terdapat kesalahan data, anda dapat
      memperbaikinya.
    </v-alert>
  </v-col>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Biodata Mahasiswa</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td width="200">Foto</td>
        <td class="text-left">
          <img v-if="profileStudent.profile_photo_url" style="width: 20%; padding: 5px"
            :src="profileStudent.profile_photo_url" alt="Foto">
        </td>
      </tr>
      <tr>
        <td>Nama</td>
        <td>{{ profileStudent.name }}</td>
      </tr>
      <tr>
        <td>Jenis Kelamin</td>
        <td>{{ profileStudent.sex == 'M' ? 'Laki-Laki' : profileStudent.sex == 'F' ? 'Perempuan' : '-' }}</td>
      </tr>
      <tr>
        <td>Provinsi Tempat Lahir</td>
        <td>{{ profileStudent.birth_province_name }}</td>
      </tr>
      <tr>
        <td>Kota Tempat Lahir</td>
        <td>{{ profileStudent.birth_regency_name }}</td>
      </tr>
      <!-- <tr>
        <td>Tempat Lahir</td>
        <td>Bandung</td>
      </tr> -->
      <tr>
        <td>Tanggal Lahir</td>
        <td>{{ moment(profileStudent.birth_date).format("D MMMM YYYY") }}</td>
      </tr>
      <tr>
        <td>Golongan Darah</td>
        <td>{{ profileStudent.blood_type }}</td>
      </tr>
      <tr>
        <td>Tinggi Badan</td>
        <td>{{ profileStudent.height }} Cm</td>
      </tr>
      <tr>
        <td>Berat Badan</td>
        <td>{{ profileStudent.weight }} Kg</td>
      </tr>
      <tr>
        <td>Kondisi Buta Warna</td>
        <td>{{ profileStudent.is_color_blind ? 'Ya' : 'Tidak' }}</td>
      </tr>
      <tr>
        <td>Kondisi Gigi</td>
        <td>{{ profileStudent.has_complete_teeth ? "Lengkap" : "Tidak Lengkap" }}</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Kemahasiswaan</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Kelas</td>
        <td>-</td>
      </tr>
      <tr>
        <td>Periode Masuk</td>
        <td>GANJIL 2022/2023</td>
      </tr>
      <tr>
        <td>Angkatan</td>
        <td>2022</td>
      </tr>
      <tr>
        <td>No. Tes</td>
        <td>22-32-0753</td>
      </tr>
      <tr>
        <td>Jalur Masuk</td>
        <td>Reguler (REG)</td>
      </tr>
      <tr>
        <td>Tanggal Daftar</td>
        <td>29 Agustus 2022</td>
      </tr>
      <tr>
        <td>Gelombang Pendaftaran</td>
        <td>Gelombang - 1</td>
      </tr>
      <tr>
        <td>Status Masuk</td>
        <td>Mahasiswa Baru</td>
      </tr>
    </tbody>
  </v-table>
  <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="2" class="text-subtitle-1 font-weight-semibold">Kewarganegaraan</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Nik / No. KTP</td>
        <td>{{ profileStudent.nisn_number }}</td>
      </tr>
      <tr>
        <td>NPWP</td>
        <td>{{ profileStudent.npwp_number }}</td>
      </tr>
      <tr>
        <td>NISN</td>
        <td>{{ profileStudent.nisn_number }}</td>
      </tr>
      <tr>
        <td>Agama</td>
        <td>{{ profileStudent.religion }}</td>
      </tr>
      <tr>
        <td>Status Nikah</td>
        <td>{{ profileStudent.marital_status }}</td>
      </tr>
      <tr>
        <td>Warganegara</td>
        <td>{{ profileStudent.nationality }}</td>
      </tr>
      <!-- <tr>
        <td>Status Rumah</td>
        <td>{{ profileStudent.is }}</td>
      </tr> -->
      <tr>
        <td>Provinsi Tempat Tinggal</td>
        <td>{{ profileStudent.province_name }}</td>
      </tr>
      <tr>
        <td>Kota Tempat Tinggal</td>
        <td>{{ profileStudent.regency_name }}</td>
      </tr>
      <tr>
        <td>Kecamatan Tempat Tinggal</td>
        <td>{{ profileStudent.district_name }}</td>
      </tr>
      <tr>
        <td>Alamat Tinggal</td>
        <td>{{ profileStudent.address }}</td>
      </tr>
      <tr>
        <td>RT</td>
        <td>{{ profileStudent.rt }}</td>
      </tr>
      <tr>
        <td>RW</td>
        <td>{{ profileStudent.rw }}</td>
      </tr>
      <tr>
        <td>Dusun</td>
        <td>{{ profileStudent.village_name }}</td>
      </tr>
      <tr>
        <td>Kelurahan</td>
        <td>{{ profileStudent.village_name }}</td>
      </tr>
      <tr>
        <td>Kode Pos</td>
        <td>{{ profileStudent.postal_code }}</td>
      </tr>
      <tr>
        <td>Negara</td>
        <td>{{ profileStudent.nationality }}</td>
      </tr>
      <tr>
        <td>Nomor Telepon</td>
        <td>{{ profileStudent.phone_number }}</td>
      </tr>
      <tr>
        <td>Nomor Hp</td>
        <td>{{ profileStudent.mobile_phone_number }}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>{{ profileStudent.email }}</td>
      </tr>
      <!-- <tr>
        <td>Jenis Tinggal</td>
        <td>Kontrak</td>
      </tr> -->
      <tr>
        <td>Alat Transportasi</td>
        <td>{{ profileStudent.transportation_mean }}</td>
      </tr>
      <tr>
        <td>Penerima KPS</td>
        <td>-</td>
      </tr>
      <tr>
        <td>Data KPS</td>
        <td>-</td>
      </tr>
    </tbody>
  </v-table>
  <!-- <v-table class="mt-5">
    <thead>
      <tr>
        <th colspan="3" class="text-subtitle-1 font-weight-semibold">Pengalaman Organisasi</th>
      </tr>
      <tr>
        <th class="text-subtitle-1 font-weight-semibold">No</th>
        <th class="text-subtitle-1 font-weight-semibold">Tempat</th>
        <th class="text-subtitle-1 font-weight-semibold">Pengalaman Organisasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Bandung</td>
        <td>Karang Taruna RW 01</td>
      </tr>
    </tbody>
  </v-table> -->
  <VCardActions class="pa-4">
    <VSpacer />
    <!-- <VBtn color="error" @click="close">
                                    Batal
                                    </VBtn> -->
    <VBtn color="secondary" @click="update()">
      Ubah
    </VBtn>
  </VCardActions>
</template>

<style scoped></style>
