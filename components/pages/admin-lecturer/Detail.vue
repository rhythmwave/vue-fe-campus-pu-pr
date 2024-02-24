<script setup lang="ts">
import moment from 'moment';
const props = defineProps({
    data: Object as any,
});

</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Predikat Kelulusan</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesAdminLecturerDetailItem title="NIDN" :value="data.id_national_lecturer" />
                <PagesAdminLecturerDetailItem title="Nama Lengkap" :value="data.name" />
                <PagesAdminLecturerDetailItem title="NIP" :value="data.employee_number" />
                <PagesAdminLecturerDetailItem title="Gelar Depan" :value="data.front_title" />
                <PagesAdminLecturerDetailItem title="Gelar Belakang" :value="data.back_degree" />
                <PagesAdminLecturerDetailItem title="Program Studi" :value="data.study_program_name" />
                <PagesAdminLecturerDetailItem title="Nomor KTP" :value="data.id_number" />
                <PagesAdminLecturerDetailItem title="Tanggal Lahir" :value="data.birth_date ? moment(data.birth_date).format('DD MMM YYYY') : ''" />
                <PagesAdminLecturerDetailItem title="Kota Tempat Lahir" :value="data.birth_regency_name" />
                <PagesAdminLecturerDetailItem title="Negara Tempat Lahir" :value="data.birth_country_name" />
                <PagesAdminLecturerDetailItem title="Kartu Pegawai" :value="data.id_employee" />
                <PagesAdminLecturerDetailItem title="Stambuk" :value="data.stambuk" />
                <PagesAdminLecturerDetailItem v-if="data.sex == 'M'" title="Jenis Kelamin" value="Laki-laki" />
                <PagesAdminLecturerDetailItem v-if="data.sex == 'F'" title="Jenis Kelamin" value="Laki-laki" />
                <PagesAdminLecturerDetailItem title="Golongan Darah" :value="data.blood_type" />
                <PagesAdminLecturerDetailItem title="Agama" :value="data.religion" />
                <PagesAdminLecturerDetailItem title="Status Nikah" :value="data.marital_status" />
                <PagesAdminLecturerDetailItem title="Alamat Rumah" :value="data.address" />
                <PagesAdminLecturerDetailItem title="Kota" :value="data.regency_name" />
                <PagesAdminLecturerDetailItem title="Negara" :value="data.country_name" />
                <PagesAdminLecturerDetailItem title="Kode Pos" :value="data.postal_code" />
                <PagesAdminLecturerDetailItem title="Telepon Rumah" :value="data.phone_number" />
                <PagesAdminLecturerDetailItem title="Fax" :value="data.fax" />
                <PagesAdminLecturerDetailItem title="Telepon Selular" :value="data.mobile_phone_number" />
                <PagesAdminLecturerDetailItem title="Telepon Kantor" :value="data.office_phone_number" />
                <PagesAdminLecturerDetailItem title="Jenis Pegawai" :value="data.employee_type" />
                <PagesAdminLecturerDetailItem title="Nomor SK CPNS" :value="data.sk_cpns_number" />
                <PagesAdminLecturerDetailItem title="Tanggal SK CPNS" :value="data.sk_cpns_date ? moment(data.sk_cpns_date).format('DD MMM YYYY') : ''" />
                <PagesAdminLecturerDetailItem title="Terhitung Mulai Tanggal (TMT) CPNS" :value="data.tmt_cpns_date ? moment(data.tmt_cpns_date).format('DD MMM YYYY') : ''" />
                <PagesAdminLecturerDetailItem title="Golongan CPNS" :value="data.cpns_category" />
                <PagesAdminLecturerDetailItem title="Pra Jabatan" :value="data.pre_position_date ? moment(data.pre_position_date).format('DD MMM YYYY') : ''" />
                <PagesAdminLecturerDetailItem title="Nomor SK PNS" :value="data.sk_pns_number" />
                <PagesAdminLecturerDetailItem title="Tanggal SK PNS" :value="data.sk_pns_date ? moment(data.sk_pns_date).format('DD MMM YYYY') : ''" />
                <PagesAdminLecturerDetailItem title="Terhitung Mulai Tanggal (TMT) PNS" :value="data.tmt_pns_date ? moment(data.tmt_pns_date).format('DD MMM YYYY') : ''" />
                <PagesAdminLecturerDetailItem title="Golongan PNS" :value="data.pns_category" />
                <PagesAdminLecturerDetailItem title="Sumpah PNS" :value="data.pns_oath_date ? moment(data.pns_oath_date).format('DD MMM YYYY') : ''" />
                <PagesAdminLecturerDetailItem title="Tanggal Masuk PT" :value="data.join_date ? moment(data.join_date).format('DD MMM YYYY') : ''" />
                <PagesAdminLecturerDetailItem title="Gelar Akademik Tertinggi" :value="data.highest_degree" />
                <PagesAdminLecturerDetailItem title="No Surat Izin Mengajar" :value="data.teaching_permit_number" />
                <PagesAdminLecturerDetailItem title="Nomor Taspen" :value="data.taspen_number" />
                <PagesAdminLecturerDetailItem title="Instansi Asal" :value="data.former_instance" />
                <PagesAdminLecturerDetailItem title="Catatan" :value="data.remarks" />
                <PagesAdminLecturerDetailItem title="Nomor Dosen" :value="data.lecturer_number" />
                <PagesAdminLecturerDetailItem title="JABATAN" :value="data.academic_position" />
                <PagesAdminLecturerDetailItem title="Status Ikatan Kerja" :value="data.employment_status" />
                <PagesAdminLecturerDetailItem title="Kelompok Keahlian" :value="data.expertise" />
                <PagesAdminLecturerDetailItem title="Kode Instansi Induk" :value="data.instance_code" />
                <PagesAdminLecturerDetailItem v-if="data.teaching_certificate_number" title="Status Sertifikat Mengajar" value="Ada" />
                <PagesAdminLecturerDetailItem v-else title="Status Sertifikat Mengajar" value="Tidak Ada" />
                <PagesAdminLecturerDetailItem title="Nomor Sertifikat Mengajar" :value="data.teaching_certificate_number" />
                <PagesAdminLecturerDetailItem v-if="data.teaching_permit_number" title="Status Surat Izin Mengajar" value="Ada" />
                <PagesAdminLecturerDetailItem v-else title="Status Surat Izin Mengajar" value="Tidak Ada" />
                <!-- <PagesAdminLecturerDetailItem title="Nomor Surat Izin Mengajar" :value="data.teaching_permit_number" /> -->
                <PagesAdminLecturerDetailItem title="Status Aktivitas" :value="data.status" />
                <PagesAdminLecturerDetailItem title="Semester Keluar" :value="data.resign_semester" />
            </tbody>
        </v-table>
    </v-card>
</template>