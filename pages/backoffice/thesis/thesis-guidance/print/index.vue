<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { formatYearMonthDate, convertStringTimeToNumberTime, convertNumberTimeToStringTime } from '~~/utils/helpers/date-utils';

import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';
import { GetLecturerDetailData } from '~~/types/api/lecturer/GetLecturerDetail';
import { GetThesisData } from '~~/types/api/thesis/GetThesis';

import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';
import { getLecturerDetail } from '~~/composables/api/lecturer/getLecturerDetail';
import { getThesis } from '~~/composables/api/admin-thesis/getThesis';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const semester_id = ref('')
const lecturer_id = ref('')
const semester = ref(<GetSemesterDetailData>{})
const lecturer = ref(<GetLecturerDetailData>{})
const datas = ref(<GetThesisData[]>[])

async function semesterDetail() {
    try {
        const { response: resp, error: error } = await getSemesterDetail(semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semester.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function lecturerDetail() {
    try {
        const { response: resp, error: error } = await getLecturerDetail(lecturer_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturer.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function getData() {
    try {
        const { response: resp, error: error } = await getThesis(100000, 1, '', lecturer.value.study_program_id, '', semester_id.value, '', lecturer_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            datas.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    const params = new URLSearchParams(window.location.search);
    lecturer_id.value = params.get('lecturer_id') ?? '';
    semester_id.value = params.get('semester_id') ?? '';
    await semesterDetail()
    await lecturerDetail()
    await getData()
    await delay(1000)
    window.print()
})
</script>
<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_dinas.jpg" style="width: 100%;" />
                    </th>
                    <th colspan="3">
                        <p style="letter-spacing: 1px">KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT</p>
                        <p style="letter-spacing: 0px">BADAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                        <p style="letter-spacing: 7px"><b>POLITEKNIK PEKERJAAN UMUM</b></p>
                        <p style="letter-spacing: 0px">Jalan Prof. Soedarto, SH No.15 Tembalang, Semarang 50275, Telp/Fax.024-7472848</p>
                        <p style="letter-spacing: 1.5px">Web : www.politeknikpu.ac.id, e-mail : info@politeknikpu.ac.id</p>
                    </th>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_semarang.png" style="width: 100%;" />
                    </th>
                </tr>
                <tr>
                    <th colspan="5">
                        <p><b>BIMBINGAN TUGAS AKHIR MAHASISWA</b></p>
                        <p><b>Program Studi {{ lecturer.study_program_name }}</b></p>
                        <p><b>Semester {{ semester.school_year }} {{ semester.semester_type }}</b></p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th colspan="5">
                        <p>
                            <b>Dosen Pembimbing :</b>
                        </p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th>
                        <p>NIDN</p>
                        <p>Nama</p>
                    </th>
                    <th>
                        <p>: {{ lecturer.id_national_lecturer }}</p>
                        <p>: {{ lecturer.name }}</p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">NIM</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Nama</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Judul</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in datas">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.student_nim_number }}</td>
                    <td>{{ item.student_name }}</td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
table {
    font-family: 'Tahoma' !important;
    font-size: 10px;
}
table > thead > tr > th {
    font-size: 12px;
}
table {
    background-color: transparent;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
}
.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
}
.head-title {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    border: 1px solid #2d2d2d;
}
.table > tbody > tr > td {
    border: 1px solid #2d2d2d;
}
table {
    border-spacing: 0;
    border-collapse: collapse;
}
td, th {
    padding: 0;
}
th {
    font-weight: 400;
}
.table {
    border-collapse: collapse !important;
}
.table td, .table th {
    background-color: #fff !important;
}
.font-size-10{
    font-size: 10px;
}
table { 
    page-break-inside:avoid;
    /* page-break-after: always; */
}
</style>