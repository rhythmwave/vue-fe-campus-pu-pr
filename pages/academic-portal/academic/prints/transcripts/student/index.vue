<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { FunctionRule } from 'v-calendar/dist/types/src/utils/date/rules';
import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';
import { getStudentTranscriptDetail } from '~~/composables/api/student-transcript/getStudentTranscriptDetail';
import { GetStudentTranscriptDetailData, GetStudentTranscriptDetailSubject } from '~~/types/api/student-transcript/GetStudentTranscriptDetail';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-student/GetHomePageSemesterSummary';
import { getHomePageSemesterSummary } from '~~/composables/api/general-student/getHomePageSemesterSummary';
import { GetAcademicPortalStudentGeneralProfileData } from '~~/types/api/academic-portal-student-general/GetAcademicPortalStudentGeneralProfile';
import { getAcademicPortalStudentGeneralProfile } from '~~/composables/api/academic-portal-student-general/getAcademicPortalStudentGeneralProfile';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {
    await getHomePageSemesterSummaryData()
    await getAcademicPortalStudentGeneralProfileData()
    await getStudentTranscriptDetailData()
    await delay(1000)
    window.print()
})

const studentTranscriptDetails = ref(<GetStudentTranscriptDetailData>{
    id: "",
    name: "",
    nim_number: 0,
    study_program_name: "",
    total_credit: 0,
    gpa: 0,
    subjects: []
})
async function getStudentTranscriptDetailData() {
    try {
        const { response: resp, error: error } = await getStudentTranscriptDetail()
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentTranscriptDetails.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}


const getHomePageSemesterSummarys = ref(<GetHomePageSemesterSummaryData>{})
async function getHomePageSemesterSummaryData() {
    try {
        const { response: resp, error: error } = await getHomePageSemesterSummary()
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getHomePageSemesterSummarys.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const getAcademicPortalStudentGeneralProfiles = ref(<GetAcademicPortalStudentGeneralProfileData>{})
async function getAcademicPortalStudentGeneralProfileData() {
    try {
        const { response: resp, error: error } = await getAcademicPortalStudentGeneralProfile()
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getAcademicPortalStudentGeneralProfiles.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function sumOfSks(data: GetStudentTranscriptDetailSubject[]) {
    return data.reduce((sum, d) => {
        return sum += d.subject_theory_credit;
    }, 0);
}
function sumOfGrade(data: GetStudentTranscriptDetailSubject[]) {
    return data.reduce((sum, d) => {
        return sum += d.grade_point;
    }, 0);
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
        <link rel="stylesheet" type="text/css" href="styles/a-portal-transcript4.css">
        <link rel="stylesheet" type="text/css" media="print" href="styles/a-portal-transcript4-print.css">

        <div class="page-portrait">
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
                            <span class="sp-web">Web : www.politeknikpu.ac.id, e-mail : info@politeknikpu.ac.id</span>
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


            <h3 align="center"><u>DAFTAR NILAI</u></h3>
            <br>
            <table class="tabel-top-trankrip">
                <tbody>
                    <tr>
                        <td width="40%">Nama</td>
                        <td width="1%">:</td>
                        <td>{{ studentTranscriptDetails.name }}</td>
                    </tr>
                    <tr>
                        <td nowrap="nowrap">NIM</td>
                        <td>:</td>
                        <td>{{ studentTranscriptDetails.nim_number }}</td>
                    </tr>
                    <tr>
                        <td nowrap="nowrap">Tempat dan Tanggal Lahir</td>
                        <td>:</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td nowrap="nowrap">Program Studi</td>
                        <td>:</td>
                        <td>{{ studentTranscriptDetails.study_program_name }}</td>
                    </tr>
                    <tr>
                        <td nowrap="nowrap">Jenjang Pendidikan</td>
                        <td>:</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td nowrap="nowrap">Tanggal Lulus</td>
                        <td>:</td>
                        <td> </td>
                    </tr>
                </tbody>
            </table>

            <div class="nobreak">
                <!-- <table width="100%" class="tabel-top-trankrip" style="display:">
                    <tr>
                        <td align="center" style="padding:0px;">
                            <img src="images/logo.png" width="125" />
                        </td>
                    </tr>
                </table> -->
                <div id="table_transkrip">
                    <center>
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tbody>
                                <!-- <tr>
                                    <th style="display:;border-left: 0px; border-right: 0px;" colspan="3" width=""
                                        align="left" class="no-top">&nbsp; {{ studentTranscriptDetails.name }}</th>
                                    <th style="display:;border-left: 0px; border-right: 0px;" colspan="3" width=""
                                        class="no-top">{{studentTranscriptDetails.nim_number}}</th>
                                </tr> -->
                                <tr>
                                    <th width="5%">No</th>
                                    <th width="15%">Kode</th>
                                    <th>Mata Kuliah</th>
                                    <th width="8%">SKS</th>
                                    <th width="8%">Nilai</th>
                                    <th width="8%">Mutu</th>
                                </tr>
                                <tr v-for="s, i in studentTranscriptDetails.subjects">
                                    <td class="border-left border-right center">{{ i + 1 }}</td>
                                    <td class="border-left border-right center">{{ s.subject_code }}</td>
                                    <td class="border-left border-right">{{ s.subject_name }}</td>
                                    <td class="border-left border-right center">{{ s.subject_theory_credit }}</td>
                                    <td class="border-left border-right center">{{ s.grade_code }}</td>
                                    <td class="border-left border-right center">{{ s.grade_point }}</td>
                                </tr>

                                <tr>
                                    <td colspan="6" class="border-top" style="display:none">&nbsp;</td>
                                </tr>

                                <!-- <tr style="display:none;">
                                <td colspan="3" style="border-right:0px solid #ff0000;height:30px;vertical-align:middle; display:">
                                    <div style="float:left">&nbsp; Jumlah SKS X BOBOT NILAI (<i>Total Credits x Grade</i>) : 
                                    </div>
                                    <div style="float:right">
                                        Jumlah SKS (<i>Total Credits</i>) :
                                    </div>
                                </td>
                                <td colspan="2" style="border-left:0px solid #ff0000;border-right:0px solid #ff0000;vertical-align:middle; text-align:center; display:"><b>38</b></td>
                                <td style="border-left:0px solid #ff0000; display:">&nbsp;</td>
                            </tr> -->

                                <tr style="display:;" class="border-all">
                                    <td colspan="3"></td>
                                    <td align="center">{{ sumOfSks(studentTranscriptDetails.subjects) }}</td>
                                    <td></td>
                                    <td align="center">{{ sumOfGrade(studentTranscriptDetails.subjects) }}</td>
                                </tr>
                                <tr style="display:;" class="border-all">
                                    <td colspan="6" class="footer">
                                        <div class="div1 i-flex">Jumlah Kredit Kumulatif</div>
                                        <div class="div2 i-flex">&nbsp;=&nbsp;</div>
                                        <div class="div3">{{ sumOfSks(studentTranscriptDetails.subjects) }}</div>
                                    </td>
                                </tr>
                                <tr style="display:;" class="border-all">
                                    <td colspan="6" class="footer">
                                        <div class="div1 i-flex">Indeks Prestasi Kumulatif</div>
                                        <div class="div2 i-flex">&nbsp;=&nbsp;</div>
                                        <div class="div3">{{ sumOfGrade(studentTranscriptDetails.subjects) }} : {{ sumOfSks(studentTranscriptDetails.subjects) }} = {{ sumOfGrade(studentTranscriptDetails.subjects)/sumOfSks(studentTranscriptDetails.subjects) }}</div>
                                    </td>
                                </tr>
                                <tr style="display:none;" class="border-all">
                                    <td colspan="6" class="footer">
                                        <div class="div1 i-flex">Predikat Kelulusan</div>
                                        <div class="div2 i-flex">&nbsp;=&nbsp;</div>
                                        <div class="div3"></div>
                                    </td>
                                </tr>
                                <tr style="display:;" class="border-all">
                                    <td colspan="6" class="footer">
                                        <div class="div1 i-flex">Tanggal Yudisium</div>
                                        <div class="div2 i-flex">&nbsp;=&nbsp;</div>
                                        <div class="div3"> </div>
                                    </td>
                                </tr>
                                <tr style="display:;" class="border-all">
                                    <td colspan="6" class="footer">
                                        <div class="div1 i-flex">Judul Tugas Akhir</div>
                                        <div class="div2 i-flex">&nbsp;=&nbsp;</div>
                                        <div class="div3"></div>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </center>
                </div>

            </div>
            <!-- endof page -->
            <br>
            <div style="font-size: 8pt;">
                <small>Tanggal Jam Cetak: {{ new Date().getDate() }}, {{ convertMonthToTextString(new
                    Date().getMonth() +
                    1) }} {{ new Date().getFullYear() }} {{ new Date().getHours() }}:{{  new Date().getMinutes() }}:{{ new Date().getSeconds() }}</small>
            </div>

            <br>

            <div align="center" class="signatureBottom">
                <table width="100%">
                    <tbody>
                        <tr>
                            <td width="33%" nowrap="nowrap" valign="top">
                                <span>&nbsp;</span><br>
                                <span hidden="hidden">,&nbsp;</span><br>
                                <span>Dosen Wali</span>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <span class="underline">{{
                                    getHomePageSemesterSummarys.academic_guidance_lecturer_front_title }}
                                    {{ getHomePageSemesterSummarys.academic_guidance_lecturer_name }}
                                    {{ getHomePageSemesterSummarys.academic_guidance_lecturer_back_degree }}</span><br>
                                <span>NIDN. </span>
                            </td>
                            <td></td>
                            <td width="33%" nowrap="nowrap" valign="top">
                                <span>Semarang, {{ new Date().getDate() }}, {{ convertMonthToTextString(new
                                    Date().getMonth() +
                                    1) }} {{ new Date().getFullYear() }}&nbsp;</span><br>
                                <span hidden="hidden">Mengetahui,&nbsp;</span><br>
                                <span>&nbsp;</span>
                                <br>
                                <br>
                                <br>
                                <br>
                                <br>
                                <span class="underline"></span><br>
                                <span>&nbsp;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>