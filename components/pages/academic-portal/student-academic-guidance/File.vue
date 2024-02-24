
<script setup lang="ts">
import Hspace from '@/components/shared/commons/Hspace.vue';
import Vspace from '@/components/shared/commons/Vspace.vue';
import moment from 'moment';
import { ErrorRoot } from '~~/types/api/error';
import { GetStudentAcademicGuidanceSessionListData } from '~~/types/api/student-academic-guidance/GetStudentAcademicGuidanceSessionList';

const props = defineProps({
    getStudentAcademicGuidanceSessionListData: Array as any,
});

onMounted(() => {
    detailStudentAcademicGuidance.value = <GetStudentAcademicGuidanceSessionListData>props.getStudentAcademicGuidanceSessionListData
});
const detailStudentAcademicGuidance = ref(<GetStudentAcademicGuidanceSessionListData>{
    id: "",
    academic_guidance_id: "",
    subject: "",
    session_date: "",
    summary: "",
    files: [],
    students: [],
});

</script>

<template>
    <v-card>
        <v-card-title class="pa-4 bg-secondary">
            <span class="title text-white">Files</span>
        </v-card-title>
        <v-row>
            <v-col :cols="12">
                <PagesAcademicPortalStudentAcademicGuidanceFileItem v-for="itm in detailStudentAcademicGuidance.files" :value="itm"/>
            </v-col>
        </v-row>
    </v-card>
</template>

<style lang="scss"></style>
