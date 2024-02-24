<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import { ErrorRoot } from '~~/types/api/error';
import { formatYearMonthDate } from '~~/utils/helpers/date-utils';

import { GetThesisDetailData } from '~~/types/api/thesis/GetThesisDetail';

import { getThesisDetail } from '~~/composables/api/admin-thesis/getThesisDetail';

const props = defineProps({
    thesisId: String,
});

const thesis_id = ref('')
const thesis_detail = ref(<GetThesisDetailData>{})

async function getDetail() {
    try {
        const { response: resp, error: error } = await getThesisDetail(thesis_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            thesis_detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

onMounted(async () => {
    thesis_id.value = <string>props.thesisId
    await getDetail()
})

</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">Detil Tugas Akhir</v-card-title>
            <v-table class="month-table">
                <tbody>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Semester Mulai</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.start_semester_school_year }} - {{ thesis_detail.start_semester_type }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Semester Selesai</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.finish_semester_school_year }} - {{ thesis_detail.finish_semester_type }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">NIM</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.student_nim_number }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Nama Mahasiswa</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.student_name }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Judul</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.title }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Topik</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.topic }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Tanggal Mulai</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.start_date ? formatYearMonthDate(thesis_detail.start_date) : '' }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Tanggal Selesai</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.finish_date ? formatYearMonthDate(thesis_detail.finish_date) : '' }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Catatan</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.remarks }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Kelompok</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.is_joint_thesis ? 'Ya' : 'Tidak' }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Status</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.status }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Tanggal Seminar</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.proposal_seminar_date ? formatYearMonthDate(thesis_detail.proposal_seminar_date) : '' }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">No Sertifikat Pengajuan</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.proposal_certificate_number }} </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Tanggal Sertifikat Pengajuan</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.proposal_seminar_date ? formatYearMonthDate(thesis_detail.proposal_seminar_date) : '' }}  </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">IP</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ thesis_detail.grade_point }}  </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">File</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <ul>
                                <li v-for="itm in thesis_detail.files">
                                    <a :href="itm.file_url" target="_blank" rel="noopener noreferrer">
                                        <h6 class="text-h6 font-weight-medium text-medium-emphasis">
                                            {{ itm.file_description }}
                                        </h6>
                                    </a>
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-center">
                                <div class="ml-4">
                                    <h6 class="text-h6">Pembimbing</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <ul>
                                <li v-for="itm in thesis_detail.thesis_supervisors">
                                    <h6 class="text-h6 font-weight-medium text-medium-emphasis">
                                        {{ itm.lecturer_front_title }} {{ itm.lecturer_name }} {{ itm.lecturer_back_degree }} ({{ itm.thesis_supervisor_role_name }})
                                    </h6>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </div>
</template>