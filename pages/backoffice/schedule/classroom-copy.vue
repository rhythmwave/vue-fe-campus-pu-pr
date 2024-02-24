<script setup lang="ts">
import { PageMeta } from 'nuxt/dist/pages/runtime/composables';
import BackofficeBreadcrumb from '@/components/shared/BackofficeBreadcrumb.vue';
import { GetAdminStudyProgramListData } from '~~/types/api/admin-study-program/GetAdminStudyProgramList';
import { GetSemesterListData } from '~~/types/api/semester/GetSemesterList';
import { getAdminStudyProgramList } from '~~/composables/api/admin-study-program/getAdminStudyProgramList';
import { getSemesterList } from '~~/composables/api/semester/getSemesterList';
import { copyClassroom } from '~~/composables/api/classroom/copyClassroom';
import { ErrorRoot } from '~~/types/api/error';
import UiParentCard from '@/components/shared/UiParentCard.vue';

definePageMeta(<PageMeta>{
    layout: "backoffice",
    middleware: ['check-auth'],
});
const title = ref('Copy Kelas')
const breadcrumbs = ref([
    {
        text: 'Beranda',
        disabled: false,
        href: '/backoffice'
    },
    {
        text: 'Proses ' + title.value,
        disabled: true,
        href: '#'
    }
]);
const study_program_id = ref('')
const from_semester_id = ref('')
const to_semester_id = ref('')
const adminStudyPrograms = ref<GetAdminStudyProgramListData[]>([])
const semesters = ref<GetSemesterListData[]>([])
async function getAdminStudyProgram() {
    try {
        const { response: resp, error: error } = await getAdminStudyProgramList(1000, 1, "", "")
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        }
        if (resp != null) {
            adminStudyPrograms.value = resp?.data
        }
    } catch (error) {
        alert(error)
    }
}
async function getSemester() {
    try {
        const { response: resp, error: error } = await getSemesterList(1000, 1, study_program_id.value, '')
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
async function adminStudyProgramsOnChange(item: any) {
    if (item != '') {
        study_program_id.value = item
    }
    if (study_program_id.value != '') {
        await getSemester()
    }
}
async function fromSemesterOnChange(item: any) {
    if (item != '') {
        from_semester_id.value = item
    }
}
async function toSemesterOnChange(item: any) {
    if (item != '') {
        to_semester_id.value = item
    }
}
async function progress() {
    if (from_semester_id.value == to_semester_id.value) {
        alert("Anda Tidak Dapat Meng-Copy Semester Yang Sama")
        return false
    }
    try {
        const { response: createRoleResponse, error } = await copyClassroom(from_semester_id.value, to_semester_id.value)
        if (error) {
            let dataError = <ErrorRoot>error;
            alert(dataError.meta.message);
            return;
        } else {
            alert("Sukses")
        }
    } catch (error) {
        alert(error)
        return false;
    }
}
onMounted(async () => {
    await getAdminStudyProgram()
    await getSemester()
})

function MouseOver(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = '#aaa'
}
function MouseOut(ev: any){
    ev.target.parentNode.parentNode.style.backgroundColor = 'white'
}
</script>

<template>
    <BackofficeBreadcrumb :title="title" :breadcrumbs="breadcrumbs"></BackofficeBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard :title="'Pilih ' + title">
                <v-row>
                    <v-col cols="12" lg="4" md="6">
                        <v-select variant="outlined" hide-details :items="adminStudyPrograms" item-value="id"
                            item-title="name" label="Pilih Program Studi"
                            @update:model-value="(sl: any) => adminStudyProgramsOnChange(sl)"></v-select>
                    </v-col>
                    <v-col cols="12" lg="4" md="6">
                        <!-- <v-select variant="outlined" hide-details :items="semesters" item-value="id"
                            item-title="semester_start_year" label="Pilih Dari Semester"
                            @update:model-value="(sl: any) => fromSemesterOnChange(sl)"></v-select>
                             -->

                        <v-select item-value="id" variant="outlined" hide-details :items="semesters"
                            label="Pilih Dari Semester" @update:model-value="(sl: any) => fromSemesterOnChange(sl)">
                            <template v-slot:selection="{ item }">
                                <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                }}</span>
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
                </v-row>
                <v-row>
                    <v-col cols="12" lg="8" md="6">
                        <!-- <v-select variant="outlined" hide-details :items="semesters" item-value="id"
                            item-title="semester_start_year" label="Pilih Tujuan Semester"
                            @update:model-value="(sl: any) => toSemesterOnChange(sl)"></v-select> -->
                        <v-select item-value="id" variant="outlined" hide-details :items="semesters"
                            label="Pilih Tujuan Semester"
                            @update:model-value="(sl: any) => fromSemestoSemesterOnChangeterOnChange(sl)">
                            <template v-slot:selection="{ item }">
                                <span>{{ item.props.title.school_year }} - {{ item.props.title.semester_type
                                }}</span>
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
                </v-row>
                <v-row>
                    <v-col cols="12" lg="8" md="6" class="text-left"></v-col>
                    <v-col cols="12" lg="4" md="6" class="text-right">
                        <v-btn color="primary" flat class="ml-auto" @click="progress()">
                            <v-icon class="mr-2">
                                mdi-account-multiple-plus
                            </v-icon>Proses {{ title }}
                        </v-btn>
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
</template>