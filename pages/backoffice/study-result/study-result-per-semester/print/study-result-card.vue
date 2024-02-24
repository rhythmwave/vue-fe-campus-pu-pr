<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import moment from 'moment';
import { convertMonthToTextString } from '~~/utils/helpers/date-utils';

import { GetSemesterDetailData } from '~~/types/api/semester/GetSemesterDetail';
import { GetStudentClassRequest } from '~~/types/api/student-class/GetStudentClassRequest1';
import { GetStudentClassList } from '~~/types/api/student-class/GetStudentClassList1';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';

import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';
import { getSemesterDetail } from '~~/composables/api/semester/getSemesterDetail';
import { getStudentClassList } from '~~/composables/api/student-class/getStudentClassList1';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

interface ArrayStudentClass {
    [key: string]: StudentClass[]
}

interface SummaryTotalCredit {
    [key: string]: number[]
}

interface StudentClass {
    id: string
    class_id: string
    class_name: string
    subject_id: string
    subject_code: string
    subject_name: string
    subject_total_credit: number
    subject_repetition: number
    monday_schedules: ScheduleData
    tuesday_schedules: ScheduleData
    wednesday_schedules: ScheduleData
    thursday_schedules: ScheduleData
    friday_schedules: ScheduleData
    saturday_schedules: ScheduleData
    sunday_schedules: ScheduleData
    total_attendance: number
    total_sick: number
    total_leave: number
    total_awol: number
    grade_point: number
    grade_code: string
    graded_by_admin_id: string
    graded_by_admin_name: string
    graded_by_lecturer_id: string
    graded_by_lecturer_name: string
    graded_at: string
    attendance_percentage: number
    total_lecture: number
    subject_is_mandatory: boolean
    student_id: string
}

interface ScheduleData {
    start_time: number
    end_time: number
    room_id: string
    room_name: string
}

const semester_id = ref('')
const student_ids = ref(<string[]>[])
const detail_semester = ref(<GetSemesterDetailData>{})
const detail_student = ref(<GetStudentDetailData>{})
const detail_students = ref(<GetStudentDetailData[]>[])
const studentClasses = ref(<GetStudentClassList[]>[])
const arrStudentClasses = ref(<StudentClass[]>[])
const resultStudentClasses = ref(<ArrayStudentClass>{})
const summaryTotalCredit = ref(<SummaryTotalCredit>{})
const resultSummaryTotalCredit = ref(0)

async function studentDetail(id: string) {
  try {
    const { response: resp, error: error } = await getStudentDetail(id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      detail_student.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}
async function semesterDetail(id: string) {
  try {
    const { response: resp, error: error } = await getSemesterDetail(id)
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      detail_semester.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

async function getStudentClass(student_id: string, semester_id: string) {
  try {
    const { response: resp, error: error } = await getStudentClassList(100000, 1, '', <GetStudentClassRequest>{
      studyPlanId: '',
      studentId: student_id,
      semesterId: semester_id
  })
    if (error) {
      let dataError = <ErrorRoot>error;
      alert(dataError.meta.message);
      return;
    }
    if (resp != null) {
      studentClasses.value = resp?.data
    }
  } catch (error) {
    alert(error)
  }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async () => {
    let href = window.location.search.replaceAll('?', '').split('&')
    for (let index = 0; index < href.length; index++) {
        const element = href[index];
        if(element.search('semester_id') > -1){
            semester_id.value = element.replaceAll('semester_id=', '')
        }
        if(element.search('student_id') > -1){
            student_ids.value.push(element.replaceAll('student_id=', ''))
        }
        
    }
    await semesterDetail(semester_id.value)
    for (let index = 0; index < student_ids.value.length; index++) {
        await getStudentClass(student_ids.value[index], semester_id.value)
        for (let i = 0; i < studentClasses.value.length; i++) {
            await studentDetail(student_ids.value[index])
            const found = detail_students.value.some(el => el.id === student_ids.value[index]);
            if(!found){
                detail_students.value.push(detail_student.value)
            }
            arrStudentClasses.value.push(<StudentClass>{
                id: studentClasses.value[i].id,
                class_id: studentClasses.value[i].class_id,
                class_name: studentClasses.value[i].class_name,
                subject_id: studentClasses.value[i].subject_id,
                subject_code: studentClasses.value[i].subject_code,
                subject_name: studentClasses.value[i].subject_name,
                subject_total_credit: studentClasses.value[i].subject_total_credit,
                subject_repetition: studentClasses.value[i].subject_repetition,
                monday_schedules: studentClasses.value[i].monday_schedules,
                tuesday_schedules: studentClasses.value[i].tuesday_schedules,
                wednesday_schedules: studentClasses.value[i].wednesday_schedules,
                thursday_schedules: studentClasses.value[i].thursday_schedules,
                friday_schedules: studentClasses.value[i].friday_schedules,
                saturday_schedules: studentClasses.value[i].saturday_schedules,
                sunday_schedules: studentClasses.value[i].sunday_schedules,
                total_attendance: studentClasses.value[i].total_attendance,
                total_sick: studentClasses.value[i].total_sick,
                total_leave: studentClasses.value[i].total_leave,
                total_awol: studentClasses.value[i].total_awol,
                grade_point: studentClasses.value[i].grade_point,
                grade_code: studentClasses.value[i].grade_code,
                graded_by_admin_id: studentClasses.value[i].graded_by_admin_id,
                graded_by_admin_name: studentClasses.value[i].graded_by_admin_name,
                graded_by_lecturer_id: studentClasses.value[i].graded_by_lecturer_id,
                graded_by_lecturer_name: studentClasses.value[i].graded_by_lecturer_name,
                graded_at: studentClasses.value[i].graded_at,
                attendance_percentage: studentClasses.value[i].attendance_percentage,
                total_lecture: studentClasses.value[i].total_lecture,
                subject_is_mandatory: studentClasses.value[i].subject_is_mandatory,
                student_id: student_ids.value[index],
            })
        }
    }
    let temp:ArrayStudentClass = {}
    let tempSummary:SummaryTotalCredit = {}
    for (let index = 0; index < arrStudentClasses.value.length; index++) {
        if(!temp[arrStudentClasses.value[index].student_id]){
            temp[arrStudentClasses.value[index].student_id] = [arrStudentClasses.value[index]]
        }else{
            temp[arrStudentClasses.value[index].student_id].push(arrStudentClasses.value[index])
        }
        
        if(!tempSummary[arrStudentClasses.value[index].student_id]){
            tempSummary[arrStudentClasses.value[index].student_id] = [arrStudentClasses.value[index].subject_total_credit]
        }else{
            tempSummary[arrStudentClasses.value[index].student_id].push(arrStudentClasses.value[index].subject_total_credit)
        }
    }
    resultStudentClasses.value = temp
    summaryTotalCredit.value = tempSummary
    for (let index = 0; index < student_ids.value.length; index++) {
        resultSummaryTotalCredit.value = summaryTotalCredit.value[student_ids.value[index]].reduce((a, b) => a + b, 0)
    }
    await delay(1000)
    window.print()
})
</script>
<template>
    <div>
        <table class="table" v-for="(itm, indx) in detail_students">
            <thead>
                <tr>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_dinas.jpg" style="width: 100%;" />
                    </th>
                    <th colspan="6">
                        <p style="letter-spacing: 1px">KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT</p>
                        <p style="letter-spacing: 0px">BADAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                        <p style="letter-spacing: 7px"><b>POLITEKNIK PEKERJAAN UMUM</b></p>
                        <p style="letter-spacing: 0px">Jalan Prof. Soedarto, SH No.15 Tembalang, Semarang 50275, Telp/Fax.024-7472848</p>
                        <p style="letter-spacing: 1.5px">Web : www.politeknikpu.ac.id, e-mail : info@politeknikpu.ac.id</p>
                    </th>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_semarang.png" style="width: 100%;" />
                    </th>
                </tr>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                <tr>
                    <th colspan="8">
                        <p><b>KARTU HASIL STUDI (KHS)</b></p>
                        <p><b>Prodi {{ itm.study_program_name }}</b></p>
                    </th>
                </tr>
                <tr>
                    <th colspan="2" class="text-left">
                        <p>Nama Mahasiswa</p>
                        <p>NIM</p>
                        <p>Dosen Wali</p>
                    </th>
                    <th class="text-left">
                        <p>: {{ itm.name }}</p>
                        <p>: {{ itm.nim_number }}</p>
                        <p>: Semester {{ detail_semester.school_year }} {{ detail_semester.semester_type }}</p>
                    </th>
                    <th colspan="2"></th>
                    <th class="text-left">
                        <p>Smt/Smtkum</p>
                        <p>TA Akademik</p>
                    </th>
                    <th colspan="2"  class="text-left">
                        <p>: {{ detail_semester.semester_type }}</p>
                        <p>: {{ detail_semester.school_year }}</p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">KODE MK</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">MATA KULIAH</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">S</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">NH</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">NB</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">SKS</th>
                    <th class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">SKS X NB</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in resultStudentClasses[itm.id]">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_code }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>S</td>
                    <td>NH</td>
                    <td>NB</td>
                    <td>{{ item.subject_total_credit }}</td>
                    <td>SKS X NB</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td>Jumlah SKS</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr style="border:0">
                    <td style="border:0" colspan="2">
                        <p>IP Semester</p>
                        <p>IP Kumulatif</p>
                        <p>SKS Kumulatif</p>
                    </td>
                    <td style="border:0">
                        <p>: 0</p>
                        <p>: 0</p>
                        <p>: 0</p>
                    </td>
                    <td style="border:0" colspan="2">
                        <p>S</p>
                        <p>NH</p>
                        <p>NB</p>
                    </td>
                    <td style="border:0">
                        <p>: Status</p>
                        <p>: Nilai Huruf</p>
                        <p>: Nilai Bobot</p>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6"></td>
                    <td colspan="2" class="text-right">
                        <div class="text-center" style="margin: 0px 50px 0px 0px;">
                            <p>Semarang, {{ new Date().getDate() }}, {{ convertMonthToTextString(new Date().getMonth() + 1) }} {{ new Date().getFullYear() }}</p>
                            <p>Dosen Wali</p>
                            <p style="margin-top: 100px; border-bottom:1px solid">{{itm.academic_guidance_lecturer_name}}</p>
                            <p>NIDN: -</p>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Tembusan :</p>
                        <p>1. Mahasiswa ybs</p>
                        <p>2. Orangtua Mahasiswa</p>
                        <p>3. Dosen Wali</p>
                        <p>4. Arsip Akademik</p>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
<style scoped>
table {
    font-family: 'Tahoma' !important;
    font-size: 10px;
}
table > thead > tr > th {
    font-size: 12px;
}
table {
    background-color: transparent;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
}
.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
}
.head-title {
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    border: 1px solid #2d2d2d;
}
.table > tbody > tr > td {
    border: 1px solid #2d2d2d;
}
table {
    border-spacing: 0;
    border-collapse: collapse;
}
td, th {
    padding: 0;
}
th {
    font-weight: 400;
}
.table {
    border-collapse: collapse !important;
}
.table td, .table th {
    background-color: #fff !important;
}
.font-size-10{
    font-size: 10px;
}
table { 
    page-break-inside:avoid;
    page-break-after: always;
}
</style>