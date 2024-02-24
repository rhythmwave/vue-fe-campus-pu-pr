<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { FunctionRule } from 'v-calendar/dist/types/src/utils/date/rules';
import { getLecturerDetail } from '~~/composables/api/lecturer/getLecturerDetail';
import { ErrorRoot } from '~~/types/api/error';
import moment from 'moment';
import { GetStudyProgramDetailData } from '~~/types/api/study-program/GetStudyProgramDetail';
import { getAdminStudyProgramDetail } from '~~/composables/api/admin-study-program/getAdminStudyProgramDetail';
import { GetReportStudentProvinceListData } from '~~/types/api/report/GetReportStudentProvinceList';
import { getReportStudentProvinceList } from '~~/composables/api/report/getReportStudentProvinceList';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {
    study_program_id.value = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]

    const urlParams = new URLSearchParams(window.location.search);
    from.value = urlParams.get('from') ?? '';
    to.value = urlParams.get('to') ?? '';
    await getStudyProgramDetailData()
    await getReportStudentProvinceListData()
    await delay(1000)
    window.print()
})
const study_program_id = ref('')
const from = ref('')
const to = ref('')

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

const reportStudentProvinceLists = ref<GetReportStudentProvinceListData[]>([])
async function getReportStudentProvinceListData() {
    try {
        const { response: resp, error: error } = await getReportStudentProvinceList(study_program_id.value, from.value, to.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            reportStudentProvinceLists.value = resp?.data
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
						<td width="5%"><img src="../images/logo_client.png?1696731307" /></td>
						<td width="95%"><h1>POLITEKNIK PEKERJAAN UMUM</h1><h3>FAKULTAS : Semua Fakultas</h3></td>
					</tr>
				</table-->

                    <br>

                    <h2 align="center">DISTRIBUSI ASAL MAHASISWA PER PROPINSI</h2>
                    <h4 align="center">Program Studi {{ studyPrograms.name }}</h4>
                    <h4 align="center">Tahun {{ from }} - {{ to }}</h4><br>


                </div>

                <table class="tabel-common" align="center" width="100%" v-if="reportStudentProvinceLists.length != 0">
                    <tbody>
                        <tr align="center">
                            <th rowspan="2">No.</th>
                            <th rowspan="2" width="120">
                                Propinsi

                            </th>
                            <th :colspan="reportStudentProvinceLists[0].student_forces.length" align="center">Tahun</th>
                        </tr>
                        <tr>
                            <th v-for="sf in reportStudentProvinceLists[0].student_forces"><strong>{{ sf.student_force
                            }}</strong></th>
                        </tr>
                        <tr align="center" v-for="rsp, i in reportStudentProvinceLists">
                            <td>
                                {{ i + 1 }}
                            </td>
                            <td nowrap="nowrap" align="left">
                                <div style="width: 120; overflow: hidden;">{{ rsp.province_name }}<div></div>
                                </div>
                            </td>
                            <td v-for="sf in rsp.student_forces">{{ sf.total }}</td>

                        </tr>

                        <tr>
                            <td colspan="2" align="center"><b>Total</b></td>
                            <td align="center"
                                v-for="sf in reportStudentProvinceLists[0].student_forces.map((sf) => sf.student_force)">
                                <b>
                                    {{
                                        reportStudentProvinceLists.map((rsp) => rsp.student_forces.filter((s) => s.student_force
                                            == sf)[0].total).reduce((a, b) => a + b)
                                    }}
                                    <b>
                                    </b></b>
                            </td>

                        </tr>

                    </tbody>
                </table>
                <br>
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
                                Date().getMonth() + 1) }} {{ new Date().getFullYear() }} <br><span
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
                        href="../popup/pejabat/?act=43146822a7f35f045e8e233c25704648&amp;w=0&amp;x=TDdhMXA5b2ZyNmE5bjM%3D&amp;y=TTdlMW45Z2ZlNnQ5YTNoY3U4aTc%3D&amp;f=&amp;i=azdvMXM5b2ZuNmc5"
                        onclick="window.open('../popup/pejabat/?act=43146822a7f35f045e8e233c25704648&amp;w=0&amp;x=TDdhMXA5b2ZyNmE5bjM%3D&amp;y=TTdlMW45Z2ZlNnQ5YTNoY3U4aTc%3D&amp;f=&amp;i=azdvMXM5b2ZuNmc5','','height=600,resizable=yes,scrollbars=yes,width=750'); return false;">Ganti
                        Pejabat Pengesah</a></span>
            </div>
            <br>
        </div>


    </div>
</template>