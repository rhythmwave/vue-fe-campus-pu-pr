<script setup lang="ts">
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useContactStore } from '@/stores/apps/contact';
import contact from '@/_mockApis/apps/contact';
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import { ErrorRoot } from '~~/types/api/error';
import { PaginationModel } from '~~/types/api/pagination';

import { GetSubjectDetailData, PrerequisiteSubject} from '~~/types/api/subject/GetSubjectDetail';
import { GetSubjectListData, GetSubjectClassesListData } from '~~/types/api/subject/GetSubjectList';

import { getSubjectDetail } from '~~/composables/api/subject/getSubjectDetail';
import { getSubjectList } from '~~/composables/api/subject/getSubjectList';

definePageMeta(<PageMeta>{
    layout: "blank",
    middleware: ['check-auth'],
});

const curriculum_id = ref('')
const subjects = ref(<GetSubjectListData[]>[])
const subject_detail_single = ref(<GetSubjectDetailData>{})
const subject_details = ref(<GetSubjectDetailData[]>[])
const subject_id = ref('')

async function getSubject() {
    try {
        const { response: resp, error: error } = await getSubjectList(1000000, 1, "", [curriculum_id.value], '', '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            subjects.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function getDetail(id: string) {
    try {
        const { response: resp, error: error } = await getSubjectDetail(id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            subject_detail_single.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
onMounted(async () => {
    curriculum_id.value = window.location.href.split('/')[window.location.href.split('/').length - 2]
    await getSubject()
    for (let index = 0; index < subjects.value.length; index++) {
        const element = subjects.value[index];
        await getDetail(element.id)
        subject_details.value.push(subject_detail_single.value)
    }
    await delay(1000)
    window.print()
})
</script>
<template>
    <div>
        <table class="table">
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
                    <th colspan="6">
                        <p><b>DAFTAR MATAKULIAH PRASYARAT</b></p>
                    </th>
                    <th></th>
                </tr>
                <tr>
                    <th width="100"></th>
                    <th width="100"></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                <tr style="text-align: left;">
                    <th colspan="2"><b>Program Studi</b></th>
                    <th colspan="6"><b>: {{ subject_detail_single.study_program_name }}</b></th>
                </tr>
                <tr style="text-align: left;">
                    <th colspan="2"><b>Kurikulum</b></th>
                    <th colspan="6"><b>: {{ subject_detail_single.curriculum_name }}</b></th>
                </tr>
                <tr style="text-align: left;">
                    <th rowspan="2" class="font-size-10 head-title" style="text-align: center; vertical-align: middle;">No</th>
                    <th colspan="4" class="font-size-10 head-title" style="text-align: center;">Mata Kuliah</th>
                    <th colspan="3" class="font-size-10 head-title" style="text-align: center;">Mata Kuliah Prasyarat</th>
                </tr>
                <tr style="text-align: left;">
                    <th class="font-size-10 head-title">Kode</th>
                    <th class="font-size-10 head-title">Nama</th>
                    <th class="font-size-10 head-title">Sifat</th>
                    <th class="font-size-10 head-title">Semester</th>
                    <th class="font-size-10 head-title">Kode</th>
                    <th class="font-size-10 head-title">Nama</th>
                    <th class="font-size-10 head-title">Syarat</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in subject_details">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.trait }}</td>
                    <td>{{ item.semester_package }}</td>
                    <td>
                        <table>
                            <tbody>
                                <tr v-for="itm in item.prerequisite_subjects">
                                    <td>{{ itm.code }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table>
                            <tbody>
                                <tr v-for="itm in item.prerequisite_subjects">
                                    <td>{{ itm.name }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table>
                            <tbody>
                                <tr v-for="itm in item.prerequisite_subjects">
                                    <td>{{ itm.prerequisite_type }}</td>
                                </tr>
                            </tbody>
                        </table>
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