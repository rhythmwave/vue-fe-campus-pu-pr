<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { ErrorRoot } from '~~/types/api/error';
import { GetReportGpaDistributionListData, GetReportGpaDistributionListRequest } from '~~/types/api/report/GetReportGpaDistributionList';
import { getReportGpaDistributionList } from '~~/composables/api/report/getReportGpaDistributionList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetStudyProgramListData } from '~~/types/api/study-program/GetStudyProgramList';

definePageMeta({
    layout: "backoffice",
});

const store = useContactStore();

function definePageMeta(arg0: { layout: string; }) {
    throw new Error('Function not implemented.');
}
const page = ref({ title: 'Daftar Distribusi Lulusan berdasarkan IPK'});
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Daftar Distribusi Lulusan berdasarkan IPK',
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

const student_graduation_to = ref("")
const student_graduation_from = ref("")

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
    await getReportGpaDistributionData()
}

const reportGpaDistributions = ref<GetReportGpaDistributionListData[]>([])
const selectedReportGpaDistribution = ref(<GetReportGpaDistributionListData>{});
async function getReportGpaDistributionData() {
    try {
        if (study_program_id.value == '' || student_graduation_from.value == '' || student_graduation_to.value == '') {
            reportGpaDistributions.value = []
            return;
        }
        const { response: resp, error: error } = await getReportGpaDistributionList(<GetReportGpaDistributionListRequest>{
            study_program_id: study_program_id.value,
            graduation_year_from: student_graduation_from.value,
            graduation_year_to: student_graduation_to.value,
        })
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            reportGpaDistributions.value = resp?.data
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
                <UiParentCard title="Pencarian Daftar Distribusi Berdasarkan IPK">
                    <v-row>
                        <v-col cols="12" sm="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="studyProgramss" item-value="id"
                                item-title="name" label="Program Studi" v-model="study_program_id"
                                @update:model-value="(c: any) => studyProgramOnChange(c)"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="studentYears" item-value="id"
                                item-title="name" label="Lulusan Dari Tahun" v-model="student_graduation_from"
                                @update:model-value="(c: any) => getReportGpaDistributionData()"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" lg="4" md="6">
                            <v-select variant="outlined" hide-details :items="studentYears" item-value="id"
                                item-title="name" label="Lulusan Sampai Tahun" v-model="student_graduation_to"
                                @update:model-value="(c: any) => getReportGpaDistributionData()"></v-select>
                        </v-col>
                        <v-col cols="12" lg="12" md="12" class="text-right">
                            <v-btn color="primary" v-bind="props" flat class="ml-auto" target="_blank"
                                :to="'/backoffice/report/prints/distribution-of-graduates-based-on-gpa/' + study_program_id + '?from=' + student_graduation_from + '&to=' + student_graduation_to"
                                :disabled="!reportGpaDistributions.length">
                                <v-icon class="mr-2">mdi-printer</v-icon>Print
                            </v-btn>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5" v-if="reportGpaDistributions.length">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Tahun Lulus</th>
                    <th class="text-subtitle-1 font-weight-semibold">IPK &lt;2.5</th>
                    <th class="text-subtitle-1 font-weight-semibold">%</th>
                    <th class="text-subtitle-1 font-weight-semibold">IPK 2.5 - 3</th>
                    <th class="text-subtitle-1 font-weight-semibold">%</th>
                    <th class="text-subtitle-1 font-weight-semibold">IPK > 3</th>
                    <th class="text-subtitle-1 font-weight-semibold">%</th>
                    <th class="text-subtitle-1 font-weight-semibold">IPK Rata Rata</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, i in reportGpaDistributions">
                    <td class="text-subtitle-1">{{ i + 1 }}</td>
                    <td class="text-subtitle-1">{{ item.graduation_school_year }}</td>
                    <td class="text-subtitle-1">{{ item.total_less_than_25 }}</td>
                    <td class="text-subtitle-1">{{ item.percentage_less_than_25 }}</td>
                    <td class="text-subtitle-1">{{ item.total_between_25_and_30 }}</td>
                    <td class="text-subtitle-1">{{ item.percentage_between_25_and_30 }}</td>
                    <td class="text-subtitle-1">{{ item.total_more_than_30 }}</td>
                    <td class="text-subtitle-1">{{ item.percentage_more_than_30 }}</td>
                    <td class="text-subtitle-1">{{ item.average_gpa }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>