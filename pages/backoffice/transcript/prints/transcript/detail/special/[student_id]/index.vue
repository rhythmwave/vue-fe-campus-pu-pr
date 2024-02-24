<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { FunctionRule } from 'v-calendar/dist/types/src/utils/date/rules';
import { getClassroomDetail } from '~~/composables/api/classroom/getClassroomDetail';
import { getLecturerDetail } from '~~/composables/api/lecturer/getLecturerDetail';
import { getStudentClassParticipantList } from '~~/composables/api/student-class/getStudentClassParticipantList';
import { GetClassroomDetail } from '~~/types/api/classroom/GetClassroomDetail';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentClassParticipantData } from '~~/types/api/student-class/GetStudentClassParticipantList';
import moment from 'moment';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { GetStudentListData, GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { GetStudyProgramDetailData } from '~~/types/api/study-program/GetStudyProgramDetail';
import { getAdminStudyProgramDetail } from '~~/composables/api/admin-study-program/getAdminStudyProgramDetail';
import { GetStudentTranscriptData } from '~~/types/api/student/GetStudentTranscript';
import { getStudentTranscript } from '~~/composables/api/student/getStudentDetailTranscript';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { getStudentSubjectGradeList } from '~~/composables/api/student/getStudentSubjectGradeList';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { GetStudentSubjectGradeListData } from '~~/types/api/student/GetStudentSubjectGradeList';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {
    student_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getStudentTranscriptData()
    // studyProgramId.value = window.location.href.split('/')[window.location.href.split('/').length - 3]
    // semesterId.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
    // classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    // await getClassroomDetailData(classId.value)
    // await getStudentClassParticipants(10000000, 1, '', classId.value)
    await delay(1000)
    window.print()
})


const student_id = ref('')
const studentDetails = ref(<GetStudentDetailData>{})
const selectedStudentDetail = ref(<GetStudentDetailData>{});
async function getStudentDetailData() {
    try {
        const { response: resp, error: error } = await getStudentDetail(student_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentDetails.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const studentTranscripts = ref(<GetStudentTranscriptData>{})
const selectedStudentTranscript = ref(<GetStudentTranscriptData>{});
async function getStudentTranscriptData() {
    try {
        const { response: resp, error: error } = await getStudentTranscript(student_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentTranscripts.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const studentSubjectGrades = ref(<GetStudentSubjectGradeListData[]>[])
const selectedStudentSubjectGrade = ref(<GetStudentSubjectGradeListData>{});
async function getStudentSubjectGradeData() {
    try {
        const { response: resp, error: error } = await getStudentSubjectGradeList(100000, 1, student_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentSubjectGrades.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
const studyProgramDetails = ref(<GetStudyProgramDetailData>{})
async function getStudyProgramDetailData() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramDetail(studentDetails.value.study_program_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyProgramDetails.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
</script>
<style type="text/css">
body {
    font-family: Arial;
    /*background-color: #C0C0C0;*/
    font-size: 10pt;
    margin: 0;
    padding: 0;
}

p {
    margin: 0;
    padding: 0;
}

#container {
    margin: 0 auto;
    padding: 10px;
    width: 18cm;
    background-color: #fff;
    /*height: 280mm;*/
    /*overflow: hidden;*/
    /*border-bottom: 1px solid #c0c0c0;*/
}

.box_institusi {
    /*border: 1px solid #000;*/
    padding: 0 40px 0 80px;
    margin: 0;
}

.institusi {
    /*border: 1px solid #000;*/
    margin: 0;
    padding: 0;
}

.eng {
    font-style: italic;
    font-weight: normal !important;
}

.institusi .kementerian {
    font-size: 10.5pt;
    text-align: center;
    font-weight: bold;
}

.institusi .kementerian .eng {
    font-size: 8.5pt;
}

.institusi .nama {
    margin: 0;
    margin-bottom: 0px;
    font-size: 12pt !important;
    text-align: center;
}

.institusi .nama .eng {
    font-size: 9pt;
}

.institusi .alamat_web {
    margin: 0;
    padding: 0;
    font-size: 8.5pt;
    text-align: center;
}

.institusi .alamat_web .eng {
    font-size: 7pt;
}

.institusi .sk {
    margin: 0;
    padding: 0;
    margin-top: 2px;
    padding-left: 22px;
    font-size: 9pt;
    text-align: center;
}

.institusi .sk .eng {
    font-size: 7pt;
}

.box_no_transkrip {
    text-align: center;
    /*border: 1px solid #000;*/
    margin: 0;
    padding: 0 25%;
    margin-top: 4px;
}

.box_no_transkrip .no_transkrip {
    text-align: center;
    /*border: 1px solid #000;*/
    margin: 0;
    padding: 0;
    font-size: 8.5pt;
    /*width: 70%;*/
}

.box_no_transkrip .no_transkrip h5 {
    margin: 0;
    padding: 0;
    padding-bottom: 0px;
    margin-bottom: 1px;
    border-bottom: 1px solid #000;
    font-size: 12pt;
}

.box_no_transkrip .no_transkrip h5 .eng {
    font-size: 8pt;
}

#info_mhs {
    margin: 0;
    padding: 0;
    margin-top: 5px;
    margin-bottom: 3px;
}

#info_mhs table {
    margin: 0;
    padding: 0;
    border-collapse: collapse;
}

#info_mhs th {
    text-align: left;
    font-weight: normal;
    font-size: 7.5pt;
    vertical-align: top;
    text-transform: uppercase;
    padding-bottom: 0;
}

#info_mhs td {
    font-size: 7.5pt;
    vertical-align: top;
    text-transform: uppercase;
    padding-bottom: 0;
}

#info_mhs .eng {
    font-size: 6pt;
    text-transform: none !important;
}

.uppercase {
    text-transform: uppercase;
}

#table_transkrip {
    margin-bottom: 0;
}

#table_transkrip table {
    /*border: 1px solid #000;*/
    font-family: Arial;
    border: none;
    border-collapse: collapse;
    width: 100%;
    font-size: 5pt;
}

#table_transkrip th {
    border: 1px solid #000;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 1px;
    font-size: 5pt;
    vertical-align: middle;
}

#table_transkrip td {
    border: 1px solid #000;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
    padding: 1px;
    vertical-align: top;
    font-size: 5pt;
}

#table_transkrip td .eng {
    font-size: 4pt;
}

#table_transkrip .empty_space {
    border: none !important;
}

#table_transkrip .spacer {
    border-top: none;
    border-bottom: none;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
}

#table_transkrip .left {
    text-align: left;
    /*width: 200px;*/
}

#table_transkrip .right {
    text-align: right;
    /*width: 200px;*/
}

#table_transkrip .noborder {
    text-align: left;
    border: none;
}

#table_transkrip .border-left {
    border: none;
}

#table_transkrip .border-right {
    text-align: left;
    border-top: none;
    border-left: none;
    border-bottom: none;
}

#table_transkrip .colspace {
    border-top: none;
}

#table_transkrip .colspace-bottom {
    border-top: none;
}

#table_transkrip .colspace-up {
    border-bottom: none;
}

#table_transkrip .total_sks {
    border-top: none;
    border-bottom: none;
}

#table_transkrip .index-prestasi {
    text-align: left;
    border-top: none;
    border-left: none;
    border-bottom: none;
}

#table_transkrip .no-left {
    border-left: none;
}

#table_transkrip .no-right {
    border-right: none;
}

#table_transkrip .no-top {
    border-top: none;
}

#table_transkrip .top {
    border-top: 1px solid #000;
}

#table_transkrip .no-bottom {
    border-bottom: none;
}

#table_transkrip .bottom {
    border-bottom: 1px solid #000;
}

#table_transkrip .no-border {
    border: none;
}

#table_total table {
    border-collapse: collapse;
}

#table_total th,
#table_total td {
    font-size: 7pt;
    padding: 0px 1px;
    vertical-align: top;
}

#table_total td .eng {
    font-size: 6pt;
}

#table_total .judul_ta {
    line-height: 1.2;
}

#table_total .judul_ta .eng {
    font-size: 6pt;
}

.hr1 {
    margin-top: 1px;
    border-top: 1px solid #000;
    border-bottom: none;
    border-right: none;
    border-left: none;
}

#table_paraf {
    margin-top: 10px;
}

#table_paraf table {
    border-collapse: collapse;
}

#table_paraf td {
    vertical-align: top;
    font-size: 7pt;
}

#table_paraf .eng {
    font-size: 6pt;
}

#table_paraf .tanggal_cetak {
    padding-bottom: 4px;
}

#pas_foto {
    text-align: center;
    height: 3.09cm;
    width: 2.15cm;
    border: 1px solid #000;
    line-height: 3.09cm;
}

#judul-skripsi {
    margin-bottom: 10px;
}

#judul-skripsi table {
    width: 100%;
    border-collapse: collapse;
}

#judul-skripsi th {
    font-weight: normal;
    text-align: left;
    width: 95px;
    vertical-align: top;
}

#pembimbing {
    float: left;
    width: 380px;
}

#pembimbing table {
    border-collapse: collapse;
}

#pembimbing th {
    text-align: left;
    font-weight: normal;
    vertical-align: top;
}

#pembimbing td {
    vertical-align: top;
    /*width: 250px;*/
}

#table_right {
    float: right;
}

#table_right table {
    border-collapse: collapse;
}

#table_right th {
    text-align: left;
    font-weight: normal;
}

#table_right td {
    width: 250px;
}

div.nobreak .hidden {
    visibility: hidden;
    display: none;
}

div.page-break

/*.hidden */
    {
    visibility: visible;
    margin: 10px 0px 10px 0px;
}

.page-break {
    clear: both;
}

/*
#info_studi {
   float: right;
   margin-bottom: 12pt;
}

#info_studi table {
   border-collapse: collapse;
}

#info_studi th {
   text-align: left;
   font-weight: normal;
}

#info_studi td {
   width: 250px;
}

#pengesah{
   clear: both;
   float: right;
}

#pengesah table {
   border-collapse: collapse;
}

#pengesah th {
   text-align: left;
   font-weight: normal;
   width: 325px;
}
*/
</style>
<style type="text/css">
body {
    font-family: Arial;
    font-size: 10pt;
    margin: 0;
    padding: 0;
}


@page {
    /*size:  21.0cm 29.7cm; */
    /*margin: 1.5cm;*/
    margin: 3mm 0.6cm 3mm 1cm;
}

p {
    margin: 0;
    padding: 0;
}

#container {
    margin: 0px auto;
    padding: 10px 10px 10px 10px;
    width: auto;
    background-color: #fff;
    /*height: 190mm;*/
    /*   overflow: hidden;*/
    page-break-after: always;
}

.box_institusi {
    /*border: 1px solid #000;*/
    padding: 0 40px 0 80px;
    margin: 0;
}

.institusi {
    /*border: 1px solid #000;*/
    margin: 0;
    padding: 0;
}

.eng {
    font-style: italic;
    font-weight: normal !important;
}

.institusi .kementerian {
    font-size: 10.5pt;
    text-align: center;
    font-weight: bold;
}

.institusi .kementerian .eng {
    font-size: 8.5pt;
}

.institusi .nama {
    margin: 0;
    margin-bottom: 0px;
    font-size: 12pt !important;
    text-align: center;
}

.institusi .nama .eng {
    font-size: 9pt;
}

.institusi .alamat_web {
    margin: 0;
    padding: 0;
    font-size: 8.5pt;
    text-align: center;
}

.institusi .alamat_web .eng {
    font-size: 7pt;
}

.institusi .sk {
    margin: 0;
    padding: 0;
    margin-top: 2px;
    padding-left: 22px;
    font-size: 9pt;
    text-align: center;
}

.institusi .sk .eng {
    font-size: 7pt;
}

.box_no_transkrip {
    text-align: center;
    /*border: 1px solid #000;*/
    margin: 0;
    padding: 0 25%;
    margin-top: 4px;
}

.box_no_transkrip .no_transkrip {
    text-align: center;
    /*border: 1px solid #000;*/
    margin: 0;
    padding: 0;
    font-size: 8.5pt;
    /*width: 70%;*/
}

.box_no_transkrip .no_transkrip h5 {
    margin: 0;
    padding: 0;
    padding-bottom: 0px;
    margin-bottom: 2px;
    border-bottom: 1px solid #000;
    font-size: 12pt;
}

.box_no_transkrip .no_transkrip h5 .eng {
    font-size: 8pt;
}

#info_mhs {
    margin: 0;
    padding: 0;
    margin-top: 5px;
    margin-bottom: 3px;
}

#info_mhs table {
    margin: 0;
    padding: 0;
    border-collapse: collapse;
}

#info_mhs th {
    text-align: left;
    font-weight: normal;
    font-size: 7.5pt;
    vertical-align: top;
    text-transform: uppercase;
    padding-bottom: 0px !important;
}

#info_mhs td {
    font-size: 7.5pt;
    vertical-align: top;
    text-transform: uppercase;
    padding-bottom: 0px !important;
}

#info_mhs .eng {
    font-size: 6pt;
    text-transform: none !important;
}

.uppercase {
    text-transform: uppercase;
}

#table_transkrip {
    margin-bottom: 0;
}

#table_transkrip table {
    /*border: 1px solid #000;*/
    font-family: Arial;
    border: none;
    border-collapse: collapse;
    width: 100%;
    font-size: 5pt;
}

#table_transkrip th {
    border-color: #949494;
    border-style: solid;
    border-width: thin;
    padding: 1px;
    font-size: 5pt;
    vertical-align: middle;
}

#table_transkrip td {
    border-color: #949494;
    border-style: solid;
    border-width: thin;
    padding: 1px;
    vertical-align: top;
    font-size: 5pt;
}

#table_transkrip td .eng {
    font-size: 4pt;
}

#table_transkrip .empty_space {
    border: none !important;
}

#table_transkrip .spacer {
    border-top: none;
    border-bottom: none;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
}

#table_transkrip .left {
    text-align: left;
    width: 200px;
}

#table_transkrip .noborder {
    text-align: left;
    border: none;
}

#table_transkrip .border-left {
    border: none;
}

#table_transkrip .border-right {
    text-align: left;
    border-top: none;
    border-left: none;
    border-bottom: none;
}

#table_transkrip .colspace {
    border-top: none;
}

#table_transkrip .colspace-bottom {
    border-top: none;
}

#table_transkrip .colspace-up {
    border-bottom: none;
}

#table_transkrip .total_sks {
    border-top: none;
    border-bottom: none;
}

#table_transkrip .index-prestasi {
    text-align: left;
    border-top: none;
    border-left: none;
    border-bottom: none;
}

#table_transkrip .no-left {
    border-left: none;
}

#table_transkrip .no-right {
    border-right: none;
}

#table_transkrip .no-top {
    border-top: none;
}

#table_transkrip .top {
    border-top: 1px solid #000;
}

#table_transkrip .no-bottom {
    border-bottom: none;
}

#table_transkrip .bottom {
    border-bottom: 1px solid #000;
}

#table_transkrip .no-border {
    border: none;
}

#table_total table {
    border-collapse: collapse;
}

#table_total th,
#table_total td {
    font-size: 7pt;
    padding: 0px 1px;
    vertical-align: top;
}

#table_total td .eng {
    font-size: 6pt;
}

#table_total .judul_ta {
    line-height: 1.2;
}

#table_total .judul_ta .eng {
    font-size: 6pt;
}

.hr1 {
    margin-top: 1px;
    border-top: 1px solid #000;
    border-bottom: none;
    border-right: none;
    border-left: none;
}

#table_paraf {
    margin-top: 10px;
}

#table_paraf table {
    border-collapse: collapse;
}

#table_paraf td {
    vertical-align: top;
    font-size: 7pt;
}

#table_paraf .eng {
    font-size: 6pt;
}

#table_paraf .tanggal_cetak {
    padding-bottom: 4px;
}

#pas_foto {
    text-align: center;
    height: 3.09cm;
    width: 2.15cm;
    border: 1px solid #000;
    line-height: 3.09cm;
}

#judul-skripsi {
    margin-bottom: 10px;
}

#judul-skripsi table {
    width: 100%;
    border-collapse: collapse;
}

#judul-skripsi th {
    font-weight: normal;
    text-align: left;
    width: 95px;
    vertical-align: top;
}

#pembimbing {
    float: left;
    width: 380px;
}

#pembimbing table {
    border-collapse: collapse;
}

#pembimbing th {
    text-align: left;
    font-weight: normal;
    vertical-align: top;
}

#pembimbing td {
    vertical-align: top;
    /*width: 250px;*/
}

#table_right {
    float: right;
}

#table_right table {
    border-collapse: collapse;
}

#table_right th {
    text-align: left;
    font-weight: normal;
}

#table_right td {
    width: 250px;
}

div.page-break {
    visibility: visible;
    page-break-after: always;
}

div.nobreak {
    visibility: visible;
}

.page-break {
    clear: both;
}

/*
#info_studi {
   float: right;
   margin-bottom: 12pt;
}

#info_studi table {
   border-collapse: collapse;
}

#info_studi th {
   text-align: left;
   font-weight: normal;
}

#info_studi td {
   width: 250px;
}

#pengesah{
   clear: both;
   float: right;
}

#pengesah table {
   border-collapse: collapse;
}

#pengesah th {
   text-align: left;
   font-weight: normal;
   width: 325px;
}
*/
</style>
<style type="text/css">
.total {
    display: none;
}
</style>
<template>
    <div id="container">
        <div class="">

            <!--bound-->

            <div class="box_institusi">
                <div class="institusi">
                    <div class="kementerian">
                        KEMENTERIAN PEKERJAAN UMUM DAN PERUSAHAAN RAKYAT <br>
                        <span class="eng">MINISTRY OF PUBLIC WORK AND HOUSING</span> <br>
                        BADAN PENGEMBANGAN SUMBER DAYA MANUSIA <br>
                        <span class="eng">HUMAN RESOURCES DEVELOPMENT AGENCY</span>
                    </div>
                    <h5 class="nama">POLITEKNIK PEKERJAAN UMUM <br> <span class="eng">POLYTECHNIC OF PUBLIC WORKS</span>
                    </h5>
                    <div class="alamat_web">
                        JL. Prof. Soedarto, SH No. 15, Tembalang, Semarang 50275, Telp/Fax. 024-7472848 <br>
                        <span class="eng">Prof. Soedarto, SH Street No. 15, Tembalang, Semarang 50275, Phone/Fax.
                            024-7472848</span> <br>
                        Web : www.politeknikpu.ac.id, e-mail : info@politeknikpu.ac.id
                    </div>
                    <div class="sk">
                        Keputusan Direktur Politeknik Pekerjaan Umum Nomor 0369/PL.6.1/SK/2022 Tanggal 2 September 2022 <br>
                        <span class="eng">Decision of Director Public Works Polytechnic Number 0369/PL.6.1/SK/2022, 2
                            September 2022</span>
                    </div>
                </div>
            </div>
            <div class="box_no_transkrip">
                <div class="no_transkrip">
                    <h5>TRANSKRIP AKADEMIK <br> <span class="eng">ACADEMIC TRANSCRIPT</span></h5>
                    Nomor/<i>Number</i> : ........................
                </div>
            </div>
            <div id="info_mhs">
                <table width="100%" border="0">
                    <tbody>
                        <tr>
                            <th width="22%">NOMOR INDUK MAHASISWA <br> <span class="eng">Student Registration Number</span>
                            </th>
                            <td width="1%">:</td>
                            <td width="31%">{{ studentTranscripts?.nim_number }}</td>

                            <th width="21%" nowrap="nowrap">NOMOR IJAZAH NASIONAL <br> <span class="eng">National
                                    Certificate Number</span></th>
                            <td width="1%">:</td>
                            <td width="24%">{{ studentTranscripts?.diploma_number }}</td>
                        </tr>

                        <tr>
                            <th>NAMA <br> <span class="eng">Name</span></th>
                            <td>:</td>
                            <td>{{ studentTranscripts?.name }}</td>

                            <th nowrap="nowrap">PROGRAM STUDI <br> <span class="eng">Study Program</span></th>
                            <td>:</td>
                            <td>{{ studentTranscripts?.study_program_name }} <br> <span class="eng"></span></td>
                        </tr>

                        <tr>
                            <th>TEMPAT/TGL. LAHIR <br> <span class="eng">Place/Date of Birth</span></th>
                            <td>:</td>
                            <td>
                                <template v-if="studentTranscripts?.birth_date">
                                    {{ studentTranscripts?.birth_place }}, {{ new
                                        Date(studentTranscripts?.birth_date).getDate() + " " + convertMonthToTextString(new
                                            Date(studentTranscripts?.birth_date).getMonth() + 1) + " " + new
                                                Date(studentTranscripts?.birth_date).getFullYear() }} <br>
                                    <span class="eng">{{ studentTranscripts?.birth_place }}, {{ moment(new
                                        Date(studentTranscripts?.birth_date)).format("MMMM DD YYYY") }}</span>
                                </template>
                            </td>

                            <th nowrap="nowrap">JENJANG <br> <span class="eng">Stratum</span></th>
                            <td>:</td>
                            <td>{{ studentTranscripts?.study_level_name }} ({{ studentTranscripts?.study_level_short_name
                            }})
                                <br> <span class="eng">{{ studentTranscripts?.study_level_name }}</span>
                            </td>
                        </tr>

                        <tr>
                            <th>TGL. KELULUSAN <br> <span class="eng">Date of Graduate</span></th>
                            <td>:</td>
                            <td>
                                <template v-if="studentTranscripts?.graduation_date">
                                    {{ new Date(studentTranscripts?.graduation_date).getDate() + " " +
                                        convertMonthToTextString(new
                                            Date(studentTranscripts?.graduation_date).getMonth() + 1) + " " + new
                                                Date(studentTranscripts?.graduation_date).getFullYear() }} <br>
                                    <span class="eng">{{ studentTranscripts?.birth_place }}, {{ moment(new
                                        Date(studentTranscripts?.graduation_date)).format("MMMM DD YYYY") }}</span>
                                </template>
                            </td>

                            <th nowrap="nowrap">&nbsp;</th>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <div id="table_transkrip" class="nobreak">
                <table cellspacing="0" cellpadding="0" style="border: none;">
                    <tbody>
                        <tr style="border: none;">
                            <td style="border: none;width:49%">
                                <table border="0">
                                    <tbody>
                                        <template v-if="studentTranscripts"
                                            v-for="s, index in studentTranscripts.semesters">
                                            <tr v-if="s.semester_package % 2 == 1">
                                                <th colspan="6">SEMESTER {{ s.semester_package }}</th>
                                            </tr>
                                            <tr v-if="s.semester_package % 2 == 1">
                                                <th rowspan="2" width="3%">NO</th>
                                                <th rowspan="2" width="7%">KODE <br> <span class="eng">Code</span></th>
                                                <th rowspan="2" width="25%">MATA KULIAH <br> <span
                                                        class="eng">Subjects</span>
                                                </th>
                                                <th colspan="2" width="4%">SKS <br> <span class="eng">SCU</span></th>
                                                <th rowspan="2" width="5%">NILAI <br> <span class="eng">Grade</span></th>

                                            </tr>
                                            <tr v-if="s.semester_package % 2 == 1">
                                                <th width="2%">T</th>
                                                <th width="2%">P</th>
                                            </tr>

                                            <tr v-if="s.semester_package % 2 == 1" v-for="subj, j in s.subjects">
                                                <td align="center">{{ j + 1 }}</td>
                                                <td align="center" class="uppercase">{{ subj.subject_code }}</td>
                                                <td class=""><span class="uppercase">{{ subj.subject_name }}</span> <br>
                                                    <span class="eng">{{ subj.subject_english_name }}</span>
                                                </td>
                                                <td align="center">{{ subj.theory_credit }}</td>
                                                <td align="center">{{ subj.practicum_credit }}</td>
                                                <td align="center" class="uppercase">{{ subj.grade_code }}</td>
                                            </tr>
                                        </template>

                                    </tbody>
                                </table>
                            </td>

                            <td style="border: none;width:2%"></td>
                            <td style="border: none;width:49%">
                                <table border="0">
                                    <tbody>
                                        <template v-if="studentTranscripts"
                                            v-for="s, index in studentTranscripts.semesters">
                                            <tr v-if="s.semester_package % 2 == 0">
                                                <th colspan="6">SEMESTER {{ s.semester_package }}</th>
                                            </tr>
                                            <tr v-if="s.semester_package % 2 == 0">
                                                <th rowspan="2" width="3%">NO</th>
                                                <th rowspan="2" width="7%">KODE <br> <span class="eng">Code</span></th>
                                                <th rowspan="2" width="25%">MATA KULIAH <br> <span
                                                        class="eng">Subjects</span>
                                                </th>
                                                <th colspan="2" width="4%">SKS <br> <span class="eng">SCU</span></th>
                                                <th rowspan="2" width="5%">NILAI <br> <span class="eng">Grade</span></th>

                                            </tr>
                                            <tr v-if="s.semester_package % 2 == 0">
                                                <th width="2%">T</th>
                                                <th width="2%">P</th>
                                            </tr>

                                            <tr v-if="s.semester_package % 2 == 0" v-for="subj, j in s.subjects">
                                                <td align="center">{{ j + 1 }}</td>
                                                <td align="center" class="uppercase">{{ subj.subject_code }}</td>
                                                <td class=""><span class="uppercase">{{ subj.subject_name }}</span> <br>
                                                    <span class="eng">{{ subj.subject_english_name }}</span>
                                                </td>
                                                <td align="center">{{ subj.theory_credit }}</td>
                                                <td align="center">{{ subj.practicum_credit }}</td>
                                                <td align="center" class="uppercase">{{ subj.grade_code }}</td>
                                            </tr>
                                        </template>

                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <br />

            <div id="table_total">
                <table width="100%" border="0">
                    <tbody>
                        <tr>
                            <td class="" width="26%"><span class="uppercase">jumlah sks</span> <br> <span class="eng">Total
                                    SCU</span></td>
                            <td class="uppercase" width="23%">: {{ studentTranscripts?.total_credit }}</td>
                            <td width="2%">&nbsp;</td>
                            <td class="" width="16%"><span class="uppercase">T : TEORI</span> <br> <span
                                    class="eng">Theory</span></td>
                            <td width="1%">=</td>
                            <td class="uppercase" width="32%">{{ studentTranscripts?.theory_credit }} SKS</td>
                        </tr>
                        <tr>
                            <td class="" nowrap="nowrap"><span class="uppercase">INDEKS PRESTASI KOMULATIF (IPK)</span> <br>
                                <span class="eng">Grade Point Average (G.P.A)</span>
                            </td>
                            <td class="uppercase">: {{ studentTranscripts?.gpa }}</td>
                            <td>&nbsp;</td>
                            <td class=""><span class="uppercase">P : PRAKTIK</span> <br> <span class="eng">Practice</span>
                            </td>
                            <td>=</td>
                            <td class="uppercase">{{ studentTranscripts?.practicum_credit }} SKS</td>
                        </tr>
                        <tr>
                            <td class=""><span class="uppercase">PREDIKAT</span> <br> <span class="eng">Predicate</span>
                            </td>
                            <td class="">: <span class="uppercase">{{ studentTranscripts?.graduation_predicate }}</span>
                                <br>
                                <span class="eng">{{ studentTranscripts?.graduation_predicate }}</span>
                            </td>
                            <td>&nbsp;</td>
                            <td class="" nowrap="nowrap"><span class="uppercase">JUDUL TUGAS AKHIR</span> <br> <span
                                    class="eng">Thesis Title</span></td>
                            <td>=</td>
                            <td class="judul_ta">{{ studentTranscripts?.thesis_title }} <br> 
                                <span class="eng">{{ studentTranscripts?.thesis_english_title }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <hr class="hr1">

            <div id="table_paraf">
                <table width="100%">
                    <tbody>
                        <tr>
                            <td colspan="3">&nbsp;</td>
                            <td align="center" class="tanggal_cetak">Semarang, {{ new Date().getDate() }}, {{ convertMonthToTextString(new Date().getMonth() + 1) }} {{ new Date().getFullYear() }}</td>
                        </tr>
                        <tr>
                            <td width="5%">&nbsp;</td>
                            <td width="45%">
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <td align="center"> <br> <span class="eng"></span></td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="height: 1.6cm;"></td>
                                        </tr>
                                        <tr>
                                            <td align="center"></td>
                                        </tr>
                                        <tr>
                                            <td align="center"></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </td>
                            <td width="20%" align="right">
                                <div id="pas_foto">PAS FOTO</div>
                            </td>
                            <td width="33%">
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <td align="center"> <br> <span class="eng"></span></td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="height: 1.6cm;"></td>
                                        </tr>
                                        <tr>
                                            <td align="center"></td>
                                        </tr>
                                        <tr>
                                            <td align="center"></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>



        </div>
    </div>
</template>