<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';

import { GetSemesterListData } from "~~/types/api/semester/GetSemesterList";
import { GetStudentSummaryListData } from "~~/types/api/student/GetStudentStatusSummary";
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { getStudentStatusSummary } from '~~/composables/api/student/getStudentStatusSummary';

definePageMeta(<PageMeta>{
  layout: "backoffice",
  middleware: ['check-auth'],
});

const limit = 20
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
const search = ref('')
const mode = ref('list')
const dialog = ref(true)
const title = ref('Rekapitulasai Status Akademik')
const breadcrumbs = ref([
  {
    text: 'Beranda',
    disabled: false,
    href: '/backoffice'
  },
  {
    text: title,
    disabled: true,
    href: '#'
  }
])

const semesters = ref(<GetSemesterListData[]>[])
const semesterId = ref('')
const summaries = ref(<GetStudentSummaryListData[]>[])

async function getSemester(limit: number, page: number, search: string) {
    try {
        const { response: resp, error: error } = await getSemesterList(limit, page, search, "")
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
async function getData() {
    try {
        const { response: resp, error: error } = await getStudentStatusSummary(semesterId.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            summaries.value = resp?.data
            pagination.value = resp?.pagination
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
watch(semesterId, async function(value){
    if(value != ''){
        await getData()
    }
})
onMounted(async () => {
    await getSemester(pagination.value.limit, pagination.value.page, search.value)
})
</script>

<template>
    <div>
      <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <v-row>
            <v-col cols="12">
                <UiParentCard :title="title">
                    <v-row>
                        <v-col cols="12" lg="4" md="4" class="float-left">
                            <v-select v-model="semesterId" item-value="id" variant="outlined" hide-details :items="semesters" label="Pilih Semester">
                                <template v-slot:selection="{ item }">
                                    <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type }}</span>
                                </template>
                                <template v-slot:item="{item, props: {onClick, title, value}}">
                                    <ul>
                                        <li style="padding: 10px; margin: 2px;">
                                            <a href="javascript:void(0)" style="text-decoration: none; color: black;" @mouseover="MouseOver($event)" @mouseout="MouseOut($event)">
                                                <span @click="onClick">{{ title.school_year }} - {{ title.semester_type }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-table class="mt-10">
            <thead>
                <tr>
                    <th rowspan="0" class="text-subtitle-1 font-weight-semibold">No</th>
                    <th rowspan="0" class="text-subtitle-1 font-weight-semibold">Program Studi</th>
                </tr>
                <tr v-if="summaries.length > 0" v-for="(item, index) in summaries">
                    <!-- <th colspan="2" class="text-subtitle-1 font-weight-semibold"></th> -->
                    <th class="text-subtitle-1 font-weight-semibold" v-if="index == 0" v-for="itm in item.statuses">
                        {{ itm.status }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in summaries">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.study_program_name }}</td>
                    <td v-for="itm in item.statuses">{{ itm.total }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>