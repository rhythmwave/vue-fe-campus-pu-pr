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
import { GetReportStudentClassGradeListData } from '~~/types/api/report/GetReportStudentClassGradeList';
import { getReportStudentClassGradeList } from '~~/composables/api/report/getReportStudentClassGradeList';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {
    study_program_id.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
    semester_id.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getSemesterDetailData(semester_id.value)
    await getStudyProgramDetailData()
    await getReportStudentClassGradeListData()
    await delay(1000)
    window.print()
})
const study_program_id = ref('')
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

const studyPrograms = ref(<GetStudyProgramDetailData>{})
const selectedStudentSemester = ref(<GetStudyProgramDetailData>{});
async function getStudyProgramDetailData() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramDetail(study_program_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const reportStudentClassGradeLists = ref<GetReportStudentClassGradeListData[]>([])
async function getReportStudentClassGradeListData() {
    try {
        const { response: resp, error: error } = await getReportStudentClassGradeList(semester_id.value, study_program_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            reportStudentClassGradeLists.value = resp?.data
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

        <div class="nobreak">

            <div class="page-break">

                <div class="header">


                    <table width="100%" class="header_cetak" border="0">
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

                    <!--table width="100%">
					<tr>
						<td width="60"><img src="../images/logo_client.png?1696005022" /></td>
						<td><h1>POLITEKNIK PEKERJAAN UMUM</h1><h3>FAKULTAS PUSAT</h3></td>
					</tr>
				</table-->

                    <br>

                    <h2 align="center">DAFTAR DISTRIBUSI NILAI</h2>
                    <h4 align="center">Program Studi {{ studyPrograms.name }} {{ studyPrograms.study_level_short_name }} -
                        {{ studyPrograms.dikti_study_program_type }}</h4>
                    <h4 align="center">Semester {{ semesters.semester_type }} {{ semesters.school_year }} </h4>
                    <br>


                </div>

                <table width="100%" class="tabel-common" v-if="reportStudentClassGradeLists.length">
                    <tbody>
                        <tr>
                            <th width="15" scope="col">No.</th>
                            <th width="300" scope="col">Matakuliah</th>
                            <th scope="col" v-for="g in reportStudentClassGradeLists[0].grades">{{ g.grade_code }}</th>
                            <th scope="col">Jumlah</th>
                        </tr>

                        <tr v-for="item, i in reportStudentClassGradeLists">
                            <td align="right">{{ i + 1 }}</td>
                            <td nowrap="nowrap" align="left">{{ item.subject_name }}</td>

                            <td align="center" v-for="s in item.grades">{{ s.total }}</td>
                            <td align="center">{{ item.grades.map((g) => g.total).reduce((a, b) => a + b, 0) }}</td>
                        </tr>



                    </tbody>
                </table>
                <hr class="hidden">

            </div>

            <br>
            <br>
            <br>

            <div class="nobreak">
                <table align="right" width="100%">
                    <tbody>
                        <tr>
                            <td width="70%" rowspan="3">&nbsp;</td>
                            <td align="center">Semarang, {{ new Date().getDate() }}, {{ convertMonthToTextString(new
                                Date().getMonth() + 1) }} {{ new Date().getFullYear() }}<br><span
                                    id="tipe_pengesahan0">...............</span><br><span id="jabatan0"></span></td>
                        </tr>
                        <tr>
                            <td align="center" height="50"></td>
                        </tr>
                        <tr>
                            <td align="center" nowrap="nowrap"><span
                                    id="nama0">........................................</span><br>------------------------------
                                <br>NIDN: <span id="nip0">..............................</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <span class="link"><a
                        href="../popup/pejabat/?act=62c106c9ac5a3d097b64d129506bf50b&amp;w=0&amp;x=TDFhYnA3bzhyYWE5bmQ%3D&amp;y=TTFlYm43ZzhlYXQ5YWRoYnUzaWQ%3D&amp;f=MTE%3D&amp;i=azFvYnM3bzhuYWc5"
                        onclick="window.open('../popup/pejabat/?act=62c106c9ac5a3d097b64d129506bf50b&amp;w=0&amp;x=TDFhYnA3bzhyYWE5bmQ%3D&amp;y=TTFlYm43ZzhlYXQ5YWRoYnUzaWQ%3D&amp;f=MTE%3D&amp;i=azFvYnM3bzhuYWc5','','height=600,resizable=yes,scrollbars=yes,width=750'); return false;">Ganti
                        Pejabat Pengesah</a></span>
            </div>
            <hr class="hidden">
        </div>
    </div>
</template>