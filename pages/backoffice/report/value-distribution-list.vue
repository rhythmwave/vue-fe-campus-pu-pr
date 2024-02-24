<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { ErrorRoot } from '~~/types/api/error';
import { GetReportStudentClassGradeListData, GetReportStudentClassGradeListGrade } from '~~/types/api/report/GetReportStudentClassGradeList';
import { getReportStudentClassGradeList } from '~~/composables/api/report/getReportStudentClassGradeList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetStudyProgramListData } from '~~/types/api/study-program/GetStudyProgramList';

definePageMeta({
    layout: "backoffice",
});

const store = useContactStore();

function definePageMeta(arg0: { layout: string; }) {
    throw new Error('Function not implemented.');
}
const page = ref({ title: 'Daftar Distribusi Nilai' });
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Daftar Distribusi Nilai',
        disabled: true,
        href: '#'
    }
]);

onMounted(async () => {
    await refresh()
});

async function refresh() {
    await getSemesterData()
    await getStudyProgramData()
}

const semester_id = ref('')
const study_program_id = ref('')
const semesters = ref<GetSemesterListData[]>([])
const selectedSemester = ref(<GetSemesterListData>{});
async function getSemesterData() {
    try {
        const { response: resp, error: error } = await getSemesterList(100000, 1, '', '')
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
async function studentSemesterOnChange(id: any) {
    selectedSemester.value = semesters.value.filter((x) => { return x.id == id })[0]
    await getReportStudentClassGradeData()
}

const studyProgramss = ref<GetStudyProgramListData[]>([])
const selectedStudyProgram = ref(<GetStudyProgramListData>{});
async function getStudyProgramData() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(100000, 1, '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            studyProgramss.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function studyProgramOnChange(id: any) {
    selectedStudyProgram.value = studyProgramss.value.filter((x) => { return x.id == id })[0]
    await getReportStudentClassGradeData()
}

const reportStudentClassGrades = ref<GetReportStudentClassGradeListData[]>([])
const selectedReportStudentClassGrade = ref(<GetReportStudentClassGradeListData>{});
async function getReportStudentClassGradeData() {
    try {
        if (semester_id.value == '' || study_program_id.value == '') {
            reportStudentClassGrades.value = []
            return;
        }
        const { response: resp, error: error } = await getReportStudentClassGradeList(semester_id.value, study_program_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            reportStudentClassGrades.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

function MouseOver(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any) {
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>

<template>
    <div>
        <BackofficeBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard title="Pencarian Rekapitulasi Status Akademik Mahasiswa">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-select v-model="semester_id" item-value="id" variant="outlined" hide-details
                                :items="semesters" label="Pilih Semester"
                                @update:model-value="(sl: any) => studentSemesterOnChange(sl)">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
                                </template>
                                <template v-slot:item="{ item, props: { onClick, title, value } }">
                                    <ul>
                                        <li style="padding: 10px; margin: 2px;">
                                            <a href="javascript:void(0)" style="text-decoration: none; color: black;"
                                                @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                <span @click="onClick">{{ title.school_year }} - {{ title.semester_type
                                                }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="studyProgramss" item-value="id"
                                item-title="name" label="Program Studi" v-model="study_program_id"
                                @update:model-value="(c: any) => studyProgramOnChange(c)"></v-select>
                        </v-col>
                        <v-col cols="12" lg="8" md="6" class="text-right">
                            <v-btn color="primary" v-bind="props" flat class="ml-auto" target="_blank"
                                :to="'/backoffice/report/prints/value-distribution-list/' +study_program_id+'/'+ semester_id"
                                :disabled="!reportStudentClassGrades.length">
                                <v-icon class="mr-2">mdi-printer</v-icon>Print
                            </v-btn>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5" v-if="reportStudentClassGrades.length">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Matakuliah</th>
                    <th class="text-subtitle-1 font-weight-semibold" v-for="s in reportStudentClassGrades[0].grades">{{
                        s.grade_code }}</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jumlah</th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="item, i in reportStudentClassGrades">
                    <td class="text-subtitle-1">{{ i + 1 }}</td>
                    <td class="text-subtitle-1">{{ item.subject_name }}</td>
                    <td class="text-subtitle-1" v-for="s in item.grades">{{ s.total }}</td>
                    <td class="text-subtitle-1">{{ item.grades.map((g) => g.total).reduce((a, b) => a + b, 0) }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>