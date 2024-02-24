<script setup lang="ts">
import { getSubjectGradeComponentList } from '~~/composables/api/grade-component/getSubjectGradeComponentList';
import { getGradeComponentList } from '~~/composables/api/grade-component/getGradeComponentList';
import { getSubjectCategoryList } from '~~/composables/api/subject-category/getSubjectCategoryList';
import { getSubjectDetail } from '~~/composables/api/subject/getSubjectDetail';
import { updateSubject } from '~~/composables/api/subject/updateSubject';
// import { getGradeComponentWithCategoryList } from '~~/composables/api/grade-component/getGradeComponentWithCategoryList';
import { ErrorRoot } from '~~/types/api/error';
import { GetSubjectGradeComponentListData } from "~~/types/api/grade-component/GetSubjectGradeComponentList";
import { GetGradeComponentListData } from "~~/types/api/grade-component/GetGradeComponentList";
import { GetSubjectCategoryListData } from "~~/types/api/subject-category/GetSubjectCategoryList";
import { GetSubjectDetailData } from "~~/types/api/subject/GetSubjectDetail";
import { UpdateSubjectRequest } from "~~/types/api/subject/UpdateSubject";
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetClassroomListData } from '~~/types/api/classroom/GetClassroomList';
import { getClassroomList } from '~~/composables/api/classroom/getClassroomList';
import { GetClassGradeComponentListData } from '~~/types/api/class-grade-component/GetClassGradeComponentList';
import { getClassGradeComponentList } from '~~/composables/api/class-grade-component/getClassGradeComponentList';

definePageMeta({
    layout: "backoffice",
    middleware: ['check-auth'],
});
const toogle = ref([])
const limit = 20
const search = ref('')
const title = ref('Nilai Mata Kuliah')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Tambah ' + title.value,
        disabled: true,
        href: '#'
    }
]);
const route = useRoute()
const mode = ref('list')
const dialog = ref(false)
const study_program_id = ref('')
const subject_category_id = ref('')
const is_mbkm = ref(false)
// if(route.query.study_program_id != ''){
//     study_program_id.value = <string>route.query.study_program_id
// }
const subject_id = ref('')
const thisFullPath: string = window.location.pathname
const thisID: any = thisFullPath.split("/")
// if (thisID[thisID.length-1] != '' || typeof thisID[thisID.length-1] != 'undefined'){
//     subject_id.value = thisID[thisID.length-1]
// }

// Data For Set This Subject Grade Component
const getSubjectGradeComponentListObj = ref<GetSubjectGradeComponentListData[]>([])

// Get Grade Component List
const getGradeComponentObj = ref<GetGradeComponentListData[]>([])

// Get Subject Category List
const getSubjectCategoryObj = ref<GetSubjectCategoryListData[]>([])

// Get Detail Subject
const getSubjectDetailObj = ref<GetSubjectDetailData>()

// Update Grade Component
const updateSubjectObj = ref<UpdateSubjectRequest>()

async function getData() {
    try {
        const { response: resp, error: error } = await getSubjectGradeComponentList(subject_id.value,subject_category_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getSubjectGradeComponentListObj.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getDataGradeComponent() {
    try {
        const { response: resp, error: error } = await getGradeComponentList(1000, 1, search.value, study_program_id.value, subject_category_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getGradeComponentObj.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getDataSubjectCategory() {
    try {
        const { response: resp, error: error } = await getSubjectCategoryList(1000, 1, search.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getSubjectCategoryObj.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getDataDetailSubject() {
    try {
        const { response: resp, error: error } = await getSubjectDetail(subject_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            getSubjectDetailObj.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function selectSubjectCategoryOnChanged(item: any) {
    subject_category_id.value = item
    await getDataGradeComponent()
    await getData()
}
function save() {
    console.log("save")
}
function close() {
    dialog.value = false
}
function setting() {
    if (subject_category_id.value == '') {
        alert('Harap Pilih Terlebih Dahulu Kategori Mata Kuliah')
        return false
    }
    mode.value = 'setting'
    dialog.value = true
}

const selectedClassroomList = ref(<GetClassroomListData>{})
const selectedClassGradeComponent = ref(<GetClassGradeComponentListData>{})
function settingPerClass(cl: GetClassroomListData, cgc: GetClassGradeComponentListData) {
    if (subject_category_id.value == '') {
        alert('Harap Pilih Terlebih Dahulu Kategori Mata Kuliah')
        return false
    }
    mode.value = 'settingPerClass'
    selectedClassroomList.value = cl
    selectedClassGradeComponent.value = cgc
    dialog.value = true
}
async function updateCategory() {
    updateSubjectObj.value = <UpdateSubjectRequest>{
        id: getSubjectDetailObj.value?.id,
        curriculum_id: getSubjectDetailObj.value?.curriculum_id,
        code: getSubjectDetailObj.value?.code,
        name: getSubjectDetailObj.value?.name,
        short_name: getSubjectDetailObj.value?.short_name,
        english_name: getSubjectDetailObj.value?.english_name,
        english_short_name: getSubjectDetailObj.value?.english_short_name,
        is_mandatory: getSubjectDetailObj.value?.is_mandatory,
        trait: getSubjectDetailObj.value?.trait,
        type: getSubjectDetailObj.value?.type,
        subject_category_id: subject_category_id.value,
        curriculum_type: getSubjectDetailObj.value?.curriculum_type,
        theory_credit: getSubjectDetailObj.value?.theory_credit,
        practicum_credit: getSubjectDetailObj.value?.practicum_credit,
        field_practicum_credit: getSubjectDetailObj.value?.field_practicum_credit,
        semester_package: getSubjectDetailObj.value?.semester_package,
        repeat_course_limit: getSubjectDetailObj.value?.repeat_course_limit,
        is_active: getSubjectDetailObj.value?.is_active,
        has_lecture_unit: getSubjectDetailObj.value?.has_lecture_unit,
        has_teaching_material: getSubjectDetailObj.value?.has_teaching_material,
        has_lecture_summary: getSubjectDetailObj.value?.has_lecture_summary,
        supporting_lecturer_id: getSubjectDetailObj.value?.supporting_lecturer_id,
        start_date: getSubjectDetailObj.value?.start_date,
        end_date: getSubjectDetailObj.value?.end_date,
        minimum_passing_grade_point: getSubjectDetailObj.value?.minimum_passing_grade_point,
        minimum_mandatory_credit_taken: getSubjectDetailObj.value?.minimum_mandatory_credit_taken,
        minimum_optional_credit_taken: getSubjectDetailObj.value?.minimum_optional_credit_taken,
        minimum_total_credit_taken: getSubjectDetailObj.value?.minimum_total_credit_taken,
        minimum_mandatory_credit_passed: getSubjectDetailObj.value?.minimum_mandatory_credit_passed,
        minimum_optional_credit_passed: getSubjectDetailObj.value?.minimum_optional_credit_passed,
        minimum_total_credit_passed: getSubjectDetailObj.value?.minimum_total_credit_passed,
        minimum_gpa: getSubjectDetailObj.value?.minimum_gpa,
        abstraction: getSubjectDetailObj.value?.abstraction,
        syllabus_path: getSubjectDetailObj.value?.syllabus_path,
        syllabus_path_type: getSubjectDetailObj.value?.syllabus_path_type,
    }
    if (getSubjectDetailObj.value?.subject_category_id == subject_category_id.value) {
        alert('Harap Ubah Kategori')
        return false
    }
    try {
        const { response: resp, error: error } = await updateSubject(updateSubjectObj.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        await refresh()
    } catch (error) {
        alert(error)
    }
}

watch(getSubjectDetailObj, async value => {
    if (typeof value !== 'undefined') {
        subject_category_id.value = value.subject_category_id
        await getDataGradeComponent()
        await getData()
    }
}, { deep: true, immediate: true })

async function refresh() {
    allClassGradeComponentLists.value = []
    let params = location.href.split('/')[window.location.href.split('/').length - 1]
    subject_id.value = params.split('?')[0]
    study_program_id.value = params.split('?')[1].replace('study_program_id=', '').replace('&is_mbkm=true', '').replace('&is_mbkm=false', '')
    is_mbkm.value = params.split('&')[1].replace('is_mbkm=', '') == 'true' ? true : false
    console.log(is_mbkm.value)
    await getDataSubjectCategory()
    await getDataDetailSubject()
    await getClassroomListData()
}

const classroomLists = ref<GetClassroomListData[]>([])
async function getClassroomListData() {
    try {
        const { response: resp, error: error } = await getClassroomList(100000, 1, '', study_program_id.value, '', true, subject_id.value, is_mbkm.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classroomLists.value = resp?.data
            for (let i = 0; i < resp?.data.length; i++) {
                const c = resp?.data[i];
                await getClassGradeComponentData(c.id)
            }
        }
    } catch (error) {
        alert(error)
    }
}
const allClassGradeComponentLists = ref<any[]>([])
const classGradeComponentLists = ref<GetClassGradeComponentListData[]>([])
async function getClassGradeComponentData(classId: string) {
    try {
        const { response: resp, error: error } = await getClassGradeComponentList(classId)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            classGradeComponentLists.value = resp?.data
            allClassGradeComponentLists.value.push({
                classId: classId,
                data: resp?.data,
            })
        }
    } catch (error) {
        alert(error)
    }
}
onMounted(async () => {
    await refresh()
})
</script>
<template>
    <div>
        <div v-if="mode == 'setting'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesSubjectGradeComponentSetting :data="getGradeComponentObj" :input="getSubjectGradeComponentListObj"
                        :subject_id="subject_id" @close="close()" @reload="refresh()" />
                </v-dialog>
            </v-col>
        </div>
        <div v-if="mode == 'settingPerClass'">
            <v-col cols="12" lg="8" md="6" class="text-right">
                <v-dialog v-model="dialog" max-width="800">
                    <PagesSubjectGradeComponentSettingClass :data="getGradeComponentObj"
                        :input="selectedClassGradeComponent" :class_id="selectedClassroomList.id" @close="close()"
                        @reload="refresh()" />
                </v-dialog>
            </v-col>
        </div>
        <BackofficeBreadcrumb :title="'Tambah ' + title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
        <SharedUiParentCard :title="title + ' : ' + getSubjectDetailObj?.name">
            <VRow>
                <VCol cols="12" lg="4" md="6" class="text-left">
                    <v-select variant="outlined" hide-details :items="getSubjectCategoryObj" item-value="id"
                        item-title="name" label="Pilih Kategori Mata Kuliah"
                        @update:model-value="(sl: any) => selectSubjectCategoryOnChanged(sl)"
                        v-model="subject_category_id"></v-select>
                </VCol>
                <VCol cols="12" lg="8" md="6" class="text-right">
                    <NuxtLink to="/backoffice/value-component/course-grade/">
                        <VBtn color="warning" flat class="ml-auto mr-2">
                            <VIcon>
                                mdi-keyboard-backspace
                            </VIcon>Kembali
                        </VBtn>
                    </NuxtLink>
                    <VBtn color="success" flat class="ml-auto mr-2" @click="updateCategory">
                        <VIcon>
                            mdi-account-multiple-plus
                        </VIcon>Ubah Kategori
                    </VBtn>
                    <VBtn color="primary" flat class="ml-auto mr-2" @click="setting()">
                        <VIcon>
                            mdi-account-multiple-plus
                        </VIcon>Setting
                    </VBtn>
                </VCol>
            </VRow>
        </SharedUiParentCard>
        <v-table>
            <thead>
                <tr>
                    <th class="text-title font-weight-bold">Jenis Komponen Nilai</th>
                </tr>
                <tr>
                    <th class="text-subtitle-1 font-weight-semibold">No</th>
                    <th class="text-subtitle-1 font-weight-semibold">Jenis Komponen Nilai</th>
                    <th class="text-subtitle-1 font-weight-semibold">Persentase (%)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in getSubjectGradeComponentListObj"
                    v-if="getSubjectGradeComponentListObj.length > 0">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.percentage }}</td>
                </tr>
            </tbody>
        </v-table>
        <br />
        <hr />
        <template v-for="cl in classroomLists">
            <template v-for="acgc in allClassGradeComponentLists">
                <v-table v-if="acgc.classId == cl.id">
                    <thead>
                        <tr>
                            <th class="text-title font-weight-bold">Kelas {{ cl.name }}</th>
                            <th class="text-title font-weight-bold">Dosen:
                                <template v-for="l in cl.lecturers">{{ l.front_title }} {{ l.name }} {{ l.back_degree
                                }}<br /></template>
                            </th>
                            <th class="text-title font-weight-bold">
                                <VBtn color="primary" flat class="ml-auto" @click="settingPerClass(cl, acgc.data)">
                                    <VIcon>
                                        mdi-account-multiple-plus
                                    </VIcon>&nbsp; Setting
                                </VBtn>
                            </th>
                        </tr>
                        <tr>
                            <th class="text-subtitle-1 font-weight-semibold">No</th>
                            <th class="text-subtitle-1 font-weight-semibold">Jenis Komponen Nilai</th>
                            <th class="text-subtitle-1 font-weight-semibold">Persentase (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in acgc.data" v-if="acgc.data.length > 0">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.percentage }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </template>

            <br />
            <hr />
        </template>
    </div>
</template>