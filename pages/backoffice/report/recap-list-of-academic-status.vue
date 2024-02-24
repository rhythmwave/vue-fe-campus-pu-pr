<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { ErrorRoot } from '~~/types/api/error';
import { GetReportStudentStatusListData } from '~~/types/api/report/GetReportStudentStatusList';
import { getReportStudentStatusList } from '~~/composables/api/report/getReportStudentStatusList';

definePageMeta({
    layout: "backoffice",
});

const store = useContactStore();

function definePageMeta(arg0: { layout: string; }) {
    throw new Error('Function not implemented.');
}
const page = ref({ title: 'Pencarian Rekapitulasi Status Akademik Mahasiswa' });
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Pencarian Rekapitulasi Status Akademik Mahasiswa',
        disabled: true,
        href: '#'
    }
]);

onMounted(async () => {
    await refresh()
});

async function refresh() {
    await getSemesterData()
}

const semester_id = ref('')
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
    await getReportStudentStatusData()
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

function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
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
                        <v-col cols="12" lg="8" md="6" class="text-right">
                            <v-btn color="primary" v-bind="props" flat class="ml-auto" target="_blank"
                                :to="'/backoffice/report/prints/recap-list-of-academic-status/' + semester_id"
                                :disabled="!reportStudentStatuss.length">
                                <v-icon class="mr-2">mdi-printer</v-icon>Print
                            </v-btn>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-5" v-if="reportStudentStatuss.length">
            <thead>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                    <th class="text-subtitle-1 font-weight-semibold" v-for="s in reportStudentStatuss[0].statuses">{{
                        s.status }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, i in reportStudentStatuss">
                    <td class="text-subtitle-1">{{ i + 1 }}</td>
                    <td class="text-subtitle-1">{{ item.study_program_name }}</td>
                    <td class="text-subtitle-1" v-for="s in item.statuses">{{ s.total }}</td>

                </tr>
            </tbody>
        </v-table>
    </div>
</template>