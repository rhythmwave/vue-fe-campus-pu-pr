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

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});
onMounted(async () => {
    studyProgramId.value = window.location.href.split('/')[window.location.href.split('/').length - 3]
    semesterId.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
    classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await getClassroomDetailData(classId.value)
    await getStudentClassParticipants(10000000, 1, '', classId.value)
    await delay(1000)
    window.print()
})
const classId = ref('')
const studyProgramId = ref('')
const semesterId = ref('')
var pageLimit = 15;
const date = ref(new Date())
const studentClassParticipants = ref(<GetStudentClassParticipantData[]>[])

const pageStudentClassParticipants = ref(<GetStudentClassParticipantData[][]>[])
async function getStudentClassParticipants(limit: number, page: number, search: string, class_id: string) {
    try {
        const { response: resp, error: error } = await getStudentClassParticipantList(limit, page, search, class_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studentClassParticipants.value = resp?.data
            var div = Math.floor(studentClassParticipants.value.length / pageLimit)

            var mod = studentClassParticipants.value.length % pageLimit
            var page = div + (mod == 0 ? 0 : 1)
            for (var i = 0; i < page; i++) {
                var temp = <GetStudentClassParticipantData[]>[]
                var startIndex = ((i) * pageLimit);
                var endIndex = startIndex + pageLimit;

                if (mod != 0 && (i + 1) == page) {
                    endIndex = startIndex + mod;
                }
                for (var j = startIndex; j < endIndex; j++) {
                    temp.push(studentClassParticipants.value[j])
                }
                pageStudentClassParticipants.value.push(temp)
            }
        }
    } catch (error) {
        alert(error)
    }
}

const classroomDetails = ref(<GetClassroomDetail>{})
async function getClassroomDetailData(class_id: string) {
    try {
        const { response: resp, error: error } = await getClassroomDetail(class_id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classroomDetails.value = resp?.data
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

.box {
    border: 1px solid #000;
    height: 150px;
}
</style>
<template>
    <div class="page-portrait">
        <div class="nobreak">

            <div :class="page + 1 == pageStudentClassParticipants.length ? 'nobreak' : 'page-break'"
                v-for="pscp, page in pageStudentClassParticipants">
                <div style="text-align: right">Halaman {{ page + 1 }}</div>
                <br>

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
                                <span class="sp-web">Web : www.politeknikpu.ac.id, e-mail : info@politeknikpu.ac.id</span>
                            </td>
                            <td rowspan="2" class="cl-img">
                                <!-- <img src="../../images/logo_poltek_pu_semarang.png"> -->
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


                <h2 align="center">DAFTAR PRESENSI KULIAH</h2>
                <h4 align="center">Program Studi {{ classroomDetails.study_program_name }}</h4>
                <h4 align="center">Semester : {{ classroomDetails.semester_type }}
                    {{ classroomDetails.semester_start_year + "/" + (classroomDetails.semester_start_year + 1) }}
                </h4><br>

                <table class="tabel-info">
                    <tbody>
                        <tr>
                            <td nowrap="nowrap">Mata Kuliah</td>
                            <td nowrap="nowrap">:</td>
                            <td nowrap="nowrap">{{ classroomDetails.subject_name }}</td>
                        </tr>
                        <tr>
                            <td nowrap="nowrap">Nama Kelas</td>
                            <td nowrap="nowrap">:</td>
                            <td nowrap="nowrap">{{ classroomDetails.name }}</td>
                        </tr>
                        <tr>
                            <td nowrap="nowrap">Jumlah Peserta</td>
                            <td nowrap="nowrap">:</td>
                            <td nowrap="nowrap">{{ classroomDetails.total_participant }}</td>
                        </tr>
                        <tr>
                            <td nowrap="nowrap" valign="top">Dosen</td>
                            <td nowrap="nowrap" valign="top">:</td>
                            <td nowrap="nowrap" valign="top">
                                <span v-if="classroomDetails.lecturers" v-for="l, index in classroomDetails.lecturers">{{
                                    l.name }}<span v-if="index + 1 != classroomDetails.lecturers.length"><br />
                                    </span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table width="100%" class="tabel-common">
                    <tbody>
                        <tr>
                            <th rowspan="2">No.</th>
                            <th rowspan="2">NIM</th>
                            <th rowspan="2">Nama</th>
                            <th colspan="7">Nilai Asal</th>
                            <th rowspan="2" width="6%">Absolut</th>
                            <th rowspan="2" width="6%">Relatif</th>
                        </tr>
                        <tr>
                            <th width="5%">Kehadiran</th>
                            <th width="5%">Tugas</th>
                            <th width="5%">UTS</th>
                            <th width="5%">UAS</th>
                            <th width="5%">Praktikum</th>
                            <th width="5%">Sikap</th>
                            <th width="5%">Kuis</th>

                        </tr>

                        <tr v-for="scp, i in pscp">
                            <td>{{ i + 1 }}</td>
                            <td nowrap="nowrap">{{ scp.student_nim_number }}</td>
                            <td nowrap="nowrap">
                                <div>{{ scp.student_nim_number }}</div>
                            </td>
                            <td align="center" width="6%"></td>
                            <td align="center" width="6%"></td>
                            <td align="center" width="6%"></td>
                            <td align="center" width="6%"></td>
                            <td align="center" width="6%"></td>
                            <td align="center" width="6%"></td>
                            <td align="center" width="6%"></td>
                            <td align="center" width="6%"></td>
                            <td align="center" width="6%"></td>
                        </tr>n 
                    </tbody>
                </table>
                <hr class="hidden">
            </div>
            <div>
                <table align="right" width="100%">
                    <tbody>
                        <tr>
                            <td width="70%" rowspan="3">&nbsp;</td>
                            <td align="center">Semarang, {{ moment(date).format("D MMMM YYYY") }}<br><span
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
                        href="../../popup/pejabat/?act=ce086f8e48c6e77c1e1fb546eaaeddf0&amp;w=0&amp;x=UDVyNWVhc2NlNW44c2RpYSA2SzdlM2wwYTJzMQ%3D%3D&amp;y=TTVlNW5hZ2NlNXQ4YWRoYXU2aTc%3D&amp;f="
                        onclick="window.open('../../popup/pejabat/?act=ce086f8e48c6e77c1e1fb546eaaeddf0&amp;w=0&amp;x=UDVyNWVhc2NlNW44c2RpYSA2SzdlM2wwYTJzMQ%3D%3D&amp;y=TTVlNW5hZ2NlNXQ4YWRoYXU2aTc%3D&amp;f=','','height=600,resizable=yes,scrollbars=yes,width=750'); return false;">Ganti
                        Pejabat Pengesah</a></span>
            </div>


        </div>

    </div>
</template>