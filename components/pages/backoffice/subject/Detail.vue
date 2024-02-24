
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { getSubjectDetail } from '~~/composables/api/subject/getSubjectDetail';
import { ErrorRoot } from '~~/types/api/error';
import { GetSubjectDetailData } from '~~/types/api/subject/GetSubjectDetail';

const props = defineProps({
    getSubjectListData: Array as any,
});

onMounted(async () => {
    detail = <GetSubjectDetailData>props.getSubjectListData
    await getDetail()
});

let detail:GetSubjectDetailData

async function getDetail() {
    try {
        const { response: resp, error: error } = await getSubjectDetail(detail.id)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            detailSubject.value = <GetSubjectDetailData><unknown>resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
const detailSubject = ref(<GetSubjectDetailData>{
    id: '',
    study_program_id: '',
    study_program_name: '',
    curriculum_id: '',
    curriculum_name: '',
    code: '',
    name: '',
    short_name: '',
    english_name: '',
    english_short_name: '',
    is_mandatory: false,
    trait: '',
    type: '',
    subject_category_id: '',
    subject_category_name: '',
    curriculum_type: '',
    theory_credit: 0,
    practicum_credit: 0,
    field_practicum_credit: 0,
    semester_package: 0,
    repeat_course_limit: 0,
    is_active: false,
    has_lecture_unit: false,
    has_teaching_material: false,
    has_lecture_summary: false,
    supporting_lecturer_id: '',
    supporting_lecturer_name: '',
    start_date: '',
    end_date: '',
    minimum_passing_grade_point: 0,
    minimum_mandatory_credit_taken: 0,
    minimum_optional_credit_taken: 0,
    minimum_total_credit_taken: 0,
    minimum_mandatory_credit_passed: 0,
    minimum_optional_credit_passed: 0,
    minimum_total_credit_passed: 0,
    minimum_gpa: 0,
    abstraction: '',
    syllabus_path: '',
    syllabus_path_type: '',
    syllabus_url: '',
    is_thesis: false
});
const config = useRuntimeConfig()

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Detail Mata Kuliah</span>
        </v-card-title>
        <v-table class="month-table">
            <tbody>
                <PagesBackofficeSubjectDetailItem title="Program Studi" :value="detailSubject.study_program_name"/>
                <PagesBackofficeSubjectDetailItem title="Kurikulum" :value="detailSubject.curriculum_name"/>
                <PagesBackofficeSubjectDetailItem title="Kode Mata Kuliah" :value="detailSubject.code"/>
                <PagesBackofficeSubjectDetailItem title="Nama Mata Kuliah" :value="detailSubject.name+'/'+detailSubject.english_name"/>
                <PagesBackofficeSubjectDetailItem title="Sifat Mata Kuliah" :value="detailSubject.trait"/>
                <PagesBackofficeSubjectDetailItem title="Kategori Mata Kuliah" :value="detailSubject.subject_category_name"/>
                <PagesBackofficeSubjectDetailItem title="Jenis Kurikulum" :value="detailSubject.curriculum_type"/>
                <PagesBackofficeSubjectDetailItem title="Jumlah SKS" :value="detailSubject.theory_credit+detailSubject.practicum_credit+detailSubject.field_practicum_credit"/>
                <PagesBackofficeSubjectDetailItem title="Status Perkuliahan" :value="detailSubject.is_active?'Aktif':'Tidak'"/>
                <PagesBackofficeSubjectDetailItem title="Status Acara Perkuliahan" :value="detailSubject.has_lecture_unit?'Aktif':'Tidak'"/>
                <PagesBackofficeSubjectDetailItem title="Bahan Ajar" :value="detailSubject.has_teaching_material?'Aktif':'Tidak'"/>
                <PagesBackofficeSubjectDetailItem title="Diktat" :value="detailSubject.has_lecture_summary?'Aktif':'Tidak'"/>
                <PagesBackofficeSubjectDetailItem title="Dosen Pengampu" :value="detailSubject.supporting_lecturer_name"/>
                <PagesBackofficeSubjectDetailItem title="Bobot Nilai Minimal untuk Lulus" :value="detailSubject.minimum_gpa.toString()"/>
                <PagesBackofficeSubjectDetailItem title="Tugas Akhir" :value="detailSubject.is_thesis ? 'Ya' : 'Bukan'"/>
                <PagesBackofficeSubjectDetailItemGroup title="Jumlah Minimal sks Mata Kuliah Telah Diambil" 
                :value="[
                    {
                        title:'sks Mata Kuliah Wajib',
                        value:detailSubject.minimum_mandatory_credit_taken.toString(),
                    },
                    {
                        title:'sks Mata Kuliah Pilihan',
                        value:detailSubject.minimum_optional_credit_taken.toString(),
                    },
                    {
                        title:'Total sks Mata Kuliah',
                        value:detailSubject.minimum_total_credit_taken.toString(),
                    },
                ]" />
                <PagesBackofficeSubjectDetailItemGroup title="Jumlah Minimal sks Mata Kuliah Telah Lulus" 
                :value="[
                    {
                        title:'sks Mata Kuliah Wajib',
                        value:detailSubject.minimum_mandatory_credit_passed.toString(),
                    },
                    {
                        title:'sks Mata Kuliah Pilihan',
                        value:detailSubject.minimum_optional_credit_passed.toString(),
                    },
                    {
                        title:'Total sks Mata Kuliah',
                        value:detailSubject.minimum_total_credit_passed.toString(),
                    },
                ]" />
                <PagesBackofficeSubjectDetailItem title="Syarat IPK Minimal" :value="detailSubject.minimum_passing_grade_point.toString()" />

                <tr>
                    <td>
                        <div class="d-flex align-center">

                            <div class="ml-4">
                                <h6 class="text-h6"> &emsp; &#x2022; Abstraksi</h6>
                            </div>
                        </div>
                    </td>
                    <td>
                        <h6 class="text-h6 font-weight-medium text-medium-emphasis"> {{ detailSubject.abstraction.toString() }} </h6>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="d-flex align-center">

                            <div class="ml-4">
                                <h6 class="text-h6"> &emsp; &#x2022; File Silabus</h6>
                            </div>
                        </div>
                    </td>
                    <td>
                        <h6 class="text-h6 font-weight-medium text-medium-emphasis">
                            <a target="_blank" :href="detailSubject.syllabus_url">klik untuk melihat file
                            </a>
                        </h6>
                    </td>
                </tr>
                <!-- <PagesBackofficeSubjectDetailItemGroup title="Data Silabus Mata Kuliah" 
                :value="[
                    {
                        title:'Abstraksi',
                        value:detailSubject.abstraction.toString(),
                    },
                    {
                        title:'File Silabus',
                        value:detailSubject.syllabus_url.toString().replace('http://localhost:1200', config.public.baseUrl),
                    },
                ]" /> -->
            </tbody>
        </v-table>
    </v-card>
</template>

<style lang="scss"></style>
