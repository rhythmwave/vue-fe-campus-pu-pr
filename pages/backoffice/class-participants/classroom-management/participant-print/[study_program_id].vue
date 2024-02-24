<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';

import { GetStudentClassParticipantData } from "~~/types/api/student-class/GetStudentClassParticipantList";
import { GetClassroomDetail } from "~~/types/api/classroom/GetClassroomDetail";

import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

interface Participant {
    student_id: string
    student_nim_number: number
    student_name: string
    study_program_id: string
    study_program_name: string
    dikti_study_program_code: string
    dikti_study_program_type: string
    study_level_short_name: string
    total_attendance: number
    attendance_percentage: number
    total_sick: number
    total_leave: number
    total_awol: number
    is_attend: boolean
    is_sick: boolean
    is_leave: boolean
    is_awol: boolean
    grade_point: number
    grade_code: string
    graded_by_admin_id: string
    graded_by_admin_name: string
    graded_by_lecturer_id: string
    graded_by_lecturer_name: string
    graded_at: string
    subject_repetition: number
    class_id: string
}

interface Lecturer {
    name: string
    front_title: string
    back_degree: string
}

const class_ids = ref(<string[]>[])
const studentParticipants = ref(<GetStudentClassParticipantData[]>[])
const arrStudentParticipants = ref(<Participant[]>[])
const classroom_detail = ref(<GetClassroomDetail>{})
const classroom_details = ref(<GetClassroomDetail[]>[])


async function getClassroom(id: string) {
    try {
        const { response: resp, error: error } = await getClassroomDetail(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classroom_detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function getStudentClassParticipant(classroom_id: string) {
    try {
        const { response: resp, error: error } = await getStudentClassParticipantList(10000, 1, '', classroom_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentParticipants.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    let params = window.location.search.replaceAll('?', '').split('&')
    for (let index = 0; index < params.length; index++) {
        const element = params[index];
        class_ids.value.push(element.replaceAll('class_id=', ''))
    }

    for (let index = 0; index < class_ids.value.length; index++) {
        const element = class_ids.value[index];
        await getStudentClassParticipant(element)
        await getClassroom(element)
        classroom_details.value.push(classroom_detail.value)
        for (let i = 0; i < studentParticipants.value.length; i++) {
            const e = studentParticipants.value[i];
            arrStudentParticipants.value.push(<Participant>{
                student_id: e.student_id,
                student_nim_number: e.student_nim_number,
                student_name: e.student_name,
                study_program_id: e.study_program_id,
                study_program_name: e.study_program_name,
                dikti_study_program_code: e.dikti_study_program_code,
                dikti_study_program_type: e.dikti_study_program_type,
                study_level_short_name: e.study_level_short_name,
                total_attendance: e.total_attendance,
                attendance_percentage: e.attendance_percentage,
                total_sick: e.total_sick,
                total_leave: e.total_leave,
                total_awol: e.total_awol,
                is_attend: e.is_attend,
                is_sick: e.is_sick,
                is_leave: e.is_leave,
                is_awol: e.is_awol,
                grade_point: e.grade_point,
                grade_code: e.grade_code,
                graded_by_admin_id: e.graded_by_admin_id,
                graded_by_admin_name: e.graded_by_admin_name,
                graded_by_lecturer_id: e.graded_by_lecturer_id,
                graded_by_lecturer_name: e.graded_by_lecturer_name,
                graded_at: e.graded_at,
                subject_repetition: e.subject_repetition,
                grades: e.grades,
                class_id: classroom_detail.value.id,
            })
        }
    }
    await delay(1000)
    window.print()
})
</script>
<template>
    <div>
        <table class="table" v-for="(itm, indx) in classroom_details">
            <thead>
                <tr>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_dinas.jpg" style="width: 100%;" />
                    </th>
                    <th colspan="2">
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
                    <th colspan="2">
                        <p><b>DAFTAR PESERTA KELAS</b></p>
                        <p><b>Program Studi {{itm.study_program_name}} - {{ itm.dikti_study_program_type }} {{ itm.study_level_short_name }}</b></p>
                    </th>
                    <th></th>
                </tr>
                <tr style="text-align: left;">
                    <th>
                        <p>Mata Kuliah</p>
                        <p>Nama Kelas</p>
                        <p>Jumlah Peserta</p>
                        <p>Dosen</p>
                    </th>
                    <th>
                        <p>{{ itm.subject_name }}</p>    
                        <p>{{ itm.name }}</p>    
                        <p>{{ itm.total_participant }}</p>    
                        <p>
                            <ul v-for="it in itm.lecturers">
                                <li>{{ it.front_title }} {{ it.name }} {{ it.back_degree }}</li>
                            </ul>    
                        </p>    
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">NIM</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Nama</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">Prodi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in arrStudentParticipants">
                    <td v-if="itm.id == item.class_id">{{ index + 1 }}</td>
                    <td v-if="itm.id == item.class_id">{{ item.student_nim_number }}</td>
                    <td v-if="itm.id == item.class_id">{{ item.student_name }}</td>
                    <td v-if="itm.id == item.class_id">{{ item.study_program_name }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2"></td>
                    <td colspan="2" class="text-right">
                        <div class="text-center" style="margin: 0px 50px 0px 0px;">
                            <p>{{ new Date().getDate() }}, {{ convertMonthToTextString(new Date().getMonth() + 1) }} {{ new Date().getFullYear() }}</p>
                            <p>..................................................</p>
                            <p style="margin-top: 100px; border-bottom:1px solid">..................................................</p>
                            <p>NIDN: ........................................</p>
                        </div>
                    </td>
                </tr>
            </tfoot>
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
    page-break-after: always;
}
</style>