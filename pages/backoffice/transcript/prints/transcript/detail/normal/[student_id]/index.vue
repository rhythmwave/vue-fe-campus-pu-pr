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
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { GetStudentSubjectGradeListData } from '~~/types/api/student/GetStudentSubjectGradeList';
import { getStudentSubjectGradeList } from '~~/composables/api/student/getStudentSubjectGradeList';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {

    student_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getStudentDetailData()
    await getStudentSubjectGradeData()
    await getStudyProgramDetailData()
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
    font-family: tahoma;
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

#header {
    text-align: center;
    margin-bottom: -15px;
}

#header h2,
#header h3,
#header h4 {
    margin: 0;
    padding: 0;
    font-weight: normal;
}

#header h2 {
    margin: 0;
    padding: 0;
    font-size: 20pt;
}

#header h3 {
    margin: 0;
    padding: 0;
    font-size: 16pt;
}

#header h4 {
    margin: 0;
    padding: 0;
    font-size: 10pt;
}

#header hr {
    border: 1px solid #ododod;
}

#header a {
    display: block;
    text-align: left;
    /*float: left;*/
    text-decoration: underline;
    /*display: none;*/
    z-index: 100;
}

#header a:hover {
    text-decoration: none;
}

#logo_ugm {
    /*text-align: center;*/
    margin: 0 auto;
    width: 45px;
    height: 45px;
    display: block;
}

#header img {
    width: 45px;
    height: 45px;
}

#nomor_transkrip {
    text-align: center;
    margin-bottom: 15px;
}

#nomor_transkrip h1 {
    margin: 0;
    padding: 0;
    font-size: 14pt;
}

#nomor_transkrip hr {
    margin: 0 auto;
    padding: 0;
    width: 290px;
    border: 1px solid #ododod;
}

#info_mhs {
    margin-bottom: 10px;
}

#info_mhs table {
    margin: 0;
    padding: 0;
}

#info_mhs th {
    text-align: left;
    font-weight: normal;
}

#info_mhs td {
    width: 240px;
}

#table_transkrip {
    margin-bottom: 10px;
}

#table_transkrip table {
    /*border: 1px solid #000;*/
    font-family: tahoma;
    border: none;
    border-collapse: collapse;
    width: 100%;
}

#table_transkrip th {
    border: 1px solid #000;

    border-left: 1px solid #000;
    border-right: 1px solid #000;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 0 5px;
}

#table_transkrip td {
    border: 1px solid #000;

    border-left: 1px solid #000;
    border-right: 1px solid #000;


    text-align: center;
    font-size: 10pt;
    padding: 0 5px;
    vertical-align: top;
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
    font-family: tahoma;
    font-size: 10pt;
    margin: 0;
    padding: 0;
}


@page size-A4 {
    size: 21.0cm 29.7cm;
    margin: 1.5cm;
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

#header {
    text-align: center;
    margin-bottom: -15px;
}

#header h2,
#header h3,
#header h4 {
    margin: 0;
    padding: 0;
    font-weight: normal;
}

#header h2 {
    margin: 0;
    padding: 0;
    font-size: 20pt;
}

#header h3 {
    margin: 0;
    padding: 0;
    font-size: 16pt;
}

#header h4 {
    margin: 0;
    padding: 0;
    font-size: 10pt;
}

#header hr {
    border: 1px solid #ododod;
}

#header a {
    display: none;
}

#header a:hover {
    text-decoration: none;
}

#logo_ugm {
    /*text-align: center;*/
    margin: 0 auto;
    width: 45px;
    height: 45px;
    display: block;
}

#header img {
    width: 45px;
    height: 45px;
}

#nomor_transkrip {
    text-align: center;
    margin-bottom: 15px;
}

#nomor_transkrip h1 {
    margin: 0;
    padding: 0;
    font-size: 14pt;
}

#nomor_transkrip hr {
    margin: 0 auto;
    padding: 0;
    width: 290px;
    border: 1px solid #ododod;
}

#info_mhs {
    margin-bottom: 10px;
}

#info_mhs table {
    margin: 0;
    padding: 0;
}

#info_mhs th {
    text-align: left;
    font-weight: normal;
}

#info_mhs td {
    width: 240px;
}

#table_transkrip {
    margin-bottom: 10px;
}

#table_transkrip table {
    /*border: 1px solid #000;*/
    font-family: tahoma;
    border: none;
    border-collapse: collapse;
    width: 100%;
}

#table_transkrip th {
    border: 1px solid #000;

    border-left: 1px solid #000;
    border-right: 1px solid #000;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 0 5px;
}

#table_transkrip td {
    border: 1px solid #000;

    border-left: 1px solid #000;
    border-right: 1px solid #000;


    text-align: center;
    font-size: 10pt;
    padding: 0 5px;
    vertical-align: top;
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

@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap');

.header_cetak tr td {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 14pt;
    padding: 0 !important;
}

.header_cetak span {
    margin: 0 !important;
    padding: 0 !important;
}

.header_cetak .cl-img {
    width: 0 !important;
    vertical-align: top;
}

.header_cetak tr td img {
    width: 90px;
    height: 90px;
    margin: 4px !important;
}

.header_cetak .cl-teks {
    vertical-align: top;
    text-align: center;
    line-height: 1.1;
}

.header_cetak .sp-kampus {
    font-weight: bold;
    letter-spacing: 8px;
}

.header_cetak .sp-alamat {
    font-size: 10pt;
}

.header_cetak .sp-web {
    font-size: 10pt;
    letter-spacing: 1.8px;
}

.header_cetak .cl-hr {
    padding: 0 10px !important;
}

.header_cetak .hr1 {
    margin: 2px;
    border: 1px solid #000;
}
</style>
<template>
    <div id="container">
        <div class="nobreak">

            <div id="header_">
                <!-- <td><img src="../../images/logo_client.png" /></td> -->
                <table width="100%" class="header_cetak">
                    <tbody>
                        <tr>
                            <td rowspan="2" class="cl-img">
                                <img src="~/assets/img/logo_poltek_pu_dinas.jpg">
                            </td>
                            <td width="100%" class="cl-teks">
                                KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT <br>
                                BADAN PENGEMBANGAN SUMBER DAYA MANUSIA <br>
                                <span class="sp-kampus">POLITEKNIK PEKERJAAN UMUM</span><br>
                                <span class="sp-alamat">Jalan Prof. Soedarto, SH No.15 Tembalang, Semarang 50275,
                                    Telp/Fax.024-7472848</span> <br>
                                <span class="sp-web">Web : www.politeknikpu.ac.id, e-mail : info@politeknikpu.ac.id</span>
                            </td>
                            <td rowspan="2" class="cl-img">
                                <img src="~/assets/img/logo_poltek_pu_semarang.png">
                            </td>
                        </tr>
                        <tr>
                            <td class="cl-hr">
                                <hr class="hr1">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--bound-->

            <h3 style="text-align: center;"><u>DAFTAR NILAI</u></h3>
            <div id="info_mhs">
                <table width="80%" border="0">
                    <tbody>
                        <tr>
                            <th style="width: 30%;" width="30%">Nama</th>
                            <th style="width: 1%;" width="1%">:</th>
                            <td style="width: 29%;" width="32%">{{ studentDetails?.name }}</td>
                        </tr>
                        <tr>
                            <th nowrap="nowrap">NIM</th>
                            <th>:</th>
                            <td>{{ studentDetails?.nim_number }}</td>
                        </tr>
                        <tr>
                            <th nowrap="nowrap">Tempat dan Tanggal Lahir</th>
                            <th>:</th>
                            <td>{{ studentDetails?.birth_regency_name }} {{ studentDetails?.birth_date ? moment(new
                                Date(studentDetails?.birth_date)).format("DD MM YYYY") : ''
                            }}</td>
                        </tr>
                        <tr>
                            <th nowrap="nowrap">Program Studi</th>
                            <th>:</th>
                            <td>{{ studentDetails?.study_program_name }}</td>
                        </tr>
                        <tr>
                            <th>Jenjang Pendidikan</th>
                            <th>:</th>
                            <td>{{ studyProgramDetails.study_level_name }}</td>
                        </tr>
                        <tr>
                            <th>Tanggal Lulus</th>
                            <th>:</th>
                            <td> </td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <div class="page-break">
                <div id="table_transkrip">
                    <table border="0">
                        <tbody>
                            <tr>
                                <th width="3%">No</th>
                                <th width="22%">Kode</th>
                                <th width="60%">Mata Kuliah</th>
                                <th width="5%">SKS</th>
                                <th width="5%">Nilai</th>
                                <th width="7%">Mutu</th>
                            </tr>
                            <tr v-for="ssg, i in studentSubjectGrades">
                                <td class="">{{ i + 1 }}</td>
                                <td class="">JJ-21201</td>
                                <td class=" left">{{ ssg.subject_name }}</td>
                                <td class="">{{ ssg.subject_total_credit }}</td>
                                <td class="">{{ ssg.grade_code }}</td>
                                <td class="">{{ ssg.grade_point }}</td>
                            </tr>

                            <tr class="">
                                <td class="no-right">&nbsp;</td>
                                <td class="no-right no-left">&nbsp;</td>
                                <td class="no-right no-left left">&nbsp;</td>
                                <td class="">
                                    <strong>{{
                                        studentSubjectGrades.map((ssg) => ssg.subject_total_credit).reduce((a, b) => a + b,
                                            0) }}</strong>
                                </td>

                                <td class="no-right no-left">&nbsp;</td>
                                <td class=""><strong>{{
                                    studentSubjectGrades.map((ssg) => ssg.grade_point).reduce((a, b) => a + b,
                                        0) }}</strong></td>
                            </tr>
                            <tr class="">
                                <td class="no-right">&nbsp;</td>
                                <td class="no-left left" colspan="5">
                                    <table width="100%" style="margin-left: -5px; border: 0;">
                                        <tbody>
                                            <tr>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: left;"
                                                    width="190px;">Jumlah Kredit Kumulatif</td>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: right;"
                                                    width="1px;">=</td>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: left;"
                                                    width="auto">{{
                                                        studentSubjectGrades.map((ssg) => ssg.subject_total_credit).reduce((a,
                                                            b) => a + b,
                                                            0) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr class="">
                                <td class="no-right">&nbsp;</td>
                                <td class="no-left left" colspan="5">
                                    <table width="100%" style="margin-left: -5px; border: 0;">
                                        <tbody>
                                            <tr>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: left;"
                                                    width="190px;">Indeks Prestasi Kumulatif</td>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: right;"
                                                    width="1px;">=</td>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: left;"
                                                    width="auto">{{
                                                        studentSubjectGrades.map((ssg) => ssg.grade_point).reduce((a, b) => a +
                                                            b,
                                                            0) }} : {{
            studentSubjectGrades.map((ssg) => ssg.subject_total_credit).reduce((a,
                b) => a + b,
                0) }} ={{
            studentSubjectGrades.map((ssg) => ssg.grade_point).reduce((a, b) => a +
                b,
                0) /
            studentSubjectGrades.map((ssg) => ssg.subject_total_credit).reduce((a,
                b) => a + b,
                0) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr class="">
                                <td class="no-right">&nbsp;</td>
                                <td class="no-left left" colspan="5">
                                    <table width="100%" style="margin-left: -5px; border: 0;">
                                        <tbody>
                                            <tr>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: left;"
                                                    width="190px;">Tanggal Yudisium</td>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: right;"
                                                    width="1px;">=</td>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: left;"
                                                    width="auto"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr class="">
                                <td class="no-right">&nbsp;</td>
                                <td class="no-left left" colspan="5">
                                    <table width="100%" style="margin-left: -5px; border: 0;">
                                        <tbody>
                                            <tr>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: left;"
                                                    width="190px;">Judul Tugas
                                                    Akhir</td>
                                                <td class="no-right no-left no-top no-bottom" style="text-align: right;"
                                                    width="1px;">=</td>
                                                <td class="no-right no-left no-top no-bottom"
                                                    style="text-align: left; font-size: 8.8pt;" width="auto"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>


            <div style="font-size: 8pt;">
                <small>Tanggal Jam Cetak: {{ new Date().getDate() }}, {{ convertMonthToTextString(new
                    Date().getMonth() +
                    1) }} {{ new Date().getFullYear() }} {{ new Date().getHours() }}:{{ new Date().getMinutes() }}:{{ new
        Date().getSeconds() }}</small>
            </div>

            <div>
                <table width="100%" border="0">
                    <tbody>
                        <tr>
                            <td>&nbsp;</td>
                            <td width="35%" style="vertical-align:top;">
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td><span id="">Dosen Wali</span></td>
                                        </tr>
                                        <tr>
                                            <td><br><br><br></td>
                                        </tr>
                                        <tr>
                                            <td nowrap=""><span id=""
                                                    style="text-decoration:underline;">{{ studentDetails.academic_guidance_lecturer_name }}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>NIDN. <span id=""></span></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </td>
                            <td width="30%" style="vertical-align:top;" align="left">
                                <!-- <div style="border: 1px solid #000000; height: 130px; width: 100px;">
						<p style="margin-top: 50px; text-align: center;">Foto 4 x 6</p>
					</div> -->
                            </td>
                            <td width="33%" style="vertical-align:top;">
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <td>Semarang, {{ new Date().getDate() }}, {{ convertMonthToTextString(new
                                                Date().getMonth() +
                                                1) }} {{ new Date().getFullYear() }}</td>
                                        </tr>
                                        <tr>
                                            <td><span id="jabatan0">Ketua Program Studi Teknologi Konstruksi Jalan
                                                    danJembatan</span></td>
                                        </tr>
                                        <tr>
                                            <td><br><br><br></td>
                                        </tr>
                                        <tr>
                                            <td nowrap=""><span id="nama0"
                                                    style="text-decoration:underline;">{{ studyProgramDetails?.head_lecturer_name }}
                                                </span></td>
                                        </tr>
                                        <tr>
                                            <td><span id="nip0">NIP. </span></td>
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