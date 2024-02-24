<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';

import moment from 'moment';
import { emit } from 'process';
import { getContext } from 'unctx/index';
import { PlusIcon } from 'vue-tabler-icons';
import { GetPermisssionsListData, GetPermisssionsListRoot } from '~~/types/api/permissions/GetPermissionsList';
import { GetSubjectListData, GetSubjectListRoot } from '~~/types/api/subject/GetSubjectList';
import { ErrorRoot } from '~~/types/api/error';
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';
import { CreateSubjectRequest } from '~~/types/api/subject/CreateSubject';
import { createSubject } from '~~/composables/api/subject/createSubject';
import { AnyMap } from '@jridgewell/trace-mapping';
import { GetSubjectDetailData } from '~~/types/api/subject/GetSubjectDetail';
import { getCuriculumList } from '~~/composables/api/curiculum/getCuriculumList';
import { GetCuriculumListData } from '~~/types/api/curiculum/GetCuriculumList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { getSubjectCategoryList } from '~~/composables/api/subject-category/getSubjectCategoryList';
import { GetSubjectCategoryListData } from '~~/types/api/subject-category/GetSubjectCategoryList';
import { getLecturerList } from '~~/composables/api/lecturer/getLecturerList';
import { GetLecturerListData } from '~~/types/api/lecturer/GetLecturerList';
import { CreateFileData, CreateFileRequest } from '~~/types/api/file/CreateFile';
import { createFile } from '~~/composables/api/file/createFile';


// const props = defineProps({
// });

const studyProgramId = ref('')
watch(studyProgramId, async function(value){
    if(value != ''){
        await getLecturerListData('')
        await getCuriculumListData()
    }
})
onMounted(async () => {
    await getAdminStudyProgramListData()
    await getSubjectCategoryListData()
});

const valid = ref(true)
const totalSks = ref(0)
const createSubjectRequest = ref(<CreateSubjectRequest>{
    curriculum_id: '',
    code: '',
    name: '',
    short_name: '',
    english_name: '',
    english_short_name: '',
    is_mandatory: false,
    trait: '',
    type: '',
    subject_category_id: '',
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
    is_thesis: false,
    is_mbkm: false,
});

const emitData = defineEmits(['close', 'reload'])

const curiculumListData = ref<GetCuriculumListData[]>([])
const selectedCuriculumLists = ref(<GetCuriculumListData>{})
async function getCuriculumListData() {
    try {
        const { response: resp, error: error } = await getCuriculumList(1000000, 1, "", studyProgramId.value)
        if (error) {
            let dataError = <ErrorRoot>error
            alert(dataError.meta.message)
            return;
        }
        if (resp != null) {
            curiculumListData.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}


const SubjectCategoryListData = ref<GetSubjectCategoryListData[]>([])
const selectedSubjectCategoryLists = ref(<GetSubjectCategoryListData>{})
async function getSubjectCategoryListData() {
    try {
        const { response: resp, error: error } = await getSubjectCategoryList(1000000, 1, "")
        if (error) {
            let dataError = <ErrorRoot>error
            alert(dataError.meta.message)
            return;
        }
        if (resp != null) {
            SubjectCategoryListData.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}


const AdminStudyProgramListData = ref<GetAdminStudyProgramListData[]>([])
const selectedAdminStudyProgramLists = ref(<GetAdminStudyProgramListData>{})
async function getAdminStudyProgramListData() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error
            alert(dataError.meta.message)
            return;
        }
        if (resp != null) {
            AdminStudyProgramListData.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

async function save() {
    try {
        const { response: createRoleResponse, error } = await createSubject(createSubjectRequest.value)

        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            emitData('reload');
        }
        // return true;
        emitData('close');
    } catch (error) {
        alert(error)
        // return false;
    }

}

function CuriculumListsOnChange(id: string) {
    selectedCuriculumLists.value = <GetCuriculumListData>curiculumListData.value.find((x) => x.id == id)
}

// async function AdminStudyProgramListsOnChange(id: string) {
//     selectedAdminStudyProgramLists.value = <GetAdminStudyProgramListData>AdminStudyProgramListData.value.find((x) => x.id == id)
//     selectedCuriculumLists.value = <GetCuriculumListData>{
//         id: '',
//         name: '',
//     };
//     selectedLecturerLists.value = <GetLecturerListData>{
//         id: '',
//         name: '',
//     }
//     createSubjectRequest.value.curriculum_id = ''
//     createSubjectRequest.value.supporting_lecturer_id = '';
//     await getCuriculumListData()
//     LecturerListData.value = [];
// }

const Traits = ref([
    {
        id: "",
        name: "-",
    },
    {
        id: "[W] Wajib Program Studi",
        name: "[W] Wajib Program Studi",
    },
    {
        id: "[P] Pilihan",
        name: "[P] Pilihan",
    },
    {
        id: "[W] Peminatan",
        name: "[W] Peminatan",
    },
    {
        id: "[W] Tugas Akhir/Sripsi/Tesis/Disertasi",
        name: "[W] Tugas Akhir/Sripsi/Tesis/Disertasi",
    },
    {
        id: "[W] Wajib Nasional",
        name: "[W] Wajib Nasional",
    },
])

const Types = ref([
    {
        id: "",
        name: "-",
    },
    {
        id: "MBB - Mata Kuliah Berkehidupan Bermasyarakat",
        name: "MBB - Mata Kuliah Berkehidupan Bermasyarakat",
    },
    {
        id: "MKB - Mata Kuliah Keahlian Berkarya",
        name: "MKB - Mata Kuliah Keahlian Berkarya",
    },
    {
        id: "MKDK - - ",
        name: "MKDK - - ",
    },
    {
        id: "MKK - Mata Kuliah Keahlian dan Keterampilan",
        name: "MKK - Mata Kuliah Keahlian dan Keterampilan",
    },
    {
        id: "MKU/MKDU - ",
        name: "MKU/MKDU - ",
    },
    {
        id: "MPB - Mata Kuliah Perilaku Berkarya",
        name: "MPB - Mata Kuliah Perilaku Berkarya",
    },
    {
        id: "MPK - Mata Kuliah Pengembangan Kepribadian",
        name: "MPK - Mata Kuliah Pengembangan Kepribadian",
    },
])

const CuriculumTypes = ref([
    {
        id: "",
        name: "-",
    },
    {
        id: "A - Inti",
        name: "A - Inti",
    },
    {
        id: "B - Institusi",
        name: "B - Institusi",
    },
])
const SemesterPackages = ref([
    {
        id: 1,
        name: "1",
    },
    {
        id: 2,
        name: "2",
    },
    {
        id: 3,
        name: "3",
    },
    {
        id: 4,
        name: "4",
    },
    {
        id: 5,
        name: "5",
    },
    {
        id: 6,
        name: "6",
    },
])
function setTotalSks() {
    totalSks.value = createSubjectRequest.value.theory_credit + createSubjectRequest.value.practicum_credit + createSubjectRequest.value.field_practicum_credit
}
const LecturerListData = ref<GetLecturerListData[]>([])
const selectedLecturerLists = ref(<GetLecturerListData>{})
async function getLecturerListData(search: string) {
    try {
        const { response: resp, error: error } = await getLecturerList(20, 1, search, studyProgramId.value, '', '','', '', '', '', '', '')
        if (error) {
            let dataError = <ErrorRoot>error
            alert(dataError.meta.message)
            return;
        }
        if (resp != null) {
            LecturerListData.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}

// function getAutocompleteLecturer(data: any) {
//     let selectedData: GetLecturerListData = <GetLecturerListData>{}
//     LecturerListData.value.forEach((l) => {
//         if (data.id == l.id) {
//             selectedData = l
//         }
//     })
//     selectedLecturerLists.value = selectedData;
//     createSubjectRequest.value.supporting_lecturer_id = selectedData.id
// }

const syllabusData = ref<CreateFileData>(<CreateFileData>{
    mime_type: '',
    path: '',
    path_type: '',
    size: 0,
    url: '',
})
async function onSyllabusUpdate(files: File[]) {
    try {

        if (!files) {
            syllabusData.value = <CreateFileData>{
                mime_type: '',
                path: '',
                path_type: '',
                size: 0,
                url: '',
            }
            createSubjectRequest.value.syllabus_path = ''
            createSubjectRequest.value.syllabus_path_type = ''
            return;
        }
        if (files.length == 0) {
            syllabusData.value = <CreateFileData>{
                mime_type: '',
                path: '',
                path_type: '',
                size: 0,
                url: '',
            }
            createSubjectRequest.value.syllabus_path = ''
            createSubjectRequest.value.syllabus_path_type = ''
            return;
        }
        let selectedFile: File = files[0]
        var reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = async () => {
            var fileBase64 = (<string>reader.result).replace('data:image/jpeg;base64,', '')
            const { response: resp, error: error } = await createFile(
                <CreateFileRequest>{
                    file: fileBase64
                }
            )
            if (error) {
                let dataError = <ErrorRoot>error;
                alert(dataError.meta.message);
                return;
            }
            if (resp != null) {
                syllabusData.value = resp?.data

                createSubjectRequest.value.syllabus_path = syllabusData.value.path
                createSubjectRequest.value.syllabus_path_type = syllabusData.value.path_type
            }
        };
    } catch (error) {
        alert(error)
        createSubjectRequest.value.syllabus_path = ''
        createSubjectRequest.value.syllabus_path_type = ''
    }
}
</script>
<template>
    <div>
        <v-card max-height="600" style="overflow: auto;">
            <v-card-title class="pa-4 bg-secondary">
                <span class="title text-white">Tambah Mata Kuliah</span>
            </v-card-title>
            <v-card-text>
                <Vspace space="3" />
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-label>Data Pokok Mata Kuliah</v-label>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select v-model="studyProgramId" variant="outlined" hide-details :items="AdminStudyProgramListData" item-value="id" item-title="name" label="Program Studi"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="curiculumListData" item-value="id"
                                item-title="name" label="Kurikulum" @update:model-value="(c: any) => CuriculumListsOnChange(c)"
                                v-model="createSubjectRequest.curriculum_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createSubjectRequest.code" variant="outlined" hide-details="auto"
                                label="Kode Mata Kuliah (*)" :readonly="false" hint="maksimal 20 karakter" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Nama Mata Kuliah</v-label>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createSubjectRequest.name" variant="outlined" hide-details="auto"
                                label="Indonesia" :readonly="false" hint="Maximal 200 Karakter" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createSubjectRequest.short_name" variant="outlined" hide-details="auto"
                                label="Singkat Indonesia" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createSubjectRequest.english_name" variant="outlined" hide-details="auto"
                                label="Inggris" :readonly="false" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model="createSubjectRequest.english_short_name" variant="outlined"
                                hide-details="auto" label="Singkat Inggris" :readonly="false" />
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="Traits" item-value="id" item-title="name"
                                label="Sifat Mata Kuliah (*)" v-model="createSubjectRequest.trait"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="Types" item-value="id" item-title="name"
                                label="Tipe Mata Kuliah" v-model="createSubjectRequest.type"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="SubjectCategoryListData" item-value="id"
                                item-title="name" label="*Kategori Mata Kuliah"
                                v-model="createSubjectRequest.subject_category_id"></v-select>
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="CuriculumTypes" item-value="id"
                                item-title="name" label="Jenis Kurikulum(*)"
                                v-model="createSubjectRequest.curriculum_type"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Jumlah SKS</v-label>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="totalSks" type="number" variant="outlined" hide-details="auto"
                                label="SKS Kurikulum" :readonly="true" :disabled="true" />
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.theory_credit" type="number"
                                variant="outlined" hide-details="auto" label="Teori (**)" :readonly="false"
                                @update:model-value="(c: any) => setTotalSks()"
                                hint="[Diisi dengan angka [0-9], dengan nilai: 0 s/d 9]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.practicum_credit" type="number"
                                variant="outlined" hide-details="auto" label="Praktikum (**)" :readonly="false"
                                @update:model-value="(c: any) => setTotalSks()"
                                hint="[Diisi dengan angka [0-9], dengan nilai: 0 s/d 9]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.field_practicum_credit" type="number"
                                variant="outlined" hide-details="auto" label="Praktikum Lapangan (**)" :readonly="false"
                                @update:model-value="(c: any) => setTotalSks()"
                                hint="[Diisi dengan angka [0-9], dengan nilai: 0 s/d 9]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-select variant="outlined" hide-details :items="SemesterPackages" item-value="id"
                                item-title="name" label="Paket Semester (*)"
                                v-model="createSubjectRequest.semester_package"></v-select>
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.repeat_course_limit" type="number"
                                variant="outlined" hide-details="auto" label="Batas Maksimal Pengambilan Ulang"
                                :readonly="false" hint="[Diisi dengan angka [0-5], dengan nilai: 0 s/d 5]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-radio-group v-model="createSubjectRequest.is_active" inline label="Status Perkuliahan"
                                hide-details="auto">
                                <v-radio label="A - Aktif" :value="true" color="primary"></v-radio>
                                <v-radio label="H - Hapus" :value="false" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-radio-group v-model="createSubjectRequest.has_lecture_unit" inline
                                label="Satuan Acara Perkuliahan" hide-details="auto">
                                <v-radio label="Ada" :value="true" color="primary"></v-radio>
                                <v-radio label="Tidak Ada" :value="false" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-radio-group v-model="createSubjectRequest.has_teaching_material" inline label="Bahan Ajar"
                                hide-details="auto">
                                <v-radio label="Ada" :value="true" color="primary"></v-radio>
                                <v-radio label="Tidak Ada" :value="false" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-radio-group v-model="createSubjectRequest.has_lecture_summary" inline label="Diktat"
                                hide-details="auto">
                                <v-radio label="Ada" :value="true" color="primary"></v-radio>
                                <v-radio label="Tidak Ada" :value="false" color="secondary"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-autocomplete v-model="createSubjectRequest.supporting_lecturer_id" :items="LecturerListData" item-value="id" item-title="name" variant="outlined" hide-details :label="'Dosen Pengampu'"></v-autocomplete>
                            <!-- <Autocomplete @reload="(data) => getLecturerListData(data.search)" :label="'Dosen Pengampu'"
                                @selected="(data) => getAutocompleteLecturer(data)" :options="LecturerListData" /> -->
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-label>Data Prasyarat Mata Kuliah</v-label>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.minimum_passing_grade_point" type="number"
                                variant="outlined" hide-details="auto" label="Bobot Nilai Minimal untuk Lulus"
                                :readonly="false" hint="[Diisi dengan angka boleh desimal, dengan nilai: 0.00 s/d 4.00]" />
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-label>Jumlah Minimal sks Mata Kuliah Telah Diambil</v-label>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.minimum_mandatory_credit_taken" type="number"
                                variant="outlined" hide-details="auto" label="Mata Kuliah Wajib" :readonly="false"
                                hint="[Diisi dengan angka [0-9], dengan nilai: 0 s/d 200]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.minimum_optional_credit_taken" type="number"
                                variant="outlined" hide-details="auto" label="Mata Kuliah Pilihan" :readonly="false"
                                hint="[Diisi dengan angka [0-9], dengan nilai: 0 s/d 200]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.minimum_total_credit_taken" type="number"
                                variant="outlined" hide-details="auto" label="Total Mata Kuliah" :readonly="false"
                                hint="[Diisi dengan angka [0-9], dengan nilai: 0 s/d 200]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Jumlah Minimal sks Mata Kuliah Telah Lulus</v-label>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.minimum_mandatory_credit_passed"
                                type="number" variant="outlined" hide-details="auto" label="Mata Kuliah Wajib"
                                :readonly="false" hint="[Diisi dengan angka [0-9], dengan nilai: 0 s/d 200]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.minimum_optional_credit_passed" type="number"
                                variant="outlined" hide-details="auto" label="Mata Kuliah Pilihan" :readonly="false"
                                hint="[Diisi dengan angka [0-9], dengan nilai: 0 s/d 200]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.minimum_total_credit_passed" type="number"
                                variant="outlined" hide-details="auto" label="Total Mata Kuliah" :readonly="false"
                                hint="[Diisi dengan angka [0-9], dengan nilai: 0 s/d 200]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-text-field v-model.number="createSubjectRequest.minimum_gpa" type="number" variant="outlined"
                                hide-details="auto" label="Syarat IPK Minimal" :readonly="false"
                                hint="[Diisi dengan angka boleh desimal, dengan nilai: 0.00 s/d 4.00]" />
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-switch v-model="createSubjectRequest.is_thesis" label="Tugas Akhir" color="primary"></v-switch>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-switch v-model="createSubjectRequest.is_mbkm" label="Mata Kuliah MBKM" color="primary"></v-switch>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-label>Data Silabus Mata Kuliah</v-label>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <v-textarea outlined v-model="createSubjectRequest.abstraction" label="Abstraksi"
                                variant="outlined" hide-details="auto"></v-textarea>
                        </v-col>
                        <v-file-input accept="image/*" label="File Silabus" variant="outlined" hide-details
                            :onUpdate:modelValue="(files: File[]) => onSyllabusUpdate(files)"></v-file-input>
                        <v-col cols="12">
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn color="error" @click="$emit('close')">
                                    Batal
                                </v-btn>
                                <v-btn color="secondary" 
                                :disabled="
                                createSubjectRequest.curriculum_id == '' ||
                                createSubjectRequest.code == '' ||
                                createSubjectRequest.name == '' ||
                                createSubjectRequest.subject_category_id == '' ||
                                createSubjectRequest.semester_package == 0 ||
                                createSubjectRequest.supporting_lecturer_id == '' ||
                                createSubjectRequest.trait == '' ||
                                createSubjectRequest.type == '' ||
                                (createSubjectRequest.theory_credit == 0 && createSubjectRequest.practicum_credit == 0 && createSubjectRequest.field_practicum_credit == 0)
                                " 
                                @click="save();">
                                    Tambah
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>