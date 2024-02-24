<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { FunctionRule } from 'v-calendar/dist/types/src/utils/date/rules';
import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';
import { GetOfferedClassData } from '~~/types/api/academic-portal-student-offered-class/GetOfferedClass';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-lecturer/GetHomePageSemesterSummary';
import { getHomePageSemesterSummary } from '~~/composables/api/general-lecturer/getHomePageSemesterSummary';
import { GetLecturerClassDetailData } from '~~/types/api/lecturer-class/GetLecturerClassDetail';
import { getLecturerClassDetail } from '~~/composables/api/lecturer-class/getLecturerClassDetail';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {

    class_id.value = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]

    // await getData(10000000, 1)
    await getLecturerClassDetailData()
    await delay(1000)
    window.print()
})

const class_id = ref('')


const getLecturerClassDetails = ref(<GetLecturerClassDetailData>{
    id: "",
    name: "",
    study_program_id: "",
    study_program_name: "",
    dikti_study_program_type: "",
    study_level_short_name: "",
    semester_id: "",
    semester_school_year: "",
    semester_type: "",
    grading_start_date: "",
    grading_end_date: "",
    curriculum_id: "",
    curriculum_name: "",
    curriculum_year: "",
    subject_id: "",
    subject_code: "",
    subject_name: "",
    is_grading_responsible: false,
    grade_components: [],
    students: [],
    grade_types: [],
})
// const selectedactiveSemesterClasss = ref(<GetActiveSemesterClassListData>{})
async function getLecturerClassDetailData() {
    try {
        const { response: resp, error: error } = await getLecturerClassDetail(class_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getLecturerClassDetails.value = resp?.data
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
    font-family: Tahoma;
    font-size: 11px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    padding: 2px 0px;
    margin: 0px;
}

h1 {
    font-size: 15pt;
}

h2 {
    font-size: 13pt;
}

h3 {
    font-size: 11pt;
}

h4 {
    font-size: 9pt;
}

hr {
    clear: both;
}

img {
    margin: 2px;
}

.center {
    text-align: center;
}

div.page-portrait {
    visibility: visible;
    font-family: Tahoma;
    font-size: 11px;
    margin: 0 auto;
    width: 18.5cm;
}

div.page-landscape {
    visibility: visible;
    font-family: Tahoma;
    font-size: 11px;
    margin: 0 auto;
    width: 25.5cm;
}

table {
    border-collapse: collapse;
}

.box {
    border: 1px solid #ccc;
    padding: 4px;
}

table tr td {
    font-family: Tahoma;
    font-size: 11px;
    padding: 2px;
}

table tr th {
    font-family: Tahoma;
    font-size: 11px;
    font-weight: bold;
    background-color: #fff;
    padding: 2px;
}

.tabel-common tr td {
    font-family: Tahoma;
    font-size: 11px;
    padding: 2px;
    border: 1px solid #ccc;
    vertical-align: top;
}

.tabel-common .nama {
    width: 250px;
    overflow: hidden;
}

.tabel-common tr th {
    font-family: Tahoma;
    font-size: 11px;
    font-weight: bold;
    background-color: #fff;
    padding: 2px;
    border: 1px solid #ccc;
}

.incommon-separator {
    border-top: 1px solid #fff !important;
    border-left: 1px solid #fff !important;
    border-right: 1px solid #fff !important;
    border-bottom: 1px solid #ccc !important;
}

.incommon-noseparator {
    border: 1px solid #fff !important;
}

.bottom-separator {
    border-bottom: 1px solid #ccc !important;
}

.tabel-info tr th {
    font-family: Tahoma;
    font-size: 11px;
    padding: 2px;
    font-weight: bold;
    float: left;
    vertical-align: top;
}

.tabel-info tr td {
    font-family: Tahoma;
    font-size: 11px;
    padding: 2px;
    font-weight: normal;
    vertical-align: top;
}

div.nobreak .hidden {
    visibility: hidden;
    display: none;
}

div.page-break .hidden {
    visibility: visible;
    margin: 10px 0px 10px 0px;
}

.page-break {
    clear: both;
}

.link {
    clear: both;
    visibility: visible;
}

#header .separatorAlamat {
    background-color: #5C74B0;
    color: #fff;
    height: 40px;
    font-size: 13px;
}

.warning {
    background-color: yellow !important;
}

.hidden {
    display: none;
}

/* .bahasa{
   position: ;
} */

.skor {
    margin-left: 100px;
}

.tanggal {
    margin-left: 93px;
}
</style>

<style type="text/css">
body {
    font-family: Tahoma;
    font-size: 11px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    padding: 2px 0px;
    margin: 0px;
}

h1 {
    font-size: 15pt;
}

h2 {
    font-size: 13pt;
}

h3 {
    font-size: 11pt;
}

h4 {
    font-size: 9pt;
}

hr {
    clear: both;
}

img {
    margin: 2px;
}

@page size-A4 {
    size: 21.0cm 33.0cm;
    margin: 1.5cm;
}

@page rotate-landscape {
    size: landscape;
}

div.page-portrait {
    visibility: visible;
    font-family: Tahoma;
    font-size: 11px;
    margin: 0px auto;
    width: auto;
}

div.page-landscape {
    visibility: visible;
    font-family: Tahoma;
    font-size: 11px;
    margin: 0px auto;
    width: auto;
}

div.page-break {
    visibility: visible;
    page-break-after: always;
}

div.nobreak {
    visibility: visible;
}

table {
    border-collapse: collapse;
}

.box {
    border: 1px solid #000;
    padding: 4px;
}

table tr td {
    font-family: Tahoma;
    font-size: 11px;
    padding: 2px;
}

table tr th {
    font-family: Tahoma;
    font-size: 11px;
    font-weight: bold;
    background-color: #eee;
    padding: 2px;
}

.tabel-common tr td {
    font-family: Tahoma;
    font-size: 11px;
    padding: 2px;
    border: 1px solid #000;
    vertical-align: top;
}

.tabel-common tr th {
    font-family: Tahoma;
    font-size: 11px;
    font-weight: bold;
    /*background-color: #eee;*/
    padding: 2px;
    border: 1px solid #000;
}

.tabel-common .nama {
    width: 250px;
    overflow: hidden;
}

.hidden {
    visibility: hidden;
}

div.nobreak .hidden {
    display: none;
}

div.page-break .hidden {
    display: none;
}

.tabel-info tr th {
    font-family: Tahoma;
    font-size: 11px;
    padding: 2px;
    font-weight: bold;
    vertical-align: top;
}

.tabel-info tr td {
    font-family: Tahoma;
    font-size: 11px;
    padding: 2px;
    font-weight: normal;
    vertical-align: top;
}

.page-break {
    clear: both;
}

.link {
    clear: both;
    visibility: hidden;
    display: none;
}

.hidden {
    display: none;
}

/*.bahasa{
   position: absolute;
}

.skor{
   position: absolute; 
   margin-left: 230px;
}

.tanggal{
   margin-left: 430px;
}*/
</style>
<style type="text/css">
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
    <div class="page-portrait">
        <div class="">
            <div class="">
                <div class="header">
                    <link rel="stylesheet" type="text/css"
                        href="module/artprint/poltekpu_semarang/assets/styles/a-portal-header-cetak.css">
                    <table width="100%" class="header_cetak">
                        <tbody>
                            <tr>
                                <td rowspan="2" class="cl-img">
                                    <img src="~/assets/img/logo_poltek_pu_dinas.jpg" />
                                </td>
                                <td width="100%" class="cl-teks">
                                    KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT <br>
                                    BADAN PENGEMBANGAN SUMBER DAYA MANUSIA <br>
                                    <span class="sp-kampus">POLITEKNIK PEKERJAAN UMUM</span><br>
                                    <span class="sp-alamat">Jalan Prof. Soedarto, SH No.15 Tembalang, Semarang 50275,
                                        Telp/Fax.024-7472848</span> <br>
                                    <span class="sp-web">Web : www.politeknikpu.ac.id, e-mail :
                                        info@politeknikpu.ac.id</span>
                                </td>
                                <td rowspan="2" class="cl-img">
                                    <img src="~/assets/img/logo_poltek_pu_semarang.png" />
                                </td>
                            </tr>
                            <tr>
                                <td class="cl-hr">
                                    <hr class="hr1">
                                </td>
                            </tr>
                        </tbody>
                    </table>


                    <h3 align="center">DAFTAR PESERTA KELAS</h3>
                    <h4 align="center">Program Studi {{ getLecturerClassDetails.study_program_name }} - {{
                        getLecturerClassDetails.study_level_short_name }} {{
        getLecturerClassDetails.dikti_study_program_type }}</h4>
                    <h4 align="center">Semester : {{ getLecturerClassDetails.semester_type }} {{
                        getLecturerClassDetails.semester_school_year }}</h4><br>

                    <table class="tabel-info" width="100%">
                        <tbody>
                            <tr>
                                <td width="15%">Mata Kuliah</td>
                                <td width="1%">:</td>
                                <td>{{ getLecturerClassDetails.subject_name }}</td>
                            </tr>
                            <tr>
                                <td>Nama Kelas</td>
                                <td>:</td>
                                <td>{{ getLecturerClassDetails.name }}</td>
                            </tr>
                            <tr>
                                <td>Jumlah Peserta</td>
                                <td>:</td>
                                <td>{{ getLecturerClassDetails.students.length }}</td>
                            </tr>
                            <tr>
                                <td valign="top">Dosen</td>
                                <td valign="top">:</td>
                                <!-- <td valign="top">Ana Irhandayaningsih, Dra., M.Si<br>Indira Laksmi Widuri, S.H, LL.M</td> -->
                                <td valign="top"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <br>

                <table width="100%" class="tabel-common">
                    <thead>
                        <tr>
                            <th width="25">No.</th>
                            <th width="100">NIM</th>
                            <th width="*">Nama</th>
                            <th width="90">Program Studi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s, i in getLecturerClassDetails.students">
                            <td align="right">{{ i + 1 }}</td>
                            <td align="center" nowrap="nowrap">{{ s.nim_number }}</td>
                            <td>
                                <div>{{ s.name }}</div>
                            </td>
                            <td align="center">{{ getLecturerClassDetails.subject_code }}</td>
                        </tr>

                    </tbody>
                </table>
                <!-- hr class="hidden" / -->
            </div>

            <table align="right" width="100%">
                <tbody>
                    <tr>
                        <td width="70%" rowspan="3">&nbsp;</td>
                        <td align="center">Semarang, {{ new Date().getDate() }}, {{ convertMonthToTextString(new
                            Date().getMonth() + 1) }} {{ new Date().getFullYear() }}<br><span id=""></span><br><span
                                id=""></span></td>
                    </tr>
                    <tr>
                        <td align="center" height="50"></td>
                    </tr>
                    <tr>
                        <td align="center" nowrap="nowrap"><span
                                id="">........................................</span><br>------------------------------
                            <br>NIDN: <span id="">..............................</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>