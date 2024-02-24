
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetClassMaterialListData } from '~~/types/api/class-material/GetClassMaterialList';
import { GetClassroomListData, LetcturerData } from '~~/types/api/classroom/GetClassroomList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { PaginationModel } from '~~/types/api/pagination';
import { getClassMaterialList } from '~~/composables/api/class-material/getClassMaterialList';
import { NuxtLink } from '~~/.nuxt/components';

const props = defineProps({
    classroom: Array as any,
    studyProgram: Array as any,
    semester: Array as any,
});

const limit = 20
const search = ref('')
const pagination = ref<PaginationModel>({
    page: 1,
    limit,
    prev: 1,
    next: 1,
    total_pages: 1,
    total_records: 0
})
onMounted(async () => {
    detailAdminClass.value = <GetClassroomListData>props.classroom
    adminStudyProgram.value = <GetAdminStudyProgramListData>props.studyProgram
    semesterCurrent.value = <GetSemesterListData>props.semester
    await getData(limit, 1)
});

const classMaterials = ref<GetClassMaterialListData[]>([])
async function getData(limit: number, page: number) {
    try {
        const { response: resp, error: error } = await getClassMaterialList(limit, page, search.value, detailAdminClass.value.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classMaterials.value = resp?.data
            pagination.value = resp?.pagination
        }
    } catch (error) {
        alert(error)
    }
}

const detailAdminClass = ref(<GetClassroomListData>{
    id: "",
    name: "",
    subject_id: "",
    subject_code: "",
    subject_name: "",
    subject_is_mandatory: false,
    subject_semester_package: 0,
    total_participant: 0,
    lecturers: <LetcturerData[]>[],
    subject_theory_credit: 0,
    subject_practicum_credit: 0,
    subject_field_practicum_credit: 0,
    is_active: false,
    maximum_participant: 0,
    unapproved_study_plan: 0,
    total_material: 0,
    total_work: 0,
    total_exam: 0,
    total_lecture_plan: 0,
    total_lecture_done: 0,
    total_discussion: 0,
    total_event:0,
});
const adminStudyProgram = ref(<GetAdminStudyProgramListData>{

    id: "",
    study_program_id: "",
    study_program_name: "",
    curriculum_id: "",
    curriculum_name: "",
    code: "",
    name: "",
    is_mandatory: false,
    semester_package: 0,
    theory_credit: 0,
    practicum_credit: 0,
    field_practicum_credit: 0,
    subject_prerequisite_id: "",
    prerequisite_type: "",
    prerequisite_minimum_grade_point: 0,
    equivalent_study_program_id: "",
    equivalent_study_program_name: "",
    equivalent_curriculum_id: "",
    equivalent_curriculum_name: "",
    equivalent_subject_code: "",
    equivalent_subject_name: "",
    equivalent_subject_id: "",
    subject_category_id: "",
    subject_category_name: "",
});
const semesterCurrent = ref(<GetSemesterListData>{
    id: "",
    semester_start_year: 0,
    school_year: "",
    semester_type: "",
    is_active: false,
    semester_type_year: "",
});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Materi Kuliah</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesStudyProgramsDetailItem title="Program Studi" :value="adminStudyProgram.name" />
                <PagesStudyProgramsDetailItem title="Semester" :value="semesterCurrent.semester_type_year" />
                <PagesStudyProgramsDetailItem title="Nama Kelas" :value="detailAdminClass.name" />
            </tbody>
        </v-table>
        <v-row>
            <v-col cols="12" class="mt-5 pl-5 pr-5">
                <UiParentCard title="Pencarian">
                    <v-row>
                        <v-col cols="12" lg="4" md="6">
                            <v-text-field density="compact" v-model="search" label="Pencarian Materi Kuliah" hide-details
                                variant="outlined" @input="getData(limit, 1)"></v-text-field>
                        </v-col>
                    </v-row>
                </UiParentCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12"><v-table class="mt-5 pl-5 pr-5">
                    <thead>
                        <tr>
                            <th class="text-subtitle-1 font-weight-semibold">No</th>
                            <th class="text-subtitle-1 font-weight-semibold">Download Materi</th>
                            <th class="text-subtitle-1 font-weight-semibold">Judul</th>
                            <th class="text-subtitle-1 font-weight-semibold">Deskripsi</th>
                            <th class="text-subtitle-1 font-weight-semibold">Status</th>
                            <th class="text-subtitle-1 font-weight-semibold">Dosen</th>
                            <th class="text-subtitle-1 font-weight-semibold">Waktu Upload</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item, index in classMaterials" :key="item.id">
                            <td class="text-subtitle-1">{{ index + 1 }}</td>
                            <td><a :href="item.file_url" download="" v-if="item.file_url" target="_blank">Download</a></td>
                            <td>{{ item.title }}</td>
                            <td>{{ item.abstraction }}</td>
                            <td>{{ item.is_active?"Aktif":"Tidak Aktif" }}</td>
                            <td>{{ item.lecturer_name }}</td>
                            <td>{{ moment(item.created_at).format('DD MMM YYYY') }} </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">
                                <TablePaginationView :limit="limit" :page="pagination.page"
                                    :total_pages="pagination.total_pages" :total_records="pagination.total_records"
                                    :prev="pagination.prev" :next="pagination.next"
                                    @prevPage="getData(limit, pagination.prev)"
                                    @jumpPage="(page: number) => getData(limit, page)"
                                    @nextPage="getData(limit, pagination.next)" />
                            </td>
                        </tr>
                    </tfoot>
                </v-table>
            </v-col>
        </v-row>
    </v-card>
</template>

<style lang="scss"></style>
