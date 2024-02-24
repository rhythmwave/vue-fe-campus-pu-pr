<script setup lang="ts">
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import moment from 'moment';
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week';
import { convertTimeNumberToString } from '~~/utils/helpers/convert-time-number-to-string';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';

import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { GetStudentClassList } from '~~/types/api/student-class/GetStudentClassList1';
import { GetStudentClassRequest } from '~~/types/api/student-class/GetStudentClassRequest1';
import { GetStudentListRequest } from '~~/types/api/student/GetStudentList';
import { GetStudentListData } from '~~/types/api/student/GetStudentList';
import { GetStudentDetailData } from '~~/types/api/student/GetStudentDetail';

import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getStudentClassList } from '~~/composables/api/student-class/getStudentClassList1';
import { getStudentList } from '~~/composables/api/student/getStudentList';
import { getStudentDetail } from '~~/composables/api/student/getStudentDetail';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const study_program_id = ref('')
const semesters = ref(<GetSemesterListData[]>[])
const students = ref(<GetStudentListData[]>[])
const student_classes = ref(<GetStudentClassList[]>[])
const student_detail = ref(<GetStudentDetailData>{})

async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000, 1, study_program_id.value, '')
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
async function getStudent(semester_id: string) {
    try {
        const { response: resp, error: error } = await getStudentList(100000, 1, <GetStudentListRequest>{
            studyProgramId: study_program_id.value,
            studentForceFrom: '',
            studentForceTo: '',
            nimNumberFrom: '',
            nimNumberTo: '',
            name: '',
            address: '',
            regencyId: '',
            status: [],
            getAcademicGuidance: '',
            hasAuthentication: '',
            studyPlanSemesterId: semester_id,
            studyPlanIsApproved: true,
            studyPlanIsSubmitted: '',
            hasStudyPlan: true,
            statusSemesterId: '',
            isRegistered: '',
            hasPaid: '',
            isGraduateEligible: '',
            isThesisEligible: '',
            yudiciumSessionId: '',
        })
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            students.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function studentDetail(id: string) {
    try {
        const { response: resp, error: error } = await getStudentDetail(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            student_detail.value = resp?.data
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
            student_classes.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

interface Temp {
    [key: string]: ResultData[]
}
interface ResultData {
    semester_id: string
    student_id: string
    student_name: string
    student_nim_number: number
    student_force: number
    study_program_name: string
    academic_guidance_lecturer_name: string
    semester_school_year: string
    semester_type: string
    data: ResultDataDetail[]
}
interface ResultDataDetail {
    id: string
    class_id: string
    class_name: string
    subject_id: string
    subject_code: string
    subject_name: string
    subject_total_credit: number
    subject_repetition: number
    monday_schedules: ScheduleDataDetail
    tuesday_schedules: ScheduleDataDetail
    wednesday_schedules: ScheduleDataDetail
    thursday_schedules: ScheduleDataDetail
    friday_schedules: ScheduleDataDetail
    saturday_schedules: ScheduleDataDetail
    sunday_schedules: ScheduleDataDetail
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
}

interface ScheduleDataDetail {
    start_time: number
    end_time: number
    room_id: string
    room_name: string
}

interface ResultSummary {
    [key: string]: number
}

const arr_student_classes = ref(<Temp>{})
const summary_sks = ref(<ResultSummary>{})
const summary_grade_sks = ref(<ResultSummary>{})
const summary_grade = ref(<ResultSummary>{})
const student_ids = ref(<string[]>[])

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
onMounted(async () => {
    study_program_id.value = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1]
    let href = window.location.search.replaceAll('?', '').split('&')
    for (let index = 0; index < href.length; index++) {
        const element = href[index];
        if (element.search('student_id') > -1) {
            student_ids.value.push(element.replaceAll('student_id=', ''))
        }
    }
    await getSemester()

    let temp = <Temp>{}

    for (let index = 0; index < student_ids.value.length; index++) {
        const student = student_ids.value[index];
        await studentDetail(student)
        for (let index = 0; index < semesters.value.length; index++) {
            let semester = semesters.value[index];
            await getStudentClass(student_detail.value.id, semester.id)
            if (!temp[student_detail.value.id]) {
                let data = <ResultDataDetail[]>[]
                //summary
                let summary = <number[]>[]
                let summaryGradeSks = <number[]>[]
                let summaryGrade = <number[]>[]
                for (let i = 0; i < student_classes.value.length; i++) {
                    const student_class = student_classes.value[i];
                    data.push(<ResultDataDetail>{
                        id: student_class.id,
                        class_id: student_class.class_id,
                        class_name: student_class.class_name,
                        subject_id: student_class.subject_id,
                        subject_code: student_class.subject_code,
                        subject_name: student_class.subject_name,
                        subject_total_credit: student_class.subject_total_credit,
                        subject_repetition: student_class.subject_repetition,
                        monday_schedules: student_class.monday_schedules,
                        tuesday_schedules: student_class.tuesday_schedules,
                        wednesday_schedules: student_class.wednesday_schedules,
                        thursday_schedules: student_class.thursday_schedules,
                        friday_schedules: student_class.friday_schedules,
                        saturday_schedules: student_class.saturday_schedules,
                        sunday_schedules: student_class.sunday_schedules,
                        total_attendance: student_class.total_attendance,
                        total_sick: student_class.total_sick,
                        total_leave: student_class.total_leave,
                        total_awol: student_class.total_awol,
                        grade_point: student_class.grade_point,
                        grade_code: student_class.grade_code,
                        graded_by_admin_id: student_class.graded_by_admin_id,
                        graded_by_admin_name: student_class.graded_by_admin_name,
                        graded_by_lecturer_id: student_class.graded_by_lecturer_id,
                        graded_by_lecturer_name: student_class.graded_by_lecturer_name,
                        graded_at: student_class.graded_at,
                        attendance_percentage: student_class.attendance_percentage,
                        total_lecture: student_class.total_lecture,
                        subject_is_mandatory: student_class.subject_is_mandatory,
                    })
                    //summary
                    summary[i] = student_class.subject_total_credit
                    summaryGradeSks[i] = student_class.subject_total_credit * student_class.grade_point
                    summaryGrade[i] = student_class.grade_point
                }
                temp[student_detail.value.id] = [<ResultData>{
                    semester_id: semester.id,
                    student_id: student_detail.value.id,
                    student_name: student_detail.value.name,
                    student_nim_number: student_detail.value.nim_number,
                    student_force: student_detail.value.student_force,
                    study_program_name: student_detail.value.study_program_name,
                    academic_guidance_lecturer_name: student_detail.value.academic_guidance_lecturer_name,
                    semester_school_year: semester.school_year,
                    semester_type: semester.semester_type,
                    data: data
                }]

                //summary
                summary_sks.value[student_detail.value.id] = summary.reduce((a, b) => a + b, 0)
                summary_grade_sks.value[student_detail.value.id] = summaryGradeSks.reduce((a, b) => a + b, 0)
                summary_grade.value[student_detail.value.id] = summaryGrade.reduce((a, b) => a + b, 0) / summaryGrade.length
            } else {
                let data = <ResultDataDetail[]>[]
                //summary
                let summary = <number[]>[]
                let summaryGradeSks = <number[]>[]
                let summaryGrade = <number[]>[]
                for (let i = 0; i < student_classes.value.length; i++) {
                    const student_class = student_classes.value[i];
                    data.push(<ResultDataDetail>{
                        id: student_class.id,
                        class_id: student_class.class_id,
                        class_name: student_class.class_name,
                        subject_id: student_class.subject_id,
                        subject_code: student_class.subject_code,
                        subject_name: student_class.subject_name,
                        subject_total_credit: student_class.subject_total_credit,
                        subject_repetition: student_class.subject_repetition,
                        monday_schedules: student_class.monday_schedules,
                        tuesday_schedules: student_class.tuesday_schedules,
                        wednesday_schedules: student_class.wednesday_schedules,
                        thursday_schedules: student_class.thursday_schedules,
                        friday_schedules: student_class.friday_schedules,
                        saturday_schedules: student_class.saturday_schedules,
                        sunday_schedules: student_class.sunday_schedules,
                        total_attendance: student_class.total_attendance,
                        total_sick: student_class.total_sick,
                        total_leave: student_class.total_leave,
                        total_awol: student_class.total_awol,
                        grade_point: student_class.grade_point,
                        grade_code: student_class.grade_code,
                        graded_by_admin_id: student_class.graded_by_admin_id,
                        graded_by_admin_name: student_class.graded_by_admin_name,
                        graded_by_lecturer_id: student_class.graded_by_lecturer_id,
                        graded_by_lecturer_name: student_class.graded_by_lecturer_name,
                        graded_at: student_class.graded_at,
                        attendance_percentage: student_class.attendance_percentage,
                        total_lecture: student_class.total_lecture,
                        subject_is_mandatory: student_class.subject_is_mandatory,
                    })
                    //summary
                    summary[i] = student_class.subject_total_credit
                    summaryGradeSks[i] = student_class.subject_total_credit * student_class.grade_point
                    summaryGrade[i] = student_class.grade_point
                }
                temp[student_detail.value.id].push(<ResultData>{
                    semester_id: semester.id,
                    student_id: student_detail.value.id,
                    student_name: student_detail.value.name,
                    student_nim_number: student_detail.value.nim_number,
                    student_force: student_detail.value.student_force,
                    study_program_name: student_detail.value.study_program_name,
                    academic_guidance_lecturer_name: student_detail.value.academic_guidance_lecturer_name,
                    semester_school_year: semester.school_year,
                    semester_type: semester.semester_type,
                    data: data
                })

                //summary
                summary_sks.value[student_detail.value.id] = summary.reduce((a, b) => a + b, 0)
                summary_grade_sks.value[student_detail.value.id] = summaryGradeSks.reduce((a, b) => a + b, 0)
                summary_grade.value[student_detail.value.id] = summaryGrade.reduce((a, b) => a + b, 0) / summaryGrade.length
            }
        }
    }
    arr_student_classes.value = temp
    await delay(1000)
    window.print()
})
</script>
<template>
    <div v-for="it in student_ids">
        <table class="table" v-for="itm, indx in arr_student_classes[it]">
            <thead>
                <tr v-if="indx == 0">
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_dinas.jpg" style="width: 100%;" />
                    </th>
                    <th colspan="6">
                        <p style="letter-spacing: 1px">KEMENTERIAN PEKERJAAN UMUM DAN PERUMAHAN RAKYAT</p>
                        <p style="letter-spacing: 0px">BADAN PENGEMBANGAN SUMBER DAYA MANUSIA</p>
                        <p style="letter-spacing: 7px"><b>POLITEKNIK PEKERJAAN UMUM</b></p>
                        <p style="letter-spacing: 0px">Jalan Prof. Soedarto, SH No.15 Tembalang, Semarang 50275,
                            Telp/Fax.024-7472848</p>
                        <p style="letter-spacing: 1.5px">Web : www.politeknikpu.ac.id, e-mail : info@politeknikpu.ac.id</p>
                    </th>
                    <th width="100">
                        <img src="~/assets/img/logo_poltek_pu_semarang.png" style="width: 100%;" />
                    </th>
                </tr>
                <tr v-if="indx == 0">
                    <th width="100"></th>
                    <th width="100"></th>
                    <th colspan="6"></th>
                </tr>
                <tr v-if="indx == 0">
                    <th></th>
                    <th colspan="6">
                        <p><b>REKAP KARTU HASIL STUDI</b></p>
                    </th>
                    <th></th>
                </tr>
                <tr style="text-align: left;" v-if="indx == 0">
                    <th colspan="2">
                        <p>Nama Mahasiswa</p>
                        <p>Nomor Induk Mahasiswa</p>
                        <p>Angkatan</p>
                        <p>Program Studi</p>
                        <p>Pembimbing Akademik</p>
                    </th>
                    <th>
                        <p>: {{ itm.student_name }}</p>
                        <p>: {{ itm.student_nim_number }}</p>
                        <p>: {{ itm.student_force }}</p>
                        <p>: {{ itm.study_program_name }}</p>
                        <p>: {{ itm.academic_guidance_lecturer_name }}</p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th colspan="2">
                        <p><b>{{ itm.semester_type }} {{ itm.semester_school_year }}</b></p>
                    </th>
                </tr>
                <tr style="text-align: left;">
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No
                    </th>
                    <th colspan="2" class="font-size-10 head-title" style="text-align: center;">Mata Kuliah</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">SKS
                    </th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">KE
                    </th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">
                        Nilai</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">
                        Bobot</th>
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">
                        Nilai SKS</th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title">Kode</th>
                    <th class="font-size-10 head-title">Nama</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in itm.data">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.subject_code }}</td>
                    <td>{{ item.subject_name }}</td>
                    <td>{{ item.subject_total_credit }}</td>
                    <td>{{ item.subject_repetition }}</td>
                    <td>{{ item.grade_code }}</td>
                    <td>{{ item.grade_point }}</td>
                    <td>{{ item.subject_total_credit * item.grade_point }}</td>
                </tr>
                <tr>
                    <td class="text-right" colspan="3">Jumlah</td>
                    <td>{{ summary_sks[it] }}</td>
                    <td colspan="3"></td>
                    <td>{{ summary_grade_sks[it] }}</td>
                </tr>
                <tr style="border:0">
                    <td style="border:0" colspan="2">
                        <p>Jumlah Sks Semester</p>
                        <p>IP Semester (IPS)</p>
                        <p>Jumlah Sks Kumulatif</p>
                        <p>IP Kumulatif (IPK)</p>
                        <p>Maks. Beban sks semester berikutnya</p>
                    </td>
                    <td style="border:0">
                    <td>: {{ summary_sks[it] }}</td>
                    <p>: {{ isNaN(summary_grade[it]) ? 0 : summary_grade[it] }}</p>
                    <p>: 0</p>
                    <p>: 0</p>
                    <p>: 0</p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
table {
    font-family: 'Tahoma' !important;
    font-size: 10px;
}

table>thead>tr>th {
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

.table>thead>tr>th,
.table>tbody>tr>th,
.table>tfoot>tr>th,
.table>thead>tr>td,
.table>tbody>tr>td,
.table>tfoot>tr>td {
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

.table>tbody>tr>td {
    border: 1px solid #2d2d2d;
}

table {
    border-spacing: 0;
    border-collapse: collapse;
}

td,
th {
    padding: 0;
}

th {
    font-weight: 400;
}

.table {
    border-collapse: collapse !important;
}

.table td,
.table th {
    background-color: #fff !important;
}

.font-size-10 {
    font-size: 10px;
}

/* table { 
    page-break-inside:avoid;
    page-break-after: always;
} */</style>