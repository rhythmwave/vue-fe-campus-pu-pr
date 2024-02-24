<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { ErrorRoot } from '~~/types/api/error';
import { GetReportStudentProvinceListData } from '~~/types/api/report/GetReportStudentProvinceList';
import { getReportStudentProvinceList } from '~~/composables/api/report/getReportStudentProvinceList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetStudyProgramListData } from '~~/types/api/study-program/GetStudyProgramList';

definePageMeta({
    layout: "backoffice",
});

const store = useContactStore();

function definePageMeta(arg0: { layout: string; }) {
    throw new Error('Function not implemented.');
}
const page = ref({ title: 'Daftar Distribusi Mahasiswa Daerah' });
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Daftar Distribusi Mahasiswa Daerah',
        disabled: true,
        href: '#'
    }
]);

onMounted(async () => {
    await refresh()
});

async function refresh() {
    let years = [];
    for (var i = 2015; i <= new Date().getFullYear(); i++) {
        years.push(i.toString())
    }
    studentYears.value = years
    await getStudyProgramData()
}

const student_force_to = ref("")
const student_force_from = ref("")

const study_program_id = ref('')
const studentYears = ref(<string[]>[])

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
    await getReportStudentProvinceData()
}

const reportStudentProvinces = ref<GetReportStudentProvinceListData[]>([])
const selectedReportStudentProvince = ref(<GetReportStudentProvinceListData>{});
async function getReportStudentProvinceData() {
    try {
        if (study_program_id.value == '' || student_force_from.value == '' || student_force_to.value == '') {
            reportStudentProvinces.value = []
            return;
        }
        const { response: resp, error: error } = await getReportStudentProvinceList(study_program_id.value, student_force_from.value, student_force_to.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            reportStudentProvinces.value = resp?.data
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
                        <v-col cols="12" sm="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="studyProgramss" item-value="id"
                                item-title="name" label="Program Studi" v-model="study_program_id"
                                @update:model-value="(c: any) => studyProgramOnChange(c)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="studentYears" item-value="id"
                                item-title="name" label="Dari Tahun" v-model="student_force_from"
                                @update:model-value="(c: any) => getReportStudentProvinceData()"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="studentYears" item-value="id"
                                item-title="name" label="Sampai Tahun" v-model="student_force_to"
                                @update:model-value="(c: any) => getReportStudentProvinceData()"></v-select>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-btn color="primary" v-bind="props" flat class="ml-auto" target="_blank"
                                :to="'/backoffice/report/prints/student-distribution-list/' + study_program_id + '?from='+student_force_from+'&to='+student_force_to"
                                :disabled="!reportStudentProvinces.length">
                                <v-icon class="mr-2">mdi-printer</v-icon>Print
                            </v-btn>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5" v-if="reportStudentProvinces.length">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
                    <th class="text-subtitle-1 font-weight-semibold">Provinsi</th>
                    <th v-for="sf in reportStudentProvinces[0].student_forces">
                        {{ sf.student_force }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, i in reportStudentProvinces">
                    <td class="text-subtitle-1">{{ i + 1 }}</td>
                    <td class="text-subtitle-1"></td>
                    <td class="text-subtitle-1">{{ item.province_name }}</td>
                    <td class="text-subtitle-1 text-center" v-for="sf in item.student_forces">{{ sf.total }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>