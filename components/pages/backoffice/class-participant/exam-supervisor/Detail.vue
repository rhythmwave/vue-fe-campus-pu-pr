<script setup lang="ts">
import { DetailExamSupervisorData } from '~~/types/api/class-participant/DetailExamSupervisor';
import { getDetailExamSupervisor } from '~~/composables/api/class-participant/exam-supervisor/getDetailExamSupervisor';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';
import { ErrorRoot } from '~~/types/api/error';

const props = defineProps({
    data: String,
});
const detail = ref(<DetailExamSupervisorData>{})
const id = ref('')
async function getDetail(id: string) {
  try {
    const { response: resp, error: error } = await getDetailExamSupervisor(id)
    if (error) {
        let dataError = <ErrorRoot>error;
        alert(dataError.meta.message);
        return;
    }
    if (resp != null) {
        detail.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
onMounted(async() => {
    id.value = <string>props.data
    await getDetail(id.value)
});
</script>
<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Pengawas Ujian</span>
        </v-card-title>
        <v-card-text>
            <v-table class="month-table">
                <tbody>
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Program Studi" :value="detail.study_program_name" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="NIDN" :value="detail.id_national_lecturer" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Gelar Depan" :value="detail.front_title" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Gelar Belakang" :value="detail.back_degree" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Nomor KTP" :value="detail.id_number" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Tanggal Lahir" :value="detail.birth_date ? formatYearMonthDate(detail.birth_date) : ''" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Kota Tempat Lahir" :value="detail.birth_regency_name" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Jenis Kelamin" :value="detail.sex == 'm' ? 'Laki-laki' : 'Perempuan'" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Golongan Darah" :value="detail.blood_type" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Agama" :value="detail.blood_type" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Status Nikah" :value="detail.marital_status" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Alamat Rumah" :value="detail.address" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Kota" :value="detail.regency_name" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Kode Pos" :value="detail.postal_code" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Telepon Rumah" :value="detail.phone_number" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Fax" :value="detail.fax" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Telepon Selular" :value="detail.mobile_phone_number" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Telepon Kantor" :value="detail.office_phone_number" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Jenis Pegawai" :value="detail.employee_type" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Nomor SK CPNS" :value="detail.sk_cpns_number" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Tanggal SK CPNS" :value="detail.sk_cpns_date ? formatYearMonthDate(detail.sk_cpns_date) : ''" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Terhitung Mulai Tanggal (TMT) CPNS" :value="detail.tmt_cpns_date ? formatYearMonthDate(detail.tmt_cpns_date) : ''" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Golongan CPNS" :value="detail.cpns_category" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Masa Kerja CPNS" :value="detail.cpns_duration_month" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Pra Jabatan" :value="detail.pre_position_date ? formatYearMonthDate(detail.pre_position_date) : ''" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Nomor SK PNS" :value="detail.sk_pns_number" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Tanggal SK PNS" :value="detail.sk_pns_date ? formatYearMonthDate(detail.sk_pns_date) : ''" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Terhitung Mulai Tanggal (TMT) PNS" :value="detail.tmt_pns_date ? formatYearMonthDate(detail.tmt_pns_date) : ''" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Golongan PNS" :value="detail.pns_category" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Sumpah PNS" :value="detail.pns_oath_date ? formatYearMonthDate(detail.pns_oath_date) : ''" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Tanggal Masuk PT" :value="detail.join_date ? formatYearMonthDate(detail.join_date) : ''" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Nomor Taspen" :value="detail.taspen_number" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Instansi Asal" :value="detail.former_instance" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Status" :value="detail.employee_status" />
                    <PagesBackofficeClassParticipantExamSupervisorDetailItem title="Catatan" :value="detail.remarks" />
                </tbody>
            </v-table>
        </v-card-text>
    </v-card>
</template>