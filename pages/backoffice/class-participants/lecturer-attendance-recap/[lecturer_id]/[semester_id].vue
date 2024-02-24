<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

import { GetLecturerAssignedClassListData } from '~~/types/api/lecturer-class/GetLecturerAssignedClassList';
import { GetLecturerDetailData } from '~~/types/api/lecturer/GetLecturerDetail';
import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';

import { getLecturerAssignedClassList } from '~~/composables/api/admin-lecturer-class/getLecturerAssignedClassList';
import { getLecturerDetail } from '~~/composables/api/lecturer/getLecturerDetail';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const lecturerAssignedClasses = ref(<GetLecturerAssignedClassListData[]>([]));
const lecturer = ref(<GetLecturerDetailData>{});
const semester = ref(<GetSemesterDetailData>{});
const lecturer_id = ref('')
const semester_id = ref('')

async function getLecturerAssignedClassData(semesterId: string, lecturerId: string) {
    try {
        const { response: resp, error: error } = await getLecturerAssignedClassList(semesterId, lecturerId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            lecturerAssignedClasses.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function lecturerDetail(lecturer_id: string) {
    try {
        const { response: resp, error: error } = await getLecturerDetail(lecturer_id)
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
async function semesterDetail(semester_id: string) {
    try {
        const { response: resp, error: error } = await getSemesterDetail(semester_id)
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

onMounted(async () => {
    lecturer_id.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
    semester_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await lecturerDetail(lecturer_id.value)
    await semesterDetail(semester_id.value)
    await getLecturerAssignedClassData(semester_id.value, lecturer_id.value)
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
                    <th colspan="6">
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
                    <th></th>
                    <th colspan="6">
                        <p><b>REKAP KEHADIRAN DOSEN</b></p>
                    </th>
                    <th></th>
                </tr>
                <tr style="text-align: left;">
                    <th colspan="2">
                        <p>Nama</p>
                        <p>NIP</p>
                        <p>Program Studi</p>
                        <p>Semester</p>
                    </th>
                    <th colspan="4">
                        <p>: {{ lecturer.front_title }} {{ lecturer.name }} {{ lecturer.back_degree }}</p>
                        <p>: {{ lecturer.id_national_lecturer }}</p>
                        <p>: {{ lecturer.study_program_name }}</p>
                        <p>: {{ semester.semester_type }} {{ semester.school_year }}</p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title">No</th>
                    <th class="font-size-10 head-title">Kode Mata Kuliah</th>
                    <th class="font-size-10 head-title">Nama Mata Kuliah</th>
                    <th class="font-size-10 head-title">Kelas</th>
                    <th class="font-size-10 head-title">SKS</th>
                    <th class="font-size-10 head-title">Jumlah Kehadiran</th>
                    <th class="font-size-10 head-title">Jumlah Terlaksana</th>
                    <th class="font-size-10 head-title">% Kehadiran</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in lecturerAssignedClasses">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_code }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.theory_credit + item.field_practicum_credit + item.practicum_credit }}</td>
                    <td>{{ item.total_attendance }}</td>
                    <td>{{ item.total_lecture_done }}</td>
                    <td>{{ item.attendance_percentage }}</td>
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
    page-break-inside:avoid 
}
</style>