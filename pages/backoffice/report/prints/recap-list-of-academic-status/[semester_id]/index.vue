<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { FunctionRule } from 'v-calendar/dist/types/src/utils/date/rules';
import { getLecturerDetail } from '~~/composables/api/lecturer/getLecturerDetail';
import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';
import { GetStudyProgramDetailData } from '~~/types/api/study-program/GetStudyProgramDetail';
import { getAdminStudyProgramDetail } from '~~/composables/api/admin-study-program/getAdminStudyProgramDetail';
import { GetLecturerResignationListData } from '~~/types/api/lecturer-resignation/GetLecturerResignationList';
import { getLecturerResignationList } from '~~/composables/api/lecturer-resignation/getLecturerResignationList';
import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';
import { getReportStudentStatusList } from '~~/composables/api/report/getReportStudentStatusList';
import { GetReportStudentStatusListData } from '~~/types/api/report/GetReportStudentStatusList';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {
    semester_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getSemesterDetailData(semester_id.value)
    await getReportStudentStatusData()
    await delay(1000)
    window.print()
})
const semester_id = ref('')
var pageLimit = 15;
const pagination = ref({
    page: 1,
    limit: 1000000,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const semesters = ref(<GetSemesterDetailData>{})
async function getSemesterDetailData(semesterId: string) {
    try {
        const { response: resp, error: error } = await getSemesterDetail(semesterId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            semesters.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}


const reportStudentStatuss = ref<GetReportStudentStatusListData[]>([])
const selectedReportStudentStatus = ref(<GetReportStudentStatusListData>{});
async function getReportStudentStatusData() {
    try {
        if (semester_id.value == '') {
            reportStudentStatuss.value = []
            return;
        }
        const { response: resp, error: error } = await getReportStudentStatusList(semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            reportStudentStatuss.value = resp?.data
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
        <div class="page-break">


            <table width="100%" class="header_cetak" border="0" v-if="reportStudentStatuss.length">
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


            <h2 align="center">Rekapitulasi Status Akademik Mahasiswa</h2>
            <h4 align="center">Semester {{ semesters.semester_type }} {{ semesters.school_year }} </h4>

            <br>

            <table class="tabel-common" width="100%">
                <tbody>
                    <tr>
                        <th width="3%">No.</th>
                        <th width="">Program Studi</th>
                        <th width="8%" v-for="s in reportStudentStatuss[0].statuses">{{
                            s.status }}</th>
                    </tr>

                    <!-- <tr>
                        <td nowrap="nowrap" colspan="11"><b>PUSAT</b></td>
                    </tr> -->

                    <tr v-for="item, i in reportStudentStatuss">
                        <td nowrap="nowrap" align="right">{{ i + 1 }}</td>
                        <td nowrap="nowrap" align="right">{{ item.study_program_name }}</td>
                        <td nowrap="nowrap" align="right" v-for="s in item.statuses">{{ s.total }}</td>
                    </tr>
                </tbody>
            </table>


        </div>
    </div>
</template>