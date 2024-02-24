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
import { GetStudentAcademicGuidanceDetailData } from '~~/types/api/student-academic-guidance/GetStudentAcademicGuidanceDetail';
import { getStudentAcademicGuidanceDetail } from '~~/composables/api/student-academic-guidance/getStudentAcademicGuidanceDetail';
import { GetStudentAcademicGuidanceSessionListData } from '~~/types/api/student-academic-guidance/GetStudentAcademicGuidanceSessionList';
import { getStudentAcademicGuidanceSessionList } from '~~/composables/api/student-academic-guidance/getStudentAcademicGuidanceSessionList';
import { getStudentParentProfileDetail } from '~~/composables/api/student-parent-profile/getStudentParentProfileDetail';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {
    await getHomePageSemesterSummaryData()
    await getAcademicPortalStudentGeneralProfileData()
    await getStudentAcademicGuidanceDetailData()
    await delay(1000)
    window.print()
})

const studentAcademicGuidanceDetails = ref(<GetStudentAcademicGuidanceDetailData>{})
async function getStudentAcademicGuidanceDetailData() {
    try {
        const { response: resp, error: error } = await getStudentAcademicGuidanceDetail(getHomePageSemesterSummarys.value.semester_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentAcademicGuidanceDetails.value = resp?.data
            await getStudentAcademicGuidanceSessionData()
        }
    } catch (error) {
        alert(error)
    }
}

const studentAcademicGuidanceSessions = ref<GetStudentAcademicGuidanceSessionListData[]>([])
async function getStudentAcademicGuidanceSessionData() {
    try {
        const { response: resp, error: error } = await getStudentAcademicGuidanceSessionList(studentAcademicGuidanceDetails.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentAcademicGuidanceSessions.value = resp?.data
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
function showDate(d: Date) {
    return d.getDate() + " " + convertMonthToTextString(d.getMonth() + 1) + " " + d.getFullYear()
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
        <link rel="stylesheet" type="text/css" href="styles/a_sia_cetak.css">
        <link rel="stylesheet" type="text/css" media="print" href="styles/a_sia_cetak_media_print.css">

        <div class="page-portrait">
            <div class="nobreak">
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


                <h3 align="center">RIWAYAT BIMBINGAN AKADEMIK</h3>
                <!-- <h4 align="center">Semester : Gasal 2023</h4><br /> -->

                <table class="tabel-info" width="100%">
                    <tbody>
                        <tr>
                            <td width="15%">NIM</td>
                            <td width="2%">:</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Nama</td>
                            <td width="2%">:</td>
                            <td>{{ getAcademicPortalStudentGeneralProfiles.name }}</td>
                        </tr>
                        <tr>
                            <td>Program Studi</td>
                            <td width="2%">:</td>
                            <td>{{ getAcademicPortalStudentGeneralProfiles.study_program_name }}</td>
                        </tr>
                        <tr>
                            <td>Angkatan</td>
                            <td width="2%">:</td>
                            <td>{{ getAcademicPortalStudentGeneralProfiles.student_force }}</td>
                        </tr>
                        <!-- <tr>
                    <td>Semester</td>
                    <td width="2%">:</td>
                    <td></td>
                </tr> -->
                    </tbody>
                </table>

                <div class="nobreak">
                    <div id="table_transkrip">
                        <center>
                            <table class="tabel-common" width="100%">
                                <tbody>
                                    <tr>
                                        <th width="4%">No</th>
                                        <th width="10%">Semester</th>
                                        <th width="10%">Tanggal</th>
                                        <th width="15%">DOSEN</th>
                                        <th width="30%">Konsultasi</th>
                                        <th>Saran</th>
                                    </tr>
                                    <tr v-for="sags, i in studentAcademicGuidanceSessions">
                                        <td align="center">{{ i + 1 }}</td>
                                        <td align="center" nowrap="nowrap"></td>
                                        <td align="center" nowrap="nowrap"> {{ showDate(new Date(sags.session_date)) }}</td>
                                        <td align="left"></td>
                                        <td align="left"></td>
                                        <td align="left"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </center>
                    </div>
                </div>
                <!-- endof page -->
            </div>
        </div>
    </div>
</template>