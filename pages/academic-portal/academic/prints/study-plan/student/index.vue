<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { FunctionRule } from 'v-calendar/dist/types/src/utils/date/rules';
import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';
import { GetOfferedClassClassData, GetOfferedClassData } from '~~/types/api/academic-portal-student-offered-class/GetOfferedClass';
import { GetHomePageSemesterSummaryData } from '~~/types/api/general-student/GetHomePageSemesterSummary';
import { getHomePageSemesterSummary } from '~~/composables/api/general-student/getHomePageSemesterSummary';
import { GetActiveSemesterClassListData } from '~~/types/api/lecturer-class/GetActiveSemesterClassList';
import { getActiveSemesterClassList } from '~~/composables/api/lecturer-class/getActiveSemesterClassList';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';
import { getOfferedClass } from '~~/composables/api/academic-portal-offered-class/getOfferedClass';
import { getAcademicPortalStudentGeneralProfile } from '~~/composables/api/academic-portal-student-general/getAcademicPortalStudentGeneralProfile';
import { GetAcademicPortalStudentGeneralProfileData } from '~~/types/api/academic-portal-student-general/GetAcademicPortalStudentGeneralProfile';
import { getStudyPlan } from '~~/composables/api/academic-portal-student-study-plan/getStudyPlan';
import { GetStudyPlanData } from '~~/types/api/academic-portal-student-study-plan/GetStudyPlan';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    studyProgramName.value = urlParams.get('studyProgramName') ?? '';
    await getStudyPlanData()
    await getOfferedClassData(getStudyPlans.value.id)
    await delay(1000)
    window.print()
})

const studyProgramName = ref('')

const offeredClasses = ref(<GetOfferedClassData[]>[])
async function getOfferedClassData(studyPlanId: string) {
    try {
        const { response: resp, error: error } = await getOfferedClass(studyPlanId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            offeredClasses.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

const getStudyPlans = ref(<GetStudyPlanData>{})
async function getStudyPlanData() {
    try {
        const { response: resp, error: error } = await getStudyPlan()
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getStudyPlans.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function sumOfSks(data: GetOfferedClassClassData[]) {
    return data.reduce((sum, d) => {
        return sum += d.subject_theory_credit;
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
        <!-- CETAK KARTU RENCANA STUDI v1 >> Sama dengan cetak BO -->
        <link rel="stylesheet" type="text/css" href="styles/css_hacked_cetak_krs.css">
        <link rel="stylesheet" type="text/css" media="print" href="styles/a_sia_cetak_media_print_new.css">

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


                <u>
                    <h3 align="center">KARTU RENCANA STUDI (KRS)</h3>
                </u>
                <table class="tabel-info" width="100%">
                    <tbody>
                        <tr>
                            <td colspan="6">&nbsp;</td>
                        </tr>
                        <tr>
                            <td width="10%" nowrap="nowrap">Nama</td>
                            <td width="1%">:</td>
                            <td width="33%">{{ getStudyPlans.student_name }}</td>
                            <td width="10%" nowrap="nowrap">Program Studi</td>
                            <td width="1%">:</td>
                            <td>{{ getStudyPlans.study_program_name }}</td>
                        </tr>
                        <tr>
                            <td nowrap="nowrap">NIM</td>
                            <td nowrap="nowrap">:</td>
                            <td nowrap="nowrap">{{ getStudyPlans.student_nim_number }}</td>
                            <td nowrap="nowrap">Strata/Jenjang </td>
                            <td nowrap="nowrap">:</td>
                            <td nowrap="nowrap"></td>
                        </tr>
                        <tr>
                            <td nowrap="nowrap">Semester</td>
                            <td nowrap="nowrap">:</td>
                            <td nowrap="nowrap">{{ getStudyPlans.semester_type }} {{ getStudyPlans.semester_school_year }}
                            </td>
                            <td nowrap="nowrap">Angkatan</td>
                            <td nowrap="nowrap">:</td>
                            <td nowrap="nowrap"></td>
                        </tr>
                        <!-- <tr> 
            <td nowrap ="nowrap"  valign="top" >Jenis Kelamin </td>
            <td nowrap ="nowrap"  valign="top" >:</td>        
            <td nowrap ="nowrap"  valign="top" >Perempuan</td>
          	<td  nowrap ="nowrap"  valign="top" >Fakultas</td>
            <td nowrap ="nowrap"  valign="top" >:</td>
            <td  valign="top">PUSAT</td>
        </tr> -->
                    </tbody>
                </table>
                <br>
                <table class="tabel-common" width="100%">
                    <tbody>
                        <tr>
                            <th width="3%">No</th>
                            <th width="10%">Kode MK</th>
                            <th width="10%" nowrap="">Nama Kelas</th>
                            <th>Matakuliah</th>
                            <!-- <th width="8%" >Teori (SKS)</th>
            <th width="8%" >Praktik (SKS)</th>
            <th width="8%" >Praktik Lapangan (SKS)</th> -->
                            <th width="5%">SKS</th>
                            <th width="33%">Dosen</th>
                        </tr>
                        <template v-for="oc, i in offeredClasses">
                            <tr height="20" v-for="c, j in oc.classes">
                                <td nowrap="nowrap" align="center" style="vertical-align:top">{{ (j) + 1 }}</td>
                                <td nowrap="nowrap" align="center" style="vertical-align:top">{{ c.subject_code }}</td>
                                <td nowrap="nowrap" align="center" style="vertical-align:top">{{ c.name }}</td>
                                <td style="vertical-align:top">
                                    <div class="nama">{{ c.subject_name }}</div>
                                </td>
                                <!-- <td nowrap ="nowrap" align="center" style="vertical-align:middle">1</td>
            <td nowrap ="nowrap" align="center" style="vertical-align:middle">1</td>
            <td nowrap ="nowrap" align="center" style="vertical-align:middle">0</td> -->
                                <td nowrap="nowrap" align="center" style="vertical-align:top">{{ c.subject_theory_credit }}
                                </td>
                                <td style="vertical-align:top"><template v-for="l in c.lecturers">{{ l.front_title }} {{
                                    l.name }} {{ l.back_degree }}<br></template>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4" class="right" align="center" style="vertical-align:middle"><strong>JUMLAH
                                        SKS
                                    </strong></td>
                                <!-- <td >&nbsp;</td>
            <td >&nbsp;</td>
            <td >&nbsp;</td> -->
                                <td align="center" style="vertical-align:middle"><strong>{{ sumOfSks(oc.classes) }}</strong></td>
                                <td colspan="7">&nbsp;</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <br>
            <table class="tabelFooter" width="100%">
                <tbody>
                    <tr>
                        <td width="auto"></td>
                        <td width="34%" align="center" nowrap="">
                            <span><br>Dosen Wali</span>
                            <br><br><br><br><br>
                            <span>{{ getStudyPlans.academic_guidance_lecturer_front_title }} {{
                                getStudyPlans.academic_guidance_lecturer_name }} {{
        getStudyPlans.academic_guidance_lecturer_back_degree }}</span><br>
                            NIDN:
                        </td>
                        <td width="20%" align="center" nowrap="">
                            &nbsp;
                        </td>
                        <td width="34%" align="center" nowrap="">
                            <span>Semarang, {{ new Date().getDate() }}, {{ convertMonthToTextString(new Date().getMonth() +
                                1) }} {{ new Date().getFullYear() }}</span><br>
                            <span>Mahasiswa</span>
                            <br><br><br><br><br>
                            <span>{{ getStudyPlans.student_name }}</span><br>&nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>

            <br><br>
            <span>
                Dibuat rangkap 4 (Empat) : <br>
                1. Warna Putih untuk BAAK <br>
                2. Warna Hijau untuk Dosen Pembimbing <br>
                3. Warna Merah untuk Mahasiswa <br>
                4. Warna Kuning untuk Program Studi <br>
            </span>

        </div>
    </div>
</template>