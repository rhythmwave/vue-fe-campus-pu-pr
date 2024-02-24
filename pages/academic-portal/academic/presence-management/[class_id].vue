<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import AcademicBreadcrumb from '@/components/shared/AcademicBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { ErrorRoot } from '~~/types/api/error';
import Detail from '@/components/pages/academic-portal/academic/presence-management/Detail.vue';
import ManualPrecense from '@/components/pages/academic-portal/academic/presence-management/ManualPrecense.vue';
import AutoPrecense from '@/components/pages/academic-portal/academic/presence-management/AutoPrecense.vue';
import { GetLecturerClassDetailData } from '~~/types/api/lecturer-class/GetLecturerClassDetail';
import { GetLectureListData } from '~~/types/api/lecturer-lecture/GetLectureList';
import { getLecturerClassDetail } from '~~/composables/api/lecturer-class/getLecturerClassDetail';
import { getLectureList } from '~~/composables/api/academic-portal-lecturer-lecture/getLectureList';
import { formatHourMinute, formatYearMonthDate } from '~~/utils/helpers/date-utils'
import { convertDayOfWeek } from '~~/utils/helpers/convert-day-of-week'

definePageMeta(<PageMeta>{
  layout: "academic-portal",
  middleware: ['check-auth'],
});
const classId = ref('')
const lectureId = ref('')
const detail = ref(<GetLecturerClassDetailData>{})
const lectures = ref(<GetLectureListData[]>[])
const lecture = ref(<GetLectureListData>{})
const title = ref('Pengelolaan Presensi')
const mode = ref('list')
const dialog = ref(false)
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Daftar '+title.value,
        disabled: true,
        href: '#'
    }
]);
function showDetail(item: any){
    lecture.value = item
    mode.value = 'detail'
    dialog.value = true
}
function manualPrecense(item: any){
    lectureId.value = item.id
    mode.value = 'manual-precense'
    dialog.value = true
}
function autoPrecense(item: any){
    lectureId.value = item.id
    mode.value = 'auto-precense'
    dialog.value = true
}
function close(){
    dialog.value = false
}
async function getDetail() {
    try {
        const { response: resp, error: error } = await getLecturerClassDetail(classId.value)
        if (error) {
          let dataError = <ErrorRoot>error;
          alert(dataError.meta.message);
          return;
        }
        if (resp != null) {
            detail.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getLecture() {
    try {
        const { response: resp, error: error } = await getLectureList(classId.value)
        if (error) {
          let dataError = <ErrorRoot>error;
          alert(dataError.meta.message);
          return;
        }
        if (resp != null) {
            lectures.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function refresh(){
    await getDetail()
    await getLecture()
}
onMounted(async () => {
    classId.value = window.location.href.split('/')[window.location.href.split('/').length - 1]
    await refresh()
})
</script>
<template>
    <div v-if="mode == 'detail'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="1200">
                <Detail :title="'Detil '+title" :lecture="lecture" />
            </v-dialog>
        </v-col>
    </div>
    <div v-if="mode == 'manual-precense'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="1200">
                <ManualPrecense :title="'Manual '+title" :lectureId="lectureId" @close="close" @reload="refresh()" />
            </v-dialog>
        </v-col>
    </div>
    <div v-if="mode == 'auto-precense'">
        <v-col cols="12" lg="8" md="6" class="text-right">
            <v-dialog v-model="dialog" max-width="1200">
                <AutoPrecense :title="'Otomatis '+title" :lectureId="lectureId" @close="close" @reload="refresh()" />
            </v-dialog>
        </v-col>
    </div>
    <v-col cols="12">
        <AcademicBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></AcademicBreadcrumb>
    </v-col>
    <v-row>
    <v-col cols="12">
        <UiParentCard :title="'Pilih '+title">
            <v-row>
                <v-col cols="12" lg="12" md="12" class="text-right">
                    <NuxtLink class="text-decoration-none color-inherits" :to="'/academic-portal/academic/presence-management'">
                        <VIcon class="mr-2">
                            mdi-keyboard-backspace
                        </VIcon>Kembali
                    </NuxtLink>
                </v-col>
            </v-row>
        </UiParentCard>
        </v-col>
    </v-row>
    <v-table class="mt-5">
        <thead>
            <tr>
                <th colspan="2" class="text-subtitle-1 font-weight-semibold">{{title}}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Mata Kuliah</td>
                <td>{{ detail.subject_name }}</td>
            </tr>
            <tr>
                <td>Kelas</td>
                <td>{{ detail.name }}</td>
            </tr>
            <tr>
                <td>Semester</td>
                <td>{{ detail.semester_school_year }} - {{ detail.semester_type }}</td>
            </tr>
        </tbody>
    </v-table>
    <v-table class="mt-5">
        <thead>
            <tr>
                <th rowspan="0" class="text-subtitle-1 font-weight-semibold">Pertemuan</th>
                <th rowspan="0" class="text-subtitle-1 font-weight-semibold">Status Presensi Mandiri</th>
                <th rowspan="0" class="text-subtitle-1 font-weight-semibold">Mahasiswa Sudah Presensi</th>
            </tr>
            <tr>
                <th colspan="3" class="text-subtitle-1 font-weight-semibold">Tanggal</th>
            </tr>
            <tr>
                <th class="text-subtitle-1 font-weight-semibold">Rencana</th>
                <th class="text-subtitle-1 font-weight-semibold">Terlaksana</th>
                <th class="text-subtitle-1 font-weight-semibold">Jadwal Akhir Presensi</th>
                <th class="text-subtitle-1 font-weight-semibold">Last Update</th>
                <th class="text-subtitle-1 font-weight-semibold">Aksi</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in lectures">
                <td>{{ index + 1 }}</td>
                <td>{{ item.is_manual_participation ? 'Tidak' : 'Ya' }}</td>
                <td>{{ item.attending_participant }}</td>
                <td>{{ item.lecture_plan_date ? convertDayOfWeek(new Date(item.lecture_plan_date).getDay())+', ' : '' }} {{ item.lecture_plan_date ? formatYearMonthDate(item.lecture_plan_date) : ''}}</td>
                <td>{{ item.lecture_actual_date ? convertDayOfWeek(new Date(item.lecture_actual_date).getDay())+', ' : '' }} {{ item.lecture_actual_date ? formatYearMonthDate(item.lecture_actual_date) : ''}}</td>
                <td>{{ item.autonomous_participation_start_time ? convertDayOfWeek(new Date(item.autonomous_participation_start_time).getDay())+', ' : '' }} {{ item.autonomous_participation_start_time ? formatYearMonthDate(item.autonomous_participation_start_time) + ' : ' + formatHourMinute(item.autonomous_participation_start_time) : ''}}</td>
                <td>{{ item.updated_at ? convertDayOfWeek(new Date(item.updated_at).getDay())+', ' : '' }} {{ item.updated_at ? formatYearMonthDate(item.updated_at) : ''}}</td>
                <td style="min-width: 250px;">
                    <v-tooltip text="Detil" v-if="item.updated_at != ''">
                        <template #activator="{ props }">
                            <VBtn flat @click="showDetail(item)" color="primary" class="ml-2">
                                Info
                            </VBtn>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Ubah" v-if="item.updated_at != ''">
                        <template #activator="{ props }">
                            <VBtn flat @click="manualPrecense(item)" color="warning" class="ml-2">
                                Ubah
                            </VBtn>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Manual" v-if="item.updated_at == ''">
                        <template #activator="{ props }">
                            <VBtn flat @click="manualPrecense(item)" color="primary" class="ml-2">
                                Manual
                            </VBtn>
                        </template>
                    </v-tooltip>
                    <v-tooltip text="Mandiri" v-if="item.updated_at == ''">
                        <template #activator="{ props }">
                            <VBtn flat @click="autoPrecense(item)" color="warning" class="ml-2">
                                Mandiri
                            </VBtn>
                        </template>
                    </v-tooltip>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>